"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { useLocalStorage } from "./use-local-storage"

type NavTheme = {
  primaryColor: string
  accentColor: string
  fontSize: "small" | "medium" | "large"
  density: "compact" | "normal" | "comfortable"
  animation: "minimal" | "normal" | "elaborate"
}

const defaultTheme: NavTheme = {
  primaryColor: "default",
  accentColor: "default",
  fontSize: "medium",
  density: "normal",
  animation: "normal",
}

type NavThemeContextType = {
  theme: NavTheme
  updateTheme: (updates: Partial<NavTheme>) => void
  resetTheme: () => void
  getThemeClasses: () => string
}

const NavThemeContext = createContext<NavThemeContextType | undefined>(undefined)

export function NavThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<NavTheme>("nav-theme", defaultTheme)

  const updateTheme = (updates: Partial<NavTheme>) => {
    setTheme({ ...theme, ...updates })
  }

  const resetTheme = () => {
    setTheme(defaultTheme)
  }

  // 根据主题设置生成CSS类名
  const getThemeClasses = () => {
    const classes: string[] = []

    // 字体大小
    if (theme.fontSize === "small") classes.push("nav-text-sm")
    if (theme.fontSize === "large") classes.push("nav-text-lg")

    // 密度
    if (theme.density === "compact") classes.push("nav-density-compact")
    if (theme.density === "comfortable") classes.push("nav-density-comfortable")

    // 动画
    if (theme.animation === "minimal") classes.push("nav-animation-minimal")
    if (theme.animation === "elaborate") classes.push("nav-animation-elaborate")

    // 主题色
    if (theme.primaryColor !== "default") classes.push(`nav-primary-${theme.primaryColor}`)
    if (theme.accentColor !== "default") classes.push(`nav-accent-${theme.accentColor}`)

    return classes.join(" ")
  }

  return (
    <NavThemeContext.Provider value={{ theme, updateTheme, resetTheme, getThemeClasses }}>
      {children}
    </NavThemeContext.Provider>
  )
}

export function useNavTheme() {
  const context = useContext(NavThemeContext)
  if (context === undefined) {
    throw new Error("useNavTheme must be used within a NavThemeProvider")
  }
  return context
}
