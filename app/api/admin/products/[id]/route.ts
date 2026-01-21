import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/api-auth"

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Check ADMIN role
    const authResult = await requireAdmin()
    if ("error" in authResult) {
        return authResult.response
    }

    try {
        const { id } = await params
        const body = await request.json()

        const {
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
            isActive,
            images, // Optional: new images to add
        } = body

        // Check product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        })

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            )
        }

        // Update product
        const product = await prisma.product.update({
            where: { id },
            data: {
                nameFr,
                nameAr,
                descFr,
                descAr,
                price,
                oldPrice,
                stock,
                brand,
                model,
                year: year ? parseInt(year) : null,
                categoryId,
                isActive,
                ...(images?.length && {
                    images: {
                        deleteMany: {}, // Remove old images
                        create: images.map((img: any, index: number) => ({
                            url: img.url,
                            isMain: img.isMain || index === 0,
                            sortOrder: img.sortOrder ?? index,
                        })),
                    },
                }),
            },
            include: {
                category: true,
                images: true,
            },
        })

        return NextResponse.json({
            product,
            message: "Product updated successfully",
        })
    } catch (error) {
        console.error("Error updating product:", error)
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Check ADMIN role
    const authResult = await requireAdmin()
    if ("error" in authResult) {
        return authResult.response
    }

    try {
        const { id } = await params

        // Check product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        })

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            )
        }

        // Check for related order items (foreign key constraint)
        const orderItemsCount = await prisma.orderItem.count({
            where: { productId: id }
        })

        if (orderItemsCount > 0) {
            // Product is used in orders, cannot hard delete
            return NextResponse.json(
                {
                    error: "Impossible de supprimer: produit utilisé dans des commandes / لا يمكن الحذف: المنتج مرتبط بطلبات",
                    code: "HAS_ORDERS",
                    orderItemsCount,
                    suggestion: "Utilisez la désactivation à la place / استخدم إلغاء التنشيط بدلاً من ذلك"
                },
                { status: 409 }
            )
        }

        // Safe to hard delete - no foreign key constraints
        await prisma.product.delete({
            where: { id },
        })

        return NextResponse.json({
            message: "Product permanently deleted / المنتج محذوف نهائياً",
        })
    } catch (error) {
        console.error("Error deleting product:", error)
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        )
    }
}
