"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })

    // 记录错误到控制台
    console.error("错误边界捕获到错误:", error, errorInfo)

    // 这里可以添加错误上报逻辑
    if (typeof window !== "undefined") {
      // 检查是否为加载chunk失败错误
      if (error.message && error.message.includes("Loading chunk")) {
        console.log("检测到chunk加载失败，尝试清除缓存...")
        // 清除缓存并重新加载
        localStorage.removeItem("app-cache")
        // 设置标志，防止无限刷新
        if (!sessionStorage.getItem("reload-attempted")) {
          sessionStorage.setItem("reload-attempted", "true")
          window.location.reload()
        }
      }
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 自定义错误UI
      return (
        this.props.fallback || (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>出现错误</AlertTitle>
            <AlertDescription>
              <p className="mb-2">应用程序遇到了意外错误。</p>
              {this.state.error && <p className="text-xs mb-4">{this.state.error.toString()}</p>}
              <Button
                size="sm"
                onClick={() => {
                  // 清除缓存并重新加载
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("app-cache")
                    sessionStorage.removeItem("reload-attempted")
                    window.location.reload()
                  }
                }}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> 刷新页面
              </Button>
            </AlertDescription>
          </Alert>
        )
      )
    }

    return this.props.children
  }
}
