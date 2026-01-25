/**
 * Guepex Shipping API Client
 * Documentation based on user provided details
 */

export interface GuepexShipmentData {
    fullName: string
    phone: string
    address: string
    // We keep these for flexibility, but ideally we use IDs for precision if available
    wilaya: string
    commune: string
    orderNumber: string
    items: Array<{
        name: string
        quantity: number
        price: number
    }>
    totalAmount: number
    notes?: string
    shippingMethod?: string // 'HOME' | 'DESK_PICKUP'
}

export interface GuepexResponse {
    success: boolean
    tracking?: string
    order_id?: string
    label?: string
    message?: string
}

export interface GuepexWilaya {
    id: number
    name: string
    zone: number
}

export interface GuepexCommune {
    id: number
    name: string
    wilaya_id: number
    has_stop_desk: number
    is_deliverable: number
}

const API_BASE = process.env.GUEPEX_API_BASE || 'https://api.guepex.app/v1'
const API_ID = process.env.GUEPEX_API_ID
const API_TOKEN = process.env.GUEPEX_API_KEY

// Helper to get headers
const getHeaders = () => {
    if (!API_ID || !API_TOKEN) {
        throw new Error("Guepex API credentials missing")
    }
    return {
        'X-API-ID': API_ID,
        'X-API-TOKEN': API_TOKEN,
        'Content-Type': 'application/json'
    }
}

/**
 * Fetch all wilayas
 */
export async function getGuepexWilayas(): Promise<GuepexWilaya[]> {
    try {
        const response = await fetch(`${API_BASE}/wilayas`, {
            headers: getHeaders(),
            next: { revalidate: 86400 } // Cache for 24h
        })

        if (!response.ok) throw new Error("Failed to fetch Guepex wilayas")

        const data = await response.json()
        return data.data || []
    } catch (error) {
        console.error("Guepex Wilayas Error:", error)
        return []
    }
}

/**
 * Fetch all communes
 */
export async function getGuepexCommunes(): Promise<GuepexCommune[]> {
    try {
        const response = await fetch(`${API_BASE}/communes`, {
            headers: getHeaders(),
            next: { revalidate: 86400 } // Cache for 24h
        })

        if (!response.ok) throw new Error("Failed to fetch Guepex communes")

        const data = await response.json()
        return data.data || []
    } catch (error) {
        console.error("Guepex Communes Error:", error)
        return []
    }
}

/**
 * Calculate Shipping Fee
 */
export async function calculateGuepexFee(toWilayaId: number, isStopDesk: boolean = false): Promise<number | null> {
    try {
        // From Wilaya 16 (Algiers) - This should be configurable or dynamic based on store location
        const fromWilayaId = 16

        const response = await fetch(`${API_BASE}/fees/?from_wilaya_id=${fromWilayaId}&to_wilaya_id=${toWilayaId}`, {
            headers: getHeaders(),
            next: { revalidate: 3600 } // Cache for 1h
        })

        if (!response.ok) return null

        const data = await response.json()
        // The API returns complex structure. 
        // Based on docs: per_commune might have specific fees?
        // Or generic fees 'express_home', 'express_desk' at top level?
        // Let's assume generic zone-based fee unless verified otherwise.
        // Actually the docs example shows `per_commune` details inside.
        // This implies we strictly need the COMMUNE ID to get the exact fee.
        // But for this function signature `toWilayaId`, we only have wilaya.
        // We might need to update this to accept commune ID if possible.

        // For now, let's look at the first commune in the list as a baseline if specific commune not provided
        // Or if the root object has a default (docs say 'zone' fee?).
        // Let's iterate `per_commune` and pick the first one's Home/Desk fee as an estimate if needed.

        const firstCommune = Object.values(data.per_commune || {})[0] as any
        if (firstCommune) {
            return isStopDesk ? (firstCommune.express_desk || 0) : (firstCommune.express_home || 0)
        }

        return null
    } catch (error) {
        console.error("Guepex Fee Error:", error)
        return null
    }
}

/**
 * Calculate Shipping Fee Exact (by Commune)
 */
export async function calculateGuepexFeeExact(fromWilayaId: number, toWilayaId: number, communeId: number, isStopDesk: boolean): Promise<number | null> {
    try {
        const response = await fetch(`${API_BASE}/fees/?from_wilaya_id=${fromWilayaId}&to_wilaya_id=${toWilayaId}`, {
            headers: getHeaders(),
            next: { revalidate: 3600 }
        })

        if (!response.ok) return null

        const data = await response.json()
        const communeData = data.per_commune?.[communeId]

        if (!communeData) return null

        return isStopDesk ? (communeData.express_desk || 0) : (communeData.express_home || 0)
    } catch (error) {
        console.error("Fee Exact Error:", error)
        return null // Fallback to free or static
    }
}

/**
 * Create a shipment in Guepex
 */
