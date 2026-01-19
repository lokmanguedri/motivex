import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { validateAlgerianPhone, checkRateLimit } from "@/lib/validators"

// Helper to generate unique payment code
async function generatePaymentCode(): Promise<string> {
    const year = new Date().getFullYear()
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    for (let attempt = 0; attempt < 5; attempt++) {
        // Generate random 6-character code
        let randomPart = ''
        for (let i = 0; i < 6; i++) {
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length))
        }

        const paymentCode = `MX-${year}-${randomPart}`

        // Check if unique
        const existing = await prisma.order.findUnique({
            where: { paymentCode }
        })

        if (!existing) {
            return paymentCode
        }
    }

    // Fallback: use CUID last 6 chars (uppercase)
    const cuid = crypto.randomUUID().replace(/-/g, '').slice(-6).toUpperCase()
    return `MX-${year}-${cuid}`
}

export async function POST(request: NextRequest) {
    try {
        // SECURITY: Rate limiting (10 orders per minute per IP)
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown'

        if (!checkRateLimit(ip, 10, 60000)) {
            return NextResponse.json(
                { error: "Too many requests. Please wait before placing another order." },
                { status: 429 }
            )
        }

        // Require authentication
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            items,
            paymentMethod,
            baridiMobReference,
            shippingFullName,
            shippingPhone,
            shippingWilaya,
            shippingCommune,
            shippingAddress1,
            shippingNotes
        } = body

        // Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Items are required" },
                { status: 400 }
            )
        }

        if (!paymentMethod || !["COD", "BARIDIMOB"].includes(paymentMethod)) {
            return NextResponse.json(
                { error: "Invalid payment method" },
                { status: 400 }
            )
        }

        if (paymentMethod === "BARIDIMOB") {
            if (!baridiMobReference || baridiMobReference.length < 6) {
                return NextResponse.json(
                    { error: "BaridiMob reference is required (minimum 6 characters)" },
                    { status: 400 }
                )
            }
        }

        if (!shippingFullName || !shippingPhone || !shippingWilaya || !shippingCommune || !shippingAddress1) {
            return NextResponse.json(
                { error: "Shipping information is required" },
                { status: 400 }
            )
        }

        // VALIDATION: Algerian phone number
        const phoneValidation = validateAlgerianPhone(shippingPhone)
        if (!phoneValidation.valid) {
            return NextResponse.json(
                { error: phoneValidation.error },
                { status: 400 }
            )
        }

        // Validate items and fetch products
        const productIds = items.map((item: any) => item.productId)
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                isActive: true
            },
            include: {
                images: {
                    where: { isMain: true },
                    take: 1
                }
            }
        })

        if (products.length !== productIds.length) {
            return NextResponse.json(
                { error: "Some products are not available" },
                { status: 400 }
            )
        }

        // Calculate totals and validate stock BEFORE transaction
        let subtotal = 0
        const orderItemsData: any[] = []
        const stockErrors: string[] = []

        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity < 1) {
                return NextResponse.json(
                    { error: "Invalid item data" },
                    { status: 400 }
                )
            }

            const product = products.find((p: any) => p.id === item.productId)
            if (!product) continue

            // CRITICAL: Stock validation - prevent overselling
            if (product.stock < item.quantity) {
                stockErrors.push(
                    `${product.nameFr}: ${item.quantity} demandé(s), ${product.stock} disponible(s)`
                )
                continue
            }

            // Additional safety: Don't allow ordering out-of-stock items
            if (product.stock <= 0) {
                stockErrors.push(`${product.nameFr}: Produit en rupture de stock`)
                continue
            }

            const itemSubtotal = Number(product.price) * item.quantity
            subtotal += itemSubtotal

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                subtotal: itemSubtotal,
                snapshotNameFr: product.nameFr,
                snapshotNameAr: product.nameAr,
                snapshotSku: product.sku,
                snapshotPrice: product.price,
                snapshotOldPrice: product.oldPrice,
                snapshotImageUrl: product.images[0]?.url || null,
                snapshotBrand: product.brand,
                snapshotModel: product.model,
                snapshotYear: product.year
            })
        }

        // If any stock errors, reject order BEFORE creating any records
        if (stockErrors.length > 0) {
            return NextResponse.json(
                {
                    error: "Stock insuffisant / المخزون غير كاف",
                    details: stockErrors
                },
                { status: 400 }
            )
        }

        if (orderItemsData.length === 0) {
            return NextResponse.json(
                { error: "No valid items in cart" },
                { status: 400 }
            )
        }

        const shippingPrice = 800 // Fixed shipping for Algeria
        const total = subtotal + shippingPrice

        // Generate unique payment code
        const paymentCode = await generatePaymentCode()

        // Create order with payment in transaction + ATOMIC STOCK DEDUCTION
        const order = await prisma.$transaction(async (tx: any) => {
            // CRITICAL: Decrement stock for each product atomically
            // This prevents race conditions when multiple orders happen simultaneously
            for (const itemData of orderItemsData) {
                await tx.product.update({
                    where: { id: itemData.productId },
                    data: {
                        stock: {
                            decrement: itemData.quantity
                        }
                    }
                })
            }

            // Now create the order (stock already decremented)
            const newOrder = await tx.order.create({
                data: {
                    paymentCode,
                    status: "PENDING",
                    subtotal,
                    shippingPrice,
                    total,
                    shippingFullName,
                    shippingPhone: phoneValidation.normalized!, // Use normalized phone
                    shippingWilaya,
                    shippingCommune,
                    shippingAddress1,
                    shippingNotes: shippingNotes || null,
                    userId: session.user.id,
                    items: {
                        create: orderItemsData
                    },
                    payment: {
                        create: {
                            method: paymentMethod,
                            status: "PENDING",
                            amount: total,
                            reference: paymentMethod === "BARIDIMOB" ? baridiMobReference : null,
                            userId: session.user.id
                        }
                    }
                },
                include: {
                    payment: true
                }
            })

            return newOrder
        })

        return NextResponse.json({
            order: {
                id: order.id,
                paymentCode: order.paymentCode,
                status: order.status,
                total: order.total,
                createdAt: order.createdAt
            },
            payment: {
                method: order.payment?.method,
                status: order.payment?.status,
                reference: order.payment?.reference
            }
        })
    } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        )
    }
}
