"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type TranslationKey } from "@/lib/translations"
import type { Language } from "@/lib/types"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  dir: "ltr" | "rtl"
  isFirstVisit: boolean
  setFirstVisitComplete: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("language") as Language | null
    const hasVisited = localStorage.getItem("hasVisited")
    
    if (stored) {
      setLanguageState(stored)
    }
    if (hasVisited) {
      setIsFirstVisit(false)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    }
  }, [language, mounted])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const setFirstVisitComplete = () => {
    setIsFirstVisit(false)
    localStorage.setItem("hasVisited", "true")
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, dir, isFirstVisit, setFirstVisitComplete }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
