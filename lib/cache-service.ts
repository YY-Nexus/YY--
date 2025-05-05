/**
 * 缓存服务
 * 提供本地存储缓存功能，包括设置、获取、删除缓存等
 */
import { getRecoveryService, ErrorType, ErrorSeverity } from "@/lib/error-recovery/recovery-service"

// 缓存版本，用于在应用更新时强制刷新缓存
const CACHE_VERSION = "1.0.3"

// 缓存键前缀
const CACHE_PREFIX = "app-cache"

// 缓存优先级
export enum CachePriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  CRITICAL = "critical",
}

// 缓存项
interface CacheItem<T> {
  data: T
  expiration: number
  version: string
  priority: CachePriority
  lastAccessed: number
}

// 缓存统计
interface CacheStats {
  totalItems: number
  totalSize: number
  itemsByPriority: Record<CachePriority, number>
  expirationCounts: Record<string, number> // 按过期时间分组
}

// 备用存储
class MemoryStorage {
  private static instance: MemoryStorage
  private storage: Map<string, string> = new Map()

  public static getInstance(): MemoryStorage {
    if (!MemoryStorage.instance) {
      MemoryStorage.instance = new MemoryStorage()
    }
    return MemoryStorage.instance
  }

  public getItem(key: string): string | null {
    return this.storage.get(key) || null
  }

  public setItem(key: string, value: string): void {
    this.storage.set(key, value)
  }

  public removeItem(key: string): void {
    this.storage.delete(key)
  }

  public clear(): void {
    this.storage.clear()
  }

  public get length(): number {
    return this.storage.size
  }

  public key(index: number): string | null {
    const keys = Array.from(this.storage.keys())
    return keys[index] || null
  }
}

// 获取带版本的缓存键
const getCacheKey = (key: string): string => {
  return `${CACHE_PREFIX}:${CACHE_VERSION}:${key}`
}

// 获取存储接口
const getStorage = (): Storage | MemoryStorage => {
  try {
    if (typeof localStorage !== "undefined") {
      // 测试localStorage是否可用
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      return localStorage
    }
  } catch (error) {
    console.warn("localStorage不可用，使用内存存储:", error)
  }
  return MemoryStorage.getInstance()
}

// 设置缓存
export function setCache<T>(
  key: string,
  data: T,
  options: {
    expirationMinutes?: number
    priority?: CachePriority
    encrypt?: boolean
  } = {},
): void {
  const recoveryService = getRecoveryService()

  recoveryService
    .withRetry(async () => {
      const storage = getStorage()
      const cacheKey = getCacheKey(key)
      const now = Date.now()
      const expirationMinutes = options.expirationMinutes ?? 60
      const expirationTime = now + expirationMinutes * 60000
      const priority = options.priority ?? CachePriority.NORMAL

      const cacheData: CacheItem<T> = {
        data: options.encrypt ? encryptData(data) : data,
        expiration: expirationTime,
        version: CACHE_VERSION,
        priority,
        lastAccessed: now,
      }

      storage.setItem(cacheKey, JSON.stringify(cacheData))
      updateCacheStats(key, cacheData)
    })
    .catch((error) => {
      recoveryService.captureError({
        type: ErrorType.STORAGE,
        severity: ErrorSeverity.MEDIUM,
        message: "缓存设置失败",
        context: {
          timestamp: Date.now(),
          additionalData: { key, error },
        },
        originalError: error instanceof Error ? error : undefined,
      })
    })
}

// 获取缓存
export function getCache<T>(
  key: string,
  options: {
    decrypt?: boolean
  } = {},
): T | null {
  const recoveryService = getRecoveryService()

  try {
    const storage = getStorage()
    const cacheKey = getCacheKey(key)
    const cachedData = storage.getItem(cacheKey)

    if (!cachedData) return null

    const cacheItem = JSON.parse(cachedData) as CacheItem<T>

    // 检查版本和过期时间
    if (cacheItem.version !== CACHE_VERSION || cacheItem.expiration < Date.now()) {
      storage.removeItem(cacheKey)
      return null
    }

    // 更新最后访问时间
    cacheItem.lastAccessed = Date.now()
    storage.setItem(cacheKey, JSON.stringify(cacheItem))

    // 返回数据，如果需要解密则解密
    return options.decrypt ? decryptData(cacheItem.data) : cacheItem.data
  } catch (error) {
    recoveryService.captureError({
      type: ErrorType.STORAGE,
      severity: ErrorSeverity.MEDIUM,
      message: "缓存获取失败",
      context: {
        timestamp: Date.now(),
        additionalData: { key, error },
      },
      originalError: error instanceof Error ? error : undefined,
    })
    return null
  }
}

