"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
    const { language } = useLanguage()

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <h1 className="text-3xl font-bold text-foreground mb-6">
                        {language === "fr" ? "À propos de MOTIVEX" : "عن MOTIVEX"}
                    </h1>

                    <div className="prose prose-slate max-w-none">
                        {language === "fr" ? (
                            <>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    MOTIVEX est votre fournisseur de confiance pour les pièces de carrosserie et optique automobile en Algérie.
                                </p>
                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Notre Mission</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Fournir des pièces automobiles de qualité à des prix compétitifs avec un service client exceptionnel.
                                </p>
                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Pourquoi Nous Choisir?</h2>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                                    <li>Large sélection de pièces de carrosserie et optique</li>
                                    <li>Prix compétitifs</li>
                                    <li>Livraison rapide partout en Algérie</li>
                                    <li>Service client réactif</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <p className="text-muted-foreground leading-relaxed mb-4" dir="rtl">
                                    MOTIVEX هو المورد الموثوق به لقطع غيار الكاروسري والبصريات في الجزائر.
                                </p>
                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4" dir="rtl">مهمتنا</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4" dir="rtl">
                                    توفير قطع غيار سيارات عالية الجودة بأسعار تنافسية مع خدمة عملاء استثنائية.
                                </p>
                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4" dir="rtl">لماذا تختارنا؟</h2>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4" dir="rtl">
                                    <li>مجموعة واسعة من قطع الكاروسري والبصريات</li>
                                    <li>أسعار تنافسية</li>
                                    <li>توصيل سريع في جميع أنحاء الجزائر</li>
                                    <li>خدمة عملاء سريعة الاستجابة</li>
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
