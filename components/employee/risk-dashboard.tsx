"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface RiskDashboardProps {
  score: number
}

export function RiskDashboard({ score }: RiskDashboardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 根据分数确定风险等级和颜色
  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: "低", color: "bg-green-500" }
    if (score < 50) return { level: "中", color: "bg-yellow-500" }
    if (score < 70) return { level: "高", color: "bg-orange-500" }
    return { level: "极高", color: "bg-red-500" }
  }

  const { level, color } = getRiskLevel(score)

  // 计算仪表盘角度
  const angle = (score / 100) * 180

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">离职风险评分</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-24 overflow-hidden">
            {/* 仪表盘背景 */}
            <div className="absolute w-full h-full bg-gray-200 rounded-t-full"></div>

            {/* 仪表盘填充部分 */}
            {mounted && (
              <div
                className={cn(
                  "absolute w-full h-full rounded-t-full origin-bottom transition-transform duration-1000",
                  color,
                )}
                style={{ transform: `rotate(${angle - 180}deg)` }}
              ></div>
            )}

            {/* 仪表盘中心点和指针 */}
            <div
              className="absolute bottom-0 left-1/2 w-1 h-1/2 bg-gray-800 -ml-0.5 origin-bottom transition-transform duration-1000"
              style={{ transform: `rotate(${angle - 90}deg)` }}
            ></div>
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full -ml-2 -mb-2 z-10"></div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-4xl font-bold">{score}</div>
            <div
              className={cn("text-lg font-medium", {
                "text-green-600": level === "低",
                "text-yellow-600": level === "中",
                "text-orange-600": level === "高",
                "text-red-600": level === "极高",
              })}
            >
              {level}风险
            </div>
            <div className="text-sm text-muted-foreground mt-1">上次更新: {new Date().toLocaleDateString("zh-CN")}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
