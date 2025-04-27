"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedCounter } from "@/components/animated-counter"

interface FinancialSummaryCardProps {
  title: string
  value: number
  change: number
  type: "revenue" | "expenses" | "profit" | "cashflow"
  className?: string
}

export function FinancialSummaryCard({ title, value, change, type, className }: FinancialSummaryCardProps) {
  // 格式化金额为人民币格式
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // 根据类型确定颜色
  const getTypeColor = () => {
    switch (type) {
      case "revenue":
        return "text-blue-600"
      case "expenses":
        return "text-red-600"
      case "profit":
        return "text-green-600"
      case "cashflow":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn("text-2xl font-bold", getTypeColor())}>
            <AnimatedCounter value={value} formatter={formatCurrency} />
          </div>
          <div className="flex items-center text-xs font-medium">
            {change > 0 ? (
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span className={change > 0 ? "text-green-500" : "text-red-500"}>{Math.abs(change).toFixed(1)}%</span>
            <span className="ml-1 text-muted-foreground">相比上期</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
