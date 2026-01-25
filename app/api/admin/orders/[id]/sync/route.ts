import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTrackingInfo, mapGuepexStatus } from '@/lib/guepex-api'
import { getToken } from 'next-auth/jwt'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Auth check
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || token.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const order = await prisma.order.findUnique({
            where: { id }
        })

        if (!order || !order.trackingNumber) {
            return NextResponse.json({ error: "Order not found or has no tracking number" }, { status: 404 })
        }

        // Fetch from Guepex
        const trackingInfo = await getTrackingInfo(order.trackingNumber)

        if (!trackingInfo) {
            return NextResponse.json({ error: "Tracking info not found in Guepex" }, { status: 404 })
        }

        const { shippingStatus, orderStatus } = mapGuepexStatus(trackingInfo.status)

        // Update DB
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                shippingStatus: shippingStatus,
                shippingRawStatus: trackingInfo.status,
                shippingLastSync: new Date(),
                status: orderStatus as any,
                shippingMeta: trackingInfo.rawResponse ? trackingInfo.rawResponse : undefined
            }
        })

        return NextResponse.json({
            success: true,
            status: shippingStatus,
            raw: trackingInfo.status
        })

    } catch (error: any) {
        console.error("Sync Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
