"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react"

interface FinancialInsightsProps {
  insights: string[]
  className?: string
}

export function FinancialInsights({ insights, className }: FinancialInsightsProps) {
  // 根据洞察内容确定图标和颜色
  const getInsightIcon = (insight: string) => {
    if (insight.includes("高于") || insight.includes("增长") || insight.includes("良好") || insight.includes("优秀")) {
      return { icon: <TrendingUp className="h-5 w-5 text-green-500" />, color: "border-green-200 bg-green-50" }
    }

    if (insight.includes("低于") || insight.includes("降低") || insight.includes("减少") || insight.includes("下降")) {
      return { icon: <TrendingDown className="h-5 w-5 text-red-500" />, color: "border-red-200 bg-red-50" }
    }

    if (insight.includes("建议") || insight.includes("需要") || insight.includes("应该")) {
      return { icon: <AlertCircle className="h-5 w-5 text-yellow-500" />, color: "border-yellow-200 bg-yellow-50" }
    }

    return { icon: <CheckCircle className="h-5 w-5 text-blue-500" />, color: "border-blue-200 bg-blue-50" }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>财务洞察</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const { icon, color } = getInsightIcon(insight)
            return (
              <div key={index} className={`p-4 border rounded-lg flex items-start gap-3 ${color}`}>
                {icon}
                <p>{insight}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