// 删除缓存
export function removeCache(key: string): void {
  const recoveryService = getRecoveryService()

  recoveryService
    .withRetry(async () => {
      const storage = getStorage()
      const cacheKey = getCacheKey(key)
      storage.removeItem(cacheKey)
    })
    .catch((error) => {
      recoveryService.captureError({
        type: ErrorType.STORAGE,
        severity: ErrorSeverity.LOW,
        message: "缓存删除失败",
        context: {
          timestamp: Date.now(),
          additionalData: { key, error },
        },
        originalError: error instanceof Error ? error : undefined,
      })
    })
}

// 清除所有缓存
export function clearAllCache(): void {
  const recoveryService = getRecoveryService()

  recoveryService
    .withRetry(async () => {
      const storage = getStorage()

      // 只清除当前应用的缓存
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && key.startsWith(CACHE_PREFIX)) {
          storage.removeItem(key)
        }
      }
    })
    .catch((error) => {
      recoveryService.captureError({
        type: ErrorType.STORAGE,
        severity: ErrorSeverity.MEDIUM,
        message: "清除所有缓存失败",
        context: {
          timestamp: Date.now(),
          additionalData: { error },
        },
        originalError: error instanceof Error ? error : undefined,
      })
    })
}

// 检查并清理过期缓存
export function cleanExpiredCache(): void {
  const recoveryService = getRecoveryService()

  recoveryService
    .withRetry(async () => {
      const storage = getStorage()

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && key.startsWith(CACHE_PREFIX)) {
          try {
            const cachedData = storage.getItem(key)
            if (cachedData) {
              const cacheItem = JSON.parse(cachedData)
              if (cacheItem.version !== CACHE_VERSION || cacheItem.expiration < Date.now()) {
                storage.removeItem(key)
              }
            }
          } catch (error) {
            // 如果解析失败，删除该缓存
            storage.removeItem(key)
          }
        }
      }
    })
    .catch((error) => {
      recoveryService.captureError({
        type: ErrorType.STORAGE,
        severity: ErrorSeverity.LOW,
        message: "清理过期缓存失败",
        context: {
          timestamp: Date.now(),
          additionalData: { error },
        },
        originalError: error instanceof Error ? error : undefined,
      })
    })
}

// 清理低优先级缓存
export function cleanLowPriorityCache(bytesToFree: number): void {
  const recoveryService = getRecoveryService()

  recoveryService
    .withRetry(async () => {
      const storage = getStorage()
      const cacheItems: Array<{ key: string; item: CacheItem<any>; size: number }> = []

      // 收集所有缓存项
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && key.startsWith(CACHE_PREFIX)) {
          try {
            const cachedData = storage.getItem(key)
            if (cachedData) {
              const item = JSON.parse(cachedData) as CacheItem<any>
              cacheItems.push({
                key,
                item,
                size: cachedData.length * 2, // 粗略估计字节大小
              })
            }
          } catch (error) {
            // 如果解析失败，删除该缓存
            storage.removeItem(key)
          }
        }
      }

      // 按优先级和最后访问时间排序
      cacheItems.sort((a, b) => {
        // 首先按优先级排序
        const priorityOrder = {
          [CachePriority.LOW]: 0,
          [CachePriority.NORMAL]: 1,
          [CachePriority.HIGH]: 2,
          [CachePriority.CRITICAL]: 3,
        }

        const priorityDiff = priorityOrder[a.item.priority] - priorityOrder[b.item.priority]
        if (priorityDiff !== 0) return priorityDiff

        // 然后按最后访问时间排序
        return a.item.lastAccessed - b.item.lastAccessed
      })

      // 从低优先级开始清理
      let freedBytes = 0
      for (const cacheItem of cacheItems) {
        if (freedBytes >= bytesToFree) break

        if (cacheItem.item.priority !== CachePriority.CRITICAL) {
          storage.removeItem(cacheItem.key)
          freedBytes += cacheItem.size
        }
      }
    })
    .catch((error) => {
      recoveryService.captureError({
        type: ErrorType.STORAGE,
        severity: ErrorSeverity.MEDIUM,
        message: "清理低优先级缓存失败",
        context: {
          timestamp: Date.now(),
          additionalData: { bytesToFree, error },
        },
        originalError: error instanceof Error ? error : undefined,
      })
    })
}

