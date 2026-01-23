export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { validateAlgerianPhone, normalizeAlgerianPhone } from "@/lib/validators"
import { Prisma } from "@prisma/client"

export async function POST(request: NextRequest) {
    try {
        const { email, password, firstName, lastName, phone } = await request.json()

        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: "Email, password, first name, and last name are required" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            )
        }

        // Validate and normalize phone
        let normalizedPhone: string | null = null
        if (phone) {
            const phoneValidation = validateAlgerianPhone(phone)
            if (!phoneValidation.valid) {
                return NextResponse.json(
                    { error: phoneValidation.error, code: "INVALID_PHONE" },
                    { status: 400 }
                )
            }
            normalizedPhone = normalizeAlgerianPhone(phone)
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Email déjà utilisé / البريد مستعمل", code: "EMAIL_EXISTS" },
                { status: 409 }
            )
        }

        // Hash password
        const passwordHash = await hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                passwordHash,
                firstName,
                lastName,
                phone: normalizedPhone,
                role: "USER",
            },
        })

        return NextResponse.json(
            {
                success: true,
                userId: user.id,
                message: "Account created successfully"
            },
            { status: 201 }
        )
    } catch (error) {

        // Handle Prisma unique constraint errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const field = (error.meta?.target as string[])?.[0]
                if (field === "email") {
                    return NextResponse.json(
                        { error: "Email déjà utilisé / البريد مستعمل", code: "EMAIL_EXISTS" },
                        { status: 409 }
                    )
                }
                if (field === "phone") {
                    return NextResponse.json(
                        { error: "Téléphone déjà utilisé / الهاتف مستعمل", code: "PHONE_EXISTS" },
                        { status: 409 }
                    )
                }
            }
        }

        return NextResponse.json(
            { error: "Erreur lors de la création du compte / خطأ أثناء إنشاء الحساب", code: "REGISTER_FAILED" },
            { status: 500 }
        )
    }
}
