"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AlertTriangle, Download, Eye, List } from "lucide-react"
import { useState } from "react"

interface AnomalyData {
  mean: number
  stdDev: number
  threshold: number
  anomalies: {
    value: number
    date: string
    deviation: number
  }[]
  distribution: {
    mean: number
    upperBound: number
    lowerBound: number
  }
}

interface AnomalyDetectionProps {
  title: string
  description?: string
  data: AnomalyData
  timeSeriesData: Array<{
    date: string
    value: number
  }>
  metricName: string
  className?: string
}

export function AnomalyDetection({
  title,
  description,
  data,
  timeSeriesData,
  metricName,
  className = "",
}: AnomalyDetectionProps) {
  const [activeTab, setActiveTab] = useState("chart")

  // 准备图表数据
  const chartData = timeSeriesData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("zh-CN"),
    [metricName]: item.value,
    isAnomaly: data.anomalies.some((a) => a.date === item.date),
  }))

  // 找出异常点
  const anomalyPoints = chartData.filter((item) => item.isAnomaly)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            检测到 {data.anomalies.length} 个异常
          </Badge>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chart" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              图表视图
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              列表视图
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="mt-0">
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  [metricName]: {
                    label: metricName,
                    color: "hsl(var(--chart-1))",
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
                      y={data.distribution.mean}
                      stroke="#888"
                      strokeDasharray="3 3"
                      label={{ value: "均值", position: "right" }}
                    />
                    <ReferenceLine
                      y={data.distribution.upperBound}
                      stroke="#ff7300"
                      strokeDasharray="3 3"
                      label={{ value: "上限", position: "right" }}
                    />
                    <ReferenceLine
                      y={data.distribution.lowerBound}
                      stroke="#ff7300"
                      strokeDasharray="3 3"
                      label={{ value: "下限", position: "right" }}
                    />
                    <ReferenceArea
                      y1={data.distribution.lowerBound}
                      y2={data.distribution.upperBound}
                      fill="#eee"
                      fillOpacity={0.2}
                    />
                    <Line
                      type="monotone"
                      dataKey={metricName}
                      stroke="var(--color-metricName)"
                      name={metricName}
                      strokeWidth={2}
                      dot={(props) => {
                        const { cx, cy, payload } = props
                        if (payload.isAnomaly) {
                          return (
                            <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="red">
                              <circle cx="10" cy="10" r="6" stroke="red" strokeWidth="2" fill="white" />
                              <path d="M10,6 L10,10 M10,12 L10,14" stroke="red" strokeWidth="2" />
                            </svg>
                          )
                        }
                        return <circle cx={cx} cy={cy} r={3} fill="var(--color-metricName)" />
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            {data.anomalies.length > 0 ? (
              <div className="space-y-2">
                {data.anomalies.map((anomaly, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4 flex gap-4">
                      <div className="rounded-full p-2 h-fit bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">异常值: {anomaly.value.toFixed(2)}</h4>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            偏差: {anomaly.deviation.toFixed(2)}σ
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          日期: {new Date(anomaly.date).toLocaleDateString("zh-CN")}
                        </p>
                        <p className="text-sm">
                          {anomaly.value > data.mean
                            ? `高于均值 ${(((anomaly.value - data.mean) / data.mean) * 100).toFixed(2)}%`
                            : `低于均值 ${(((data.mean - anomaly.value) / data.mean) * 100).toFixed(2)}%`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">未检测到异常值</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <span>异常检测阈值: {data.threshold} 个标准差</span>
          <Button variant="ghost" size="sm" className="h-auto p-0">
            <Download className="h-3 w-3 mr-1" />
            导出异常数据
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
