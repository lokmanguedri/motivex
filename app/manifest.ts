import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'MOTIVEX - Pièces Auto Algérie',
        short_name: 'MOTIVEX',
        description: 'Pièces de carrosserie et optique automobile en Algérie',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2d3436',
        orientation: 'portrait',
        icons: [
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}
