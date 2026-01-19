import { prisma } from "./prisma"
import { hash } from "bcryptjs"

/**
 * One-time password reset for admin user
 * This will run once and update the admin password
 */

const globalForReset = globalThis as unknown as {
    adminResetCompleted?: boolean
}

export async function resetAdminPassword(): Promise<void> {
    // Only run once
    if (globalForReset.adminResetCompleted) {
        return
    }

    const adminEmail = "owner@motivex.dz"
    const newPassword = "Motivex@2026"

    try {
        // Find admin user
        const user = await prisma.user.findUnique({
            where: { email: adminEmail }
        })

        if (!user) {
            console.log("❌ Admin user not found, creating new one...")
            const passwordHash = await hash(newPassword, 12)
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
            console.log("✅ Admin user created with new password")
        } else {
            // Update password and ensure role is ADMIN
            const passwordHash = await hash(newPassword, 12)
            await prisma.user.update({
                where: { email: adminEmail },
                data: {
                    passwordHash,
                    role: "ADMIN"
                }
            })
            console.log("✅ Admin password reset and role set to ADMIN")
        }

        globalForReset.adminResetCompleted = true
    } catch (error) {
        console.error("❌ Admin password reset failed:", error)
    }
}
