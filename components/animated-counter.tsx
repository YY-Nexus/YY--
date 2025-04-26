"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  duration?: number
  formatter?: (value: number) => string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 1000,
  formatter = (val) => val.toLocaleString(),
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 如果值为0，直接设置为0
    if (value === 0) {
      setCount(0)
      return
    }

    // 计算每一步的增量
    const startValue = count || 0
    const increment = (value - startValue) / (duration / 16)
    let startTime: number | null = null

    // 动画函数
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      // 计算当前值
      const currentValue = startValue + increment * Math.min(progress, duration)

      // 更新状态
      setCount(currentValue)

      // 如果动画未完成，继续请求动画帧
      if (progress < duration) {
        requestAnimationFrame(animateCount)
      } else {
        // 确保最终值精确
        setCount(value)
      }
    }

    // 开始动画
    requestAnimationFrame(animateCount)

    // 清理函数
    return () => {
      startTime = null
    }
  }, [value, duration])

  return <span className={cn("tabular-nums", className)}>{formatter(count)}</span>
}
