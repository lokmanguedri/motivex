import { NextRequest, NextResponse } from 'next/server'
import { getGuepexCommunes } from '@/lib/guepex-api'

export const revalidate = 86400 // Cache API response for 24h

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const wilayaId = searchParams.get('wilaya_id')

        // Fetch ALL communes from Guepex (not just 100)
        const allCommunes = await getGuepexCommunes()

        // Filter by wilaya if requested
        if (wilayaId) {
            const filtered = allCommunes.filter(
                (c) => c.wilaya_id == parseInt(wilayaId)
            )
            return NextResponse.json(filtered)
        }

        return NextResponse.json(allCommunes)
    } catch (error) {
        console.error("Communes API Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch communes" },
            { status: 500 }
        )
    }
}
