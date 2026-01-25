import { NextResponse } from 'next/server'
import { getGuepexWilayas, getGuepexCommunes } from '@/lib/guepex-api'

// Force rebuild: 2026-01-25T01:40:00
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const start = Date.now()

        // Parallel fetch to test connectivity
        const [wilayas, communes] = await Promise.all([
            getGuepexWilayas(),
            getGuepexCommunes()
        ])

        const duration = Date.now() - start

        if (!wilayas.length || !communes.length) {
            return NextResponse.json({
                status: 'degraded',
                message: 'Connected to Guepex but returned empty lists. Check API Key.',
                duration: `${duration}ms`
            }, { status: 500 })
        }

        return NextResponse.json({
            status: 'healthy',
            message: 'Successfully connected to Guepex API',
            provider: 'YALIDINE / GUEPEX',
            stats: {
                wilayas_count: wilayas.length,
                communes_count: communes.length
            },
            sample_wilaya: wilayas[0],
            latency: `${duration}ms`
        })

    } catch (error: any) {
        return NextResponse.json({
            status: 'unhealthy',
            error: error.message
        }, { status: 500 })
    }
}
