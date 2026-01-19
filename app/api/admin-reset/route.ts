export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(request: NextRequest) {
    try {
        const { email, newPassword, secret } = await request.json()

        // Security check - require a secret
        if (secret !== process.env.ADMIN_RESET_SECRET) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        if (!email || !newPassword) {
            return NextResponse.json(
                { error: "Email and newPassword required" },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // Hash new password
        const passwordHash = await hash(newPassword, 12)

        // Update user
        await prisma.user.update({
            where: { email: email.toLowerCase() },
            data: {
                passwordHash,
                role: "ADMIN" // Ensure role is ADMIN
            }
        })

        return NextResponse.json({
            ok: true,
            message: "Password and role updated successfully",
            email: user.email,
            role: "ADMIN"
        })
    } catch (error) {
        console.error("Reset password error:", error)
        return NextResponse.json(
            { error: "Server error", details: String(error) },
            { status: 500 }
        )
    }
}
