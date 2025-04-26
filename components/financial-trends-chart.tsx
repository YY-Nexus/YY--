"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TrendData {
  month: string
  revenue: number
  expenses: number
  profit: number
}

interface FinancialTrendsChartProps {
  data: TrendData[]
  className?: string
}

export function FinancialTrendsChart({ data, className }: FinancialTrendsChartProps) {
  // 格式化金额为人民币格式
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{label}</p>
          <p className="text-[#8884d8]">收入: {formatCurrency(payload[0].value)}</p>
          <p className="text-[#82ca9d]">支出: {formatCurrency(payload[1].value)}</p>
          <p className="text-[#ff7300]">利润: {formatCurrency(payload[2].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>财务趋势</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="收入" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="expenses" name="支出" stroke="#82ca9d" />
              <Line type="monotone" dataKey="profit" name="利润" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
