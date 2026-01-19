#!/usr/bin/env node

/**
 * Production Verification Script
 * Verifies critical endpoints are accessible and functioning
 */

const ENDPOINTS = [
    { path: '/robots.txt', name: 'Robots.txt' },
    { path: '/sitemap.xml', name: 'Sitemap' },
    { path: '/manifest.webmanifest', name: 'PWA Manifest' },
]

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

async function verifyEndpoint(endpoint) {
    try {
        const url = `${BASE_URL}${endpoint.path}`
        console.log(`\n🔍 Testing: ${endpoint.name}`)
        console.log(`   URL: ${url}`)

        const response = await fetch(url)
        const text = await response.text()

        const status = response.ok ? '✅' : '❌'
        console.log(`   ${status} Status: ${response.status} ${response.statusText}`)

        if (response.ok) {
            const preview = text.substring(0, 200).replace(/\n/g, ' ')
            console.log(`   Preview: ${preview}...`)
        } else {
            console.error(`   Error: ${text.substring(0, 200)}`)
        }

        return response.ok
    } catch (error) {
        console.error(`   ❌ Failed: ${error.message}`)
        return false
    }
}

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🚀 MOTIVEX Production Verification')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Base URL: ${BASE_URL}`)

    const results = []
    for (const endpoint of ENDPOINTS) {
        const success = await verifyEndpoint(endpoint)
        results.push({ endpoint: endpoint.name, success })
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 Results Summary')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    results.forEach(({ endpoint, success }) => {
        const icon = success ? '✅' : '❌'
        console.log(`${icon} ${endpoint}`)
    })

    const allPassed = results.every(r => r.success)

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    if (allPassed) {
        console.log('✅ All checks passed! Ready for production.')
        process.exit(0)
    } else {
        console.error('❌ Some checks failed. Review errors above.')
        process.exit(1)
    }
}

main().catch(error => {
    console.error('\n❌ Verification script failed:', error)
    process.exit(1)
})
