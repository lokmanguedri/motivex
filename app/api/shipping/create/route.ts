import { NextRequest, NextResponse } from 'next/server'
import { createShipment, type ShipmentData } from '@/lib/yalidine-api'

/**
 * POST /api/shipping/create
 * Create a new shipment with the shipping provider
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate required fields
        const requiredFields = ['fullName', 'phone', 'address', 'wilaya', 'commune', 'orderNumber', 'totalAmount']
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                )
            }
        }

        const shipmentData: ShipmentData = {
            fullName: body.fullName,
            phone: body.phone,
            address: body.address,
            wilaya: body.wilaya,
            commune: body.commune,
            orderNumber: body.orderNumber,
            items: body.items || [],
            totalAmount: parseFloat(body.totalAmount),
            notes: body.notes,
        }

        const result = await createShipment(shipmentData)

        return NextResponse.json({
            success: true,
            trackingId: result.trackingId,
            status: result.status,
            estimatedDelivery: result.estimatedDelivery,
        })
    } catch (error) {
        console.error('Error in create shipment API:', error)
        return NextResponse.json(
            {
                error: 'Failed to create shipment',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
