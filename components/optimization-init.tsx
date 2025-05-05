"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { getRecoveryService } from "@/lib/error-recovery/recovery-service"
import { initCacheService } from "@/lib/cache-service"
import { initEncryptionService } from "@/lib/security/encryption-service"
import { initSmartPreloadService, getSmartPreloadService } from "@/lib/performance/smart-preload"

export function OptimizationInit() {
  const pathname = usePathname()

  useEffect(() => {
    const initializeServices = async () => {
      try {
        console.log("正在初始化优化服务...")

        // 初始化错误恢复服务
        const recoveryService = getRecoveryService()

        // 初始化缓存服务
        await recoveryService.withRetry(async () => {
          await initCacheService()
          console.log("缓存服务初始化成功")
        })

        // 初始化加密服务
        await recoveryService.withRetry(async () => {
          await initEncryptionService()
          console.log("加密服务初始化成功")
        })

        // 初始化智能预加载服务
        await recoveryService.withRetry(async () => {
          try {
            initSmartPreloadService()
            console.log("智能预加载服务初始化成功")
          } catch (error) {
            console.warn("智能预加载服务初始化失败，将使用基本预加载:", error)
            // 可以在这里实现一个基本的预加载策略作为备选
          }
        })

        console.log("所有优化服务初始化成功")
      } catch (error) {
        console.error("初始化优化服务失败:", error)
      }
    }

    initializeServices()
  }, [])

  // 记录页面访问
  useEffect(() => {
    if (pathname) {
      try {
        const preloadService = getSmartPreloadService()
        if (preloadService) {
          preloadService.recordPageVisit(pathname)
        }
      } catch (error) {
        console.error("记录页面访问失败:", error)
        // 错误不应影响用户体验
      }
    }
  }, [pathname])

  return null
}
