"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MicroFrontendConfig } from "@/lib/micro-frontend/config"

// 声明全局federation类型
declare global {
  interface Window {
    __webpack_init_sharing__: (shareScope: string) => Promise<void>
    __webpack_share_scopes__: { default: any }
  }
}

interface MicroFrontendLoaderProps {
  config: MicroFrontendConfig
  tenantId?: string
  fallback?: React.ReactNode
}

export function MicroFrontendLoader({ config, tenantId, fallback }: MicroFrontendLoaderProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 重置状态
    setLoading(true)
    setError(null)
    setComponent(null)

    // 加载微前端
    const loadMicroFrontend = async () => {
      try {
        // 初始化共享作用域
        if (!window.__webpack_share_scopes__?.default) {
          await window.__webpack_init_sharing__("default")
        }

        // 动态加载远程模块
        // @ts-ignore
        const container = window[config.scope]
        if (!container) {
          // 加载远程入口脚本
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script")
            script.src = config.remoteEntry
            script.type = "text/javascript"
            script.async = true

            script.onload = () => resolve()
            script.onerror = () => reject(new Error(`无法加载微前端: ${config.name}`))

            document.head.appendChild(script)
          })
        }

        // @ts-ignore
        const factory = await window[config.scope].get(config.exposedModule)
        const Module = factory()

        // 初始化模块
        setComponent(() => Module.default)
        setLoading(false)
      } catch (err) {
        console.error("加载微前端失败:", err)
        setError(err instanceof Error ? err : new Error("加载微前端失败"))
        setLoading(false)
      }
    }

    loadMicroFrontend()

    // 清理函数
    return () => {
      // 可以在这里添加清理逻辑
    }
  }, [config])

  if (loading) {
    return fallback || <Skeleton className="w-full h-[400px]" />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>加载失败</AlertTitle>
        <AlertDescription>
          <p className="mb-2">无法加载 {config.name} 模块。</p>
          <p className="text-xs mb-4">{error.message}</p>
          <Button
            size="sm"
            onClick={() => {
              setLoading(true)
              setError(null)
              // 重新加载页面
              window.location.reload()
            }}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> 重试
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!Component) {
    return null
  }

  // 传递租户ID到微前端组件
  return <Component tenantId={tenantId} />
}
