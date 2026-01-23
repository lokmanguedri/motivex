import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, mapShippingStatus } from '@/lib/yalidine-api'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/webhooks/yalidine
 * Webhook endpoint for receiving shipping status updates
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const signature = request.headers.get('x-webhook-signature') || ''

        // Verify webhook signature
        if (!verifyWebhookSignature(body, signature)) {
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
            console.warn(`Order not found for tracking ID: ${trackingId}`)
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
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

        console.log(`Updated order ${order.paymentCode} - Tracking: ${trackingId}, Status: ${providerStatus} -> ${internalStatus}`)

        return NextResponse.json({
            success: true,
            message: 'Webhook processed successfully',
        })
    } catch (error) {
        console.error('Error processing webhook:', error)
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
