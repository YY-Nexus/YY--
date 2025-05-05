"use client"

import { useEffect } from "react"
import { initCacheService } from "@/lib/cache-service"

export function CacheInit() {
  useEffect(() => {
    // 初始化缓存服务
    if (typeof window !== "undefined") {
      try {
        console.log("备用缓存初始化组件: 正在初始化缓存服务...")
        initCacheService()
        console.log("备用缓存初始化组件: 缓存服务初始化成功")
      } catch (error) {
        console.error("备用缓存初始化组件: 缓存服务初始化失败:", error)
      }
    }
  }, [])

  return null
}
