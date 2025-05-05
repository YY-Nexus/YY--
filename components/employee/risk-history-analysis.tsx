"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Calendar, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RiskHistoryAnalysisProps {
  history: Array<{
    date: string
    score: number
    factors: Record<string, number>
  }>
  predictions?: Array<{
    month: string
    score: number
  }>
}

export function RiskHistoryAnalysis({ history, predictions }: RiskHistoryAnalysisProps) {
  const [comparisonType, setComparisonType] = useState<"mom" | "yoy">("mom")
  const [timeRange, setTimeRange] = useState<"6m" | "1y" | "all">("6m")

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", { year: "numeric", month: "short" })
  }

  // 获取风险等级和颜色
  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: "低", color: "bg-green-500 text-white" }
    if (score < 50) return { level: "中", color: "bg-yellow-500 text-white" }
    if (score < 70) return { level: "高", color: "bg-orange-500 text-white" }
    return { level: "极高", color: "bg-red-500 text-white" }
  }

  // 获取趋势图标和颜色
  const getTrendIndicator = (value: number) => {
    if (value > 5) return { icon: <TrendingUp className="h-4 w-4" />, color: "text-red-600" }
    if (value < -5) return { icon: <TrendingDown className="h-4 w-4" />, color: "text-green-600" }
    return { icon: <ArrowUpDown className="h-4 w-4" />, color: "text-gray-600" }
  }

  // 根据时间范围筛选历史数据
  const getFilteredHistory = () => {
    if (timeRange === "all") return history

    const now = new Date()
    const cutoffDate = new Date()

    if (timeRange === "6m") {
      cutoffDate.setMonth(now.getMonth() - 6)
    } else if (timeRange === "1y") {
      cutoffDate.setFullYear(now.getFullYear() - 1)
    }

    return history.filter((record) => new Date(record.date) >= cutoffDate)
  }

  const filteredHistory = getFilteredHistory()

  // 计算环比变化
  const calculateMoMChange = () => {
    const result = []

    for (let i = 1; i < filteredHistory.length; i++) {
      const current = filteredHistory[i]
      const previous = filteredHistory[i - 1]

      const scoreChange = current.score - previous.score
      const scoreChangePercent = previous.score !== 0 ? (scoreChange / previous.score) * 100 : 0

      const factorChanges: Record<string, { value: number; percent: number }> = {}

      for (const [factor, value] of Object.entries(current.factors)) {
        if (previous.factors[factor] !== undefined) {
          const change = value - previous.factors[factor]
          const changePercent = previous.factors[factor] !== 0 ? (change / previous.factors[factor]) * 100 : 0

          factorChanges[factor] = {
            value: change,
            percent: changePercent,
          }
        }
      }

      result.push({
        currentDate: current.date,
        previousDate: previous.date,
        scoreChange,
        scoreChangePercent,
        factorChanges,
      })
    }

    return result
  }

  // 计算同比变化
  const calculateYoYChange = () => {
    const result = []

    for (let i = 0; i < filteredHistory.length; i++) {
      const current = filteredHistory[i]
      const currentDate = new Date(current.date)

      // 查找去年同期的记录
      const previousYearDate = new Date(currentDate)
      previousYearDate.setFullYear(currentDate.getFullYear() - 1)

      // 查找日期最接近的记录
      const previousYearRecord = history.find((record) => {
        const recordDate = new Date(record.date)
        return Math.abs(recordDate.getTime() - previousYearDate.getTime()) < 45 * 24 * 60 * 60 * 1000 // 45天内
      })

      if (previousYearRecord) {
        const scoreChange = current.score - previousYearRecord.score
        const scoreChangePercent = previousYearRecord.score !== 0 ? (scoreChange / previousYearRecord.score) * 100 : 0

        const factorChanges: Record<string, { value: number; percent: number }> = {}

        for (const [factor, value] of Object.entries(current.factors)) {
          if (previousYearRecord.factors[factor] !== undefined) {
            const change = value - previousYearRecord.factors[factor]
            const changePercent =
              previousYearRecord.factors[factor] !== 0 ? (change / previousYearRecord.factors[factor]) * 100 : 0

            factorChanges[factor] = {
              value: change,
              percent: changePercent,
            }
          }
        }

        result.push({
          currentDate: current.date,
          previousDate: previousYearRecord.date,
          scoreChange,
          scoreChangePercent,
          factorChanges,
        })
      }
    }

    return result
  }

  const comparisonData = comparisonType === "mom" ? calculateMoMChange() : calculateYoYChange()

  // 计算风险评分统计数据
  const calculateRiskStats = () => {
    if (filteredHistory.length === 0) return null

    const scores = filteredHistory.map((record) => record.score)

    const min = Math.min(...scores)
    const max = Math.max(...scores)
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length

    const latest = scores[scores.length - 1]
    const first = scores[0]
    const overallChange = latest - first
    const overallChangePercent = first !== 0 ? (overallChange / first) * 100 : 0

    return {
      min,
      max,
      avg: Math.round(avg * 10) / 10,
      latest,
      overallChange,
      overallChangePercent,
    }
  }

  const riskStats = calculateRiskStats()

  // 获取因素的中文名称
  const getFactorName = (factor: string): string => {
    const factorNames: Record<string, string> = {
      engagement: "工作投入度",
      performance: "工作表现",
      satisfaction: "工作满意度",
    }

    return factorNames[factor] || factor
  }

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">风险评分历史分析</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">近6个月</SelectItem>
              <SelectItem value="1y">近1年</SelectItem>
              <SelectItem value="all">全部数据</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comparison">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="comparison">对比分析</TabsTrigger>
            <TabsTrigger value="stats">统计分析</TabsTrigger>
            <TabsTrigger value="prediction">趋势预测</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium">风险评分变化对比</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={comparisonType === "mom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setComparisonType("mom")}
                  >
                    环比
                  </Button>
                  <Button
                    variant={comparisonType === "yoy" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setComparisonType("yoy")}
                  >
                    同比
                  </Button>
                </div>
              </div>

              {comparisonData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  没有足够的历史数据进行{comparisonType === "mom" ? "环比" : "同比"}分析
                </div>
              ) : (
                <div className="space-y-4">
                  {comparisonData.map((item, index) => {
                    const { icon, color } = getTrendIndicator(item.scoreChange)

                    return (
                      <Card key={index} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="font-medium">{formatDate(item.currentDate)}</span>
                              <span className="text-muted-foreground mx-2">vs</span>
                              <span className="text-muted-foreground">{formatDate(item.previousDate)}</span>
                            </div>
                            <Badge variant="outline" className={cn("font-normal", color)}>
                              <span className="flex items-center">
                                {icon}
                                <span className="ml-1">
                                  {item.scoreChange > 0 ? "+" : ""}
                                  {item.scoreChange}({item.scoreChangePercent > 0 ? "+" : ""}
                                  {item.scoreChangePercent.toFixed(1)}%)
                                </span>
                              </span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {Object.entries(item.factorChanges).map(([factor, change]) => {
                              const { icon, color } = getTrendIndicator(change.value)

                              return (
                                <div key={factor} className="flex justify-between items-center p-2 border rounded">
                                  <span className="text-sm">{getFactorName(factor)}</span>
                                  <Badge variant="outline" className={cn("font-normal", color)}>
                                    <span className="flex items-center">
                                      {icon}
                                      <span className="ml-1">
                                        {change.value > 0 ? "+" : ""}
                                        {change.value}({change.percent > 0 ? "+" : ""}
                                        {change.percent.toFixed(1)}%)
                                      </span>
                                    </span>
                                  </Badge>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            {!riskStats ? (
              <div className="text-center py-8 text-muted-foreground">没有足够的历史数据进行统计分析</div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border border-gray-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-muted-foreground mb-1">最新风险评分</div>
                      <div className="text-2xl font-bold">{riskStats.latest}</div>
                      <Badge className={cn("mt-1", getRiskLevel(riskStats.latest).color)}>
                        {getRiskLevel(riskStats.latest).level}风险
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-muted-foreground mb-1">平均风险评分</div>
                      <div className="text-2xl font-bold">{riskStats.avg}</div>
                      <Badge className={cn("mt-1", getRiskLevel(riskStats.avg).color)}>
                        {getRiskLevel(riskStats.avg).level}风险
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-muted-foreground mb-1">最高风险评分</div>
                      <div className="text-2xl font-bold">{riskStats.max}</div>
                      <Badge className={cn("mt-1", getRiskLevel(riskStats.max).color)}>
                        {getRiskLevel(riskStats.max).level}风险
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-muted-foreground mb-1">最低风险评分</div>
                      <div className="text-2xl font-bold">{riskStats.min}</div>
                      <Badge className={cn("mt-1", getRiskLevel(riskStats.min).color)}>
                        {getRiskLevel(riskStats.min).level}风险
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-md font-medium mb-4">整体变化趋势</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">起始评分</div>
                        <div className="text-lg font-medium">{filteredHistory[0].score}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(filteredHistory[0].date)}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">变化</div>
                        <div
                          className={cn(
                            "text-lg font-medium",
                            riskStats.overallChange > 0
                              ? "text-red-600"
                              : riskStats.overallChange < 0
                                ? "text-green-600"
                                : "text-gray-600",
                          )}
                        >
                          {riskStats.overallChange > 0 ? "+" : ""}
                          {riskStats.overallChange}({riskStats.overallChangePercent > 0 ? "+" : ""}
                          {riskStats.overallChangePercent.toFixed(1)}%)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {timeRange === "6m" ? "近6个月" : timeRange === "1y" ? "近1年" : "全部时间"}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">最新评分</div>
                        <div className="text-lg font-medium">{riskStats.latest}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(filteredHistory[filteredHistory.length - 1].date)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-md font-medium mb-4">风险因素变化分析</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.keys(filteredHistory[0].factors).map((factor) => {
                      const firstValue = filteredHistory[0].factors[factor]
                      const latestValue = filteredHistory[filteredHistory.length - 1].factors[factor]
                      const change = latestValue - firstValue
                      const changePercent = firstValue !== 0 ? (change / firstValue) * 100 : 0

                      const { icon, color } = getTrendIndicator(change)

                      return (
                        <Card key={factor} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="font-medium mb-2">{getFactorName(factor)}</div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm">
                                <div className="text-muted-foreground">起始值</div>
                                <div>{firstValue}</div>
                              </div>

                              <Badge variant="outline" className={cn("font-normal", color)}>
                                <span className="flex items-center">
                                  {icon}
                                  <span className="ml-1">
                                    {change > 0 ? "+" : ""}
                                    {change}({changePercent > 0 ? "+" : ""}
                                    {changePercent.toFixed(1)}%)
                                  </span>
                                </span>
                              </Badge>

                              <div className="text-sm text-right">
                                <div className="text-muted-foreground">最新值</div>
                                <div>{latestValue}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="prediction">
            {!predictions || predictions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">没有可用的风险预测数据</div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-start gap-3">
                    <div>
                      <h4 className="font-medium text-blue-800">风险趋势预测</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        基于历史数据和机器学习算法，预测未来6个月的风险评分趋势。预测结果仅供参考，实际风险可能受多种因素影响而变化。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {predictions.map((prediction, index) => {
                    const { level, color } = getRiskLevel(prediction.score)

                    return (
                      <Card key={index} className="border border-gray-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-sm text-muted-foreground mb-1">{prediction.month}</div>
                          <div className="text-2xl font-bold">{prediction.score}</div>
                          <Badge className={cn("mt-1", color)}>{level}风险</Badge>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-md font-medium mb-4">预测分析</h3>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">当前风险评分</div>
                        <div className="font-medium">{filteredHistory[filteredHistory.length - 1].score}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm">预测最高风险评分</div>
                        <div className="font-medium">{Math.max(...predictions.map((p) => p.score))}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm">预测最低风险评分</div>
                        <div className="font-medium">{Math.min(...predictions.map((p) => p.score))}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm">预测平均风险评分</div>
                        <div className="font-medium">
                          {Math.round(predictions.reduce((sum, p) => sum + p.score, 0) / predictions.length)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm">预测趋势</div>
                        <div className="font-medium">
                          {predictions[predictions.length - 1].score > filteredHistory[filteredHistory.length - 1].score
                            ? "上升趋势"
                            : predictions[predictions.length - 1].score <
                                filteredHistory[filteredHistory.length - 1].score
                              ? "下降趋势"
                              : "保持稳定"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
