import { prisma } from "./prisma"
import { hash } from "bcryptjs"

/**
 * Bootstrap admin user at RUNTIME ONLY (not during build)
 * Uses globalThis cache to run once per server instance
 * Idempotent: safe to call multiple times
 */

// Global cache to ensure bootstrap runs only once per server instance
const globalForBootstrap = globalThis as unknown as {
    adminBootstrapCompleted?: boolean
    adminBootstrapPromise?: Promise<void>
}

export async function bootstrapAdminOnce(): Promise<void> {
    // Return immediately if already completed
    if (globalForBootstrap.adminBootstrapCompleted) {
        return
    }

    // If bootstrap is in progress, wait for it
    if (globalForBootstrap.adminBootstrapPromise) {
        return globalForBootstrap.adminBootstrapPromise
    }

    // Start bootstrap
    globalForBootstrap.adminBootstrapPromise = (async () => {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        // Skip if env vars not set
        if (!adminEmail || !adminPassword) {
            if (process.env.NODE_ENV === "development") {
                console.log("ℹ️  Admin bootstrap skipped (ADMIN_EMAIL/ADMIN_PASSWORD not set)")
            }
            globalForBootstrap.adminBootstrapCompleted = true
            return
        }

        try {
            // Check if admin exists
            const existing = await prisma.user.findUnique({
                where: { email: adminEmail }
            })

            if (existing) {
                if (process.env.NODE_ENV === "development") {
                    console.log("✅ Admin user already exists:", adminEmail)
                }
                globalForBootstrap.adminBootstrapCompleted = true
                return
            }

            // Create admin
            const passwordHash = await hash(adminPassword, 12)
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    passwordHash,
                    firstName: "Admin",
                    lastName: "MOTIVEX",
                    role: "ADMIN",
                    phone: null
                }
            })

            console.log("✅ Admin user created:", adminEmail)
            globalForBootstrap.adminBootstrapCompleted = true
        } catch (error) {
            console.error("❌ Admin bootstrap failed:", error)
            // Don't mark as completed, allow retry
            globalForBootstrap.adminBootstrapPromise = undefined
        }
    })()

    return globalForBootstrap.adminBootstrapPromise
}
