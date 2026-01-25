import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
        if (!token || token.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const order = await prisma.order.findUnique({
            where: { id },
            select: {
                id: true,
                paymentCode: true,
                trackingNumber: true,
                shippingStatus: true,
                shippingRawStatus: true,
                shippingLastSync: true,
                shippingWilaya: true,
                shippingWilayaCode: true,
                shippingCommune: true,
                shippingCommuneCode: true,
                shippingProvider: true,
                shippingMeta: true,
                lastWebhookAt: true,
                lastWebhookPayload: true
            }
        })

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        return NextResponse.json({
            debug: true,
            order
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
