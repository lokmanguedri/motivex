import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteAllOrders() {
    try {
        console.log('🗑️  Starting to delete all orders...')

        // Delete all order items first (because of foreign key constraints)
        const deletedItems = await prisma.orderItem.deleteMany({})
        console.log(`✅ Deleted ${deletedItems.count} order items`)

        // Delete all payments
        const deletedPayments = await prisma.payment.deleteMany({})
        console.log(`✅ Deleted ${deletedPayments.count} payments`)

        // Finally, delete all orders
        const deletedOrders = await prisma.order.deleteMany({})
        console.log(`✅ Deleted ${deletedOrders.count} orders`)

        console.log('✨ All old orders have been successfully deleted!')
    } catch (error) {
        console.error('❌ Error deleting orders:', error)
    } finally {
        await prisma.$disconnect()
    }
}

deleteAllOrders()
