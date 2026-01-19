"use client"

import React from "react"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/types"
import { toast } from "sonner"

export function ProductCard({ product }: { product: Product }) {
  const { t, language } = useLanguage()
  const { addItem } = useCart()
  
  const discount = Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)
  const name = language === "fr" ? product.nameFr : product.nameAr
  const isInStock = product.stock > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(t("addedToCart"))
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group h-full overflow-hidden border-border bg-card hover:shadow-lg hover:border-border/80 transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img
            src={product.image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {discount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-destructive text-destructive-foreground">
                -{discount}%
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ms-auto ${
              isInStock 
                ? "bg-accent/90 text-accent-foreground" 
                : "bg-muted text-muted-foreground"
            }`}>
              {isInStock ? t("inStock") : t("outOfStock")}
            </span>
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button 
              size="sm" 
              className="bg-card text-foreground hover:bg-card shadow-lg"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <ShoppingCart className="w-4 h-4 me-2" />
              {t("addToCart")}
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          {/* Category */}
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
            {language === "fr" 
              ? (product.category === "carrosserie" ? "Carrosserie" : "Optique")
              : (product.category === "carrosserie" ? "الكاروسري" : "البصريات")
            }
          </p>
          
          {/* Product Name */}
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2 text-sm leading-snug group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          {/* Brand & Model */}
          <p className="text-xs text-muted-foreground mb-3">
            {product.brand} {product.model} ({product.year})
          </p>
          
          {/* Price Block */}
          <div className="flex items-end justify-between gap-2 pt-3 border-t border-border">
            <div>
              {discount > 0 && (
                <p className="text-xs text-muted-foreground line-through">
                  {product.oldPrice.toLocaleString()} DZD
                </p>
              )}
              <p className="text-lg font-bold text-foreground">
                {product.newPrice.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">DZD</span>
              </p>
            </div>
            
            <Button 
              size="icon" 
              variant="outline"
              className="h-9 w-9 shrink-0 bg-transparent border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="sr-only">{t("addToCart")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
