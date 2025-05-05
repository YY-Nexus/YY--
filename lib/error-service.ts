// 错误类型
export enum ErrorType {
  NETWORK = "network",
  API = "api",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  VALIDATION = "validation",
  RUNTIME = "runtime",
  BOUNDARY = "boundary",
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
  url?: string
  component?: string
  action?: string
  userId?: string
  timestamp: number
  additionalData?: Record<string, any>
}

// 错误信息
export interface ErrorInfo {
  type: ErrorType
  severity: ErrorSeverity
  message: string
  stack?: string
  context: ErrorContext
}

// 错误处理配置
interface ErrorServiceConfig {
  reportingEndpoint?: string
  logToConsole?: boolean
  captureUnhandledErrors?: boolean
  maxErrorsStored?: number
}

// 默认配置
const defaultConfig: ErrorServiceConfig = {
  reportingEndpoint: "/api/error",
  logToConsole: true,
  captureUnhandledErrors: true,
  maxErrorsStored: 50,
}

// 错误处理服务
export class ErrorService {
  private config: ErrorServiceConfig
  private errors: ErrorInfo[] = []
  private isInitialized = false

  constructor(config: Partial<ErrorServiceConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  // 初始化错误处理服务
  public init(): void {
    if (typeof window === "undefined" || this.isInitialized) return

    // 捕获未处理的Promise错误
    if (this.config.captureUnhandledErrors) {
      window.addEventListener("unhandledrejection", (event) => {
        this.captureError({
          type: ErrorType.RUNTIME,
          severity: ErrorSeverity.HIGH,
          message: `未处理的Promise错误: ${event.reason}`,
          stack: event.reason?.stack,
          context: {
            timestamp: Date.now(),
            url: window.location.href,
          },
        })
      })

      // 捕获未处理的JS错误
      window.addEventListener("error", (event) => {
        this.captureError({
          type: ErrorType.RUNTIME,
          severity: ErrorSeverity.HIGH,
          message: `未处理的JS错误: ${event.message}`,
          stack: event.error?.stack,
          context: {
            timestamp: Date.now(),
            url: window.location.href,
            additionalData: {
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
            },
          },
        })

        // 防止错误冒泡
        event.preventDefault()
      })
    }

    this.isInitialized = true
  }

  // 捕获错误
  public captureError(errorInfo: ErrorInfo): void {
    // 添加到错误列表
    this.errors.push(errorInfo)

    // 如果超过最大存储数量，移除最旧的错误
    if (this.errors.length > this.config.maxErrorsStored!) {
      this.errors.shift()
    }

    // 记录到控制台
    if (this.config.logToConsole) {
      console.error(`[${errorInfo.severity.toUpperCase()}] ${errorInfo.type}: ${errorInfo.message}`, errorInfo)
    }

    // 上报错误
    this.reportError(errorInfo)
  }

  // 上报错误
  private reportError(errorInfo: ErrorInfo): void {
    if (!this.config.reportingEndpoint || typeof window === "undefined") return

    // 使用fetch API上报错误
    fetch(this.config.reportingEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorInfo),
      // 即使页面正在卸载也尝试发送
      keepalive: true,
    }).catch((err) => {
      // 避免因上报错误而产生新错误
      console.warn("上报错误失败:", err)
    })
  }

  // 获取所有捕获的错误
  public getErrors(): ErrorInfo[] {
    return [...this.errors]
  }

  // 清除所有错误
  public clearErrors(): void {
    this.errors = []
  }

  // 创建API错误
  public createApiError(
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    additionalData?: Record<string, any>,
  ): ErrorInfo {
    return {
      type: ErrorType.API,
      severity,
      message,
      context: {
        timestamp: Date.now(),
        url: typeof window !== "undefined" ? window.location.href : "",
        additionalData,
      },
    }
  }

  // 创建网络错误
  public createNetworkError(
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    additionalData?: Record<string, any>,
  ): ErrorInfo {
    return {
      type: ErrorType.NETWORK,
      severity,
      message,
      context: {
        timestamp: Date.now(),
        url: typeof window !== "undefined" ? window.location.href : "",
        additionalData,
      },
    }
  }

  // 创建认证错误
  public createAuthError(
    message: string,
    severity: ErrorSeverity = ErrorSeverity.HIGH,
    additionalData?: Record<string, any>,
  ): ErrorInfo {
    return {
      type: ErrorType.AUTHENTICATION,
      severity,
      message,
      context: {
        timestamp: Date.now(),
        url: typeof window !== "undefined" ? window.location.href : "",
        additionalData,
      },
    }
  }
}

// 创建单例实例
let instance: ErrorService | null = null

export function getErrorService(config?: Partial<ErrorServiceConfig>): ErrorService {
  if (!instance) {
    instance = new ErrorService(config)
  }

  return instance
}
