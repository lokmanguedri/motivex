import { NextResponse } from 'next/server'
import { WILAYAS } from '@/lib/algeria-locations'

export const revalidate = 86400 // Cache for 24h

/**
 * GET /api/shipping/wilayas
 * Returns stable local Algeria wilayas dataset (58 wilayas)
 * No external API calls - 100% reliable
 */
export async function GET() {
    try {
        return NextResponse.json(WILAYAS)
    } catch (error) {
        console.error("Wilayas Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch wilayas" },
            { status: 500 }
        )
    }
}
