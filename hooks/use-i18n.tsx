"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useLocalStorage } from "./use-local-storage"
import { type Locale, type TranslationKey, translations } from "@/lib/i18n"

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
  locales: Locale[]
  getLocaleName: (locale: Locale) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const localeNames: Record<Locale, string> = {
  "zh-CN": "简体中文",
  "en-US": "English",
  "ja-JP": "日本語",
  "ko-KR": "한국어",
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useLocalStorage<Locale>("nav-locale", "zh-CN")

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations["zh-CN"][key] || key
  }

  const locales: Locale[] = ["zh-CN", "en-US", "ja-JP", "ko-KR"]

  const getLocaleName = (locale: Locale): string => {
    return localeNames[locale] || locale
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, locales, getLocaleName }}>{children}</I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
