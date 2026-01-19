"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronRight, Truck, Shield } from "lucide-react"

export default function CartPage() {
  const { t, language } = useLanguage()
  const { items, removeItem, updateQuantity, subtotal, shipping, total } = useCart()

  const totalDiscount = items.reduce((sum, item) => {
    return sum + (item.product.oldPrice - item.priceAtAdd) * item.quantity
  }, 0)

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
              <span className="text-foreground font-medium">{t("yourCart")}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{t("yourCart")}</h1>

          {items.length === 0 ? (
            <Card className="border-border text-center py-16">
              <CardContent>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {language === "fr" ? "Votre panier est vide" : "سلة التسوق فارغة"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === "fr" 
                    ? "Découvrez nos produits et ajoutez-les à votre panier"
                    : "اكتشف منتجاتنا وأضفها إلى سلتك"
                  }
                </p>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6">
                    {t("continueShopping")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map(item => {
                  const name = language === "fr" ? item.product.nameFr : item.product.nameAr
                  const itemTotal = item.priceAtAdd * item.quantity
                  return (
                    <Card key={item.product.id} className="border-border overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                          <Link href={`/product/${item.product.id}`} className="shrink-0">
                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary">
                              <img
                                src={item.product.image || "/placeholder.svg"}
                                alt={name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${item.product.id}`}>
                              <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1">
                                {name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mb-3">
                              {item.product.brand} {item.product.model}
                            </p>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center h-9 border border-border rounded-lg bg-card">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-full w-8 rounded-none rounded-s-lg"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-full w-8 rounded-none rounded-e-lg"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.stock}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="text-end">
                                <p className="font-bold text-foreground">
                                  {itemTotal.toLocaleString()} DZD
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.priceAtAdd.toLocaleString()} DZD × {item.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                
                <Link href="/" className="inline-flex">
                  <Button variant="outline" className="bg-transparent border-border text-muted-foreground hover:text-foreground">
                    <ArrowRight className={`w-4 h-4 ${language === "ar" ? "ms-2" : "me-2 rotate-180"}`} />
                    {t("continueShopping")}
                  </Button>
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="border-border sticky top-24">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{t("orderSummary")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("subtotal")} ({items.length} {language === "fr" ? "articles" : "منتج"})
                        </span>
                        <span className="font-medium text-foreground">{subtotal.toLocaleString()} DZD</span>
                      </div>
                      {totalDiscount > 0 && (
                        <div className="flex justify-between text-accent">
                          <span>{t("discount")}</span>
                          <span className="font-medium">-{totalDiscount.toLocaleString()} DZD</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("shipping")}</span>
                        <span className="font-medium text-foreground">{shipping.toLocaleString()} DZD</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-foreground">{t("total")}</span>
                        <span className="text-2xl font-bold text-foreground">{total.toLocaleString()} DZD</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 pt-0">
                    <Link href="/checkout" className="w-full">
                      <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                        {t("checkout")}
                        <ArrowRight className="w-4 h-4 ms-2" />
                      </Button>
                    </Link>
                    
                    {/* Trust badges */}
                    <div className="w-full pt-4 border-t border-border space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Truck className="w-4 h-4" />
                        <span>{language === "fr" ? "Livraison Yalidine" : "توصيل ياليدين"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        <span>{language === "fr" ? "Paiement sécurisé" : "دفع آمن"}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
