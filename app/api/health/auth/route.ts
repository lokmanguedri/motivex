export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const isProd = process.env.NODE_ENV === "production"

    return NextResponse.json({
        ok: true,
        is_prod: isProd,
        nextauth_url: process.env.NEXTAUTH_URL || "not-set",
        site_url: process.env.NEXT_PUBLIC_SITE_URL || "not-set",
        has_secret: !!process.env.NEXTAUTH_SECRET,
        has_database_url: !!process.env.DATABASE_URL,
        has_direct_url: !!process.env.DIRECT_URL,
        has_admin_email: !!process.env.ADMIN_EMAIL,
        has_admin_password: !!process.env.ADMIN_PASSWORD
    })
}
