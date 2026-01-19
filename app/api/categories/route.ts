import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                slug: true,
                nameFr: true,
                nameAr: true,
            },
            orderBy: {
                nameFr: "asc",
            },
        })

        return NextResponse.json({ categories })
    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        )
    }
}
