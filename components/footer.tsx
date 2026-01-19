"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Phone, Mail, MapPin, Facebook, Instagram, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MotivexLogo } from "./motivex-logo"

export function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {language === "fr" ? "Restez informé" : "ابق على اطلاع"}
              </h3>
              <p className="text-sm text-primary-foreground/70">
                {language === "fr" 
                  ? "Recevez nos offres exclusives et nouveautés"
                  : "احصل على عروضنا الحصرية والمستجدات"
                }
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input 
                type="email" 
                placeholder={language === "fr" ? "Votre email" : "بريدك الإلكتروني"}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-11 w-full md:w-64"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground h-11 px-4 shrink-0">
                <Send className="w-4 h-4" />
                <span className="sr-only">{language === "fr" ? "S'abonner" : "اشترك"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <MotivexLogo size="md" inverted />
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              {language === "fr" 
                ? "Votre fournisseur de confiance pour les pièces de carrosserie et optique automobile en Algérie."
                : "موردك الموثوق لقطع غيار الكاروسري والبصريات في الجزائر."
              }
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/90">
              {t("categories")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/category/carrosserie" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t("carrosserie")}
                </Link>
              </li>
              <li>
                <Link href="/category/optique" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t("optique")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/90">
              {language === "fr" ? "Informations" : "معلومات"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {language === "fr" ? "À propos" : "من نحن"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t("termsConditions")}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t("returnPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/90">
              {t("contactUs")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-primary-foreground/70">
                <Phone className="w-4 h-4 shrink-0" />
                <span dir="ltr">+213 555 123 456</span>
              </li>
              <li className="flex items-center gap-2.5 text-primary-foreground/70">
                <Mail className="w-4 h-4 shrink-0" />
                <span>contact@motivex-dz.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-primary-foreground/70">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{language === "fr" ? "Alger, Algérie" : "الجزائر العاصمة"}</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
            <p>© 2026 MOTIVEX. {t("allRightsReserved")}</p>
            <div className="flex items-center gap-4">
              <span>{language === "fr" ? "Paiement sécurisé" : "دفع آمن"}</span>
              <span>•</span>
              <span>Yalidine Partner</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
