"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react"

export function HeroBanner() {
  const { t, language } = useLanguage()

  return (
    <section className="relative bg-secondary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div style={{ textAlign: language === "ar" ? "right" : "left" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {language === "fr" ? "Nouveau stock disponible" : "مخزون جديد متوفر"}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">
              {language === "fr"
                ? "Pièces Auto Premium pour Votre Véhicule"
                : "قطع غيار السيارات الممتازة لسيارتك"
              }
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              {language === "fr"
                ? "Carrosserie et optique automobile de qualité OEM. Livraison rapide dans toutes les wilayas d'Algérie."
                : "كاروسري وبصريات السيارات بجودة OEM. توصيل سريع لجميع ولايات الجزائر."
              }
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/category/carrosserie">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6">
                  {t("carrosserie")}
                  <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
              </Link>
              <Link href="/category/optique">
                <Button size="lg" variant="outline" className="bg-transparent border-border text-foreground hover:bg-secondary h-12 px-6">
                  {t("optique")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-2xl">
              <img
                src="/car-parts-warehouse.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <div className={`absolute ${language === "ar" ? "-left-8" : "-right-8"} bottom-12 bg-card rounded-xl shadow-xl p-5 border border-border`}>
              <p className="text-2xl font-bold text-foreground mb-1">+2000</p>
              <p className="text-sm text-muted-foreground">
                {language === "fr" ? "Références disponibles" : "مرجع متوفر"}
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-8 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {language === "fr" ? "Livraison Multi-transporteurs" : "توصيل متعدد الناقلين"}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "fr" ? "Toutes les wilayas" : "جميع الولايات"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {language === "fr" ? "Paiement Flexible" : "دفع مرن"}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "fr" ? "Cash ou BaridiMob" : "نقداً أو بريدي موب"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {language === "fr" ? "Qualité Garantie" : "جودة مضمونة"}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "fr" ? "Pièces OEM certifiées" : "قطع OEM معتمدة"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

