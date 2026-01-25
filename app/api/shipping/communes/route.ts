import { NextRequest, NextResponse } from 'next/server'
import { getGuepexCommunes } from '@/lib/guepex-api'

export const revalidate = 86400 // Cache API response for 24h

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const wilayaId = searchParams.get('wilaya_id')

        // Fetch ALL communes from Guepex
        const allCommunes = await getGuepexCommunes()

        console.log(`[Communes API] Total communes from Guepex: ${allCommunes.length}`)

        // Filter by wilaya if requested
        if (wilayaId) {
            const filtered = allCommunes.filter(
                (c) => String(c.wilaya_id) === String(wilayaId)
            )
            console.log(`[Communes API] Filtered for wilaya ${wilayaId}: ${filtered.length} communes`)
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
