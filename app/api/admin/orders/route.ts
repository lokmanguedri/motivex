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
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                nameFr: true,
                                nameAr: true,
                                sku: true
                            }
                        }
                    }
                },
                payment: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ orders })
    } catch (error) {
        console.error("Error fetching orders:", error)
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        )
    }
}