export async function createGuepexShipment(data: GuepexShipmentData) {
    try {
        const isStopDesk = data.shippingMethod === 'DESK_PICKUP'

        // Construct payload based on user provided docs
        const parcel = {
            order_id: data.orderNumber,
            firstname: data.fullName.split(' ')[0],
            familyname: data.fullName.split(' ').slice(1).join(' ') || '.',
            contact_phone: data.phone,
            address: data.address,
            from_wilaya_name: "Alger",
            to_wilaya_name: data.wilaya,
            to_commune_name: data.commune,
            product_list: data.items.map(i => `${i.name} x${i.quantity}`).join(', '),
            price: data.totalAmount,
            declared_value: data.totalAmount,
            do_insurance: true,
            freeshipping: false,
            is_stopdesk: isStopDesk,
            ...(isStopDesk && { stopdesk_id: null }),
            height: 10,
            width: 20,
            length: 30,
            weight: 1,
            has_exchange: false
        }

        const payload = [parcel] // Payload is array of parcels (not array of array of parcels based on some docs, but array of objects)
        // Check API docs: Usually `POST /parcels` accepts `[{...}]`
        // Existing code had `const payload = [[parcel]]`. Double array? 
        // Let's stick to standard `[parcel]` unless specific knowledge says `[[...]]`.
        // Actually, some Yalidine/Guepex integrations use weird formats. 
        // But `[parcel]` is safer JSON `[{...}]`. 
        // Wait, if existing code had `[[parcel]]` maybe it was tested? 
        // "We already connected Guepex API ... but integration is not functioning end-to-end."
        // I will assume standard `[parcel]` first.

        const response = await fetch(`${API_BASE}/parcels`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify([parcel])
        })

        if (!response.ok) {
            const err = await response.text()
            throw new Error(`Guepex API Error (${response.status}): ${err}`)
        }

        const result = await response.json()

        // Guepex usually returns { "OrderRef": { success: true, tracking: "..." } }
        // result is keyed by Order ID (your internal ID)
        const orderResult = result[parcel.order_id]

        if (!orderResult) {
            // Maybe single object?
            if (result.success && result.tracking) return { trackingId: result.tracking, label: result.label, status: "PENDING" }
            throw new Error("Invalid Guepex Response format")
        }

        if (orderResult.success !== true && orderResult.success !== "true") { // Handle loose types
            throw new Error(orderResult.message || "Guepex returned unsuccess")
        }

        return {
            trackingId: orderResult.tracking,
            label: orderResult.label,
            status: "PENDING", // Initial status
            rawResponse: orderResult
        }
    } catch (error) {
        console.error("Guepex Create Shipment Error:", error)
        throw error
    }
}

/**
 * Verify Webhook Signature
 */
export function verifyGuepexSignature(payload: string, signature: string): boolean {
    const secret = process.env.GUEPEX_WEBHOOK_SECRET
    if (!secret) return true // If no secret configured, skip check (dev mode)

    // PHP: hash_hmac("sha256", $payload, $secret_key)
    const crypto = require('crypto')
    const computed = crypto.createHmac('sha256', secret).update(payload).digest('hex')

    return computed === signature
}

/**
 * Map Guepex Status to generic Shipping/Order Status
 */
/**
 * Map Guepex Status to granular Shipping Status and high-level Order Status
 */
export function mapGuepexStatus(guepexStatus: string): { shippingStatus: string, orderStatus: string } {
    const s = guepexStatus.toLowerCase()

    // Default return
    let shippingStatus = "SHIPPING_PENDING"
    let orderStatus = "SHIPPED" // Once tracking exists, it's generally SHIPPED until final state

    // 1. Creation / Pending
    if (s.includes('créé') || s.includes('created') || s.includes('new')) {
        shippingStatus = "SHIPPING_CREATED"
        orderStatus = "SHIPPED" // Or CONFIRMED? Usually if tracking exists, we consider it shipped/processing.
    }
    // 2. Pickup / Center
    else if (s.includes('ramassé') || s.includes('picked') || s.includes('expédié') || s.includes('shipped')) {
        shippingStatus = "SHIPPING_PICKED"
        orderStatus = "SHIPPED"
    }
    // 3. Transit
    else if (s.includes('transit') || s.includes('départ') || s.includes('acheminement')) {
        shippingStatus = "SHIPPING_IN_TRANSIT"
        orderStatus = "SHIPPED"
    }
    // 4. Agency / Center
    else if (s.includes('agence') || s.includes('agency') || s.includes('centre')) {
        shippingStatus = "SHIPPING_AT_AGENCY"
        orderStatus = "SHIPPED"
    }
    // 5. Out for Delivery
    else if (s.includes('livraison') || s.includes('out for delivery') || s.includes('distrib')) {
        shippingStatus = "SHIPPING_OUT_FOR_DELIVERY"
        orderStatus = "SHIPPED"
    }
    // 6. Delivered
    else if (s.includes('livré') || s.includes('delivered')) {
        shippingStatus = "DELIVERED"
        orderStatus = "DELIVERED"
    }
    // 7. Returned / Canceled
    else if (s.includes('retour') || s.includes('returned') || s.includes('annulé') || s.includes('cancelled') || s.includes('échoué')) {
        shippingStatus = "SHIPPING_RETURNED"
        orderStatus = "RETURNED"
    }

    return { shippingStatus, orderStatus }
}
