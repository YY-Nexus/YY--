"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { getPreloadService } from "@/lib/preload-service"
import { navigationData } from "@/lib/navigation-data"
import { initCacheService } from "@/lib/cache-service"

export function PreloadInit() {
  const pathname = usePathname()

  useEffect(() => {
    // 初始化缓存服务
    if (typeof window !== "undefined") {
      try {
        console.log("正在初始化缓存服务...")
        initCacheService()
        console.log("缓存服务初始化成功")
      } catch (error) {
        console.error("缓存服务初始化失败:", error)
      }
    }

    const preloadService = getPreloadService()

    // 预加载关键资源
    preloadService.preloadCriticalAssets()

    // 根据当前路径预加载相关路由
    if (pathname) {
      // 找到当前导航项
      const currentNavItem = navigationData.find((item) => pathname.startsWith(item.path || ""))

      // 预加载子路由
      if (currentNavItem?.children) {
        currentNavItem.children.forEach((child) => {
          if (child.path) {
            preloadService.prefetchRoute(child.path)
          }
        })
      }

      // 预加载常用路由
      const commonRoutes = ["/", "/notifications", "/system-config"]
      commonRoutes.forEach((route) => {
        if (route !== pathname) {
          preloadService.prefetchRoute(route)
        }
      })
    }

    // 清除会话存储中的重载标志
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("reload-attempted")
    }
  }, [pathname])

  return null
}
