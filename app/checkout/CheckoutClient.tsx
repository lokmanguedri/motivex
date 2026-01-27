"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Banknote, Smartphone, CheckCircle, Truck, Lock, Loader2 } from "lucide-react"
import { MotivexLogo } from "@/components/motivex-logo"

// Algerian Wilayas list
const ALGERIAN_WILAYAS = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
    "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
    "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
    "Illizi", "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
    "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
    "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal",
    "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
]

export default function CheckoutClient() {
    const router = useRouter()
    const { t, language } = useLanguage()
    const { items, subtotal, total: cartTotal, clearCart } = useCart()
    const { user } = useAuth()

    const shippingFee = 800 // Static shipping fee

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        wilaya: "",
        commune: "",
        shippingMethod: "HOME_DELIVERY",
        paymentMethod: "COD",
        baridiMobReference: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [paymentCode, setPaymentCode] = useState("")

    // Debug helper
    const isDev = process.env.NODE_ENV === 'development'

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Dynamic Total
    const finalTotal = subtotal + shippingFee

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast.error(language === "fr" ? "Veuillez vous connecter" : "يرجى تسجيل الدخول")
            router.push("/account")
            return
        }

        console.log("[CHECKOUT] Form submission - formData:", formData)
        console.log("[CHECKOUT] Validation check:", {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            wilaya: formData.wilaya,
            commune: formData.commune
        })

        if (!formData.name || !formData.phone || !formData.address || !formData.wilaya) {
            console.error("[CHECKOUT] Validation failed! Missing:", {
                name: !formData.name,
                phone: !formData.phone,
                address: !formData.address,
                wilaya: !formData.wilaya
            })
            toast.error(language === "fr" ? "Veuillez remplir tous les champs" : "يرجى ملء جميع الحقول")
            return
        }

        // Validate BaridiMob reference
        if (formData.paymentMethod === "BARIDIMOB") {
            if (!formData.baridiMobReference || formData.baridiMobReference.length < 6) {
                toast.error(language === "fr" ? "Référence de transaction requise (min 6 caractères)" : "مرجع المعاملة مطلوب")
                return
            }
        }

        setIsSubmitting(true)

        try {
            const orderItems = items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }))

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: orderItems,
                    paymentMethod: formData.paymentMethod,
                    baridiMobReference: formData.paymentMethod === "BARIDIMOB" ? formData.baridiMobReference : undefined,
                    shippingFullName: formData.name,
                    shippingPhone: formData.phone,
                    shippingWilaya: formData.wilaya,
                    shippingCommune: formData.commune,
                    shippingAddress1: formData.address,
                    shippingNotes: null
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create order')
            }

            setPaymentCode(data.order.paymentCode)
            setOrderPlaced(true)
            clearCart()

            toast.success(language === "fr" ? "Commande confirmée !" : "تم تأكيد الطلب!")

        } catch (error: any) {
            console.error('Order error:', error)
            toast.error(error.message)
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
                            <div className="mb-4"><MotivexLogo size="md" /></div>
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-accent" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">{t("orderConfirmed")}</h1>
                            <p className="text-muted-foreground mb-6">
                                {language === "fr" ? "Merci pour votre commande!" : "شكراً لطلبك!"}
                            </p>
                            <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-muted-foreground mb-1">{language === "fr" ? "Code Paiement" : "كود الدفع"}</p>
                                <p className="font-mono font-bold text-lg text-foreground">{paymentCode}</p>
                                <p className="text-xs text-amber-600 mt-2">
                                    {language === "fr" ? "Notez ce code pour le suivi de votre commande" : "سجل هذا الرمز لتتبع طلبك"}
                                </p>
                            </div>
                            {formData.paymentMethod === "BARIDIMOB" && (
                                <div className="bg-primary/10 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-foreground">
                                        {language === "fr"
                                            ? `⚠️ Important: Code ${paymentCode} motif transfert.`
                                            : `⚠️ مهم: الكود ${paymentCode} في سبب التحويل.`}
                                    </p>
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <Link href="/account"><Button className="w-full">{t("myOrders")}</Button></Link>
                                <Link href="/"><Button variant="outline" className="w-full">{t("continueShopping")}</Button></Link>
                            </div>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    {/* Debug Block - Requirement 2 */}
                    {isDev && (
                        <div className="mb-4 p-4 bg-slate-900 text-green-400 font-mono text-xs rounded border border-green-800 overflow-auto">
                            <p><strong>DEBUG SHIPPING:</strong></p>
                            <p>Wilaya: {formData.wilaya}</p>
                            <p>Commune: {formData.commune}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="border-border">
                                    <CardHeader className="pb-4"><CardTitle>{t("billingInfo")} {language === 'fr' ? '(Sécurisé par Yalidine)' : '(مؤمن بواسطة Yalidine)'}</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">{t("fullName")}</Label>
                                                <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">{t("phone")}</Label>
                                                <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required dir="ltr" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">{t("address")}</Label>
                                            <Input id="address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} required />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="wilaya">{t("wilaya")}</Label>
                                                <Select value={formData.wilaya} onValueChange={(value) => handleChange("wilaya", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("selectWilaya")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ALGERIAN_WILAYAS.map((wilaya) => (
                                                            <SelectItem key={wilaya} value={wilaya}>
                                                                {wilaya}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="commune">{language === "fr" ? "Commune" : "البلدية"}</Label>
                                                <Input
                                                    id="commune"
                                                    value={formData.commune}
                                                    onChange={(e) => handleChange("commune", e.target.value)}
                                                    placeholder={language === "fr" ? "Ex: Bab Ezzouar" : "مثال: باب الزوار"}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Shipping Method Selection */}
                                <Card className="border-border">
                                    <CardHeader className="pb-4"><CardTitle>{language === "fr" ? "Méthode de livraison" : "طريقة التوصيل"}</CardTitle></CardHeader>
                                    <CardContent className="space-y-3">
                                        <RadioGroup value={formData.shippingMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, shippingMethod: value }))} className="space-y-3">
                                            <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer ${formData.shippingMethod === "HOME_DELIVERY" ? "border-primary bg-primary/5" : "border-border"}`}>
                                                <RadioGroupItem value="HOME_DELIVERY" id="HOME_DELIVERY" />
                                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Truck className="w-5 h-5 text-primary" /></div>
                                                <div className="flex-1"><p className="font-medium">{language === "fr" ? "Livraison à domicile" : "التوصيل إلى المنزل"}</p></div>
                                            </label>
                                            <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer ${formData.shippingMethod === "DESK_PICKUP" ? "border-primary bg-primary/5" : "border-border"}`}>
                                                <RadioGroupItem value="DESK_PICKUP" id="DESK_PICKUP" />
                                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Truck className="w-5 h-5 text-primary" /></div>
                                                <div className="flex-1"><p className="font-medium">{language === "fr" ? "Retrait au bureau (Stop Desk)" : "التوصيل إلى المكتب"}</p></div>
                                            </label>
                                        </RadioGroup>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader><CardTitle>{t("paymentMethod")}</CardTitle></CardHeader>
                                    <CardContent>
                                        <RadioGroup value={formData.paymentMethod} onValueChange={(val) => handleChange("paymentMethod", val)}>
                                            <label className="flex items-center gap-4 p-4 border rounded-xl mb-2 cursor-pointer">
                                                <RadioGroupItem value="COD" />
                                                <Banknote className="w-5 h-5" />
                                                <span className="font-medium">{t("cashOnDelivery")}</span>
                                            </label>
                                            <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer">
                                                <RadioGroupItem value="BARIDIMOB" />
                                                <Smartphone className="w-5 h-5" />
                                                <span className="font-medium">{t("baridimob")}</span>
                                            </label>
                                        </RadioGroup>
                                        {formData.paymentMethod === "BARIDIMOB" && (
                                            <div className="mt-4">
                                                <Label>{language === "fr" ? "Référence transaction" : "مرجع المعاملة"}</Label>
                                                <Input value={formData.baridiMobReference} onChange={(e) => handleChange("baridiMobReference", e.target.value)} required minLength={6} className="mt-2" />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-1">
                                <Card className="sticky top-24">
                                    <CardHeader><CardTitle>{t("orderSummary")}</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 mb-4">
                                            {items.map(item => (
                                                <div key={item.product.id} className="flex justify-between text-sm">
                                                    <span>{language === "fr" ? item.product.nameFr : item.product.nameAr} x{item.quantity}</span>
                                                    <span>{(item.priceAtAdd * item.quantity).toLocaleString()} DZD</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-4 space-y-2">
                                            <div className="flex justify-between">
                                                <span>{t("subtotal")}</span>
                                                <span>{subtotal.toLocaleString()} DZD</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>{t("shipping")}</span>
                                                <span className="font-medium">
                                                    {shippingFee.toLocaleString()} DZD
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
                                                <span>{t("total")}</span>
                                                <span>{finalTotal.toLocaleString()} DZD</span>
                                            </div>
                                        </div>
                                        <Button className="w-full mt-6" onClick={handleSubmit} disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="animate-spin" /> : t("confirmOrder")}
                                        </Button>

                                        <div className="mt-4 pt-4 border-t space-y-2 text-xs text-muted-foreground">
                                            <div className="flex gap-2"><Truck className="w-4" /> <span>{language === "fr" ? "Livraison par Yalidine" : "توصيل عبر ياليدين"}</span></div>
                                            <div className="flex gap-2"><Lock className="w-4" /> <span>{language === "fr" ? "Paiement Sécurisé" : "دفع آمن"}</span></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div >
    )
}

