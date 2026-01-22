"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Search, Menu, X, User, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { LanguageSwitcher } from "./language-selector"
import { MotivexLogo } from "./motivex-logo"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { t, language } = useLanguage()
  const { itemCount } = useCart()
  const { user } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top Bar */}
      <div className="border-b border-border bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-9 text-xs">
            <p className="hidden sm:block">
              {language === "fr"
                ? "Livraison rapide dans toutes les wilayas via Yalidine"
                : "توصيل سريع لجميع الولايات عبر ياليدين"
              }
            </p>
            <div className="flex items-center gap-4 ms-auto">
              <span className="hidden sm:inline">
                {language === "fr" ? "Service client:" : "خدمة العملاء:"}
                <span dir="ltr" className="ms-1 font-medium">+213 555 123 456</span>
              </span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <MotivexLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("home")}
            </Link>
            <Link href="/category/carrosserie" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("carrosserie")}
            </Link>
            <Link href="/category/optique" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("optique")}
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className={`absolute ${language === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${language === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} h-10 bg-secondary/50 border-transparent focus:border-border focus:bg-card transition-colors`}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">{t("searchPlaceholder")}</span>
            </Button>

            {user?.role?.toUpperCase() === "ADMIN" && (
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Admin</span>
                </Button>
              </Link>
            )}

            <Link href="/account">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User className="h-5 w-5" />
                <span className="sr-only">{t("myAccount")}</span>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center text-[10px] font-medium bg-accent text-accent-foreground rounded-full">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
                <span className="sr-only">{t("cart")}</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className={`absolute ${language === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${language === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} h-10 bg-secondary/50 border-transparent focus:border-border`}
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-border pt-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/carrosserie"
                  className="flex items-center px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("carrosserie")}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/optique"
                  className="flex items-center px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("optique")}
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="flex items-center px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("myAccount")}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
