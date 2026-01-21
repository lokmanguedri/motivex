"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function PrivacyPage() {
    const { language } = useLanguage()

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <h1 className="text-3xl font-bold text-foreground mb-6">
                        {language === "fr" ? "Politique de Confidentialité" : "سياسة الخصوصية"}
                    </h1>

                    <div className="prose prose-slate max-w-none text-muted-foreground">
                        {language === "fr" ? (
                            <>
                                <p className="mb-4">Dernière mise à jour: Janvier 2026</p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Collecte des Informations</h2>
                                <p className="mb-4">
                                    Nous collectons les informations que vous nous fournissez lors de votre inscription, de vos commandes et de votre navigation sur notre site.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Utilisation des Informations</h2>
                                <p className="mb-4">
                                    Vos informations sont utilisées pour traiter vos commandes, améliorer nos services et vous contacter si nécessaire.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Protection des Données</h2>
                                <p className="mb-4">
                                    Nous prenons très au sérieux la protection de vos données personnelles et utilisons des mesures de sécurité appropriées.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Nous Contacter</h2>
                                <p className="mb-4">
                                    Pour toute question concernant cette politique, contactez-nous à guedrilokmanabdelmouiz@gmail.com
                                </p>
                            </>
                        ) : (
                            <div dir="rtl">
                                <p className="mb-4">آخر تحديث: يناير 2026</p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">جمع المعلومات</h2>
                                <p className="mb-4">
                                    نجمع المعلومات التي تقدمها عند التسجيل وتقديم الطلبات والتصفح على موقعنا.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">استخدام المعلومات</h2>
                                <p className="mb-4">
                                    تُستخدم معلوماتك لمعالجة طلباتك وتحسين خدماتنا والاتصال بك عند الضرورة.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">حماية البيانات</h2>
                                <p className="mb-4">
                                    نحن نأخذ حماية بياناتك الشخصية على محمل الجد ونستخدم تدابير أمنية مناسبة.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">اتصل بنا</h2>
                                <p className="mb-4">
                                    لأي أسئلة حول هذه السياسة، اتصل بنا على guedrilokmanabdelmouiz@gmail.com
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
