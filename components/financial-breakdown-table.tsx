"use client"
import { Progress } from "@/components/ui/progress"

interface BreakdownItem {
  category: string
  amount: number
  percentage: number
}

interface FinancialBreakdownTableProps {
  data: BreakdownItem[]
}

export function FinancialBreakdownTable({ data }: FinancialBreakdownTableProps) {
  // 格式化金额为人民币格式
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // 将数据分为收入和支出
  const incomeItems = data.filter((item) => item.category.includes("收入"))
  const expenseItems = data.filter((item) => !item.category.includes("收入"))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium">收入明细</h3>
        <div className="space-y-2">
          {incomeItems.map((item, index) => (
            <div key={index} className="grid grid-cols-8 gap-2 text-sm">
              <div className="col-span-3">{item.category}</div>
              <div className="col-span-2 text-right font-medium">{formatCurrency(item.amount)}</div>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Progress value={item.percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground w-9 text-right">{item.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">支出明细</h3>
        <div className="space-y-2">
          {expenseItems.map((item, index) => (
            <div key={index} className="grid grid-cols-8 gap-2 text-sm">
              <div className="col-span-3">{item.category}</div>
              <div className="col-span-2 text-right font-medium">{formatCurrency(item.amount)}</div>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Progress value={item.percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground w-9 text-right">{item.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
