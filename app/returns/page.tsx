"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function ReturnsPage() {
    const { language } = useLanguage()

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-background">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <h1 className="text-3xl font-bold text-foreground mb-6">
                        {language === "fr" ? "Politique de Retour" : "سياسة الإرجاع"}
                    </h1>

                    <div className="prose prose-slate max-w-none text-muted-foreground">
                        {language === "fr" ? (
                            <>
                                <p className="mb-4">Dernière mise à jour: Janvier 2026</p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Délai de Retour</h2>
                                <p className="mb-4">
                                    Vous disposez de 7 jours après réception de votre commande pour demander un retour.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Conditions de Retour</h2>
                                <ul className="list-disc list-inside space-y-2 mb-4">
                                    <li>Les pièces doivent être dans leur emballage d'origine</li>
                                    <li>Les pièces ne doivent pas avoir été installées ou utilisées</li>
                                    <li>Produits en parfait état, sans dommages</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Procédure de Retour</h2>
                                <ol className="list-decimal list-inside space-y-2 mb-4">
                                    <li>Contactez-nous au +213 560 261 594</li>
                                    <li>Obtenez un numéro d'autorisation de retour</li>
                                    <li>Renvoyez le produit avec tous les accessoires</li>
                                    <li>Le remboursement sera effectué après inspection</li>
                                </ol>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Frais de Retour</h2>
                                <p className="mb-4">
                                    Les frais de retour sont à la charge du client, sauf en cas de produit défectueux ou d'erreur de notre part.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Contact</h2>
                                <p className="mb-4">
                                    Pour toute question, contactez-nous à guedrilokmanabdelmouiz@gmail.com
                                </p>
                            </>
                        ) : (
                            <div dir="rtl">
                                <p className="mb-4">آخر تحديث: يناير 2026</p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">مدة الإرجاع</h2>
                                <p className="mb-4">
                                    لديك 7 أيام بعد استلام طلبك لطلب الإرجاع.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">شروط الإرجاع</h2>
                                <ul className="list-disc list-inside space-y-2 mb-4">
                                    <li>يجب أن تكون القطع في عبوتها الأصلية</li>
                                    <li>يجب عدم تركيب أو استخدام القطع</li>
                                    <li>المنتجات في حالة ممتازة، بدون أضرار</li>
                                </ul>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">إجراءات الإرجاع</h2>
                                <ol className="list-decimal list-inside space-y-2 mb-4">
                                    <li>اتصل بنا على +213 560 261 594</li>
                                    <li>احصل على رقم تفويض الإرجاع</li>
                                    <li>أعد المنتج مع جميع الملحقات</li>
                                    <li>سيتم استرداد الأموال بعد الفحص</li>
                                </ol>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">رسوم الإرجاع</h2>
                                <p className="mb-4">
                                    رسوم الإرجاع على عاتق العميل، إلا في حالة المنتج المعيب أو خطأ من جانبنا.
                                </p>

                                <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">الاتصال</h2>
                                <p className="mb-4">
                                    لأي أسئلة، اتصل بنا على guedrilokmanabdelmouiz@gmail.com
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
