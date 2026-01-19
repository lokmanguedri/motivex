export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

export async function GET() {
    return NextResponse.json({
        ok: true,
        version: "v2-with-logging",
        timestamp: new Date().toISOString()
    })
}
