import { prisma } from "./prisma"
import { hash } from "bcryptjs"

const globalForBootstrap = globalThis as unknown as {
    adminBootstrapCompleted?: boolean
    adminBootstrapPromise?: Promise<void>
}

export async function bootstrapAdminOnce(): Promise<void> {
    if (globalForBootstrap.adminBootstrapCompleted) {
        return
    }

    if (globalForBootstrap.adminBootstrapPromise) {
        return globalForBootstrap.adminBootstrapPromise
    }

    globalForBootstrap.adminBootstrapPromise = (async () => {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
            globalForBootstrap.adminBootstrapCompleted = true
            return
        }

        try {
            const existing = await prisma.user.findUnique({
                where: { email: adminEmail }
            })

            if (existing) {
                if (existing.role !== "ADMIN") {
                    await prisma.user.update({
                        where: { email: adminEmail },
                        data: { role: "ADMIN" }
                    })
                }
                globalForBootstrap.adminBootstrapCompleted = true
                return
            }

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

            globalForBootstrap.adminBootstrapCompleted = true
        } catch (error) {
            globalForBootstrap.adminBootstrapPromise = undefined
        }
    })()

    return globalForBootstrap.adminBootstrapPromise
}
