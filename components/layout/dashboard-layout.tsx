"use client"

import type React from "react"

import { MainNav } from "@/components/navigation/main-nav"
import { NavigationProvider } from "@/hooks/use-navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // 在客户端渲染后设置挂载状态
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 避免服务器端渲染不匹配
  if (!isMounted) {
    return null
  }

  return (
    <NavigationProvider>
      <div className="flex h-screen overflow-hidden">
        {/* 桌面端显示侧边导航 */}
        {isDesktop && <MainNav />}

        {/* 内容区域 */}
        <div className={cn("flex flex-1 flex-col overflow-hidden")}>
          {/* 这里可以添加顶部导航栏 */}

          {/* 主内容区域 */}
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </NavigationProvider>
  )
}
