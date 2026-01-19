export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const nextauthUrl = process.env.NEXTAUTH_URL || "not-set"
    const hasSecret = !!process.env.NEXTAUTH_SECRET
    const isProd = process.env.NODE_ENV === "production"

    // Check if session exists (without exposing sensitive data)
    const sessionCookie = request.cookies.get(
        isProd ? "__Secure-next-auth.session-token" : "next-auth.session-token"
    )

    return NextResponse.json({
        ok: true,
        nextauth_url: nextauthUrl,
        has_secret: hasSecret,
        is_prod: isProd,
        session_cookie_present: !!sessionCookie,
        cookie_name: isProd ? "__Secure-next-auth.session-token" : "next-auth.session-token"
    })
}
