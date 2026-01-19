"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { User, Package, LogOut, Eye, ChevronRight, Settings } from "lucide-react"

export default function AccountPage() {
  const { t, language } = useLanguage()
  const { user, isLoading, login, register, logout, orders } = useAuth()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const success = await login(loginEmail, loginPassword)
    if (success) {
      toast.success(language === "fr" ? "Connexion réussie" : "تم تسجيل الدخول بنجاح")
    } else {
      toast.error(language === "fr" ? "Email ou mot de passe incorrect" : "البريد الإلكتروني أو كلمة المرور غير صحيحة")
    }

    setIsSubmitting(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const success = await register(registerEmail, registerPassword, registerName, registerPhone)
    if (success) {
      toast.success(language === "fr" ? "Compte créé avec succès" : "تم إنشاء الحساب بنجاح")
    } else {
      toast.error(language === "fr" ? "Erreur lors de la création du compte" : "خطأ في إنشاء الحساب")
    }

    setIsSubmitting(false)
  }

  const getStatusStyles = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-violet-50 text-violet-700 border-violet-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      returned: "bg-rose-50 text-rose-700 border-rose-200",
    }
    return styles[status] || "bg-secondary text-muted-foreground border-border"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            {language === "fr" ? "Chargement..." : "جاري التحميل..."}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="border-b border-border bg-card">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">{t("home")}</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">{t("myAccount")}</span>
              </nav>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {language === "fr" ? "Mon Compte" : "حسابي"}
                </h1>
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Connectez-vous ou créez un compte"
                    : "سجل دخولك أو أنشئ حساباً"
                  }
                </p>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12 mb-6">
                  <TabsTrigger value="login" className="h-10">{t("login")}</TabsTrigger>
                  <TabsTrigger value="register" className="h-10">{t("register")}</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="text-sm font-medium">{t("email")}</Label>
                          <Input
                            id="login-email"
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="h-11 bg-card border-border"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password" className="text-sm font-medium">{t("password")}</Label>
                          <Input
                            id="login-password"
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="h-11 bg-card border-border"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "..." : t("login")}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="register">
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-name" className="text-sm font-medium">{t("fullName")}</Label>
                          <Input
                            id="register-name"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                            className="h-11 bg-card border-border"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-email" className="text-sm font-medium">{t("email")}</Label>
                          <Input
                            id="register-email"
                            type="email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            className="h-11 bg-card border-border"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-phone" className="text-sm font-medium">{t("phone")}</Label>
                          <Input
                            id="register-phone"
                            type="tel"
                            value={registerPhone}
                            onChange={(e) => setRegisterPhone(e.target.value)}
                            placeholder="05XX XXX XXX"
                            dir="ltr"
                            className="h-11 bg-card border-border"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password" className="text-sm font-medium">{t("password")}</Label>
                          <Input
                            id="register-password"
                            type="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            className="h-11 bg-card border-border"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "..." : t("createAccount")}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">{t("home")}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{t("myAccount")}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {language === "fr" ? `Bonjour, ${user.name.split(" ")[0]}` : `مرحباً، ${user.name.split(" ")[0]}`}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === "fr" ? "Gérez votre compte et vos commandes" : "إدارة حسابك وطلباتك"}
              </p>
            </div>
            <Button variant="outline" className="bg-transparent border-border" onClick={logout}>
              <LogOut className="w-4 h-4 me-2" />
              {t("logout")}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info */}
            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4" />
                  {language === "fr" ? "Informations personnelles" : "المعلومات الشخصية"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t("fullName")}</p>
                  <p className="font-medium text-foreground">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t("email")}</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t("phone")}</p>
                  <p className="font-medium text-foreground" dir="ltr">{user.phone}</p>
                </div>
                {user.role === "admin" && (
                  <Link href="/admin" className="block pt-2">
                    <Button className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Settings className="w-4 h-4 me-2" />
                      {t("adminDashboard")}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Orders */}
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Package className="w-4 h-4" />
                    {t("myOrders")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-foreground mb-2">
                        {language === "fr" ? "Aucune commande" : "لا توجد طلبات"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {language === "fr"
                          ? "Vous n'avez pas encore passé de commande"
                          : "لم تقم بأي طلب بعد"
                        }
                      </p>
                      <Link href="/">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          {t("continueShopping")}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border border-border rounded-xl p-4 hover:bg-secondary/30 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-mono text-sm font-semibold text-foreground">{order.id}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString(language === "fr" ? "fr-FR" : "ar-DZ", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                })}
                              </p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(order.status)}`}>
                              {t(order.status as "pending" | "confirmed" | "shipped" | "delivered" | "returned")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {order.items.slice(0, 3).map(item => (
                                <div key={item.product.id} className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                                  <img
                                    src={item.product.image || "/placeholder.svg"}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{order.items.length - 3}</span>
                              )}
                            </div>
                            <div className="text-end">
                              <p className="font-bold text-foreground">{order.total.toLocaleString()} DZD</p>
                              <Link href={`/account/orders/${order.id}`}>
                                <Button variant="ghost" size="sm" className="mt-1 h-8 text-muted-foreground hover:text-foreground">
                                  <Eye className="w-3.5 h-3.5 me-1.5" />
                                  {t("orderDetails")}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
