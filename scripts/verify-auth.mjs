#!/usr/bin/env node

/**
 * Auth verification script for MOTIVEX
 * Tests authentication flows in production
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"

async function testHealthAuth() {
    console.log("\n🔍 Testing /api/health/auth...")
    const res = await fetch(`${BASE_URL}/api/health/auth`)
    const data = await res.json()
    console.log("✅ Health check:", JSON.stringify(data, null, 2))

    if (!data.has_secret) {
        console.warn("⚠️  WARNING: NEXTAUTH_SECRET not set!")
    }
    if (data.nextauth_url.includes("localhost") && data.is_prod) {
        console.warn("⚠️  WARNING: NEXTAUTH_URL still set to localhost in production!")
    }
}

async function testSession() {
    console.log("\n🔍 Testing /api/auth/session...")
    const res = await fetch(`${BASE_URL}/api/auth/session`)
    const data = await res.json()

    if (data.user) {
        console.log("✅ Session exists:", {
            email: data.user.email,
            role: data.user.role,
            id: data.user.id
        })
    } else {
        console.log("ℹ️  No active session")
    }
}

async function testRegisterDuplicate() {
    console.log("\n🔍 Testing duplicate email registration...")

    const testEmail = "test@example.com"
    const testData = {
        email: testEmail,
        password: "test123",
        firstName: "Test",
        lastName: "User",
        phone: "0555123456"
    }

    // First registration
    console.log("  Attempting first registration...")
    const res1 = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData)
    })
    const data1 = await res1.json()

    if (res1.status === 201) {
        console.log("  ✅ First registration successful")
    } else if (res1.status === 409 && data1.code === "EMAIL_EXISTS") {
        console.log("  ℹ️  Email already exists (expected if run before)")
    } else {
        console.log("  ❌ Unexpected response:", res1.status, data1)
    }

    // Duplicate registration
    console.log("  Attempting duplicate registration...")
    const res2 = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData)
    })
    const data2 = await res2.json()

    if (res2.status === 409 && data2.code === "EMAIL_EXISTS") {
        console.log("  ✅ Duplicate email correctly rejected:", data2.error)
    } else {
        console.log("  ❌ Expected 409 EMAIL_EXISTS, got:", res2.status, data2)
    }
}

async function testAdminLogin() {
    console.log("\n🔍 Testing admin login...")

    const adminEmail = process.env.ADMIN_EMAIL || "owner@motivex.dz"
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
        console.log("  ⚠️  ADMIN_PASSWORD not set, skipping admin login test")
        return
    }

    console.log(`  Attempting login as ${adminEmail}...`)

    // Note: This is a simplified test. In real scenario, you'd need to handle
    // NextAuth's CSRF token and session cookies properly
    console.log("  ℹ️  Admin login test requires browser session handling")
    console.log("  ℹ️  Manually test: Login at /account with admin credentials")
    console.log("  ℹ️  Expected: Redirect to /admin")
}

async function main() {
    console.log("🚀 MOTIVEX Auth Verification")
    console.log("Base URL:", BASE_URL)
    console.log("=".repeat(50))

    try {
        await testHealthAuth()
        await testSession()
        await testRegisterDuplicate()
        await testAdminLogin()

        console.log("\n" + "=".repeat(50))
        console.log("✅ Verification complete")
    } catch (error) {
        console.error("\n❌ Verification failed:", error)
        process.exit(1)
    }
}

main()
