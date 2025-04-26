"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface FinancialMetrics {
  profitMargin: number
  roa: number
  currentRatio: number
  debtToEquity: number
  cashConversionCycle: number
}

interface FinancialMetricsGridProps {
  data: FinancialMetrics
  className?: string
}

export function FinancialMetricsGrid({ data, className }: FinancialMetricsGridProps) {
  // 根据指标值确定评级和颜色
  const getRating = (metric: string, value: number) => {
    switch (metric) {
      case "profitMargin":
        if (value >= 20) return { rating: "优秀", color: "bg-green-500" }
        if (value >= 10) return { rating: "良好", color: "bg-blue-500" }
        if (value >= 5) return { rating: "一般", color: "bg-yellow-500" }
        return { rating: "需改进", color: "bg-red-500" }

      case "roa":
        if (value >= 10) return { rating: "优秀", color: "bg-green-500" }
        if (value >= 5) return { rating: "良好", color: "bg-blue-500" }
        if (value >= 2) return { rating: "一般", color: "bg-yellow-500" }
        return { rating: "需改进", color: "bg-red-500" }

      case "currentRatio":
        if (value >= 2) return { rating: "优秀", color: "bg-green-500" }
        if (value >= 1.5) return { rating: "良好", color: "bg-blue-500" }
        if (value >= 1) return { rating: "一般", color: "bg-yellow-500" }
        return { rating: "需改进", color: "bg-red-500" }

      case "debtToEquity":
        if (value <= 0.5) return { rating: "优秀", color: "bg-green-500" }
        if (value <= 1) return { rating: "良好", color: "bg-blue-500" }
        if (value <= 1.5) return { rating: "一般", color: "bg-yellow-500" }
        return { rating: "需改进", color: "bg-red-500" }

      case "cashConversionCycle":
        if (value <= 30) return { rating: "优秀", color: "bg-green-500" }
        if (value <= 45) return { rating: "良好", color: "bg-blue-500" }
        if (value <= 60) return { rating: "一般", color: "bg-yellow-500" }
        return { rating: "需改进", color: "bg-red-500" }

      default:
        return { rating: "未知", color: "bg-gray-500" }
    }
  }

  // 获取进度条百分比
  const getProgressPercentage = (metric: string, value: number) => {
    switch (metric) {
      case "profitMargin":
        return Math.min(value * 2.5, 100) // 最高40%为满分

      case "roa":
        return Math.min(value * 5, 100) // 最高20%为满分

      case "currentRatio":
        return Math.min(value * 33.3, 100) // 最高3为满分

      case "debtToEquity":
        return Math.max(0, 100 - value * 33.3) // 最低0为满分，最高3为0分

      case "cashConversionCycle":
        return Math.max(0, 100 - value * 1.1) // 最低0为满分，最高90为0分

      default:
        return 50
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>财务指标评估</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">利润率</span>
                <span className="text-sm font-medium">{data.profitMargin}%</span>
              </div>
              <Progress value={getProgressPercentage("profitMargin", data.profitMargin)} className="h-2" />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRating("profitMargin", data.profitMargin).color.replace("bg-", "text-")} bg-opacity-20`}
                >
                  {getRating("profitMargin", data.profitMargin).rating}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">资产回报率</span>
                <span className="text-sm font-medium">{data.roa}%</span>
              </div>
              <Progress value={getProgressPercentage("roa", data.roa)} className="h-2" />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRating("roa", data.roa).color.replace("bg-", "text-")} bg-opacity-20`}
                >
                  {getRating("roa", data.roa).rating}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">流动比率</span>
                <span className="text-sm font-medium">{data.currentRatio}</span>
              </div>
              <Progress value={getProgressPercentage("currentRatio", data.currentRatio)} className="h-2" />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRating("currentRatio", data.currentRatio).color.replace("bg-", "text-")} bg-opacity-20`}
                >
                  {getRating("currentRatio", data.currentRatio).rating}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">负债权益比</span>
                <span className="text-sm font-medium">{data.debtToEquity}</span>
              </div>
              <Progress value={getProgressPercentage("debtToEquity", data.debtToEquity)} className="h-2" />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRating("debtToEquity", data.debtToEquity).color.replace("bg-", "text-")} bg-opacity-20`}
                >
                  {getRating("debtToEquity", data.debtToEquity).rating}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">现金转换周期</span>
                <span className="text-sm font-medium">{data.cashConversionCycle} 天</span>
              </div>
              <Progress
                value={getProgressPercentage("cashConversionCycle", data.cashConversionCycle)}
                className="h-2"
              />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRating("cashConversionCycle", data.cashConversionCycle).color.replace("bg-", "text-")} bg-opacity-20`}
                >
                  {getRating("cashConversionCycle", data.cashConversionCycle).rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
