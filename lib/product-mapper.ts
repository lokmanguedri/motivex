/**
 * Product type mapping utilities
 * Converts API product shape to UI product type
 */

import type { Product } from "./types"

// API Product shape from /api/products
interface ApiProduct {
    id: string
    sku: string
    nameFr: string
    nameAr: string
    descFr: string | null
    descAr: string | null
    price: number
    oldPrice: number | null
    stock: number
    brand: string | null
    model: string | null
    year: number | null
    isActive: boolean
    categoryId: string
    category: {
        id: string
        nameFr: string
        nameAr: string
        slug: string
    }
    images: Array<{
        url: string
        isMain: boolean
        sortOrder: number
    }>
}

/**
 * Maps API product to UI Product type
 * Maintains compatibility with existing ProductCard and pages
 */
export function mapApiProductToUi(apiProduct: ApiProduct): Product {
    // Find main image or use first image, or placeholder
    const mainImage =
        apiProduct.images.find((img) => img.isMain)?.url ||
        apiProduct.images[0]?.url ||
        "/placeholder.svg"

    return {
        id: apiProduct.id,
        nameFr: apiProduct.nameFr,
        nameAr: apiProduct.nameAr,
        descriptionFr: apiProduct.descFr || "",
        descriptionAr: apiProduct.descAr || "",
        oldPrice: apiProduct.oldPrice ? Number(apiProduct.oldPrice) : 0,
        newPrice: Number(apiProduct.price),
        image: mainImage,
        images: apiProduct.images.map((img) => img.url),
        category: apiProduct.category.slug,
        brand: apiProduct.brand || "",
        model: apiProduct.model || "",
        year: apiProduct.year?.toString() || "",
        stock: apiProduct.stock,
        sku: apiProduct.sku,
    }
}

/**
 * Maps array of API products to UI products
 */
export function mapApiProductsToUi(apiProducts: ApiProduct[]): Product[] {
    return apiProducts.map(mapApiProductToUi)
}
