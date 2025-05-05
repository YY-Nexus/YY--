"use client"

import { useState, useEffect, useCallback } from "react"
import { useOfflineStatus } from "@/hooks/use-offline-status"
import { getSupabase } from "@/lib/supabase"
import { cacheData, getCachedData, deleteCachedData } from "@/lib/indexed-db"
import { createOfflineRecord, updateOfflineRecord, deleteOfflineRecord } from "@/lib/offline-sync"

interface UseOfflineDataOptions {
  table: string
  cacheExpiry?: number // 缓存过期时间（毫秒）
  initialData?: any[]
}

export function useOfflineData<T extends { id: string }>({
  table,
  cacheExpiry = 1000 * 60 * 60, // 默认1小时
  initialData = [],
}: UseOfflineDataOptions) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const isOffline = useOfflineStatus()

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      if (isOffline) {
        // 离线模式：从缓存加载数据
        const cachedData = await getCachedData(table)
        if (cachedData) {
          setData(cachedData)
        }
      } else {
        // 在线模式：从服务器加载数据并更新缓存
        const supabase = getSupabase()
        const { data: serverData, error: serverError } = await supabase.from(table).select("*")

        if (serverError) {
          throw serverError
        }

        if (serverData) {
          setData(serverData as T[])

          // 更新缓存
          const expires = Date.now() + cacheExpiry
          for (const item of serverData) {
            await cacheData(table, item, expires)
          }
        }
      }
    } catch (err) {
      console.error(`加载数据失败:`, err)
      setError(err as Error)

      // 尝试从缓存加载
      const cachedData = await getCachedData(table)
      if (cachedData) {
        setData(cachedData)
      }
    } finally {
      setLoading(false)
    }
  }, [table, isOffline, cacheExpiry])

  // 创建记录
  const createRecord = useCallback(
    async (record: Omit<T, "id">): Promise<T> => {
      try {
        if (isOffline) {
          // 离线模式：创建临时ID并存储到待处理操作
          const tempId = crypto.randomUUID()
          const newRecord = { ...record, id: tempId } as T

          // 添加到本地数据
          setData((prev) => [...prev, newRecord])

          // 缓存数据
          await cacheData(table, newRecord)

          // 添加待处理操作
          await createOfflineRecord(table, newRecord)

          return newRecord
        } else {
          // 在线模式：直接创建记录
          const supabase = getSupabase()
          const { data: createdData, error } = await supabase.from(table).insert(record).select().single()

          if (error) {
            throw error
          }

          const newRecord = createdData as T

          // 更新本地数据
          setData((prev) => [...prev, newRecord])

          // 更新缓存
          const expires = Date.now() + cacheExpiry
          await cacheData(table, newRecord, expires)

          return newRecord
        }
      } catch (err) {
        console.error(`创建记录失败:`, err)
        throw err
      }
    },
    [table, isOffline, cacheExpiry],
  )

  // 更新记录
  const updateRecord = useCallback(
    async (id: string, updates: Partial<T>): Promise<T> => {
      try {
        // 查找当前记录
        const currentRecord = data.find((item) => item.id === id)
        if (!currentRecord) {
          throw new Error(`记录不存在: ${id}`)
        }

        // 合并更新
        const updatedRecord = { ...currentRecord, ...updates } as T

        if (isOffline) {
          // 离线模式：存储到待处理操作
          // 更新本地数据
          setData((prev) => prev.map((item) => (item.id === id ? updatedRecord : item)))

          // 更新缓存
          await cacheData(table, updatedRecord)

          // 添加待处理操作
          await updateOfflineRecord(table, updatedRecord)

          return updatedRecord
        } else {
          // 在线模式：直接更新记录
          const supabase = getSupabase()
          const { data: updatedData, error } = await supabase.from(table).update(updates).eq("id", id).select().single()

          if (error) {
            throw error
          }

          const serverUpdatedRecord = updatedData as T

          // 更新本地数据
          setData((prev) => prev.map((item) => (item.id === id ? serverUpdatedRecord : item)))

          // 更新缓存
          const expires = Date.now() + cacheExpiry
          await cacheData(table, serverUpdatedRecord, expires)

          return serverUpdatedRecord
        }
      } catch (err) {
        console.error(`更新记录失败:`, err)
        throw err
      }
    },
    [table, data, isOffline, cacheExpiry],
  )

  // 删除记录
  const deleteRecord = useCallback(
    async (id: string): Promise<void> => {
      try {
        if (isOffline) {
          // 离线模式：存储到待处理操作
          // 更新本地数据
          setData((prev) => prev.filter((item) => item.id !== id))

          // 删除缓存
          await deleteCachedData(table, id)

          // 添加待处理操作
          await deleteOfflineRecord(table, id)
        } else {
          // 在线模式：直接删除记录
          const supabase = getSupabase()
          const { error } = await supabase.from(table).delete().eq("id", id)

          if (error) {
            throw error
          }

          // 更新本地数据
          setData((prev) => prev.filter((item) => item.id !== id))

          // 删除缓存
          await deleteCachedData(table, id)
        }
      } catch (err) {
        console.error(`删除记录失败:`, err)
        throw err
      }
    },
    [table, isOffline],
  )

  // 初始加载数据
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    data,
    loading,
    error,
    isOffline,
    refresh: loadData,
    create: createRecord,
    update: updateRecord,
    delete: deleteRecord,
  }
}
