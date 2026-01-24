"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus, ChevronRight, Truck, Shield, RotateCcw, CreditCard } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/lib/types"
import { mapApiProductToUi, mapApiProductsToUi } from "@/lib/product-mapper"

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const { t, language } = useLanguage()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          console.error("Failed to fetch product")
          return
        }
        const data = await response.json()
        const mappedProduct = mapApiProductToUi(data.product)
        setProduct(mappedProduct)

        // Fetch related products
        if (mappedProduct.category) {
          const relatedResponse = await fetch(`/api/products?category=${mappedProduct.category}&limit=4`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            const mappedRelated = mapApiProductsToUi(relatedData.products || [])
            // Filter out current product
            setRelatedProducts(mappedRelated.filter(p => p.id !== id).slice(0, 3))
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

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

  if (!product) {
    notFound()
  }

  const discount = product.oldPrice > 0 ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100) : 0
  const name = language === "fr" ? product.nameFr : product.nameAr
  const description = language === "fr" ? product.descriptionFr : product.descriptionAr
  const categoryName = product.category === "carrosserie" ? t("carrosserie") : t("optique")
  const isInStock = product.stock > 0
  const savings = product.oldPrice > 0 ? product.oldPrice - product.newPrice : 0

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    toast.success(t("addedToCart"))
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">{t("home")}</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/category/${product.category}`} className="hover:text-foreground transition-colors">{categoryName}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium line-clamp-1">{name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-sm font-semibold bg-destructive text-destructive-foreground">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Category & SKU */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {categoryName}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground font-mono">SKU: {product.sku}</span>
              </div>

              {/* Product Name */}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance">{name}</h1>

              {/* Compatibility */}
              <p className="text-muted-foreground mb-4">
                {product.brand} {product.model}
                {product.fitmentYearsFrom && product.fitmentYearsTo
                  ? ` (${product.fitmentYearsFrom} - ${product.fitmentYearsTo})`
                  : product.fitmentYearsFrom
                    ? ` (${product.fitmentYearsFrom}+)`
                    : product.year
                      ? ` (${product.year})`
                      : ''
                }
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {isInStock ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-sm font-medium text-accent">{t("inStock")}</span>
                    <span className="text-sm text-muted-foreground">
                      ({product.stock} {language === "fr" ? "disponibles" : "متوفر"})
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">{t("outOfStock")}</span>
                  </>
                )}
              </div>

              {/* Price Block */}
              <div className="bg-secondary/50 rounded-xl p-5 mb-6">
                <div className=" flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-foreground">
                    {product.newPrice.toLocaleString()} DZD
                  </span>
                  {discount > 0 && (
                    <span className="text-lg text-muted-foreground line-through">
                      {product.oldPrice.toLocaleString()} DZD
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-sm text-accent font-medium">
                    {language === "fr"
                      ? `Vous économisez ${savings.toLocaleString()} DZD`
                      : `توفير ${savings.toLocaleString()} دج`
                    }
                  </p>
                )}
              </div>

              {/* Description */}
              {description && (
                <p className="text-foreground/80 mb-6 leading-relaxed">{description}</p>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center h-12 border border-border rounded-lg bg-card">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full rounded-none rounded-s-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-14 text-center font-medium text-foreground">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full rounded-none rounded-e-lg"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                >
                  <ShoppingCart className="w-5 h-5 me-2" />
                  {t("addToCart")}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                  <Truck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {language === "fr" ? "Yalidine" : "ياليدين"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "fr" ? "Livraison rapide" : "توصيل سريع"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                  <CreditCard className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {language === "fr" ? "Paiement" : "الدفع"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "fr" ? "Cash / BaridiMob" : "نقداً / بريدي موب"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                  <Shield className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {language === "fr" ? "Qualité OEM" : "جودة OEM"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "fr" ? "Certifiée" : "معتمدة"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                  <RotateCcw className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {language === "fr" ? "Retour" : "إرجاع"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "fr" ? "7 jours" : "7 أيام"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{t("relatedProducts")}</h2>
                <Link href={`/category/${product.category}`}>
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    {language === "fr" ? "Voir plus" : "عرض المزيد"}
                    <ChevronRight className="w-4 h-4 ms-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
