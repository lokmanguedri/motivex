import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

    try {
        // Fetch active categories and products
        const [categories, products] = await Promise.all([
            prisma.category.findMany({
                where: { isActive: true },
                select: { slug: true, updatedAt: true },
            }),
            prisma.product.findMany({
                where: { isActive: true },
                select: { id: true, updatedAt: true },
                take: 1000, // Limit for performance
            }),
        ])

        // Static pages
        const staticPages: MetadataRoute.Sitemap = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/cart`,
                lastModified: new Date(),
                changeFrequency: 'always',
                priority: 0.5,
            },
            {
                url: `${baseUrl}/checkout`,
                lastModified: new Date(),
                changeFrequency: 'always',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/account`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            },
        ]

        // Category pages
        const categoryPages: MetadataRoute.Sitemap = categories.map((category: { slug: string; updatedAt: Date }) => ({
            url: `${baseUrl}/category/${category.slug}`,
            lastModified: category.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))

        // Product pages
        const productPages: MetadataRoute.Sitemap = products.map((product: { id: string; updatedAt: Date }) => ({
            url: `${baseUrl}/product/${product.id}`,
            lastModified: product.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))

        return [...staticPages, ...categoryPages, ...productPages]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        // Return static pages only if DB fetch fails
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
        ]
    }
}
