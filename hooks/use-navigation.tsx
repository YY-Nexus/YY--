"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { useLocalStorage } from "./use-local-storage"

type NavigationContextType = {
  isExpanded: boolean
  toggleExpanded: () => void
  activeItemId: string | null
  setActiveItemId: (id: string | null) => void
  expandedSubmenuIds: string[]
  toggleSubmenu: (id: string) => void
  isSubmenuExpanded: (id: string) => boolean
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  // 导航栏展开状态
  const [isExpanded, setIsExpanded] = useLocalStorage("nav-expanded", true)

  // 当前活动项ID
  const [activeItemId, setActiveItemId] = useState<string | null>(null)

  // 展开的子菜单ID列表
  const [expandedSubmenuIds, setExpandedSubmenuIds] = useState<string[]>([])

  const pathname = usePathname()
  const previousPathname = useRef(pathname)

  // 切换导航栏展开/收缩状态
  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded, setIsExpanded])

  // 切换子菜单展开/收缩状态
  const toggleSubmenu = useCallback((id: string) => {
    setExpandedSubmenuIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }, [])

  // 检查子菜单是否展开
  const isSubmenuExpanded = useCallback(
    (id: string) => {
      return expandedSubmenuIds.includes(id)
    },
    [expandedSubmenuIds],
  )

  // 根据路径自动设置活动项
  useEffect(() => {
    // 只有当路径真正变化时才更新
    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname

      if (pathname) {
        // 从路径中提取主要部分
        const mainPath = pathname.split("/")[1]
        if (mainPath) {
          setActiveItemId(mainPath)

          // 自动展开包含当前路径的子菜单
          setExpandedSubmenuIds((prev) => {
            if (!prev.includes(mainPath)) {
              return [...prev, mainPath]
            }
            return prev
          })
        }
      }
    }
  }, [pathname])

  return (
    <NavigationContext.Provider
      value={{
        isExpanded,
        toggleExpanded,
        activeItemId,
        setActiveItemId,
        expandedSubmenuIds,
        toggleSubmenu,
        isSubmenuExpanded,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation必须在NavigationProvider内部使用")
  }
  return context
}
