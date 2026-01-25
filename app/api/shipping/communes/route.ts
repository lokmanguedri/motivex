import { NextRequest, NextResponse } from 'next/server'
import { COMMUNES } from '@/lib/algeria-locations'

export const revalidate = 86400 // Cache for 24h

/**
 * GET /api/shipping/communes
 * Returns stable local Algeria communes dataset
 * Filtered by wilaya_id if provided
 * No external API calls - 100% reliable
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const wilayaId = searchParams.get('wilaya_id')

        let communes = COMMUNES

        // Filter by wilaya if requested
        if (wilayaId) {
            const wilayaIdNum = parseInt(wilayaId)
            communes = COMMUNES.filter(c => c.wilaya_id === wilayaIdNum)
            console.log(`[Communes API] Filtered for wilaya ${wilayaId}: ${communes.length} communes`)
        } else {
            console.log(`[Communes API] Returning all communes: ${communes.length}`)
        }

        return NextResponse.json(communes)
    } catch (error) {
        console.error("Communes API Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch communes" },
            { status: 500 }
        )
    }
}
