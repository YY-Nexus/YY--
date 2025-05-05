"use client"

import { useState, useEffect } from "react"
import { useNavAnalytics } from "@/hooks/use-nav-analytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function NavAnalyticsDashboard() {
  const { getAnalyticsSummary, clearAnalyticsData } = useNavAnalytics()
  const [summary, setSummary] = useState(getAnalyticsSummary())

  useEffect(() => {
    setSummary(getAnalyticsSummary())
  }, [])

  const refreshData = () => {
    setSummary(getAnalyticsSummary())
  }

  const handleClearData = () => {
    clearAnalyticsData()
    refreshData()
  }

  // 格式化时间
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}小时 ${minutes % 60}分钟`
    } else if (minutes > 0) {
      return `${minutes}分钟 ${seconds % 60}秒`
    } else {
      return `${seconds}秒`
    }
  }

  // 格式化百分比
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>导航使用分析</CardTitle>
          <CardDescription>了解用户如何使用导航系统</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            刷新数据
          </Button>
          <Button variant="destructive" onClick={handleClearData}>
            清除数据
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pages">
          <TabsList className="mb-4">
            <TabsTrigger value="pages" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>页面访问</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              <span>功能使用</span>
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              <span>导航模式</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">平均会话时长</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatDuration(summary.averageSessionDuration)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">搜索使用率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(summary.searchUsageRate)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AI推荐点击率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(summary.aiRecommendationClickRate)}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>最常访问页面</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "访问次数",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={summary.mostVisitedPages}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">快捷键使用率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(summary.shortcutUsageRate)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">收藏夹使用率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(summary.favoriteUsageRate)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AI推荐点击率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(summary.aiRecommendationClickRate)}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>功能使用分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: "导航点击", value: 1 - summary.shortcutUsageRate - summary.favoriteUsageRate },
                          { name: "快捷键", value: summary.shortcutUsageRate },
                          { name: "收藏夹", value: summary.favoriteUsageRate },
                          { name: "搜索", value: summary.searchUsageRate },
                          { name: "AI推荐", value: summary.aiRecommendationClickRate },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: "导航点击", value: 1 - summary.shortcutUsageRate - summary.favoriteUsageRate },
                          { name: "快捷键", value: summary.shortcutUsageRate },
                          { name: "收藏夹", value: summary.favoriteUsageRate },
                          { name: "搜索", value: summary.searchUsageRate },
                          { name: "AI推荐", value: summary.aiRecommendationClickRate },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>常见导航路径</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={summary.navigationPatterns.map((pattern, index) => ({
                        name: `${pattern.from} → ${pattern.to}`,
                        value: pattern.count,
                        index,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
