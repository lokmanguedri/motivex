import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Parse query parameters
        const category = searchParams.get("category") // Can be ID or slug
        const brand = searchParams.get("brand")
        const model = searchParams.get("model")
        const year = searchParams.get("year")
        const search = searchParams.get("search")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {
            isActive: true,
        }

        // Support both categoryId and categorySlug via 'category' param
        if (category) {
            // Check if it's a CUID (starts with 'c') or a slug
            if (category.startsWith('c') && category.length > 20) {
                // Likely a categoryId
                where.categoryId = category
            } else {
                // Treat as slug
                const categoryRecord = await prisma.category.findUnique({
                    where: { slug: category },
                    select: { id: true }
                })
                if (categoryRecord) {
                    where.categoryId = categoryRecord.id
                }
            }
        }

        if (brand) {
            where.brand = { contains: brand, mode: "insensitive" }
        }

        if (model) {
            where.model = { contains: model, mode: "insensitive" }
        }

        if (year) {
            where.year = parseInt(year)
        }

        if (search) {
            where.OR = [
                { nameFr: { contains: search, mode: "insensitive" } },
                { nameAr: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { brand: { contains: search, mode: "insensitive" } },
            ]
        }

        // Fetch products with pagination
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
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
                        where: { isMain: true },
                        take: 1,
                        select: {
                            url: true,
                            isMain: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Error fetching products:", error)
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        )
    }
}
