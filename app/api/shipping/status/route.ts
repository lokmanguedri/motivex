import { NextRequest, NextResponse } from 'next/server'
import { getShipmentStatus } from '@/lib/yalidine-api'

/**
 * GET /api/shipping/status?trackingId=X
 * Get shipment status by tracking ID
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const trackingId = searchParams.get('trackingId')

        if (!trackingId) {
            return NextResponse.json(
                { error: 'Tracking ID is required' },
                { status: 400 }
            )
        }

        const status = await getShipmentStatus(trackingId)

        return NextResponse.json({
            success: true,
            status,
        })
    } catch (error) {
        console.error('Error in shipment status API:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch shipment status',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
