"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FinancialSummaryCard } from "@/components/financial-summary-card"
import { FinancialTrendsChart } from "@/components/financial-trends-chart"
import { FinancialBreakdownTable } from "@/components/financial-breakdown-table"
import { FinancialMetricsGrid } from "@/components/financial-metrics-grid"
import { FinancialInsights } from "@/components/financial-insights"
import { fetchFinancialData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export default function DashboardPage() {
  const [period, setPeriod] = useState<string>("month")
  const [financialData, setFinancialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchFinancialData(period)
      setFinancialData(data)
    } catch (err) {
      console.error("获取数据失败:", err)
      setError("获取财务数据失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [period])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">财务仪表盘</h1>
            <p className="text-muted-foreground">欢迎回来，{user?.name || "用户"}。查看您的财务状况概览和关键指标。</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择时间段" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">日</SelectItem>
                <SelectItem value="week">周</SelectItem>
                <SelectItem value="month">月</SelectItem>
                <SelectItem value="quarter">季度</SelectItem>
                <SelectItem value="year">年</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">刷新数据</span>
            </Button>
          </div>
        </div>

        {error ? (
          <Card>
            <CardContent className="flex h-40 items-center justify-center">
              <p className="text-center text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="analytics">分析</TabsTrigger>
              <TabsTrigger value="reports">报告</TabsTrigger>
              <TabsTrigger value="insights">洞察</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="mt-2 h-4 w-1/3" />
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <>
                    <FinancialSummaryCard
                      title="总收入"
                      value={financialData.summary.totalRevenue}
                      change={financialData.summary.revenueChange}
                      type="revenue"
                    />
                    <FinancialSummaryCard
                      title="总支出"
                      value={financialData.summary.totalExpenses}
                      change={financialData.summary.expensesChange}
                      type="expenses"
                    />
                    <FinancialSummaryCard
                      title="净利润"
                      value={financialData.summary.netProfit}
                      change={financialData.summary.profitChange}
                      type="profit"
                    />
                    <FinancialSummaryCard
                      title="现金流"
                      value={financialData.summary.cashFlow}
                      change={financialData.summary.cashFlowChange}
                      type="cashflow"
                    />
                  </>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>财务趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : (
                      <FinancialTrendsChart data={financialData.trends} />
                    )}
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>收支明细</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : (
                      <FinancialBreakdownTable data={financialData.breakdown} />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {loading ? (
                <Skeleton className="h-[500px] w-full" />
              ) : (
                <FinancialMetricsGrid metrics={financialData.metrics} />
              )}
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>财务报告</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <Card key={i}>
                              <CardHeader className="pb-2">
                                <Skeleton className="h-5 w-3/4" />
                              </CardHeader>
                              <CardContent>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="mt-2 h-4 w-full" />
                                <Skeleton className="mt-4 h-8 w-full" />
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-muted-foreground">查看和下载详细的财务报告。您可以自定义报告内容和格式。</p>
                      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {financialData.reports.map((report: any, index: number) => (
                          <Card key={index}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{report.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{report.description}</p>
                              <p className="mt-1 text-xs text-muted-foreground">更新日期: {report.date}</p>
                              <Button className="mt-4 w-full" variant="outline">
                                下载报告
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {loading ? (
                <Skeleton className="h-[500px] w-full" />
              ) : (
                <FinancialInsights insights={financialData.insights} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}
