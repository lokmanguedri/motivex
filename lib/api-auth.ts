import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

/**
 * Server-side authorization helpers for API routes
 * Use in App Router route handlers to enforce authentication and admin access
 */

export async function requireAuth() {
    const session = await auth()

    if (!session || !session.user) {
        return {
            error: "Unauthorized",
            status: 401,
            response: NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            ),
        }
    }

    return { session, user: session.user }
}

export async function requireAdmin() {
    const authResult = await requireAuth()

    if ("error" in authResult) {
        return authResult
    }

    if (authResult.user.role !== "ADMIN") {
        return {
            error: "Forbidden",
            status: 403,
            response: NextResponse.json(
                { error: "Admin access required" },
                { status: 403 }
            ),
        }
    }

    return { session: authResult.session, user: authResult.user }
}
