"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"

interface InsightItem {
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
}

interface FinancialInsightsProps {
  insights: InsightItem[]
}

export function FinancialInsights({ insights }: FinancialInsightsProps) {
  // 根据影响类型获取图标和颜色
  const getImpactDetails = (impact: string) => {
    switch (impact) {
      case "positive":
        return { icon: <ArrowUpIcon className="h-5 w-5" />, color: "text-green-500 bg-green-50" }
      case "negative":
        return { icon: <ArrowDownIcon className="h-5 w-5" />, color: "text-red-500 bg-red-50" }
      default:
        return { icon: <MinusIcon className="h-5 w-5" />, color: "text-gray-500 bg-gray-50" }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          财务洞察
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight, index) => {
            const { icon, color } = getImpactDetails(insight.impact)
            return (
              <Card key={index} className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className={`rounded-full p-1.5 ${color}`}>{icon}</div>
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
