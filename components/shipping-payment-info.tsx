"use client"

import { useLanguage } from "@/contexts/language-context"
import { Truck, CreditCard, Shield, Clock, RotateCcw, Headphones } from "lucide-react"

export function ShippingPaymentInfo() {
  const { t, language } = useLanguage()

  const features = [
    {
      icon: Truck,
      titleFr: "Livraison Yalidine",
      titleAr: "توصيل ياليدين",
      descFr: "Livraison rapide et sécurisée dans les 58 wilayas d'Algérie",
      descAr: "توصيل سريع وآمن في جميع ولايات الجزائر الـ 58",
    },
    {
      icon: CreditCard,
      titleFr: "Paiement Flexible",
      titleAr: "دفع مرن",
      descFr: "Payez en cash à la livraison ou via BaridiMob",
      descAr: "ادفع نقداً عند الاستلام أو عبر بريدي موب",
    },
    {
      icon: Shield,
      titleFr: "Qualité Garantie",
      titleAr: "جودة مضمونة",
      descFr: "Toutes nos pièces sont certifiées OEM ou équivalent",
      descAr: "جميع قطعنا معتمدة OEM أو ما يعادلها",
    },
    {
      icon: Clock,
      titleFr: "Traitement Rapide",
      titleAr: "معالجة سريعة",
      descFr: "Commandes traitées et expédiées sous 24h",
      descAr: "معالجة وشحن الطلبات خلال 24 ساعة",
    },
    {
      icon: RotateCcw,
      titleFr: "Retours Faciles",
      titleAr: "إرجاع سهل",
      descFr: "Retour gratuit sous 7 jours si non conforme",
      descAr: "إرجاع مجاني خلال 7 أيام في حالة عدم المطابقة",
    },
    {
      icon: Headphones,
      titleFr: "Support Client",
      titleAr: "دعم العملاء",
      descFr: "Équipe disponible 7j/7 pour vous aider",
      descAr: "فريق متاح 7 أيام في الأسبوع لمساعدتك",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance">
            {language === "fr" ? "Pourquoi Nous Choisir" : "لماذا تختارنا"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {language === "fr" 
              ? "Votre satisfaction est notre priorité"
              : "رضاكم هو أولويتنا"
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {language === "fr" ? feature.titleFr : feature.titleAr}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {language === "fr" ? feature.descFr : feature.descAr}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
