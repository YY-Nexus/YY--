"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download, Info } from "lucide-react"
import { useState } from "react"

interface PredictionData {
  historical: {
    x: number
    y: number
    date: string
  }[]
  predictions: {
    period: number
    value: number
    date: string
  }[]
  accuracy: number
  mape: number
}

interface PredictionChartProps {
  title: string
  description?: string
  data: PredictionData
  metricName: string
  timeRanges?: string[]
  className?: string
}

export function PredictionChart({
  title,
  description,
  data,
  metricName,
  timeRanges = ["6个月", "12个月", "24个月"],
  className = "",
}: PredictionChartProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0])

  // 准备图表数据
  const chartData = [
    ...data.historical.map((item) => ({
      date: new Date(item.date).toLocaleDateString("zh-CN"),
      [metricName]: item.y,
      type: "历史数据",
    })),
    ...data.predictions.map((item) => ({
      date: new Date(item.date).toLocaleDateString("zh-CN"),
      [metricName]: item.value,
      [`${metricName}预测`]: item.value,
      type: "预测数据",
    })),
  ]

  // 获取置信度标签颜色
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.8) return "bg-green-100 text-green-800"
    if (accuracy >= 0.6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  // 格式化准确度为百分比
  const formatAccuracy = (accuracy: number) => {
    return `${Math.round(accuracy * 100)}%`
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="预测周期" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={getAccuracyColor(data.accuracy)}>
            预测准确度: {formatAccuracy(data.accuracy)}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Info className="h-3 w-3 mr-1" />
            基于历史数据的模型验证
          </div>
        </div>

        <div className="h-[300px]">
          <ChartContainer
            config={{
              [metricName]: {
                label: "历史数据",
                color: "hsl(var(--chart-1))",
              },
              [`${metricName}预测`]: {
                label: "预测数据",
                color: "hsl(var(--chart-2))",
                dashed: true,
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <ReferenceLine
                  x={data.historical.length - 1}
                  stroke="#666"
                  strokeDasharray="3 3"
                  label={{ value: "当前", position: "top" }}
                />
                <Line
                  type="monotone"
                  dataKey={metricName}
                  stroke="var(--color-metricName)"
                  name="历史数据"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey={`${metricName}预测`}
                  stroke="var(--color-metricName预测)"
                  name="预测数据"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <span>预测基于 {data.historical.length} 个历史数据点</span>
          <Button variant="ghost" size="sm" className="h-auto p-0">
            <Download className="h-3 w-3 mr-1" />
            导出预测数据
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
