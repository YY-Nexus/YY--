"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext, useRef } from "react"
import { usePathname } from "next/navigation"
import { useLocalStorage } from "./use-local-storage"
import { navigationData, type NavItemType } from "@/lib/navigation-data"

type NavUsagePattern = {
  itemId: string
  count: number
  lastUsed: number
  timeSpent: number
  timeOfDay: number[]
}

type NavAIContextType = {
  recommendations: NavItemType[]
  isLoading: boolean
  refreshRecommendations: () => void
}

const NavAIContext = createContext<NavAIContextType | undefined>(undefined)

export function NavAIProvider({ children }: { children: React.ReactNode }) {
  const [usagePatterns, setUsagePatterns] = useLocalStorage<Record<string, NavUsagePattern>>("nav-usage-patterns", {})
  const [recommendations, setRecommendations] = useState<NavItemType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  // 使用ref来存储最近的路径，避免无限循环
  const [recentPaths, setRecentPaths] = useLocalStorage<string[]>("recent-paths", [])
  const prevPathRef = useRef<string | null>(null)

  // 记录用户导航行为 - 只在路径变化且不同于上一个路径时执行
  useEffect(() => {
    if (!pathname || pathname === prevPathRef.current) return

    prevPathRef.current = pathname
    const currentTime = Date.now()
    const hourOfDay = new Date().getHours()

    // 更新最近访问的路径 - 使用函数式更新，避免依赖recentPaths
    setRecentPaths((prev) => {
      // 如果路径已经在列表中，不做任何更改
      if (prev.includes(pathname)) return prev

      // 否则添加新路径到列表开头
      return [pathname, ...prev].slice(0, 10)
    })

    // 找到当前路径对应的导航项
    const findNavItem = (items: NavItemType[], path: string): NavItemType | null => {
      for (const item of items) {
        if (item.path === path) return item
        if (item.children) {
          const found = findNavItem(item.children, path)
          if (found) return found
        }
      }
      return null
    }

    const currentItem = findNavItem(navigationData, pathname)
    if (!currentItem) return

    // 更新使用模式 - 使用函数式更新，避免依赖usagePatterns
    setUsagePatterns((prev) => {
      const itemPattern = prev[currentItem.id] || {
        itemId: currentItem.id,
        count: 0,
        lastUsed: 0,
        timeSpent: 0,
        timeOfDay: Array(24).fill(0),
      }

      const timeOfDay = [...itemPattern.timeOfDay]
      timeOfDay[hourOfDay] += 1

      return {
        ...prev,
        [currentItem.id]: {
          ...itemPattern,
          count: itemPattern.count + 1,
          lastUsed: currentTime,
          timeOfDay,
        },
      }
    })
  }, [pathname, setUsagePatterns, setRecentPaths]) // 依赖项中只包含必要的变量

  // 生成推荐
  const generateRecommendations = () => {
    setIsLoading(true)

    // 模拟AI处理延迟
    setTimeout(() => {
      // 基于使用频率的推荐
      const frequencyBasedItems = Object.values(usagePatterns)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((pattern) => {
          const findItem = (items: NavItemType[], id: string): NavItemType | null => {
            for (const item of items) {
              if (item.id === id) return item
              if (item.children) {
                const found = findItem(item.children, id)
                if (found) return found
              }
            }
            return null
          }
          return findItem(navigationData, pattern.itemId)
        })
        .filter((item): item is NavItemType => item !== null)

      // 基于最近使用的推荐
      const recentlyUsedItems = Object.values(usagePatterns)
        .sort((a, b) => b.lastUsed - a.lastUsed)
        .slice(0, 3)
        .map((pattern) => {
          const findItem = (items: NavItemType[], id: string): NavItemType | null => {
            for (const item of items) {
              if (item.id === id) return item
              if (item.children) {
                const found = findItem(item.children, id)
                if (found) return found
              }
            }
            return null
          }
          return findItem(navigationData, pattern.itemId)
        })
        .filter((item): item is NavItemType => item !== null)

      // 基于当前时间的推荐
      const currentHour = new Date().getHours()
      const timeBasedItems = Object.values(usagePatterns)
        .sort((a, b) => b.timeOfDay[currentHour] - a.timeOfDay[currentHour])
        .slice(0, 2)
        .map((pattern) => {
          const findItem = (items: NavItemType[], id: string): NavItemType | null => {
            for (const item of items) {
              if (item.id === id) return item
              if (item.children) {
                const found = findItem(item.children, id)
                if (found) return found
              }
            }
            return null
          }
          return findItem(navigationData, pattern.itemId)
        })
        .filter((item): item is NavItemType => item !== null)

      // 合并推荐，去重
      const allRecommendations = [...frequencyBasedItems, ...recentlyUsedItems, ...timeBasedItems]
      const uniqueRecommendations = allRecommendations.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id),
      )

      // 如果推荐不足5个，添加默认推荐
      if (uniqueRecommendations.length < 5) {
        const defaultRecommendations = navigationData
          .slice(0, 5 - uniqueRecommendations.length)
          .filter((item) => !uniqueRecommendations.some((rec) => rec.id === item.id))

        uniqueRecommendations.push(...defaultRecommendations)
      }

      setRecommendations(uniqueRecommendations.slice(0, 5))
      setIsLoading(false)
    }, 500)
  }

  // 初始化和定期刷新推荐 - 只在组件挂载和usagePatterns变化时执行
  const usagePatternsRef = useRef(usagePatterns)

  useEffect(() => {
    usagePatternsRef.current = usagePatterns
  }, [usagePatterns])

  useEffect(() => {
    generateRecommendations()

    // 每小时刷新一次推荐
    const interval = setInterval(generateRecommendations, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, []) // 空依赖数组，只在组件挂载时执行一次

  const refreshRecommendations = () => {
    generateRecommendations()
  }

  return (
    <NavAIContext.Provider value={{ recommendations, isLoading, refreshRecommendations }}>
      {children}
    </NavAIContext.Provider>
  )
}

export function useNavAI() {
  const context = useContext(NavAIContext)
  if (context === undefined) {
    throw new Error("useNavAI must be used within a NavAIProvider")
  }
  return context
}
