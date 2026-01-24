import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createGuepexShipment } from '@/lib/guepex-api'
import { getToken } from 'next-auth/jwt'

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Auth check
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || token.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const order = await prisma.order.findUnique({
            where: { id: params.id },
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
        // 'shippingNotes' field stores "Mode: DESK_PICKUP" string from Checkout
        if (order.shippingNotes && order.shippingNotes.includes('DESK_PICKUP')) {
            isDeskPickup = true
        }

        // Prepare Shipment Data
        const shipmentData = {
            fullName: order.shippingFullName,
            phone: order.shippingPhone,
            address: order.shippingAddress1,
            wilaya: order.shippingWilaya,
            commune: order.shippingCommune,
            orderNumber: order.id,
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
            where: { id: params.id },
            data: {
                shippingTrackingId: result.trackingId,
                shippingLabel: result.label,
                shippingStatus: result.status,
                status: 'SHIPPED',
                shippingProvider: 'GUEPEX',
                shippingLastSync: new Date()
            }
        })

        return NextResponse.json({ success: true, ...result })

    } catch (error: any) {
        console.error("Shipment Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
