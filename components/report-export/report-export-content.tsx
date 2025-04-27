"use client"

import { useRef, useState } from "react"
import { ReportExportPanel } from "@/components/report-export/report-export-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FinancialSummaryCard } from "@/components/financial-summary-card"
import { FinancialTrendsChart } from "@/components/financial-trends-chart"
import { FinancialBreakdownTable } from "@/components/financial-breakdown-table"
import { FinancialMetricsGrid } from "@/components/financial-metrics-grid"
import { FinancialInsights } from "@/components/financial-insights"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RefreshCw, Save } from "lucide-react"

// 模拟财务数据
const mockFinancialData = {
  summary: {
    totalRevenue: 1250000,
    totalExpenses: 875000,
    netProfit: 375000,
    cashFlow: 420000,
    assets: 3200000,
    liabilities: 1800000,
  },
  trends: [
    { month: "1月", revenue: 980000, expenses: 720000, profit: 260000 },
    { month: "2月", revenue: 1050000, expenses: 760000, profit: 290000 },
    { month: "3月", revenue: 1120000, expenses: 790000, profit: 330000 },
    { month: "4月", revenue: 1180000, expenses: 810000, profit: 370000 },
    { month: "5月", revenue: 1250000, expenses: 875000, profit: 375000 },
  ],
  breakdown: {
    revenue: [
      { category: "产品销售", amount: 750000, percentage: 60 },
      { category: "服务收入", amount: 375000, percentage: 30 },
      { category: "其他收入", amount: 125000, percentage: 10 },
    ],
    expenses: [
      { category: "人力成本", amount: 437500, percentage: 50 },
      { category: "运营成本", amount: 218750, percentage: 25 },
      { category: "市场营销", amount: 131250, percentage: 15 },
      { category: "其他支出", amount: 87500, percentage: 10 },
    ],
  },
  metrics: {
    profitMargin: 30,
    roa: 11.7,
    currentRatio: 1.8,
    debtToEquity: 1.3,
    cashConversionCycle: 45,
  },
  insights: [
    "本月净利润率达到30%，高于行业平均水平",
    "运营成本占总支出的25%，比上月降低2个百分点",
    "现金转换周期为45天，建议优化库存管理以进一步缩短",
    "资产回报率为11.7%，显示资产利用效率良好",
    "负债权益比为1.3，处于健康范围但需关注债务结构",
  ],
}

export function ReportExportContent() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [reportTitle, setReportTitle] = useState("2024年5月财务报表")
  const [reportDate, setReportDate] = useState<Date | undefined>(new Date())
  const [reportType, setReportType] = useState("monthly")

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">报表导出中心</h1>
          <p className="text-muted-foreground">生成并导出高质量的财务报表，支持多种格式和自定义模板</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新数据
          </Button>
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            保存设置
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>报表配置</CardTitle>
            <CardDescription>自定义报表标题、时间范围和内容</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-title">报表标题</Label>
                <input
                  id="report-title"
                  className="w-full p-2 border rounded-md"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>报表日期</Label>
                <DatePicker date={reportDate} setDate={setReportDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-type">报表类型</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="选择报表类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">月度报表</SelectItem>
                    <SelectItem value="quarterly">季度报表</SelectItem>
                    <SelectItem value="annual">年度报表</SelectItem>
                    <SelectItem value="custom">自定义报表</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <ReportExportPanel reportTitle={reportTitle} contentRef={contentRef} />
      </div>

      <div ref={contentRef} className="space-y-6">
        <FinancialSummaryCard data={mockFinancialData.summary} className="chart-container" />

        <FinancialTrendsChart data={mockFinancialData.trends} className="chart-container" />

        <FinancialBreakdownTable
          revenueData={mockFinancialData.breakdown.revenue}
          expensesData={mockFinancialData.breakdown.expenses}
          className="table-container"
        />

        <FinancialMetricsGrid data={mockFinancialData.metrics} className="chart-container" />

        <FinancialInsights insights={mockFinancialData.insights} className="insight-container" />
      </div>
    </div>
  )
}
