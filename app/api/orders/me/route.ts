import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        // Require authentication
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                nameFr: true,
                                nameAr: true
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
        console.error("Error fetching user orders:", error)
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        )
    }
}
