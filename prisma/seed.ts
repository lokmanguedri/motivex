import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding database...")

    // Get admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
        throw new Error(
            "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file"
        )
    }

    // Hash password
    const passwordHash = await hash(adminPassword, 10)

    // Upsert admin user (create or update)
    const admin = await prisma.user.upsert({
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

    console.log("✅ Admin user created/updated:")
    console.log(`   Email: ${admin.email}`)
    console.log(`   Role: ${admin.role}`)
    console.log(`   ID: ${admin.id}`)

    console.log("\n🎉 Seeding completed successfully!")
}

main()
    .catch((error) => {
        console.error("❌ Seeding failed:")
        console.error(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
