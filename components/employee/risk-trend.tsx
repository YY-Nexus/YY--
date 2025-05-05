"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface RiskTrendProps {
  history: Array<{
    date: string
    score: number
    factors: Record<string, number>
  }>
}

export function RiskTrend({ history }: RiskTrendProps) {
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}月`
  }

  // 准备图表数据
  const chartData = history.map((item) => ({
    name: formatDate(item.date),
    风险分: item.score,
  }))

  // 获取风险趋势
  const getScoreTrend = () => {
    if (history.length < 2) return { trend: "持平", color: "text-gray-600" }

    const lastScore = history[history.length - 1].score
    const prevScore = history[history.length - 2].score
    const diff = lastScore - prevScore

    if (diff > 5) return { trend: "上升", color: "text-red-600" }
    if (diff < -5) return { trend: "下降", color: "text-green-600" }
    return { trend: "持平", color: "text-gray-600" }
  }

  const { trend, color } = getScoreTrend()

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">风险趋势 (近6个月)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip formatter={(value: number) => [`${value}`, "风险分"]} labelFormatter={(label) => `${label}`} />
              <Line
                type="monotone"
                dataKey="风险分"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 text-center">
          <span className="text-sm text-muted-foreground">
            与上月相比: <span className={color}>{trend}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
