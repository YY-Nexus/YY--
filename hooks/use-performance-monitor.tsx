"use client"

import { useEffect, useRef } from "react"
import { getPerformanceMonitor } from "@/lib/performance-monitor"

interface UsePerformanceMonitorOptions {
  componentName: string
  enabled?: boolean
}

export function usePerformanceMonitor({ componentName, enabled = true }: UsePerformanceMonitorOptions) {
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) return

    // 记录组件挂载时间
    startTimeRef.current = performance.now()

    return () => {
      // 组件卸载时记录渲染时间
      const monitor = getPerformanceMonitor()
      monitor.recordComponentRender(componentName, startTimeRef.current)
    }
  }, [componentName, enabled])

  // 提供一个手动记录性能指标的方法
  const recordMetric = (name: string, value: number) => {
    if (!enabled) return

    const monitor = getPerformanceMonitor()
    monitor.addCustomMetric(`${componentName}_${name}`, value)
  }

  // 提供一个计时器方法
  const startTimer = (metricName: string) => {
    if (!enabled) return () => {}

    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      recordMetric(metricName, endTime - startTime)
    }
  }

  return {
    recordMetric,
    startTimer,
  }
}
