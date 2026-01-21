"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function TermsPage() {
    const { language } = useLanguage()

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <h1 className="text-3xl font-bold text-foreground mb-6">
                        {language === "fr" ? "Conditions Générales" : "الشروط والأحكام"}
                    </h1>

                    <div className="prose prose-slate max-w-none text-muted-foreground">
                        {language === "fr" ? (
                            <>
                                <p className="mb-4">Dernière mise à jour: Janvier 2026</p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Acceptation des Conditions</h2>
                                <p className="mb-4">
                                    En utilisant notre site, vous acceptez les présentes conditions générales.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Commandes</h2>
                                <p className="mb-4">
                                    Toutes les commandes sont soumises à confirmation et disponibilité des stocks.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Prix et Paiement</h2>
                                <p className="mb-4">
                                    Les prix sont affichés en Dinars Algériens (DZD) et peuvent être modifiés sans préavis. Le paiement est à la livraison.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Livraison</h2>
                                <p className="mb-4">
                                    Nous livrons partout en Algérie via notre partenaire Yalidine. Les délais de livraison varient selon votre localisation.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Contact</h2>
                                <p className="mb-4">
                                    Pour toute question, contactez-nous au +213 560 261 594
                                </p>
                            </>
                        ) : (
                            <div dir="rtl">
                                <p className="mb-4">آخر تحديث: يناير 2026</p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">قبول الشروط</h2>
                                <p className="mb-4">
                                    باستخدام موقعنا، فإنك توافق على هذه الشروط والأحكام.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">الطلبات</h2>
                                <p className="mb-4">
                                    جميع الطلبات تخضع للتأكيد وتوافر المخزون.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">الأسعار والدفع</h2>
                                <p className="mb-4">
                                    الأسعار معروضة بالدينار الجزائري (DZD) وقد تتغير دون إشعار مسبق. الدفع عند التسليم.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">التوصيل</h2>
                                <p className="mb-4">
                                    نقوم بالتوصيل في جميع أنحاء الجزائر عبر شريكنا Yalidine. تختلف مواعيد التسليم حسب موقعك.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">الاتصال</h2>
                                <p className="mb-4">
                                    لأي أسئلة، اتصل بنا على +213 560 261 594
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
