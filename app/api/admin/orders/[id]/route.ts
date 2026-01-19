import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/api-auth"

type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "RETURNED"
type PaymentStatus = "PENDING" | "PAID"

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin()
    if ("error" in authResult) return authResult.response

    try {
        const { id } = await params
        const body = await request.json().catch(() => ({} as any))
        const status = body?.status as OrderStatus | undefined
        const paymentStatus = body?.paymentStatus as PaymentStatus | undefined

        // Optional: basic validation to avoid random values
        const allowedOrderStatuses: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "RETURNED"]
        const allowedPaymentStatuses: PaymentStatus[] = ["PENDING", "PAID"]

        if (status && !allowedOrderStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid order status" }, { status: 400 })
        }
        if (paymentStatus && !allowedPaymentStatuses.includes(paymentStatus)) {
            return NextResponse.json({ error: "Invalid payment status" }, { status: 400 })
        }

        await prisma.$transaction(async (tx: any) => {
            const currentOrder = await tx.order.findUnique({
                where: { id },
                include: { payment: true },
            })

            if (!currentOrder) {
                throw Object.assign(new Error("ORDER_NOT_FOUND"), { code: "ORDER_NOT_FOUND" })
            }
            if (!currentOrder.payment) {
                throw Object.assign(new Error("ORDER_NO_PAYMENT"), { code: "ORDER_NO_PAYMENT" })
            }

            // Block manual payment update for COD
            if (paymentStatus && currentOrder.payment.method === "COD") {
                throw Object.assign(new Error("COD_MANUAL_PAYMENT_FORBIDDEN"), { code: "COD_MANUAL_PAYMENT_FORBIDDEN" })
            }

            // Decide final payment status
            let finalPaymentStatus = currentOrder.payment.status

            // Manual BARIDIMOB update allowed
            if (paymentStatus && currentOrder.payment.method === "BARIDIMOB") {
                finalPaymentStatus = paymentStatus
            }

            // COD auto rule: status -> DELIVERED => payment -> PAID
            if (
                currentOrder.payment.method === "COD" &&
                status === "DELIVERED" &&
                currentOrder.payment.status !== "PAID"
            ) {
                finalPaymentStatus = "PAID"
            }

            // Payment FIRST (only if changed)
            if (finalPaymentStatus !== currentOrder.payment.status) {
                await tx.payment.update({
                    where: { id: currentOrder.payment.id },
                    data: { status: finalPaymentStatus },
                })
            }

            // Order SECOND (only if changed)
            if (status && status !== currentOrder.status) {
                await tx.order.update({
                    where: { id },
                    data: { status },
                })
            }
        })

        // Fresh fetch after transaction (no stale data)
        const freshOrder = await prisma.order.findUnique({
            where: { id },
            include: {
                payment: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                nameFr: true,
                                nameAr: true,
                                sku: true,
                            },
                        },
                    },
                },
            },
        })

        if (!freshOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        return NextResponse.json({ order: freshOrder, payment: freshOrder.payment })
    } catch (error: any) {
        const code = error?.code || error?.message

        if (code === "ORDER_NOT_FOUND") {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }
        if (code === "ORDER_NO_PAYMENT") {
            return NextResponse.json({ error: "Order has no payment" }, { status: 400 })
        }
        if (code === "COD_MANUAL_PAYMENT_FORBIDDEN") {
            return NextResponse.json(
                { error: "Cannot manually update payment status for COD orders" },
                { status: 400 }
            )
        }

        console.error("Error updating order:", error)
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }
}
