"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import { usePathname } from "next/navigation"
import { recordNavEvent, getAnalyticsSummary, clearAnalyticsData, type NavAnalyticsSummary } from "@/lib/nav-analytics"
import { useNavigation } from "./use-navigation"
import { navigationData } from "@/lib/navigation-data"

type NavAnalyticsContextType = {
  recordEvent: (type: string, metadata?: Record<string, any>) => void
  getAnalyticsSummary: () => NavAnalyticsSummary
  clearAnalyticsData: () => void
}

const NavAnalyticsContext = createContext<NavAnalyticsContextType | undefined>(undefined)

export function NavAnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { activeItemId } = useNavigation()

  // 记录导航事件
  useEffect(() => {
    if (!pathname) return

    // 查找当前路径对应的导航项
    const findNavItem = (path: string) => {
      const findItem = (items: any[], targetPath: string): any => {
        for (const item of items) {
          if (item.path === targetPath) return item
          if (item.children) {
            const found = findItem(item.children, targetPath)
            if (found) return found
          }
        }
        return null
      }

      return findItem(navigationData, path)
    }

    const navItem = findNavItem(pathname)

    if (navItem) {
      recordNavEvent({
        type: "navigation",
        itemId: navItem.id,
        path: pathname,
        metadata: {
          title: navItem.title,
          userId: "current-user", // 在实际应用中，这应该是真实的用户ID
          timestamp: Date.now(),
        },
      })
    }
  }, [pathname])

  // 记录事件的通用方法
  const recordEvent = (type: string, metadata?: Record<string, any>) => {
    recordNavEvent({
      type: type as any,
      path: pathname,
      itemId: activeItemId || undefined,
      metadata: {
        ...metadata,
        userId: "current-user", // 在实际应用中，这应该是真实的用户ID
      },
    })
  }

  return (
    <NavAnalyticsContext.Provider
      value={{
        recordEvent,
        getAnalyticsSummary,
        clearAnalyticsData,
      }}
    >
      {children}
    </NavAnalyticsContext.Provider>
  )
}

export function useNavAnalytics() {
  const context = useContext(NavAnalyticsContext)
  if (context === undefined) {
    throw new Error("useNavAnalytics must be used within a NavAnalyticsProvider")
  }
  return context
}
