import { NextRequest, NextResponse } from 'next/server'
import { verifyGuepexSignature, mapGuepexStatus } from '@/lib/guepex-api'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs' // Required for raw body reading if needed, but Next.js request.text() works fine

/**
 * POST /api/webhooks/guepex
 * Webhook endpoint for receiving Guepex shipping status updates
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const signature = request.headers.get('x-yalidine-signature') || request.headers.get('x-guepex-signature') || ''

        // Verify signature
        if (!verifyGuepexSignature(body, signature)) {
            console.warn('Invalid Guepex webhook signature')
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            )
        }

        const payload = JSON.parse(body)

        // Log Full Payload (Requirement)
        console.log("Guepex Webhook Payload:", JSON.stringify(payload))

        // 1. Check for 'events' array (parcel_status_updated)
        // Payload format: { type: 'parcel_status_updated', events: [ { data: { ... } } ] }
        if (payload.events && Array.isArray(payload.events)) {

            for (const event of payload.events) {
                const data = event.data
                if (!data || !data.tracking) continue

                const trackingId = data.tracking
                // Status might be nested differently depending on event type?
                // parcel_status_updated -> data.status
                // parcel_payment_updated -> data.status (payment status)
                // We care mostly about shipping status for now.

                const providerStatus = data.status || 'UNKNOWN'

                if (providerStatus) {
                    const { shippingStatus, orderStatus } = mapGuepexStatus(providerStatus)

                    // Update DB
                    // Only update if we find the order
                    const order = await prisma.order.findFirst({
                        where: {
                            OR: [
                                { trackingNumber: trackingId },
                                { shippingTrackingId: trackingId }
                            ]
                        }
                    })

                    if (order) {
                        // Special case: payment updated
                        let paymentUpdate = {}
                        if (payload.type === 'parcel_payment_updated') {
                            if (data.status === 'receivable') {
                                paymentUpdate = {
                                    payment: {
                                        update: {
                                            status: 'PAID'
                                        }
                                    }
                                }
                            }
                        }

                        await prisma.order.update({
                            where: { id: order.id },
                            data: {
                                shippingStatus: shippingStatus, // Granular
                                shippingRawStatus: providerStatus,
                                shippingLastSync: new Date(),
                                // Update main status
                                status: orderStatus as any,
                                ...paymentUpdate
                            } as any
                        })
                        console.log(`Updated Order ${order.paymentCode} [${trackingId}]: ${shippingStatus} / ${orderStatus}`)
                    } else {
                        // Log Warning (Requirement)
                        console.warn(`WEBHOOK WARNING: Tracking ID ${trackingId} not found in database. Payload:`, JSON.stringify(event))
                    }
                }
            }
        }

        // Return 200 OK immediately
        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error processing Guepex webhook:', error)
        // Return 200 anyway to prevent Guepex from retrying/disabling webhook for internal errors
        return NextResponse.json({ success: true, warning: "Processed with errors" })
    }
}

/**
 * GET /api/webhooks/guepex
 * Webhook verification endpoint (CRC check)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const crc_token = searchParams.get('crc_token')
    const subscribe = searchParams.get('subscribe')

    if (crc_token && subscribe) {
        return new NextResponse(crc_token, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        })
    }

    return NextResponse.json({ message: 'Guepex Webhook Endpoint Ready' })
}
