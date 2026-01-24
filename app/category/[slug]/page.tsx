"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Filter, X, ChevronRight, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Product } from "@/lib/types"
import { mapApiProductsToUi } from "@/lib/product-mapper"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t, language } = useLanguage()

  const [brand, setBrand] = useState<string>("all")
  const [year, setYear] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("default")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [brands, setBrands] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch products for this category
        const response = await fetch(`/api/products?category=${slug}&limit=100`)
        if (!response.ok) {
          console.error("Failed to fetch products")
          setProducts([])
          return
        }
        const data = await response.json()
        const mappedProducts = mapApiProductsToUi(data.products || [])
        setProducts(mappedProducts)

        // Extract unique brands and years for filters
        const brandsSet = new Set<string>()
        const yearsSet = new Set<string>()

        mappedProducts.forEach(p => {
          if (p.brand) {
            // Normalize brand: trim whitespace and ensure proper casing
            const normalizedBrand = p.brand.trim()
            // Capitalize first letter
            const displayBrand = normalizedBrand.charAt(0).toUpperCase() + normalizedBrand.slice(1)
            brandsSet.add(displayBrand)
          }
          if (p.year) yearsSet.add(p.year)
        })

        setBrands(Array.from(brandsSet).sort())
        setYears(Array.from(yearsSet).sort().reverse())
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [slug])

  const categoryProducts = useMemo(() => {
    let filtered = [...products]

    if (brand !== "all") {
      filtered = filtered.filter(p => {
        if (!p.brand) return false
        const normalized = p.brand.trim()
        const display = normalized.charAt(0).toUpperCase() + normalized.slice(1)
        return display === brand
      })
    }
    if (year !== "all") {
      filtered = filtered.filter(p => p.year === year)
    }

    if (sortBy === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.newPrice - b.newPrice)
    } else if (sortBy === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.newPrice - a.newPrice)
    } else if (sortBy === "discount") {
      filtered = [...filtered].sort((a, b) => {
        const discountA = a.oldPrice > 0 ? (a.oldPrice - a.newPrice) / a.oldPrice : 0
        const discountB = b.oldPrice > 0 ? (b.oldPrice - b.newPrice) / b.oldPrice : 0
        return discountB - discountA
      })
    }

    return filtered
  }, [products, brand, year, sortBy])

  const categoryTitle = slug === "carrosserie" ? t("carrosserie") : t("optique")
  const hasActiveFilters = brand !== "all" || year !== "all" || sortBy !== "default"

  const clearFilters = () => {
    setBrand("all")
    setYear("all")
    setSortBy("default")
  }

  const FilterControls = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
          {t("filterByBrand")}
        </Label>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger className="h-11 bg-card border-border">
            <SelectValue placeholder={t("allBrands")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allBrands")}</SelectItem>
            {brands.map(b => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
          {t("filterByYear")}
        </Label>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="h-11 bg-card border-border">
            <SelectValue placeholder={t("allYears")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allYears")}</SelectItem>
            {years.map(y => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
          {t("sortBy")}
        </Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-11 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">{language === "fr" ? "Par défaut" : "الافتراضي"}</SelectItem>
            <SelectItem value="price-asc">{language === "fr" ? "Prix croissant" : "السعر: الأقل"}</SelectItem>
            <SelectItem value="price-desc">{language === "fr" ? "Prix décroissant" : "السعر: الأعلى"}</SelectItem>
            <SelectItem value="discount">{language === "fr" ? "Remise" : "الخصم"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full h-11 bg-transparent border-border text-muted-foreground hover:text-foreground"
          onClick={clearFilters}
        >
          <X className="w-4 h-4 me-2" />
          {language === "fr" ? "Effacer les filtres" : "مسح الفلاتر"}
        </Button>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            {language === "fr" ? "Chargement..." : "جاري التحميل..."}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-secondary/50 border-b border-border">
          <div className="container mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground transition-colors">{t("home")}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{categoryTitle}</span>
            </nav>

            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{categoryTitle}</h1>
                <p className="text-muted-foreground mt-1">
                  {categoryProducts.length} {language === "fr" ? "produits trouvés" : "منتج موجود"}
                </p>
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden bg-card border-border h-11 gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    {language === "fr" ? "Filtres" : "فلاتر"}
                    {hasActiveFilters && (
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        !
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side={language === "ar" ? "left" : "right"} className="w-80">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-lg">
                      {language === "fr" ? "Filtres" : "فلاتر"}
                    </SheetTitle>
                  </SheetHeader>
                  <FilterControls />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-foreground">{language === "fr" ? "Filtres" : "فلاتر"}</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {language === "fr" ? "Réinitialiser" : "إعادة تعيين"}
                    </button>
                  )}
                </div>
                <FilterControls />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {categoryProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                    <Filter className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {language === "fr" ? "Aucun produit trouvé" : "لم يتم العثور على منتجات"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {language === "fr"
                      ? "Essayez de modifier vos filtres"
                      : "حاول تعديل الفلاتر"
                    }
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="bg-transparent">
                    {language === "fr" ? "Effacer les filtres" : "مسح الفلاتر"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