// 获取缓存统计信息
export function getCacheStats(): CacheStats {
  const storage = getStorage()
  const stats: CacheStats = {
    totalItems: 0,
    totalSize: 0,
    itemsByPriority: {
      [CachePriority.LOW]: 0,
      [CachePriority.NORMAL]: 0,
      [CachePriority.HIGH]: 0,
      [CachePriority.CRITICAL]: 0,
    },
    expirationCounts: {},
  }

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (key && key.startsWith(CACHE_PREFIX)) {
      try {
        const cachedData = storage.getItem(key)
        if (cachedData) {
          const item = JSON.parse(cachedData) as CacheItem<any>
          stats.totalItems++
          stats.totalSize += cachedData.length * 2 // 粗略估计字节大小

          // 按优先级统计
          stats.itemsByPriority[item.priority]++

          // 按过期时间分组
          const expirationDate = new Date(item.expiration).toDateString()
          stats.expirationCounts[expirationDate] = (stats.expirationCounts[expirationDate] || 0) + 1
        }
      } catch (error) {
        // 忽略解析错误
      }
    }
  }

  return stats
}

// 更新缓存统计信息
function updateCacheStats(key: string, item: CacheItem<any>): void {
  // 这里可以实现更详细的统计逻辑
  // 例如，记录缓存命中率、缓存大小等
}

// 加密数据
function encryptData<T>(data: T): any {
  // 简单加密示例，实际应用中应使用更安全的加密算法
  if (typeof data === "string") {
    return btoa(data)
  }
  return btoa(JSON.stringify(data))
}

// 解密数据
function decryptData<T>(data: any): T {
  // 简单解密示例，实际应用中应使用更安全的解密算法
  try {
    if (typeof data === "string") {
      const decrypted = atob(data)
      try {
        return JSON.parse(decrypted) as T
      } catch {
        return decrypted as unknown as T
      }
    }
    return data
  } catch {
    return data
  }
}

// 初始化缓存服务
export function initCacheService(): void {
  const recoveryService = getRecoveryService()

  recoveryService
    .withRetry(async () => {
      // 检查并清理过期缓存
      cleanExpiredCache()

      // 定期清理过期缓存
      if (typeof window !== "undefined") {
        setInterval(cleanExpiredCache, 30 * 60 * 1000) // 每30分钟清理一次
      }

      // 监听存储事件
      if (typeof window !== "undefined") {
        window.addEventListener("storage", (event) => {
          if (event.key && event.key.startsWith(CACHE_PREFIX)) {
            // 处理存储变化
            console.log("缓存变化:", event.key)
          }
        })
      }

      // 监听存储配额超出事件
      if (typeof window !== "undefined" && navigator.storage && navigator.storage.estimate) {
        try {
          const estimate = await navigator.storage.estimate()
          const usedPercentage = ((estimate.usage || 0) / (estimate.quota || 1)) * 100

          if (usedPercentage > 80) {
            console.warn(`存储使用率高: ${usedPercentage.toFixed(2)}%`)
            // 清理低优先级缓存
            cleanLowPriorityCache(1024 * 1024) // 尝试释放1MB
          }
        } catch (error) {
          console.error("获取存储估计失败:", error)
        }
      }
    })
    .catch((error) => {
      console.error("缓存服务初始化失败:", error)
    })
}
