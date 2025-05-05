/**
 * 错误恢复服务
 * 提供错误处理、自动重试和降级策略
 */

// 重试配置
interface RetryConfig {
  maxRetries: number
  initialDelay: number
  backoffFactor: number
  maxDelay: number
}

// 默认重试配置
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1秒
  backoffFactor: 2,
  maxDelay: 30000, // 30秒
}

// 错误类型
export enum ErrorType {
  NETWORK = "network",
  STORAGE = "storage",
  API = "api",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  VALIDATION = "validation",
  UNKNOWN = "unknown",
}

// 错误严重程度
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// 错误上下文
export interface ErrorContext {
  timestamp: number
  url?: string
  component?: string
  additionalData?: Record<string, any>
}

// 错误信息
export interface ErrorInfo {
  type: ErrorType
  severity: ErrorSeverity
  message: string
  context: ErrorContext
  originalError?: Error
}

// 错误恢复服务
export class RecoveryService {
  private static instance: RecoveryService
  private errorListeners: Array<(error: ErrorInfo) => void> = []
  private recoveryStrategies: Map<ErrorType, Array<(error: ErrorInfo) => Promise<boolean>>> = new Map()
  private isRecovering = false
  private recoveryQueue: ErrorInfo[] = []

  // 获取单例实例
  public static getInstance(): RecoveryService {
    if (!RecoveryService.instance) {
      RecoveryService.instance = new RecoveryService()
    }
    return RecoveryService.instance
  }

  // 私有构造函数
  private constructor() {
    this.initDefaultRecoveryStrategies()
  }

  // 初始化默认恢复策略
  private initDefaultRecoveryStrategies(): void {
    // 网络错误恢复策略
    this.registerRecoveryStrategy(ErrorType.NETWORK, async (error) => {
      console.log("尝试恢复网络错误:", error.message)
      // 检查网络连接
      if (navigator.onLine) {
        return true // 网络已恢复
      }
      return false // 网络仍然不可用
    })

    // 存储错误恢复策略
    this.registerRecoveryStrategy(ErrorType.STORAGE, async (error) => {
      console.log("尝试恢复存储错误:", error.message)
      // 尝试清除部分存储
      try {
        // 清除可能损坏的缓存
        if (typeof localStorage !== "undefined") {
          const keysToRemove = []
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.includes("cache")) {
              keysToRemove.push(key)
            }
          }
          keysToRemove.forEach((key) => localStorage.removeItem(key))
        }
        return true // 存储已清理
      } catch (e) {
        console.error("清理存储失败:", e)
        return false // 存储清理失败
      }
    })

    // API错误恢复策略
    this.registerRecoveryStrategy(ErrorType.API, async (error) => {
      console.log("尝试恢复API错误:", error.message)
      // 可以实现API重试逻辑
      return true
    })
  }

  // 注册错误监听器
  public registerErrorListener(listener: (error: ErrorInfo) => void): void {
    this.errorListeners.push(listener)
  }

  // 注册恢复策略
  public registerRecoveryStrategy(errorType: ErrorType, strategy: (error: ErrorInfo) => Promise<boolean>): void {
    if (!this.recoveryStrategies.has(errorType)) {
      this.recoveryStrategies.set(errorType, [])
    }
    this.recoveryStrategies.get(errorType)!.push(strategy)
  }

  // 捕获错误
  public captureError(error: ErrorInfo): void {
    // 通知所有监听器
    this.errorListeners.forEach((listener) => {
      try {
        listener(error)
      } catch (e) {
        console.error("错误监听器执行失败:", e)
      }
    })

    // 添加到恢复队列
    this.recoveryQueue.push(error)

    // 如果没有正在进行的恢复过程，启动恢复
    if (!this.isRecovering) {
      this.startRecovery()
    }
  }

  // 启动恢复过程
  private async startRecovery(): Promise<void> {
    if (this.isRecovering || this.recoveryQueue.length === 0) {
      return
    }

    this.isRecovering = true

    while (this.recoveryQueue.length > 0) {
      const error = this.recoveryQueue.shift()!
      await this.recoverFromError(error)
    }

    this.isRecovering = false
  }

  // 从错误中恢复
  private async recoverFromError(error: ErrorInfo): Promise<void> {
    const strategies = this.recoveryStrategies.get(error.type) || []

    for (const strategy of strategies) {
      try {
        const success = await strategy(error)
        if (success) {
          console.log("错误恢复成功:", error.message)
          return
        }
      } catch (e) {
        console.error("恢复策略执行失败:", e)
      }
    }

    console.warn("所有恢复策略失败，无法恢复错误:", error.message)
  }

  // 使用重试执行函数
  public async withRetry<T>(fn: () => Promise<T>, config: Partial<RetryConfig> = {}): Promise<T> {
    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
    let lastError: Error | null = null
    let delay = retryConfig.initialDelay

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        console.warn(`操作失败，尝试 ${attempt + 1}/${retryConfig.maxRetries + 1}:`, lastError.message)

        if (attempt < retryConfig.maxRetries) {
          // 等待延迟时间后重试
          await new Promise((resolve) => setTimeout(resolve, delay))
          // 计算下一次延迟时间（指数退避）
          delay = Math.min(delay * retryConfig.backoffFactor, retryConfig.maxDelay)
        }
      }
    }

    throw lastError || new Error("操作失败，已达到最大重试次数")
  }

  // 使用降级策略执行函数
  public async withFallback<T>(primaryFn: () => Promise<T>, fallbackFn: () => Promise<T>): Promise<T> {
    try {
      return await primaryFn()
    } catch (error) {
      console.warn("主要操作失败，使用降级策略:", error)
      return fallbackFn()
    }
  }
}

// 获取错误恢复服务实例
export function getRecoveryService(): RecoveryService {
  return RecoveryService.getInstance()
}
