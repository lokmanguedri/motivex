import { NextRequest, NextResponse } from 'next/server'
import { calculateGuepexFee, calculateGuepexFeeExact } from '@/lib/guepex-api'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const wilayaId = searchParams.get('wilaya_id')
    const communeId = searchParams.get('commune_id')
    const isStopDesk = searchParams.get('is_stop_desk') === 'true'

    if (!wilayaId) {
        return NextResponse.json({ error: "Wilaya ID required" }, { status: 400 })
    }

    try {
        let fee: number | null = null;

        if (communeId) {
            // Precise calculation
            // Note: source wilaya is 16 (Algiers) hardcoded in lib
            fee = await calculateGuepexFeeExact(16, parseInt(wilayaId), parseInt(communeId), isStopDesk)
        } else {
            // Estimate based on wilaya
            fee = await calculateGuepexFee(parseInt(wilayaId), isStopDesk)
        }

        if (fee === null) {
            // Fallback if API fails? Or return error?
            // Fallback to standard 800 DA if API fails to prevent blocking checkout
            return NextResponse.json({ fee: 800, isEstimate: true })
        }

        return NextResponse.json({ fee, isEstimate: false })
    } catch (error) {
        return NextResponse.json({ fee: 800, isEstimate: true, error: "Failed to calc fee" })
    }
}
