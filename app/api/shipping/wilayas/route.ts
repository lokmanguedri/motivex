import { NextRequest, NextResponse } from 'next/server'
import { ALGERIA_WILAYAS } from '@/lib/algeria-data'

export const revalidate = 86400 // Cache for 24h

export async function GET() {
    try {
        return NextResponse.json(ALGERIA_WILAYAS)
    } catch (error) {
        console.error("Wilayas Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch wilayas" },
            { status: 500 }
        )
    }
}
