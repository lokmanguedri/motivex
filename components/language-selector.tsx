"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/lib/types"

export function LanguageSelector() {
  const { isFirstVisit, setLanguage, setFirstVisitComplete } = useLanguage()

  const handleSelect = (lang: Language) => {
    setLanguage(lang)
    setFirstVisitComplete()
  }

  return (
    <Dialog open={isFirstVisit}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            <span className="block mb-2">Bienvenue / مرحبا</span>
            <span className="text-sm font-normal text-muted-foreground">
              Choisissez votre langue / اختر لغتك
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2 bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => handleSelect("fr")}
          >
            <span className="text-2xl">FR</span>
            <span className="text-sm">Français</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2 bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => handleSelect("ar")}
          >
            <span className="text-2xl">ع</span>
            <span className="text-sm">العربية</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1 border border-border rounded-md overflow-hidden">
      <button
        onClick={() => setLanguage("fr")}
        className={`px-2 py-1 text-xs font-medium transition-colors ${
          language === "fr"
            ? "bg-primary text-primary-foreground"
            : "bg-transparent text-muted-foreground hover:bg-secondary"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage("ar")}
        className={`px-2 py-1 text-xs font-medium transition-colors ${
          language === "ar"
            ? "bg-primary text-primary-foreground"
            : "bg-transparent text-muted-foreground hover:bg-secondary"
        }`}
      >
        ع
      </button>
    </div>
  )
}
