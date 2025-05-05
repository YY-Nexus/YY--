"use client"

import { useState, useEffect, useCallback } from "react"
import { getCacheService } from "@/lib/cache-service"
import { useLoading } from "@/lib/store"

interface UseCachedDataOptions<T> {
  key: string
  fetcher: () => Promise<T>
  ttl?: number
  namespace?: string
  initialData?: T
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
  dedupingInterval?: number
}

export function useCachedData<T>({
  key,
  fetcher,
  ttl = 5 * 60 * 1000, // 默认5分钟
  namespace,
  initialData,
  revalidateOnFocus = true,
  revalidateOnReconnect = true,
  dedupingInterval = 2000, // 默认2秒内不重复请求
}: UseCachedDataOptions<T>) {
  const cacheService = getCacheService()
  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<Error | null>(null)
  const { isLoading, startLoading, stopLoading } = useLoading()
  const loadingKey = `cached_data_${namespace ? `${namespace}:` : ""}${key}`

  // 上次请求时间
  const lastFetchRef = { current: 0 }

  // 获取数据
  const fetchData = useCallback(
    async (force = false) => {
      // 检查是否在去重间隔内
      const now = Date.now()
      if (!force && now - lastFetchRef.current < dedupingInterval) {
        return
      }

      lastFetchRef.current = now

      // 如果没有强制刷新，尝试从缓存获取
      if (!force) {
        const cachedData = cacheService.get<T>(key, { namespace })
        if (cachedData) {
          setData(cachedData)
          return
        }
      }

      // 缓存未命中或强制刷新，从源获取数据
      try {
        startLoading(loadingKey)
        const freshData = await fetcher()

        // 更新状态和缓存
        setData(freshData)
        setError(null)
        cacheService.set(key, freshData, { ttl, namespace })
      } catch (err) {
        setError(err instanceof Error ? err : new Error("获取数据失败"))
        console.error("获取数据失败:", err)
      } finally {
        stopLoading(loadingKey)
      }
    },
    [key, fetcher, ttl, namespace, dedupingInterval, cacheService, startLoading, stopLoading, loadingKey],
  )

  // 刷新数据
  const refresh = useCallback(() => fetchData(true), [fetchData])

  // 初始加载
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 页面聚焦时重新验证
  useEffect(() => {
    if (!revalidateOnFocus) return

    const handleFocus = () => fetchData()
    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [revalidateOnFocus, fetchData])

  // 网络重连时重新验证
  useEffect(() => {
    if (!revalidateOnReconnect) return

    const handleReconnect = () => fetchData()
    window.addEventListener("online", handleReconnect)

    return () => {
      window.removeEventListener("online", handleReconnect)
    }
  }, [revalidateOnReconnect, fetchData])

  return {
    data,
    error,
    isLoading: isLoading(loadingKey),
    refresh,
  }
}
