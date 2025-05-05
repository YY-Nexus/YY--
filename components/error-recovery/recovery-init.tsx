"use client"

import { useEffect } from "react"
import { getRecoveryService, ErrorType, ErrorSeverity } from "@/lib/error-recovery/recovery-service"

export function RecoveryInit() {
  useEffect(() => {
    const recoveryService = getRecoveryService()

    // 注册全局错误监听器
    const handleGlobalError = (event: ErrorEvent) => {
      recoveryService.captureError({
        type: ErrorType.UNKNOWN,
        severity: ErrorSeverity.MEDIUM,
        message: event.message || "未知错误",
        context: {
          timestamp: Date.now(),
          additionalData: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        },
        originalError: event.error,
      })

      // 阻止默认处理
      event.preventDefault()
    }

    // 注册未捕获的Promise错误监听器
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      recoveryService.captureError({
        type: ErrorType.UNKNOWN,
        severity: ErrorSeverity.MEDIUM,
        message: event.reason?.message || "未处理的Promise拒绝",
        context: {
          timestamp: Date.now(),
          additionalData: {
            reason: event.reason,
          },
        },
        originalError: event.reason instanceof Error ? event.reason : undefined,
      })

      // 阻止默认处理
      event.preventDefault()
    }

    // 注册错误监听器
    window.addEventListener("error", handleGlobalError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    // 注册自定义错误监听器
    recoveryService.registerErrorListener((error) => {
      console.group("捕获到错误")
      console.error(`[${error.severity}] ${error.type}: ${error.message}`)
      console.info("上下文:", error.context)
      if (error.originalError) {
        console.error("原始错误:", error.originalError)
      }
      console.groupEnd()
    })

    return () => {
      // 清理监听器
      window.removeEventListener("error", handleGlobalError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return null
}
