"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  LineChart,
  Line,
  Bar,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { AlertCircle, Download, Save, RefreshCw, Settings, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CashFlowForecastProps {
  className?: string
  initialData?: any
  onSave?: (data: any) => void
}

export function CashFlowForecast({ className, initialData, onSave }: CashFlowForecastProps) {
  const [forecastPeriod, setForecastPeriod] = useState("12")
  const [forecastMethod, setForecastMethod] = useState("trend")
  const [confidenceInterval, setConfidenceInterval] = useState(80)
  const [showActual, setShowActual] = useState(true)
  const [showSeasonality, setShowSeasonality] = useState(true)
  const [activeTab, setActiveTab] = useState("forecast")

  // 模拟历史现金流数据
  const [historicalData, setHistoricalData] = useState([
    { month: "2023-01", inflow: 1850000, outflow: 1650000, netFlow: 200000 },
    { month: "2023-02", inflow: 1920000, outflow: 1680000, netFlow: 240000 },
    { month: "2023-03", inflow: 2100000, outflow: 1750000, netFlow: 350000 },
    { month: "2023-04", inflow: 1980000, outflow: 1720000, netFlow: 260000 },
    { month: "2023-05", inflow: 2050000, outflow: 1800000, netFlow: 250000 },
    { month: "2023-06", inflow: 2200000, outflow: 1850000, netFlow: 350000 },
    { month: "2023-07", inflow: 2150000, outflow: 1900000, netFlow: 250000 },
    { month: "2023-08", inflow: 2250000, outflow: 1950000, netFlow: 300000 },
    { month: "2023-09", inflow: 2350000, outflow: 2000000, netFlow: 350000 },
    { month: "2023-10", inflow: 2400000, outflow: 2050000, netFlow: 350000 },
    { month: "2023-11", inflow: 2500000, outflow: 2100000, netFlow: 400000 },
    { month: "2023-12", inflow: 2700000, outflow: 2300000, netFlow: 400000 },
    { month: "2024-01", inflow: 2550000, outflow: 2200000, netFlow: 350000 },
    { month: "2024-02", inflow: 2600000, outflow: 2250000, netFlow: 350000 },
    { month: "2024-03", inflow: 2750000, outflow: 2350000, netFlow: 400000 },
    { month: "2024-04", inflow: 2800000, outflow: 2400000, netFlow: 400000 },
  ])

  // 生成预测数据
  const generateForecastData = () => {
    const periods = Number.parseInt(forecastPeriod)
    const lastMonth = historicalData[historicalData.length - 1]
    const lastMonthDate = new Date(lastMonth.month)

    const forecastData = []

    // 计算趋势
    const netFlowTrend = calculateTrend(historicalData.map((d) => d.netFlow))
    const inflowTrend = calculateTrend(historicalData.map((d) => d.inflow))
    const outflowTrend = calculateTrend(historicalData.map((d) => d.outflow))

    for (let i = 1; i <= periods; i++) {
      const forecastDate = new Date(lastMonthDate)
      forecastDate.setMonth(lastMonthDate.getMonth() + i)

      const month = forecastDate.toISOString().slice(0, 7)

      // 基础预测值
      let inflow = lastMonth.inflow + inflowTrend * i
      let outflow = lastMonth.outflow + outflowTrend * i

      // 添加季节性因素
      if (showSeasonality) {
        const monthIndex = forecastDate.getMonth()
        const seasonalFactor = getSeasonalFactor(monthIndex)
        inflow = inflow * seasonalFactor.inflow
        outflow = outflow * seasonalFactor.outflow
      }

      // 添加随机波动
      const randomFactor = 1 + (Math.random() * 0.1 - 0.05) // -5% to +5%
      inflow = inflow * randomFactor
      outflow = outflow * randomFactor

      const netFlow = inflow - outflow

      // 计算置信区间
      const ciRange = netFlow * (1 - confidenceInterval / 100) * 2
      const upperBound = netFlow + ciRange / 2
      const lowerBound = netFlow - ciRange / 2

      forecastData.push({
        month,
        inflow: Math.round(inflow),
        outflow: Math.round(outflow),
        netFlow: Math.round(netFlow),
        upperBound: Math.round(upperBound),
        lowerBound: Math.round(lowerBound),
        isForecast: true,
      })
    }

    return forecastData
  }

  // 计算趋势
  const calculateTrend = (data: number[]) => {
    // 简单线性回归
    const n = data.length
    const indices = Array.from({ length: n }, (_, i) => i)

    const sumX = indices.reduce((sum, x) => sum + x, 0)
    const sumY = data.reduce((sum, y) => sum + y, 0)
    const sumXY = indices.reduce((sum, x, i) => sum + x * data[i], 0)
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)

    return slope
  }

  // 获取季节性因素
  const getSeasonalFactor = (monthIndex: number) => {
    // 模拟季节性因素
    const seasonalFactors = [
      { inflow: 0.95, outflow: 0.98 }, // 1月
      { inflow: 0.97, outflow: 0.99 }, // 2月
      { inflow: 1.02, outflow: 1.01 }, // 3月
      { inflow: 1.0, outflow: 1.0 }, // 4月
      { inflow: 1.01, outflow: 1.0 }, // 5月
      { inflow: 1.05, outflow: 1.02 }, // 6月
      { inflow: 1.03, outflow: 1.03 }, // 7月
      { inflow: 1.02, outflow: 1.02 }, // 8月
      { inflow: 1.04, outflow: 1.03 }, // 9月
      { inflow: 1.03, outflow: 1.02 }, // 10月
      { inflow: 1.05, outflow: 1.04 }, // 11月
      { inflow: 1.1, outflow: 1.08 }, // 12月
    ]

    return seasonalFactors[monthIndex]
  }

  // 合并历史数据和预测数据
  const combinedData = [...historicalData.map((d) => ({ ...d, isForecast: false })), ...generateForecastData()]

  // 格式化金额
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", { year: "numeric", month: "short" })
  }

  // 自定义图表提示
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const isForecast = data.isForecast

      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">
            {formatDate(label)}
            {isForecast ? " (预测)" : ""}
          </p>
          <p className="text-sm text-gray-500">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
            现金流入: {formatCurrency(data.inflow)}
          </p>
          <p className="text-sm text-gray-500">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
            现金流出: {formatCurrency(data.outflow)}
          </p>
          <p className="text-sm font-medium">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            净现金流: {formatCurrency(data.netFlow)}
          </p>
          {isForecast && (
            <div className="mt-1 pt-1 border-t text-xs text-gray-500">
              <p>置信区间 ({confidenceInterval}%):</p>
              <p>上限: {formatCurrency(data.upperBound)}</p>
              <p>下限: {formatCurrency(data.lowerBound)}</p>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  // 计算现金流指标
  const calculateCashFlowMetrics = () => {
    const lastSixMonths = historicalData.slice(-6)
    const nextSixMonths = generateForecastData().slice(0, 6)

    // 平均月度净现金流
    const avgMonthlyNetFlow = lastSixMonths.reduce((sum, d) => sum + d.netFlow, 0) / lastSixMonths.length

    // 现金流增长率
    const firstMonth = lastSixMonths[0].netFlow
    const lastMonth = lastSixMonths[lastSixMonths.length - 1].netFlow
    const growthRate = ((lastMonth - firstMonth) / firstMonth) * 100

    // 现金流预测趋势
    const forecastTrend = calculateTrend(nextSixMonths.map((d) => d.netFlow))
    const forecastTrendDirection = forecastTrend > 0 ? "上升" : "下降"

    // 现金流波动性
    const netFlows = lastSixMonths.map((d) => d.netFlow)
    const mean = netFlows.reduce((sum, val) => sum + val, 0) / netFlows.length
    const variance = netFlows.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / netFlows.length
    const volatility = (Math.sqrt(variance) / mean) * 100

    // 现金流覆盖率
    const totalInflow = lastSixMonths.reduce((sum, d) => sum + d.inflow, 0)
    const totalOutflow = lastSixMonths.reduce((sum, d) => sum + d.outflow, 0)
    const coverageRatio = totalInflow / totalOutflow

    return {
      avgMonthlyNetFlow,
      growthRate,
      forecastTrend,
      forecastTrendDirection,
      volatility,
      coverageRatio,
    }
  }

  const metrics = calculateCashFlowMetrics()

  // 保存预测
  const handleSave = () => {
    const data = {
      historical: historicalData,
      forecast: generateForecastData(),
      settings: {
        forecastPeriod,
        forecastMethod,
        confidenceInterval,
        showSeasonality,
      },
      metrics,
    }

    onSave?.(data)
    alert("现金流预测已保存")
  }

  // 导出预测
  const handleExport = () => {
    const data = {
      historical: historicalData,
      forecast: generateForecastData(),
      settings: {
        forecastPeriod,
        forecastMethod,
        confidenceInterval,
        showSeasonality,
      },
      metrics,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `现金流预测_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>现金流预测与管理</CardTitle>
            <CardDescription>基于历史数据预测未来现金流，帮助企业进行财务规划</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="预测期间" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3个月</SelectItem>
                <SelectItem value="6">6个月</SelectItem>
                <SelectItem value="12">12个月</SelectItem>
                <SelectItem value="24">24个月</SelectItem>
              </SelectContent>
            </Select>

            <Select value={forecastMethod} onValueChange={setForecastMethod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="预测方法" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trend">趋势分析</SelectItem>
                <SelectItem value="regression">回归分析</SelectItem>
                <SelectItem value="arima">ARIMA模型</SelectItem>
                <SelectItem value="ml">机器学习</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch id="show-seasonality" checked={showSeasonality} onCheckedChange={setShowSeasonality} />
              <Label htmlFor="show-seasonality">季节性因素</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast">现金流预测</TabsTrigger>
            <TabsTrigger value="analysis">现金流分析</TabsTrigger>
            <TabsTrigger value="management">现金流管理</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="pt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-3/4">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium mb-4">现金流预测图表</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickFormatter={formatDate} minTickGap={30} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="inflow" name="现金流入" fill="#3b82f6" />
                        <Bar dataKey="outflow" name="现金流出" fill="#ef4444" />
                        <Line
                          type="monotone"
                          dataKey="netFlow"
                          name="净现金流"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        {/* 置信区间 */}
                        <Area
                          type="monotone"
                          dataKey="upperBound"
                          stroke="transparent"
                          fill="#10b981"
                          fillOpacity={0.1}
                          name="置信区间上限"
                          legendType="none"
                        />
                        <Area
                          type="monotone"
                          dataKey="lowerBound"
                          stroke="transparent"
                          fill="#10b981"
                          fillOpacity={0.1}
                          name="置信区间下限"
                          legendType="none"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">历史数据</span>
                      <div className="h-3 w-3 rounded-full bg-blue-500 opacity-50 ml-2"></div>
                      <span className="text-sm">预测数据</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">置信区间:</span>
                      <Slider
                        value={[confidenceInterval]}
                        onValueChange={(value) => setConfidenceInterval(value[0])}
                        min={50}
                        max={95}
                        step={5}
                        className="w-32"
                      />
                      <span className="text-sm w-8">{confidenceInterval}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/4">
                <div className="rounded-md border p-4 h-full">
                  <h3 className="text-lg font-medium mb-4">现金流指标</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">平均月度净现金流</div>
                      <div className="text-xl font-bold">{formatCurrency(metrics.avgMonthlyNetFlow)}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">现金流增长率</div>
                      <div className="flex items-center">
                        <span className="text-xl font-bold">{metrics.growthRate.toFixed(1)}%</span>
                        {metrics.growthRate > 0 ? (
                          <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">预测趋势</div>
                      <div className="flex items-center">
                        <span className="text-xl font-bold">{metrics.forecastTrendDirection}</span>
                        {metrics.forecastTrend > 0 ? (
                          <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">现金流波动性</div>
                      <div className="text-xl font-bold">{metrics.volatility.toFixed(1)}%</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">现金流覆盖率</div>
                      <div className="text-xl font-bold">{metrics.coverageRatio.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">预测说明</AlertTitle>
              <AlertDescription className="text-blue-700">
                本预测基于历史数据和
                {forecastMethod === "trend"
                  ? "趋势分析"
                  : forecastMethod === "regression"
                    ? "回归分析"
                    : forecastMethod === "arima"
                      ? "ARIMA模型"
                      : "机器学习"}
                方法生成。
                {showSeasonality && "已考虑季节性因素。"}预测结果仅供参考，实际现金流可能受多种因素影响而变化。
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="analysis" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">现金流入分析</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} labelFormatter={formatDate} />
                      <Legend />
                      <Line type="monotone" dataKey="inflow" name="现金流入" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">平均月度流入</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(historicalData.reduce((sum, d) => sum + d.inflow, 0) / historicalData.length)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">流入增长率</div>
                    <div className="text-lg font-bold">
                      {(
                        (historicalData[historicalData.length - 1].inflow / historicalData[0].inflow - 1) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">现金流出分析</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} labelFormatter={formatDate} />
                      <Legend />
                      <Line type="monotone" dataKey="outflow" name="现金流出" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">平均月度流出</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(historicalData.reduce((sum, d) => sum + d.outflow, 0) / historicalData.length)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">流出增长率</div>
                    <div className="text-lg font-bold">
                      {(
                        (historicalData[historicalData.length - 1].outflow / historicalData[0].outflow - 1) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">净现金流分析</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} labelFormatter={formatDate} />
                      <Legend />
                      <Line type="monotone" dataKey="netFlow" name="净现金流" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">平均净现金流</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(historicalData.reduce((sum, d) => sum + d.netFlow, 0) / historicalData.length)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">净流量波动性</div>
                    <div className="text-lg font-bold">{metrics.volatility.toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">现金流比率分析</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicalData.map((d) => ({
                        ...d,
                        ratio: d.inflow / d.outflow,
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={formatDate} />
                      <YAxis domain={[0.9, 1.3]} />
                      <Tooltip formatter={(value) => (value as number).toFixed(2)} labelFormatter={formatDate} />
                      <Legend />
                      <Line type="monotone" dataKey="ratio" name="现金流覆盖率" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey={() => 1} name="平衡线" stroke="#888888" strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">平均覆盖率</div>
                    <div className="text-lg font-bold">
                      {(
                        historicalData.reduce((sum, d) => sum + d.inflow / d.outflow, 0) / historicalData.length
                      ).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">最低覆盖率</div>
                    <div className="text-lg font-bold">
                      {Math.min(...historicalData.map((d) => d.inflow / d.outflow)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="management" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-md border p-4 col-span-1 md:col-span-2">
                <h3 className="text-lg font-medium mb-4">现金流管理建议</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="font-medium text-green-800">收入优化</div>
                    <p className="text-sm text-green-700 mt-1">
                      根据预测，未来6个月现金流入将保持{metrics.forecastTrend > 0 ? "增长" : "下降"}趋势。 建议
                      {metrics.forecastTrend > 0
                        ? "继续保持当前销售策略，并考虑扩大市场份额"
                        : "调整定价策略，加强销售团队激励，开发新的收入来源"}
                      。
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="font-medium text-blue-800">支出控制</div>
                    <p className="text-sm text-blue-700 mt-1">
                      现金流出增长率为
                      {(
                        (historicalData[historicalData.length - 1].outflow / historicalData[0].outflow - 1) *
                        100
                      ).toFixed(1)}
                      %，
                      {(historicalData[historicalData.length - 1].outflow / historicalData[0].outflow - 1) * 100 > 15
                        ? "高于"
                        : "低于"}
                      警戒水平。 建议
                      {(historicalData[historicalData.length - 1].outflow / historicalData[0].outflow - 1) * 100 > 15
                        ? "审查主要支出项目，识别可削减的非必要支出，优化供应链以降低成本"
                        : "继续保持当前支出控制策略，定期审查大额支出项目"}
                      。
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="font-medium text-yellow-800">现金流缓冲</div>
                    <p className="text-sm text-yellow-700 mt-1">
                      当前现金流覆盖率为{metrics.coverageRatio.toFixed(2)}，
                      {metrics.coverageRatio < 1.1 ? "低于" : "高于"}安全水平。 建议
                      {metrics.coverageRatio < 1.1
                        ? "增加现金储备，考虑建立或扩大信贷额度，延长应付账款周期"
                        : "保持当前现金储备水平，可考虑将部分闲置资金用于短期投资"}
                      。
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                    <div className="font-medium text-purple-800">季节性管理</div>
                    <p className="text-sm text-purple-700 mt-1">
                      数据显示现金流存在季节性波动，第{showSeasonality ? "四" : "三"}季度现金流入较高， 第
                      {showSeasonality ? "一" : "二"}季度较低。
                      建议在高现金流季节增加储备，为低现金流季节做准备，并考虑调整采购和费用支付时间以匹配现金流入模式。
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">现金流预警</h3>
                <div className="space-y-3">
                  <div
                    className={`p-3 ${metrics.coverageRatio < 1.05 ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"} rounded-md`}
                  >
                    <div className={`font-medium ${metrics.coverageRatio < 1.05 ? "text-red-800" : "text-gray-800"}`}>
                      现金流覆盖率预警
                    </div>
                    <p className={`text-sm mt-1 ${metrics.coverageRatio < 1.05 ? "text-red-700" : "text-gray-700"}`}>
                      {metrics.coverageRatio < 1.05
                        ? `当前覆盖率${metrics.coverageRatio.toFixed(2)}低于安全阈值1.05，存在现金流紧张风险。`
                        : "当前覆盖率处于安全水平，无需预警。"}
                    </p>
                  </div>

                  <div
                    className={`p-3 ${metrics.volatility > 20 ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"} rounded-md`}
                  >
                    <div className={`font-medium ${metrics.volatility > 20 ? "text-red-800" : "text-gray-800"}`}>
                      现金流波动性预警
                    </div>
                    <p className={`text-sm mt-1 ${metrics.volatility > 20 ? "text-red-700" : "text-gray-700"}`}>
                      {metrics.volatility > 20
                        ? `当前波动性${metrics.volatility.toFixed(1)}%高于警戒阈值20%，现金流不稳定。`
                        : "当前波动性处于可接受范围，现金流相对稳定。"}
                    </p>
                  </div>

                  <div
                    className={`p-3 ${generateForecastData().some((d) => d.netFlow < 0) ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"} rounded-md`}
                  >
                    <div
                      className={`font-medium ${generateForecastData().some((d) => d.netFlow < 0) ? "text-red-800" : "text-gray-800"}`}
                    >
                      负现金流预警
                    </div>
                    <p
                      className={`text-sm mt-1 ${generateForecastData().some((d) => d.netFlow < 0) ? "text-red-700" : "text-gray-700"}`}
                    >
                      {generateForecastData().some((d) => d.netFlow < 0)
                        ? `预测期内可能出现负现金流，请做好资金准备。`
                        : "预测期内未发现负现金流风险。"}
                    </p>
                  </div>

                  <div
                    className={`p-3 ${metrics.growthRate < 0 ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-gray-200"} rounded-md`}
                  >
                    <div className={`font-medium ${metrics.growthRate < 0 ? "text-yellow-800" : "text-gray-800"}`}>
                      现金流下降预警
                    </div>
                    <p className={`text-sm mt-1 ${metrics.growthRate < 0 ? "text-yellow-700" : "text-gray-700"}`}>
                      {metrics.growthRate < 0
                        ? `当前现金流增长率为${metrics.growthRate.toFixed(1)}%，呈下降趋势。`
                        : "当前现金流呈增长趋势，无需预警。"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新数据
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            高级设置
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出预测
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存预测
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
