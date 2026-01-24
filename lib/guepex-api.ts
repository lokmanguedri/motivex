/**
 * Guepex Shipping API Client
 * Documentation based on user provided details
 */

export interface GuepexShipmentData {
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
    shippingMethod?: string // 'HOME' | 'DESK_PICKUP'
}

export interface GuepexResponse {
    success: boolean
    tracking?: string
    order_id?: string
    label?: string
    message?: string
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
 * Fetch communes (Guepex uses same structure as Yalidine for convenience?)
 * actually we verified /v1/communes works.
 */
export async function getGuepexCommunes() {
    try {
        const response = await fetch(`${API_BASE}/communes`, {
            headers: getHeaders()
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
 * Create a shipment in Guepex
 */
export async function createGuepexShipment(data: GuepexShipmentData) {
    try {
        const isStopDesk = data.shippingMethod === 'DESK_PICKUP'

        // Construct payload based on user provided docs
        // Guepex expects an array of parcels
        const parcel = {
            order_id: data.orderNumber,
            firstname: data.fullName.split(' ')[0],
            familyname: data.fullName.split(' ').slice(1).join(' ') || '.',
            contact_phone: data.phone,
            address: data.address,
            from_wilaya_name: "Alger", // Warehouse location - generic for now
            to_wilaya_name: data.wilaya,
            to_commune_name: data.commune,
            product_list: data.items.map(i => `${i.name} x${i.quantity}`).join(', '),
            price: data.totalAmount,
            declared_value: data.totalAmount,
            do_insurance: true, // Defaulting to true as per examples often showing true
            freeshipping: false,
            is_stopdesk: isStopDesk,
            ...(isStopDesk && { stopdesk_id: null }), // If we had desk ID we would pass it
            // Required placeholders for dimensions/weight to avoid errors
            height: 10,
            width: 20,
            length: 30,
            weight: 1,
            has_exchange: false
        }

        // Guepex Payload is an ARRAY of arrays? 
        // Docs: "To create a parcel you need to send an array of an array of one or many parcels."
        // $data = array( array( ... ) )
        const payload = [[parcel]]

        const response = await fetch(`${API_BASE}/parcels`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const err = await response.text()
            throw new Error(`Guepex API Error: ${err}`)
        }

        const result = await response.json()

        // Response key is the order_id
        const orderResult = result[data.orderNumber]

        if (!orderResult || !orderResult.success) {
            throw new Error(orderResult?.message || "Unknown Guepex Error")
        }

        return {
            trackingId: orderResult.tracking,
            label: orderResult.label,
            status: "PENDING"
        }

    } catch (error) {
        console.error("Guepex Create Shipment Error:", error)
        throw error
    }
}
