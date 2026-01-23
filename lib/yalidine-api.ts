/**
 * Yalidine/Guepex Shipping API Client
 * Handles communication with the shipping provider API
 */

const SHIPPING_PROVIDER = process.env.SHIPPING_PROVIDER || 'YALIDINE'
const API_BASE = process.env.YALIDINE_API_BASE || process.env.GUEPEX_API_BASE || ''
const API_KEY = process.env.YALIDINE_API_KEY || process.env.GUEPEX_API_KEY || ''
const WEBHOOK_SECRET = process.env.YALIDINE_WEBHOOK_SECRET || process.env.GUEPEX_WEBHOOK_SECRET || ''

// Type definitions
export interface Commune {
    id: string | number
    name: string
    nameAr?: string
    wilayaId: string | number
}

export interface ShipmentData {
    fullName: string
    phone: string
    address: string
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
    shippingMethod?: string
}

export interface ShipmentResponse {
    trackingId: string
    status: string
    estimatedDelivery?: string
}

export interface StatusResponse {
    trackingId: string
    status: string
    statusHistory: Array<{
        status: string
        timestamp: string
        location?: string
    }>
    lastUpdate: string
}

/**
 * Fetch communes for a given wilaya
 */
export async function getCommunesByWilaya(wilayaId: string): Promise<Commune[]> {
    try {
        const response = await fetch(`${API_BASE}/communes?wilaya=${wilayaId}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch communes: ${response.statusText}`)
        }

        const data = await response.json()
        return data.communes || data.data || []
    } catch (error) {
        console.error('Error fetching communes:', error)
        throw error
    }
}

/**
 * Create a new shipment
 */
export async function createShipment(shipmentData: ShipmentData): Promise<ShipmentResponse> {
    try {
        // Determine if this is a desk pickup
        const isStopdesk = shipmentData.shippingMethod === 'DESK_PICKUP'

        // Yalidine API expects an array of parcels
        const parcels = [{
            order_id: shipmentData.orderNumber,
            from_wilaya_name: "Alger", // Your warehouse location - update as needed
            firstname: shipmentData.fullName.split(' ')[0],
            familyname: shipmentData.fullName.split(' ').slice(1).join(' ') || shipmentData.fullName,
            contact_phone: shipmentData.phone,
            address: shipmentData.address,
            to_commune_name: shipmentData.commune, // Commune name (not ID)
            to_wilaya_name: shipmentData.wilaya, // Wilaya name (not ID)
            product_list: shipmentData.items.map(item => `${item.name} x${item.quantity}`).join(', '),
            price: shipmentData.totalAmount,
            do_not_call: false,
            is_stopdesk: isStopdesk,
            stopdesk_id: null,
            has_exchange: false,
            freeshipping: false,
            product_to_collect: null,
        }]

        const response = await fetch(`${API_BASE}/parcels`, {
            method: 'POST',
            headers: {
                'X-API-ID': process.env.YALIDINE_API_ID || API_KEY,
                'X-API-TOKEN': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parcels),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(`Failed to create shipment: ${errorData.message || response.statusText}`)
        }

        const data = await response.json()

        // Yalidine returns the tracking number in the response
        return {
            trackingId: data[0]?.tracking || data[0]?.tracking_id || data[0]?.id,
            status: 'PENDING',
            estimatedDelivery: undefined,
        }
    } catch (error) {
        console.error('Error creating shipment:', error)
        throw error
    }
}

/**
 * Get shipment status by tracking ID
 */
export async function getShipmentStatus(trackingId: string): Promise<StatusResponse> {
    try {
        const response = await fetch(`${API_BASE}/parcels/${trackingId}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch shipment status: ${response.statusText}`)
        }

        const data = await response.json()

        return {
            trackingId: data.tracking || data.tracking_id || trackingId,
            status: data.status || 'UNKNOWN',
            statusHistory: data.tracking_history || [],
            lastUpdate: data.updated_at || new Date().toISOString(),
        }
    } catch (error) {
        console.error('Error fetching shipment status:', error)
        throw error
    }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!WEBHOOK_SECRET) {
        console.warn('WEBHOOK_SECRET not configured')
        return false
    }

    try {
        const crypto = require('crypto')
        const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
        const digest = hmac.update(payload).digest('hex')

        return digest === signature
    } catch (error) {
        console.error('Error verifying webhook signature:', error)
        return false
    }
}

/**
 * Map shipping provider status to internal order status
 */
export function mapShippingStatus(providerStatus: string): string {
    const statusMap: Record<string, string> = {
        // Yalidine statuses
        'pending': 'PENDING',
        'picked_up': 'PROCESSING',
        'in_transit': 'SHIPPED',
        'out_for_delivery': 'SHIPPED',
        'delivered': 'DELIVERED',
        'returned': 'CANCELLED',
        'cancelled': 'CANCELLED',

        // Guepex statuses (add as needed)
        'new': 'PENDING',
        'processing': 'PROCESSING',
        'shipped': 'SHIPPED',
        'delivery': 'SHIPPED',
        'completed': 'DELIVERED',
        'failed': 'CANCELLED',
    }

    return statusMap[providerStatus.toLowerCase()] || 'PROCESSING'
}

/**
 * Get shipping provider name
 */
export function getShippingProviderName(): string {
    return SHIPPING_PROVIDER
}
