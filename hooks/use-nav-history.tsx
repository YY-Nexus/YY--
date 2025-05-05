"use client"

import type React from "react"

import { useEffect, createContext, useContext } from "react"
import { usePathname } from "next/navigation"
import { useLocalStorage } from "./use-local-storage"
import { navigationData, type NavItemType } from "@/lib/navigation-data"

type HistoryEntry = {
  id: string
  path: string
  title: string
  timestamp: number
  icon: any
}

type NavHistoryContextType = {
  history: HistoryEntry[]
  clearHistory: () => void
  removeFromHistory: (id: string) => void
}

const NavHistoryContext = createContext<NavHistoryContextType | undefined>(undefined)

const MAX_HISTORY_ITEMS = 10

export function NavHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>("nav-history", [])
  const pathname = usePathname()

  // 查找导航项
  const findNavItem = (path: string): NavItemType | null => {
    const findItem = (items: NavItemType[], targetPath: string): NavItemType | null => {
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

  // 记录导航历史
  useEffect(() => {
    if (!pathname) return

    const navItem = findNavItem(pathname)
    if (!navItem) return

    const newEntry: HistoryEntry = {
      id: navItem.id,
      path: pathname,
      title: navItem.title,
      timestamp: Date.now(),
      icon: navItem.icon,
    }

    setHistory((prev) => {
      // 移除已存在的相同路径
      const filtered = prev.filter((item) => item.path !== pathname)
      // 添加到开头并限制长度
      return [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS)
    })
  }, [pathname, setHistory])

  // 清空历史
  const clearHistory = () => {
    setHistory([])
  }

  // 从历史中移除项
  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <NavHistoryContext.Provider value={{ history, clearHistory, removeFromHistory }}>
      {children}
    </NavHistoryContext.Provider>
  )
}

export function useNavHistory() {
  const context = useContext(NavHistoryContext)
  if (context === undefined) {
    throw new Error("useNavHistory must be used within a NavHistoryProvider")
  }
  return context
}
