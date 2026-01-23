import { NextRequest, NextResponse } from 'next/server'
import { getCommunesByWilaya } from '@/lib/yalidine-api'

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

        const communes = await getCommunesByWilaya(wilayaId)

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
