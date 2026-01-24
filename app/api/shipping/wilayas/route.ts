import { NextResponse } from 'next/server'
import { getGuepexWilayas } from '@/lib/guepex-api'

export const revalidate = 86400 // Cache API response for 24h

export async function GET() {
    try {
        const wilayas = await getGuepexWilayas()

        // Ensure standard format for frontend
        return NextResponse.json(wilayas)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch wilayas" },
            { status: 500 }
        )
    }
}
