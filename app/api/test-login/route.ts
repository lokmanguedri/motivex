export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password required" },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found", email },
                { status: 404 }
            )
        }

        // Check password
        const isValid = await compare(password, user.passwordHash)

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            )
        }

        // Return user info (for debugging)
        return NextResponse.json({
            ok: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        })
    } catch (error) {
        console.error("Test login error:", error)
        return NextResponse.json(
            { error: "Server error", details: String(error) },
            { status: 500 }
        )
    }
}
