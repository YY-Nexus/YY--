"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"

interface MetricItem {
  name: string
  value: number
  change: number
  status: "up" | "down" | "neutral"
}

interface FinancialMetricsGridProps {
  metrics: MetricItem[]
}

export function FinancialMetricsGrid({ metrics }: FinancialMetricsGridProps) {
  // 格式化数值，根据指标类型添加适当的单位
  const formatValue = (name: string, value: number) => {
    if (name.includes("率")) {
      return `${value}%`
    } else if (value > 10000) {
      return new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    } else {
      return value.toFixed(1)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            {metric.status === "up" ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : metric.status === "down" ? (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            ) : (
              <MinusIcon className="h-4 w-4 text-gray-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatValue(metric.name, metric.value)}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  metric.status === "up"
                    ? "text-green-500"
                    : metric.status === "down"
                      ? "text-red-500"
                      : "text-gray-500"
                }
              >
                {metric.change > 0 ? "+" : ""}
                {metric.change.toFixed(1)}%
              </span>{" "}
              相比上期
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
