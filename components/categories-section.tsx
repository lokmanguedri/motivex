"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { ArrowRight, Car, Lightbulb } from "lucide-react"

const categories = [
  {
    id: "carrosserie",
    icon: Car,
    image: "/car-body-parts-bumper-fender.jpg",
    count: 850,
  },
  {
    id: "optique",
    icon: Lightbulb,
    image: "/car-headlights-tail-lights-automotive-optics.jpg",
    count: 420,
  },
]

export function CategoriesSection() {
  const { t, language } = useLanguage()

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance">
            {t("ourCategories")}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {language === "fr" 
              ? "Découvrez notre gamme complète de pièces automobiles"
              : "اكتشف مجموعتنا الكاملة من قطع غيار السيارات"
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-2xl bg-secondary aspect-[16/9] md:aspect-[4/3]"
            >
              {/* Background Image */}
              <img
                src={category.image || "/placeholder.svg"}
                alt={t(category.id as "carrosserie" | "optique")}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-card/20 backdrop-blur-sm flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">
                    {category.count}+ {language === "fr" ? "produits" : "منتج"}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-1">
                  {t(category.id as "carrosserie" | "optique")}
                </h3>
                
                <p className="text-sm text-primary-foreground/80 mb-4 line-clamp-2">
                  {t(`${category.id}Desc` as "carrosserieDesc" | "optiqueDesc")}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground group-hover:gap-3 transition-all">
                  <span>{language === "fr" ? "Explorer" : "استكشف"}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
