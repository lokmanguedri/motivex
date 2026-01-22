"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { ProductCard } from "@/components/product-card"
import { Loader2 } from "lucide-react"

interface Product {
    id: string
    sku: string
    nameFr: string
    nameAr: string
    price: number
    stockQuantity: number
    mainImage?: { url: string }
    category?: { nameFr: string; nameAr: string }
}

export default function ProductsPage() {
    const searchParams = useSearchParams()
    const { language } = useLanguage()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const searchQuery = searchParams.get("search") || ""

    useEffect(() => {
        async function fetchProducts() {
            setIsLoading(true)
            try {
                const params = new URLSearchParams()
                if (searchQuery) params.append("search", searchQuery)

                const res = await fetch(`/api/products?${params}`, { cache: "no-store" })
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

        fetchProducts()
    }, [searchQuery])

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {searchQuery
                                ? (language === "fr"
                                    ? `Résultats pour "${searchQuery}"`
                                    : `نتائج البحث عن "${searchQuery}"`)
                                : (language === "fr" ? "Tous les produits" : "جميع المنتجات")
                            }
                        </h1>
                        <p className="text-muted-foreground">
                            {isLoading
                                ? (language === "fr" ? "Chargement..." : "جاري التحميل...")
                                : `${products.length} ${language === "fr" ? "produit(s) trouvé(s)" : "منتج"}`
                            }
                        </p>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Products Grid */}
                    {!isLoading && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    title={language === "fr" ? product.nameFr : product.nameAr}
                                    price={product.price}
                                    image={product.mainImage?.url || "/placeholder.svg"}
                                    inStock={product.stockQuantity > 0}
                                    category={product.category ? (language === "fr" ? product.category.nameFr : product.category.nameAr) : ""}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && products.length === 0 && (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <svg
                                    className="mx-auto h-24 w-24 text-muted-foreground/50 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <h2 className="text-xl font-semibold text-foreground mb-2">
                                    {language === "fr" ? "Aucun produit trouvé" : "لم يتم العثور على منتجات"}
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    {searchQuery
                                        ? (language === "fr"
                                            ? `Aucun résultat pour "${searchQuery}". Essayez avec d'autres mots-clés.`
                                            : `لا توجد نتائج لـ "${searchQuery}". جرب كلمات ب حث أخرى.`)
                                        : (language === "fr"
                                            ? "Aucun produit disponible pour le moment."
                                            : "لا توجد منتجات متاحة حالياً.")
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
