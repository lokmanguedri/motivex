"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Package, MapPin, CreditCard, ArrowLeft } from "lucide-react"
import { MotivexLogo } from "@/components/motivex-logo"

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = params.id as string
  const { t, language } = useLanguage()
  const { orders, user } = useAuth()

  const order = orders.find(o => o.id === orderId)

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      returned: "bg-red-100 text-red-800",
    }
    return statusColors[status] || "bg-gray-100 text-gray-800"
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-secondary flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 text-center">
            <CardContent className="py-8">
              <p className="text-muted-foreground mb-4">{t("loginRequired")}</p>
              <Link href="/account">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {t("login")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-secondary flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 text-center">
            <CardContent className="py-8">
              <p className="text-muted-foreground mb-4">
                {language === "fr" ? "Commande introuvable" : "الطلب غير موجود"}
              </p>
              <Link href="/account">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {t("myOrders")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/account" className="hover:text-foreground">{t("myAccount")}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/account" className="hover:text-foreground">{t("myOrders")}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{order.id}</span>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/account">
                <Button variant="outline" size="icon" className="bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t("orderDetails")}</h1>
                <p className="text-muted-foreground font-mono">{order.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getStatusBadge(order.status)}>
                {t(order.status as "pending" | "confirmed" | "shipped" | "delivered" | "returned")}
              </Badge>
              <MotivexLogo size="sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {language === "fr" ? "Articles" : "المنتجات"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map(item => {
                      const name = language === "fr" ? item.product.nameFr : item.product.nameAr
                      return (
                        <div key={item.product.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                          <img
                            src={item.product.image || "/placeholder.svg"}
                            alt={name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-card-foreground">{name}</h3>
                            <p className="text-sm text-muted-foreground">{item.product.brand} - {item.product.model}</p>
                            <p className="text-sm text-muted-foreground">{t("quantity")}: {item.quantity}</p>
                          </div>
                          <div className="text-end">
                            <p className="font-bold text-accent">{(item.priceAtAdd * item.quantity).toLocaleString()} DZD</p>
                            <p className="text-sm text-muted-foreground">{item.priceAtAdd.toLocaleString()} DZD x{item.quantity}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Info */}
            <div className="space-y-6">
              {/* Summary */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>{t("orderSummary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span>{order.subtotal.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("shipping")}</span>
                    <span>{order.shipping.toLocaleString()} DZD</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">{t("total")}</span>
                    <span className="font-bold text-accent">{order.total.toLocaleString()} DZD</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {language === "fr" ? "Livraison" : "التوصيل"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-muted-foreground">{order.customer.address}</p>
                  <p className="text-muted-foreground">{order.customer.wilaya}</p>
                  <p className="text-muted-foreground" dir="ltr">{order.customer.phone}</p>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {t("paymentMethod")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">
                    {order.paymentMethod === "cash" ? t("cashOnDelivery") : t("baridimob")}
                  </p>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card className="border-border">
                <CardContent className="pt-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("orderDate")}</span>
                    <span>{new Date(order.createdAt).toLocaleDateString(language === "fr" ? "fr-FR" : "ar-DZ")}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
