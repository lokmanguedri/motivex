"use client"

import Link from "next/link"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { mapApiProductsToUi } from "@/lib/product-mapper"

export function FeaturedProducts() {
  const { t, language } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch("/api/products?limit=6")
        if (!response.ok) {
          setProducts([])
          return
        }
        const data = await response.json()
        const mappedProducts = mapApiProductsToUi(data.products || [])
        setProducts(mappedProducts)
      } catch {
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">
              {language === "fr" ? "Chargement..." : "جاري التحميل..."}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
              {t("featuredProducts")}
            </h2>
            <p className="text-muted-foreground">
              {language === "fr"
                ? "Nos meilleures offres du moment"
                : "أفضل عروضنا الحالية"}
            </p>
          </div>
          <Link href="/category/carrosserie">
            <Button variant="outline" className="bg-transparent border-border text-foreground hover:bg-card group">
              {language === "fr" ? "Voir tout" : "عرض الكل"}
              <ArrowRight className="w-4 h-4 ms-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === "fr" ? "Aucun produit disponible" : "لا توجد منتجات متاحة"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
