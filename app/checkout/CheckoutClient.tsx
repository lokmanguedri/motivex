"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { wilayas } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Banknote, Smartphone, CheckCircle, ChevronRight, Truck, Shield, Lock } from "lucide-react"
import { MotivexLogo } from "@/components/motivex-logo"

export default function CheckoutClient() {
    const router = useRouter()
    const { t, language } = useLanguage()
    const { items, subtotal, shipping, total, clearCart } = useCart()
    const { user } = useAuth()

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        wilaya: "",
        commune: "",
        shippingMethod: "YALIDINE",
        paymentMethod: "COD",
        baridiMobReference: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [paymentCode, setPaymentCode] = useState("")

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Check authentication
        if (!user) {
            toast.error(language === "fr" ? "Veuillez vous connecter" : "يرجى تسجيل الدخول")
            router.push("/account")
            return
        }

        if (!formData.name || !formData.phone || !formData.address || !formData.wilaya) {
            toast.error(language === "fr" ? "Veuillez remplir tous les champs" : "يرجى ملء جميع الحقول")
            return
        }

        // Validate BaridiMob reference if selected
        if (formData.paymentMethod === "BARIDIMOB") {
            if (!formData.baridiMobReference || formData.baridiMobReference.length < 6) {
                toast.error(
                    language === "fr"
                        ? "Référence de transaction requise (minimum 6 caractères)"
                        : "مرجع المعاملة مطلوب (6 أحرف على الأقل)"
                )
                return
            }
        }

        setIsSubmitting(true)

        try {
            // Prepare order items
            const orderItems = items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }))

            // Call Orders API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: orderItems,
                    paymentMethod: formData.paymentMethod,
                    baridiMobReference: formData.paymentMethod === "BARIDIMOB" ? formData.baridiMobReference : undefined,
                    shippingFullName: formData.name,
                    shippingPhone: formData.phone,
                    shippingWilaya: formData.wilaya,
                    shippingCommune: formData.commune || formData.wilaya,
                    shippingAddress1: formData.address,
                    shippingNotes: null
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create order')
            }

            // Success!
            setPaymentCode(data.order.paymentCode)
            setOrderPlaced(true)
            clearCart()

            // Show success toast with payment code
            if (formData.paymentMethod === "BARIDIMOB") {
                toast.success(
                    language === "fr"
                        ? `Commande créée. Code paiement: ${data.order.paymentCode}. Mettez-le dans le motif du transfert.`
                        : `تم إنشاء الطلب. كود الدفع: ${data.order.paymentCode}. ضعه في سبب التحويل.`
                )
            } else {
                toast.success(
                    language === "fr"
                        ? `Commande créée avec succès! Code: ${data.order.paymentCode}`
                        : `تم إنشاء الطلب بنجاح! الكود: ${data.order.paymentCode}`
                )
            }
        } catch (error: any) {
            console.error('Order creation error:', error)
            toast.error(
                language === "fr"
                    ? `Erreur: ${error.message}`
                    : `خطأ: ${error.message}`
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (items.length === 0 && !orderPlaced) {
        router.push("/cart")
        return null
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12">
                    <Card className="max-w-md w-full mx-4 border-border">
                        <CardContent className="pt-10 pb-10 text-center">
                            <div className="mb-4">
                                <MotivexLogo size="md" />
                            </div>
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-accent" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">{t("orderConfirmed")}</h1>
                            <p className="text-muted-foreground mb-6">
                                {language === "fr"
                                    ? "Merci pour votre commande! Nous vous contacterons bientôt pour confirmer la livraison."
                                    : "شكراً لطلبك! سنتواصل معك قريباً لتأكيد التوصيل."
                                }
                            </p>
                            <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-muted-foreground mb-1">{language === "fr" ? "Code Paiement" : "كود الدفع"}</p>
                                <p className="font-mono font-bold text-lg text-foreground">{paymentCode}</p>
                            </div>
                            {formData.paymentMethod === "BARIDIMOB" && (
                                <div className="bg-primary/10 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-foreground">
                                        {language === "fr"
                                            ? `⚠️ Important: Mettez le code ${paymentCode} dans le motif/raison de votre transfert BaridiMob pour faciliter la vérification.`
                                            : `⚠️ مهم: ضع الكود ${paymentCode} في سبب التحويل BaridiMob لتسهيل التحقق.`
                                        }
                                    </p>
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <Link href="/account">
                                    <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground">
                                        {t("myOrders")}
                                    </Button>
                                </Link>
                                <Link href="/">
                                    <Button variant="outline" className="w-full h-11 bg-transparent border-border">
                                        {t("continueShopping")}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

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
                            <Link href="/cart" className="hover:text-foreground transition-colors">{t("yourCart")}</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-foreground font-medium">{t("checkout")}</span>
                        </nav>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 mb-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                            <span className="text-sm font-medium text-foreground hidden sm:inline">{t("billingInfo")}</span>
                        </div>
                        <div className="w-8 h-px bg-border" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-medium">2</div>
                            <span className="text-sm text-muted-foreground hidden sm:inline">{t("orderConfirmed")}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Billing Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="border-border">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg">{t("billingInfo")}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium">{t("fullName")}</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => handleChange("name", e.target.value)}
                                                    className="h-11 bg-card border-border"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-sm font-medium">{t("phone")}</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleChange("phone", e.target.value)}
                                                    placeholder="05XX XXX XXX"
                                                    dir="ltr"
                                                    className="h-11 bg-card border-border"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-sm font-medium">{t("address")}</Label>
                                            <Input
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => handleChange("address", e.target.value)}
                                                className="h-11 bg-card border-border"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="wilaya" className="text-sm font-medium">{t("wilaya")}</Label>
                                                <Select value={formData.wilaya} onValueChange={(value) => handleChange("wilaya", value)}>
                                                    <SelectTrigger className="h-11 bg-card border-border">
                                                        <SelectValue placeholder={t("selectWilaya")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {wilayas.map((w, index) => (
                                                            <SelectItem key={w} value={w}>
                                                                {String(index + 1).padStart(2, "0")} - {w}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="commune" className="text-sm font-medium">
                                                    {language === "fr" ? "Commune (optionnel)" : "البلدية (اختياري)"}
                                                </Label>
                                                <Input
                                                    id="commune"
                                                    value={formData.commune}
                                                    onChange={(e) => handleChange("commune", e.target.value)}
                                                    className="h-11 bg-card border-border"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-border">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg">
                                            {language === "fr" ? "Méthode de livraison" : "طريقة التوصيل"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <RadioGroup
                                            value={formData.shippingMethod}
                                            onValueChange={(value) => handleChange("shippingMethod", value)}
                                            className="space-y-3"
                                        >
                                            <label
                                                htmlFor="YALIDINE"
                                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${formData.shippingMethod === "YALIDINE"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:bg-secondary/50"
                                                    }`}
                                            >
                                                <RadioGroupItem value="YALIDINE" id="YALIDINE" />
                                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                                    <Truck className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-foreground">Yalidine</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {language === "fr" ? "Livraison standard 48-72h" : "توصيل قياسي 48-72 ساعة"}
                                                    </p>
                                                </div>
                                            </label>
                                            <label
                                                htmlFor="GUEPEX"
                                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${formData.shippingMethod === "GUEPEX"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:bg-secondary/50"
                                                    }`}
                                            >
                                                <RadioGroupItem value="GUEPEX" id="GUEPEX" />
                                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                                    <Truck className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-foreground">Guepex</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {language === "fr" ? "Livraison express 24-48h" : "توصيل سريع 24-48 ساعة"}
                                                    </p>
                                                </div>
                                            </label>
                                        </RadioGroup>
                                    </CardContent>
                                </Card>

                                <Card className="border-border">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg">{t("paymentMethod")}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <RadioGroup
                                            value={formData.paymentMethod}
                                            onValueChange={(value) => handleChange("paymentMethod", value)}
                                            className="space-y-3"
                                        >
                                            <label
                                                htmlFor="COD"
                                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${formData.paymentMethod === "COD"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:bg-secondary/50"
                                                    }`}
                                            >
                                                <RadioGroupItem value="COD" id="COD" />
                                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                                    <Banknote className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-foreground">{t("cashOnDelivery")}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {language === "fr" ? "Payer en espèces à la livraison" : "الدفع نقداً عند التسليم"}
                                                    </p>
                                                </div>
                                            </label>
                                            <label
                                                htmlFor="BARIDIMOB"
                                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${formData.paymentMethod === "BARIDIMOB"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:bg-secondary/50"
                                                    }`}
                                            >
                                                <RadioGroupItem value="BARIDIMOB" id="BARIDIMOB" />
                                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                                    <Smartphone className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-foreground">{t("baridimob")}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {language === "fr" ? "Paiement mobile sécurisé" : "دفع إلكتروني آمن"}
                                                    </p>
                                                </div>
                                            </label>
                                        </RadioGroup>

                                        {/* BaridiMob Reference Input */}
                                        {formData.paymentMethod === "BARIDIMOB" && (
                                            <div className="space-y-4 pt-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="baridiMobReference" className="text-sm font-medium">
                                                        {language === "fr" ? "Référence de transaction *" : "مرجع المعاملة *"}
                                                    </Label>
                                                    <Input
                                                        id="baridiMobReference"
                                                        value={formData.baridiMobReference}
                                                        onChange={(e) => handleChange("baridiMobReference", e.target.value)}
                                                        placeholder={language === "fr" ? "Ex: BM123456789" : "مثال: BM123456789"}
                                                        className="h-11 bg-card border-border"
                                                        required
                                                        minLength={6}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        {language === "fr"
                                                            ? "Saisissez le numéro de référence de votre transfert BaridiMob (minimum 6 caractères)"
                                                            : "أدخل رقم مرجع تحويل BaridiMob الخاص بك (6 أحرف على الأقل)"
                                                        }
                                                    </p>
                                                </div>

                                                {/* BaridiMob Payment Instructions */}
                                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                                                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                                        <Smartphone className="w-4 h-4" />
                                                        {language === "fr" ? "Instructions de paiement" : "تعليمات الدفع"}
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div>
                                                            <span className="font-medium text-foreground">
                                                                {language === "fr" ? "Compte BaridiMob:" : "حساب BaridiMob:"}
                                                            </span>
                                                            <p className="text-foreground font-mono mt-1">0550 0000 0000</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-foreground">
                                                                {language === "fr" ? "Bénéficiaire:" : "المستفيد:"}
                                                            </span>
                                                            <p className="text-foreground mt-1">MOTIVEX SARL</p>
                                                        </div>
                                                        <div className="mt-3 pt-3 border-t border-primary/20">
                                                            <p className="text-foreground font-medium mb-1">
                                                                ⚠️ {language === "fr" ? "IMPORTANT:" : "مهم:"}
                                                            </p>
                                                            <p className="text-foreground">
                                                                {language === "fr"
                                                                    ? "Après validation de votre commande, vous recevrez un code de paiement. Mettez ce code dans le motif/raison de votre transfert BaridiMob pour faciliter la vérification."
                                                                    : "بعد تأكيد طلبك، ستتلقى رمز الدفع. ضع هذا الرمز في سبب التحويل BaridiMob لتسهيل التحقق."
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <Card className="border-border sticky top-24">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg">{t("orderSummary")}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Items Summary */}
                                        <div className="space-y-3 max-h-48 overflow-y-auto">
                                            {items.map(item => {
                                                const name = language === "fr" ? item.product.nameFr : item.product.nameAr
                                                return (
                                                    <div key={item.product.id} className="flex gap-3">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                                                            <img
                                                                src={item.product.image || "/placeholder.svg"}
                                                                alt={name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-foreground line-clamp-1">{name}</p>
                                                            <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-foreground shrink-0">
                                                            {(item.priceAtAdd * item.quantity).toLocaleString()} DZD
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="border-t border-border pt-4 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">{t("subtotal")}</span>
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
                                            <div className="border-t border-border pt-3 flex justify-between items-baseline">
                                                <span className="font-semibold text-foreground">{t("total")}</span>
                                                <span className="text-xl font-bold text-foreground">{total.toLocaleString()} DZD</span>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? (language === "fr" ? "Traitement..." : "جاري المعالجة...")
                                                : t("confirmOrder")
                                            }
                                        </Button>

                                        {/* Trust badges */}
                                        <div className="pt-4 border-t border-border space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Truck className="w-4 h-4" />
                                                <span>{language === "fr" ? "Livraison rapide via Yalidine" : "توصيل سريع عبر ياليدين"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Shield className="w-4 h-4" />
                                                <span>{language === "fr" ? "Retour gratuit sous 7 jours" : "إرجاع مجاني خلال 7 أيام"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Lock className="w-4 h-4" />
                                                <span>{language === "fr" ? "Paiement 100% sécurisé" : "دفع آمن 100%"}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}
