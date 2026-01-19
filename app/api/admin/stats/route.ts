import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/api-auth"

export async function GET() {
    const authResult = await requireAdmin()
    if ("error" in authResult) {
        return authResult.response
    }

    try {
        // Get total products count
        const productsCount = await prisma.product.count()

        // Get total orders count
        const ordersCount = await prisma.order.count()

        // Get pending orders count
        const pendingOrders = await prisma.order.count({
            where: {
                status: "PENDING"
            }
        })

        // Calculate revenue (delivered orders with paid payments)
        const revenueData = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            where: {
                status: "DELIVERED",
                payment: {
                    status: "PAID"
                }
            }
        })

        const revenue = Number(revenueData._sum.total || 0)

        return NextResponse.json({
            productsCount,
            ordersCount,
            pendingOrders,
            revenue
        })
    } catch (error) {
        console.error("Error fetching admin stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        )
    }
}
