import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createGuepexShipment } from '@/lib/guepex-api'
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
            where: { id },
            include: { items: { include: { product: true } } }
        })

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        if (order.shippingTrackingId) {
            return NextResponse.json({ error: "Order already shipped" }, { status: 400 })
        }

        // Determine Shipping Mode (HOME / DESK)
        let isDeskPickup = false
        if (order.shippingNotes && order.shippingNotes.includes('DESK_PICKUP')) {
            isDeskPickup = true
        }

        // Prepare Shipment Data - Match GuepexShipmentData interface
        const shipmentData = {
            fullName: order.shippingFullName,
            phone: order.shippingPhone,
            address: order.shippingAddress1,
            wilaya: order.shippingWilaya,
            commune: order.shippingCommune,
            orderNumber: order.paymentCode,
            items: order.items.map(item => ({
                name: item.snapshotNameFr,
                quantity: item.quantity,
                price: Number(item.snapshotPrice)
            })),
            totalAmount: Number(order.total),
            shippingMethod: isDeskPickup ? 'DESK_PICKUP' : 'HOME_DELIVERY'
        }

        // Create in Guepex
        const result = await createGuepexShipment(shipmentData)

        // Update Order
        await prisma.order.update({
            where: { id },
            data: {
                trackingNumber: result.trackingId,
                shippingTrackingId: result.trackingId,
                shippingLabel: result.label,
                shippingStatus: "SHIPPING_CREATED",
                shippingRawStatus: result.status,
                status: 'SHIPPED',
                shippingProvider: 'YALIDINE',
                shippingLastSync: new Date(),
                shippingMeta: result.rawResponse ? result.rawResponse : undefined
            }
        })

        return NextResponse.json({ success: true, ...result })

    } catch (error: any) {
        console.error("Shipment Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
