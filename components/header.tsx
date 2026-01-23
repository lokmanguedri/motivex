"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Search, Menu, X, User, LogOut, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { MotivexLogo } from "@/components/motivex-logo"

export function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { t, language } = useLanguage()
  const { itemCount } = useCart()
  const { user, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <p className="text-xs sm:text-sm text-center font-medium">
            {language === "fr"
              ? "Livraison rapide dans toutes les wilayas via Yalidine & Guepex"
              : "توصيل سريع في جميع الولايات عبر ياليدين و جيبكس"}
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <MotivexLogo className="h-8 w-auto" />
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
                className={`${language === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} h-10 bg-secondary/50 border-transparent focus:border-border`}
              />
            </form>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="text-sm" onClick={() => router.push("/account")}>
                  <User className="h-4 w-4 mr-2" />
                  {t("myAccount")}
                </Button>
                <Button variant="ghost" size="sm" className="text-sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("logout")}
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" className="text-sm" onClick={() => router.push("/account")}>
                <User className="h-4 w-4 mr-2" />
                {t("login")}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/cart")}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" onClick={() => router.push("/cart")}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Button>
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
          <div className="lg:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("home")}
              </Link>
              <Link
                href="/category/carrosserie"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("carrosserie")}
              </Link>
              <Link
                href="/category/optique"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("optique")}
              </Link>
              <div className="border-t border-border pt-2 mt-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        router.push("/account")
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t("myAccount")}
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push("/account")
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t("login")}
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
