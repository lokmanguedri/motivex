import { NextRequest, NextResponse } from 'next/server'
import { getCommunesByWilaya } from '@/lib/yalidine-api'
import { getGuepexCommunes } from '@/lib/guepex-api'

const PROVIDER = process.env.SHIPPING_PROVIDER || 'YALIDINE'

/**
 * GET /api/shipping/communes?wilaya=X
 * Fetch communes for a given wilaya
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const wilayaId = searchParams.get('wilaya')

        if (!wilayaId) {
            return NextResponse.json(
                { error: 'Wilaya ID is required' },
                { status: 400 }
            )
        }

        let communes = []

        if (PROVIDER === 'GUEPEX') {
            const allCommunes = await getGuepexCommunes()
            // Filter by wilaya_id (ensure types match, string vs int)
            communes = allCommunes.filter((c: any) => c.wilaya_id == wilayaId)
        } else {
            communes = await getCommunesByWilaya(wilayaId)
        }

        return NextResponse.json({
            success: true,
            communes,
        })
    } catch (error) {
        console.error('Error in communes API:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch communes',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
