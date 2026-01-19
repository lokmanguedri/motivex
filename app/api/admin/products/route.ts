import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
    // Check ADMIN role
    const authResult = await requireAdmin()
    if ("error" in authResult) {
        return authResult.response
    }

    try {
        // Admin can see ALL products including inactive
        const products = await prisma.product.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        nameFr: true,
                        nameAr: true,
                        slug: true,
                    },
                },
                images: {
                    orderBy: { sortOrder: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json({ products })
    } catch (error) {
        console.error("Error fetching products:", error)
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    // Check ADMIN role
    const authResult = await requireAdmin()
    if ("error" in authResult) {
        return authResult.response
    }

    try {
        const body = await request.json()

        const {
            sku,
            nameFr,
            nameAr,
            descFr,
            descAr,
            price,
            oldPrice,
            stock,
            brand,
            model,
            year,
            categoryId,
            images, // Array of { url, isMain?, sortOrder? }
        } = body

        // Validate required fields
        if (!sku || !nameFr || !nameAr || !price || !categoryId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Check SKU uniqueness
        const existingProduct = await prisma.product.findUnique({
            where: { sku },
        })

        if (existingProduct) {
            return NextResponse.json(
                { error: "Product with this SKU already exists" },
                { status: 400 }
            )
        }

        // Check category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        })

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 400 }
            )
        }

        // Create product with images
        const product = await prisma.product.create({
            data: {
                sku,
                nameFr,
                nameAr,
                descFr,
                descAr,
                price,
                oldPrice,
                stock: stock || 0,
                brand,
                model,
                year: year ? parseInt(year) : null,
                categoryId,
                images: images?.length
                    ? {
                        create: images.map((img: any, index: number) => ({
                            url: img.url,
                            isMain: img.isMain || index === 0,
                            sortOrder: img.sortOrder ?? index,
                        })),
                    }
                    : undefined,
            },
            include: {
                category: true,
                images: true,
            },
        })

        return NextResponse.json(
            { product, message: "Product created successfully" },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error creating product:", error)
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        )
    }
}
