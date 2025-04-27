"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

// 用户设置类型定义
export interface UserSettings {
  defaultPeriod: string
  currency: string
  refreshInterval: number
  autoSaveReports: boolean
  showPredictions: boolean
  theme: "light" | "dark" | "system"
  chartColorScheme: string
  tableDensity: "compact" | "normal" | "relaxed"
  enableAnimations: boolean
  compactSidebar: boolean
  notifications: {
    financialAlerts: boolean
    reportReady: boolean
    systemUpdates: boolean
    teamActivities: boolean
  }
  notificationChannels: {
    email: boolean
    browser: boolean
    sms: boolean
  }
}

// 默认设置
const defaultSettings: UserSettings = {
  defaultPeriod: "month",
  currency: "CNY",
  refreshInterval: 0,
  autoSaveReports: false,
  showPredictions: true,
  theme: "system",
  chartColorScheme: "default",
  tableDensity: "normal",
  enableAnimations: true,
  compactSidebar: false,
  notifications: {
    financialAlerts: true,
    reportReady: true,
    systemUpdates: true,
    teamActivities: false,
  },
  notificationChannels: {
    email: true,
    browser: true,
    sms: false,
  },
}

interface UserSettingsContextType {
  settings: UserSettings
  updateSettings: (newSettings: UserSettings) => void
  loading: boolean
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined)

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  // 从本地存储加载设置
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem("userSettings")
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings))
        }
      } catch (error) {
        console.error("加载用户设置失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  // 更新设置
  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings)
    try {
      localStorage.setItem("userSettings", JSON.stringify(newSettings))
    } catch (error) {
      console.error("保存用户设置失败:", error)
    }
  }

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext)
  if (context === undefined) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider")
  }
  return context
}
