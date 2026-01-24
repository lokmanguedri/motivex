import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, mapShippingStatus } from '@/lib/yalidine-api'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/webhooks/guepex
 * Webhook endpoint for receiving Guepex shipping status updates
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const signature = request.headers.get('x-webhook-signature') || ''

        // Note: verifyWebhookSignature checks process.env.GUEPEX_WEBHOOK_SECRET if configured
        // If Guepex doesn't sign requests or uses a different header, this might need adjustment.
        // For now, we reuse the robust logic assuming similarity to Yalidine.
        if (process.env.GUEPEX_WEBHOOK_SECRET && !verifyWebhookSignature(body, signature)) {
            console.warn('Invalid webhook signature')
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            )
        }

        const payload = JSON.parse(body)

        // Extract tracking ID and status
        const trackingId = payload.tracking_id || payload.tracking || payload.id
        const providerStatus = payload.status || payload.state

        if (!trackingId || !providerStatus) {
            console.error('Missing tracking ID or status in webhook payload')
            return NextResponse.json(
                { error: 'Invalid payload' },
                { status: 400 }
            )
        }

        // Find the order with this tracking ID
        const order = await prisma.order.findFirst({
            where: { shippingTrackingId: trackingId },
        })

        if (!order) {
            // It's possible we get updates for orders not in our DB (legacy), just ignore.
            return NextResponse.json({ message: 'Order not found, ignored.' })
        }

        // Map provider status to internal status
        const internalStatus = mapShippingStatus(providerStatus)

        // Update order with new status
        await prisma.order.update({
            where: { id: order.id },
            data: {
                shippingStatus: providerStatus,
                shippingLastSync: new Date(),
                status: internalStatus as any, // Map to OrderStatus enum
            },
        })

        console.log(`Updated Guepex order ${order.paymentCode} - Tracking: ${trackingId}, Status: ${providerStatus} -> ${internalStatus}`)

        return NextResponse.json({
            success: true,
            message: 'Webhook processed successfully',
        })
    } catch (error) {
        console.error('Error processing Guepex webhook:', error)
        return NextResponse.json(
            {
                error: 'Webhook processing failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs'

/**
 * GET /api/webhooks/guepex
 * Simple endpoint for webhook verification (some providers check for 200 OK on GET)
 */
export async function GET() {
    return NextResponse.json({ message: 'Guepex Webhook Endpoint Ready' })
}
