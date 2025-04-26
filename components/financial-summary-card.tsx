"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"

interface FinancialSummaryData {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  cashFlow: number
  assets: number
  liabilities: number
}

interface FinancialSummaryCardProps {
  data: FinancialSummaryData
  className?: string
}

export function FinancialSummaryCard({ data, className }: FinancialSummaryCardProps) {
  const profitMargin = (data.netProfit / data.totalRevenue) * 100
  const assetToLiabilityRatio = data.assets / data.liabilities

  // 格式化金额为人民币格式
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>财务概览</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">总收入</h3>
                <p className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">总支出</h3>
                <p className="text-2xl font-bold">{formatCurrency(data.totalExpenses)}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">净利润</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(data.netProfit)}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <CircularProgress
              value={profitMargin}
              maxValue={100}
              size={120}
              strokeWidth={10}
              label="利润率"
              valueLabel={`${profitMargin.toFixed(1)}%`}
              color="green"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">现金流</h3>
              <p className="text-2xl font-bold">{formatCurrency(data.cashFlow)}</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">资产</h3>
                <p className="text-2xl font-bold">{formatCurrency(data.assets)}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">负债</h3>
                <p className="text-2xl font-bold">{formatCurrency(data.liabilities)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
