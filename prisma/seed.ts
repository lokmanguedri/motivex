import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
        throw new Error(
            "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file"
        )
    }

    const passwordHash = await hash(adminPassword, 10)

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            passwordHash,
            role: "ADMIN",
        },
        create: {
            email: adminEmail,
            passwordHash,
            firstName: "Admin",
            lastName: "User",
            role: "ADMIN",
        },
    })
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
