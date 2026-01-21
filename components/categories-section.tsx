"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useEffect, useState } from "react"
import { ArrowRight, Car, Lightbulb, PackageIcon } from "lucide-react"

interface Category {
  id: string
  slug: string
  nameFr: string
  nameAr: string
}

const iconMap: Record<string, any> = {
  carrosserie: Car,
  optique: Lightbulb,
}

export function CategoriesSection() {
  const { language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" })
        if (!response.ok) {
          console.error("Failed to fetch categories")
          setCategories([])
          return
        }
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">
              {language === "fr" ? "Chargement..." : "جاري التحميل..."}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === "fr" ? "Aucune catégorie disponible" : "لا توجد فئات متاحة"}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance">
            {language === "fr" ? "Nos Catégories" : "فئاتنا"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {language === "fr"
              ? "Découvrez notre gamme complète de pièces automobiles"
              : "اكتشف مجموعتنا الكاملة من قطع غيار السيارات"
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((category) => {
            const Icon = iconMap[category.slug] || PackageIcon
            const imageUrl = category.slug === 'carrosserie'
              ? "/car-body-parts-bumper-fender.jpg"
              : category.slug === 'optique'
                ? "/car-headlights-tail-lights-automotive-optics.jpg"
                : "/placeholder.svg"

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-secondary aspect-[16/9] md:aspect-[4/3]"
              >
                {/* Background Image */}
                <img
                  src={imageUrl}
                  alt={language === "fr" ? category.nameFr : category.nameAr}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-card/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-1">
                    {language === "fr" ? category.nameFr : category.nameAr}
                  </h3>

                  <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground group-hover:gap-3 transition-all">
                    <span>{language === "fr" ? "Explorer" : "استكشف"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
