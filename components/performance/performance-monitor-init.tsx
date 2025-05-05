"use client"

import { useEffect } from "react"
import { getPerformanceMonitor } from "@/lib/performance-monitor"

export function PerformanceMonitorInit() {
  useEffect(() => {
    // 初始化性能监控
    const monitor = getPerformanceMonitor({
      sampleRate: 0.5, // 50%的用户会被采样
      reportingEndpoint: "/api/performance",
      reportingInterval: 30000, // 30秒
    })

    monitor.init()

    return () => {
      // 组件卸载时停止监控
      monitor.stop()
    }
  }, [])

  // 这是一个纯功能组件，不渲染任何内容
  return null
}
