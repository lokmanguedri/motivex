export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
    const session = await auth()
    const isProd = process.env.NODE_ENV === "production"

    return NextResponse.json({
        ok: true,
        user: session?.user || null,
        cookie_name: isProd ? "__Secure-next-auth.session-token" : "next-auth.session-token"
    })
}
