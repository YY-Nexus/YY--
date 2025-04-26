"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface BreakdownItem {
  category: string
  amount: number
  percentage: number
}

interface FinancialBreakdownTableProps {
  revenueData: BreakdownItem[]
  expensesData: BreakdownItem[]
  className?: string
}

export function FinancialBreakdownTable({ revenueData, expensesData, className }: FinancialBreakdownTableProps) {
  // 格式化金额为人民币格式
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{payload[0].name}</p>
          <p>金额: {formatCurrency(payload[0].value)}</p>
          <p>占比: {payload[0].payload.percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>财务明细分析</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenue">收入明细</TabsTrigger>
            <TabsTrigger value="expenses">支出明细</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">类别</th>
                      <th className="text-right py-2">金额</th>
                      <th className="text-right py-2">占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.category}</td>
                        <td className="text-right py-2">{formatCurrency(item.amount)}</td>
                        <td className="text-right py-2">{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="expenses" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                    >
                      {expensesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">类别</th>
                      <th className="text-right py-2">金额</th>
                      <th className="text-right py-2">占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expensesData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.category}</td>
                        <td className="text-right py-2">{formatCurrency(item.amount)}</td>
                        <td className="text-right py-2">{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
