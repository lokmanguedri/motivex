"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Product } from "@/lib/types"

function ProductsContent() {
    const searchParams = useSearchParams()
    const { t, language } = useLanguage()
    const searchQuery = searchParams.get("search") || ""

    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        filterProducts()
    }, [products, searchQuery])

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products")
            if (res.ok) {
                const data = await res.json()
                setProducts(data.products || [])
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const filterProducts = () => {
        if (!searchQuery.trim()) {
            setFilteredProducts(products)
            return
        }

        const query = searchQuery.toLowerCase()
        const filtered = products.filter((product) => {
            const nameFr = product.nameFr?.toLowerCase() || ""
            const nameAr = product.nameAr?.toLowerCase() || ""
            const brand = product.brand?.toLowerCase() || ""
            const model = product.model?.toLowerCase() || ""
            const year = product.year?.toLowerCase() || ""

            return (
                nameFr.includes(query) ||
                nameAr.includes(query) ||
                brand.includes(query) ||
                model.includes(query) ||
                year.includes(query)
            )
        })

        setFilteredProducts(filtered)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">{language === "fr" ? "Chargement..." : "جاري التحميل..."}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        {searchQuery
                            ? (language === "fr" ? "Résultats de recherche" : "نتائج البحث")
                            : (language === "fr" ? "Tous les produits" : "جميع المنتجات")}
                    </h1>
                    {searchQuery && (
                        <p className="text-muted-foreground">
                            {language === "fr"
                                ? `Recherche pour "${searchQuery}"`
                                : `البحث عن "${searchQuery}"`}
                        </p>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-sm text-muted-foreground">
                        {language === "fr"
                            ? `${filteredProducts.length} produit(s) trouvé(s)`
                            : `تم العثور على ${filteredProducts.length} منتج`}
                    </p>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-semibold mb-2">
                            {language === "fr" ? "Aucun produit trouvé" : "لا توجد منتجات"}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {language === "fr"
                                ? "Essayez de modifier votre recherche"
                                : "حاول تعديل بحثك"}
                        </p>
                        <Button onClick={() => window.history.back()}>
                            {language === "fr" ? "Retour" : "رجوع"}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    )
}
