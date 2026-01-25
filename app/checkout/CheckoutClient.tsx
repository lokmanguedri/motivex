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

interface Wilaya {
    id: number
    name: string
    zone: number
}

interface Commune {
    id: number
    name: string
    wilaya_id: number
    has_stop_desk: number
    is_deliverable: number
}

export default function CheckoutClient() {
    const router = useRouter()
    const { t, language } = useLanguage()
    const { items, subtotal, total: cartTotal, clearCart } = useCart()
    const { user } = useAuth()

    // Shipping Data State
    const [wilayas, setWilayas] = useState<Wilaya[]>([])
    const [communes, setCommunes] = useState<Commune[]>([])
    const [filteredCommunes, setFilteredCommunes] = useState<Commune[]>([])
    const [isLoadingLocation, setIsLoadingLocation] = useState(true)
    const [shippingFee, setShippingFee] = useState(800) // Default fallback
    const [isCalculatingFee, setIsCalculatingFee] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        wilaya: "", // Stores ID as string
        wilayaName: "", // For UI/API
        commune: "", // Stores ID as string
        communeName: "", // For UI/API
        shippingMethod: "HOME_DELIVERY",
        paymentMethod: "COD",
        baridiMobReference: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [paymentCode, setPaymentCode] = useState("")
    const [trackingNumber, setTrackingNumber] = useState("")

    // Debug helper
    const isDev = process.env.NODE_ENV === 'development'

    // Load Wilayas on mount (Communes loaded dynamically per wilaya)
    useEffect(() => {
        const loadWilayas = async () => {
            try {
                const wRes = await fetch('/api/shipping/wilayas')
                if (wRes.ok) {
                    setWilayas(await wRes.json())
                }
            } catch (err) {
                console.error("Failed to load wilayas", err)
                toast.error("Error loading location data / خطأ في تحميل البيانات")
            } finally {
                setIsLoadingLocation(false)
            }
        }
        loadWilayas()
    }, [])

    const calculateFee = async (wilayaId: number, communeId: number | null, isStopDesk: boolean) => {
        setIsCalculatingFee(true)
        try {
            const params = new URLSearchParams()
            params.append('wilaya_id', wilayaId.toString())
            params.append('is_stop_desk', isStopDesk.toString())
            if (communeId) params.append('commune_id', communeId.toString())

            const res = await fetch(`/api/shipping/fee?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setShippingFee(data.fee)
            }
        } catch (err) {
            console.error("Fee calc error", err)
        } finally {
            setIsCalculatingFee(false)
        }
    }

    // Filter communes when Wilaya changes
    const handleWilayaChange = async (wilayaIdStr: string) => {
        const wilayaId = parseInt(wilayaIdStr)
        const selectedWilaya = wilayas.find(w => w.id === wilayaId)

        // Reset commune when wilaya changes
        setFormData(prev => ({
            ...prev,
            wilaya: wilayaIdStr,
            wilayaName: selectedWilaya?.name || "",
            commune: "",
            communeName: ""
        }))

        // Fetch communes for this wilaya
        await filterCommunesForWilaya(wilayaId, formData.shippingMethod)

        // Reset fee
        calculateFee(wilayaId, null, formData.shippingMethod === 'DESK_PICKUP')
    }

// Helper to fetch and filter communes by wilaya and mode
    const filterCommunesForWilaya = async (wilayaId: number, mode: string) => {
        try {
            console.log(`[CHECKOUT] Fetching communes for wilaya ${wilayaId}, mode: ${mode}`)
            
            // Fetch communes for this specific wilaya using query parameter
            const res = await fetch(`/api/shipping/communes?wilaya_id=${wilayaId}`)
            if (!res.ok) {
                console.error("[CHECKOUT] Failed to fetch communes:", await res.text())
                setFilteredCommunes([])
                return
            }

            const allCommunes = await res.json()
            console.log(`[CHECKOUT] Received ${allCommunes.length} communes for wilaya ${wilayaId} from API`)
            
            // Filter based on delivery mode
            const filtered = allCommunes.filter((c: Commune) => {
                // STOPDESK mode: only communes with stopdesk offices
                if (mode === 'DESK_PICKUP') {
                    return c.has_stop_desk === 1
                }
                
                // HOME delivery: only deliverable communes
                return c.is_deliverable === 1
            })
            
            setFilteredCommunes(filtered)
            console.log(`[CHECKOUT] Filtered Communes for Wilaya ${wilayaId} (${mode}): ${filtered.length} found`)
        } catch (err) {
            console.error("[CHECKOUT] Error filtering communes:", err)
            setFilteredCommunes([])
        }
    }


    const handleCommuneChange = (communeIdStr: string) => {
        const communeId = parseInt(communeIdStr)
        const selectedCommune = filteredCommunes.find(c => c.id === communeId)

        setFormData(prev => ({
            ...prev,
            commune: communeIdStr,
            communeName: selectedCommune?.name || ""
        }))

        // Calculate precise fee
        if (formData.wilaya) {
            calculateFee(parseInt(formData.wilaya), communeId, formData.shippingMethod === 'DESK_PICKUP')
        }
    }

    const handleMethodChange = async (method: string) => {
        setFormData(prev => ({ ...prev, shippingMethod: method }))

        // Re-filter communes when mode changes
        if (formData.wilaya) {
            const wilayaId = parseInt(formData.wilaya)
            await filterCommunesForWilaya(wilayaId, method)

            // Recalculate fee
            const communeId = formData.commune ? parseInt(formData.commune) : null
            calculateFee(wilayaId, communeId, method === 'DESK_PICKUP')

            // Reset commune selection as available communes changed
            setFormData(prev => ({ ...prev, commune: "", communeName: "" }))
        }
    }

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

        if (!formData.name || !formData.phone || !formData.address || !formData.wilaya) {
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
                    shippingWilaya: formData.wilayaName,
                    shippingWilayaCode: formData.wilaya, // Send Code
                    shippingCommune: formData.communeName || formData.commune, // Use Name if avail, else fallback
                    shippingCommuneCode: formData.commune, // Send Code
                    shippingAddress1: formData.address,
                    shippingNotes: `Mode: ${formData.shippingMethod}`,
                    shippingMethod: "GUEPEX"
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create order')
            }

            setPaymentCode(data.order.paymentCode)
            if (data.order.trackingNumber) {
                setTrackingNumber(data.order.trackingNumber)
            }
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
                                {trackingNumber ? (
                                    <>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {language === "fr" ? "Numéro de Suivi (Yalidine)" : "رقم التتبع (Yalidine)"}
                                        </p>
                                        <p className="font-mono font-bold text-2xl text-primary mb-2 select-all">
                                            {trackingNumber}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {language === "fr" ? `Ref Commande: ${paymentCode}` : `مرجع الطلب: ${paymentCode}`}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-muted-foreground mb-1">{language === "fr" ? "Code Paiement" : "كود الدفع"}</p>
                                        <p className="font-mono font-bold text-lg text-foreground">{paymentCode}</p>
                                        <p className="text-xs text-amber-600 mt-2">
                                            {language === "fr" ? "Expédition en cours de création..." : "جاري إنشاء الشحنة..."}
                                        </p>
                                    </>
                                )}
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
                            <p>Wilaya: {formData.wilaya} ({formData.wilayaName})</p>
                            <p>Commune: {formData.commune} ({formData.communeName})</p>
                            <p>Provider: YALIDINE/GUEPEX</p>
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
                                                <Label>{t("wilaya")}</Label>
                                                <Select value={formData.wilaya} onValueChange={handleWilayaChange} disabled={isLoadingLocation}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={isLoadingLocation ? "Loading..." : t("selectWilaya")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {wilayas.map((w) => (
                                                            <SelectItem key={w.id} value={w.id.toString()}>
                                                                {String(w.id).padStart(2, "0")} - {w.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{language === "fr" ? "Commune" : "البلدية"}</Label>
                                                <Select value={formData.commune} onValueChange={handleCommuneChange} disabled={!formData.wilaya}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={language === "fr" ? "Sélectionner Commune" : "اختر البلدية"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {filteredCommunes.map((c) => (
                                                            <SelectItem key={c.id} value={c.id.toString()}>
                                                                {c.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-border">
                                    <CardHeader className="pb-4"><CardTitle>{language === "fr" ? "Méthode de livraison" : "طريقة التوصيل"}</CardTitle></CardHeader>
                                    <CardContent className="space-y-3">
                                        <RadioGroup value={formData.shippingMethod} onValueChange={handleMethodChange} className="space-y-3">
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
                                                    {isCalculatingFee ? <Loader2 className="w-4 h-4 animate-spin" /> : `${shippingFee.toLocaleString()} DZD`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
                                                <span>{t("total")}</span>
                                                <span>{finalTotal.toLocaleString()} DZD</span>
                                            </div>
                                        </div>
                                        <Button className="w-full mt-6" onClick={handleSubmit} disabled={isSubmitting || isCalculatingFee}>
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

