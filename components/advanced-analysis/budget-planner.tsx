"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, Save, FileDown, Copy, Trash2, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"

interface BudgetPlannerProps {
  className?: string
  initialData?: any
  onSave?: (data: any) => void
}

export function BudgetPlanner({ className, initialData, onSave }: BudgetPlannerProps) {
  const [activeTab, setActiveTab] = useState("revenue")
  const [budgetPeriod, setBudgetPeriod] = useState("monthly")
  const [budgetYear, setBudgetYear] = useState("2024")
  const [showVariance, setShowVariance] = useState(true)
  const [autoCalculate, setAutoCalculate] = useState(true)

  // 模拟预算数据
  const [budgetData, setBudgetData] = useState({
    revenue: [
      { category: "产品销售", q1: 1200000, q2: 1350000, q3: 1500000, q4: 1650000 },
      { category: "服务收入", q1: 800000, q2: 850000, q3: 900000, q4: 950000 },
      { category: "许可费", q1: 300000, q2: 300000, q3: 350000, q4: 350000 },
      { category: "其他收入", q1: 100000, q2: 120000, q3: 130000, q4: 150000 },
    ],
    expenses: [
      { category: "人力成本", q1: 800000, q2: 820000, q3: 840000, q4: 860000 },
      { category: "营销费用", q1: 250000, q2: 300000, q3: 350000, q4: 400000 },
      { category: "研发费用", q1: 350000, q2: 350000, q3: 400000, q4: 400000 },
      { category: "运营成本", q1: 300000, q2: 310000, q3: 320000, q4: 330000 },
      { category: "办公费用", q1: 120000, q2: 125000, q3: 130000, q4: 135000 },
      { category: "其他支出", q1: 80000, q2: 85000, q3: 90000, q4: 95000 },
    ],
    capital: [
      { category: "设备购置", q1: 200000, q2: 50000, q3: 150000, q4: 100000 },
      { category: "软件投资", q1: 150000, q2: 50000, q3: 50000, q4: 50000 },
      { category: "办公装修", q1: 100000, q2: 0, q3: 0, q4: 50000 },
      { category: "其他资本支出", q1: 50000, q2: 50000, q3: 50000, q4: 50000 },
    ],
  })

  // 模拟实际数据
  const [actualData, setActualData] = useState({
    revenue: [
      { category: "产品销售", q1: 1180000, q2: 1400000, q3: null, q4: null },
      { category: "服务收入", q1: 820000, q2: 840000, q3: null, q4: null },
      { category: "许可费", q1: 290000, q2: 310000, q3: null, q4: null },
      { category: "其他收入", q1: 110000, q2: 115000, q3: null, q4: null },
    ],
    expenses: [
      { category: "人力成本", q1: 810000, q2: 825000, q3: null, q4: null },
      { category: "营销费用", q1: 260000, q2: 290000, q3: null, q4: null },
      { category: "研发费用", q1: 340000, q2: 360000, q3: null, q4: null },
      { category: "运营成本", q1: 310000, q2: 305000, q3: null, q4: null },
      { category: "办公费用", q1: 125000, q2: 128000, q3: null, q4: null },
      { category: "其他支出", q1: 75000, q2: 88000, q3: null, q4: null },
    ],
    capital: [
      { category: "设备购置", q1: 210000, q2: 45000, q3: null, q4: null },
      { category: "软件投资", q1: 155000, q2: 48000, q3: null, q4: null },
      { category: "办公装修", q1: 95000, q2: 0, q3: null, q4: null },
      { category: "其他资本支出", q1: 52000, q2: 51000, q3: null, q4: null },
    ],
  })

  // 计算总计和差异
  const calculateTotals = (data: any) => {
    const totals = { revenue: 0, expenses: 0, capital: 0 }

    Object.keys(data).forEach((category) => {
      data[category].forEach((item: any) => {
        const categoryTotal = item.q1 + item.q2 + (item.q3 || 0) + (item.q4 || 0)
        totals[category as keyof typeof totals] += categoryTotal
      })
    })

    return totals
  }

  const budgetTotals = calculateTotals(budgetData)
  const actualTotals = calculateTotals(actualData)

  // 计算差异百分比
  const calculateVariance = (actual: number | null, budget: number) => {
    if (actual === null || budget === 0) return null
    return ((actual - budget) / budget) * 100
  }

  // 格式化金额
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-"
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // 获取差异颜色
  const getVarianceColor = (variance: number | null, isRevenue: boolean) => {
    if (variance === null) return ""

    // 收入：正差异是好的，负差异是坏的
    // 支出：负差异是好的，正差异是坏的
    const isPositive = isRevenue ? variance >= 0 : variance <= 0

    if (Math.abs(variance) < 5) return "text-yellow-500" // 接近预算
    return isPositive ? "text-green-500" : "text-red-500"
  }

  // 添加新预算项
  const addBudgetItem = (category: string) => {
    const newItem = { category: `新${category}项`, q1: 0, q2: 0, q3: 0, q4: 0 }
    const newActualItem = { category: `新${category}项`, q1: null, q2: null, q3: null, q4: null }

    setBudgetData({
      ...budgetData,
      [category]: [...budgetData[category as keyof typeof budgetData], newItem],
    })

    setActualData({
      ...actualData,
      [category]: [...actualData[category as keyof typeof actualData], newActualItem],
    })
  }

  // 更新预算项
  const updateBudgetItem = (category: string, index: number, quarter: string, value: number) => {
    const updatedData = { ...budgetData }
    const items = [...updatedData[category as keyof typeof updatedData]]
    items[index] = { ...items[index], [quarter]: value }
    updatedData[category as keyof typeof updatedData] = items

    setBudgetData(updatedData)
  }

  // 更新实际数据
  const updateActualItem = (category: string, index: number, quarter: string, value: number | null) => {
    const updatedData = { ...actualData }
    const items = [...updatedData[category as keyof typeof updatedData]]
    items[index] = { ...items[index], [quarter]: value }
    updatedData[category as keyof typeof updatedData] = items

    setActualData(updatedData)
  }

  // 删除预算项
  const deleteBudgetItem = (category: string, index: number) => {
    const updatedBudgetData = { ...budgetData }
    const budgetItems = [...updatedBudgetData[category as keyof typeof updatedBudgetData]]
    budgetItems.splice(index, 1)
    updatedBudgetData[category as keyof typeof updatedBudgetData] = budgetItems

    const updatedActualData = { ...actualData }
    const actualItems = [...updatedActualData[category as keyof typeof updatedActualData]]
    actualItems.splice(index, 1)
    updatedActualData[category as keyof typeof updatedActualData] = actualItems

    setBudgetData(updatedBudgetData)
    setActualData(updatedActualData)
  }

  // 保存预算
  const handleSave = () => {
    const data = {
      budget: budgetData,
      actual: actualData,
      period: budgetPeriod,
      year: budgetYear,
    }

    onSave?.(data)
    alert("预算已保存")
  }

  // 导出预算
  const handleExport = () => {
    const data = {
      budget: budgetData,
      actual: actualData,
      period: budgetPeriod,
      year: budgetYear,
      totals: {
        budget: budgetTotals,
        actual: actualTotals,
      },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `预算计划_${budgetYear}.json`
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
            <CardTitle>预算规划与控制</CardTitle>
            <CardDescription>创建、管理和跟踪企业预算，分析实际与计划的差异</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={budgetYear} onValueChange={setBudgetYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="选择年份" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023年</SelectItem>
                <SelectItem value="2024">2024年</SelectItem>
                <SelectItem value="2025">2025年</SelectItem>
              </SelectContent>
            </Select>

            <Select value={budgetPeriod} onValueChange={setBudgetPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="选择周期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">月度</SelectItem>
                <SelectItem value="quarterly">季度</SelectItem>
                <SelectItem value="annual">年度</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch id="show-variance" checked={showVariance} onCheckedChange={setShowVariance} />
              <Label htmlFor="show-variance">显示差异</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">收入预算</TabsTrigger>
            <TabsTrigger value="expenses">支出预算</TabsTrigger>
            <TabsTrigger value="capital">资本支出</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="pt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">收入类别</TableHead>
                    <TableHead>Q1 预算</TableHead>
                    {showVariance && <TableHead>Q1 实际</TableHead>}
                    {showVariance && <TableHead>Q1 差异</TableHead>}
                    <TableHead>Q2 预算</TableHead>
                    {showVariance && <TableHead>Q2 实际</TableHead>}
                    {showVariance && <TableHead>Q2 差异</TableHead>}
                    <TableHead>Q3 预算</TableHead>
                    {showVariance && <TableHead>Q3 实际</TableHead>}
                    {showVariance && <TableHead>Q3 差异</TableHead>}
                    <TableHead>Q4 预算</TableHead>
                    {showVariance && <TableHead>Q4 实际</TableHead>}
                    {showVariance && <TableHead>Q4 差异</TableHead>}
                    <TableHead>年度总计</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.revenue.map((item, index) => {
                    const actual = actualData.revenue[index]
                    const yearTotal = item.q1 + item.q2 + item.q3 + item.q4

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.category}</TableCell>

                        <TableCell>{formatCurrency(item.q1)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q1)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q1, item.q1), true)}>
                            {actual.q1 !== null ? `${calculateVariance(actual.q1, item.q1)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell>{formatCurrency(item.q2)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q2)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q2, item.q2), true)}>
                            {actual.q2 !== null ? `${calculateVariance(actual.q2, item.q2)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell>{formatCurrency(item.q3)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q3)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q3, item.q3), true)}>
                            {actual.q3 !== null ? `${calculateVariance(actual.q3, item.q3)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell>{formatCurrency(item.q4)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q4)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q4, item.q4), true)}>
                            {actual.q4 !== null ? `${calculateVariance(actual.q4, item.q4)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell className="font-bold">{formatCurrency(yearTotal)}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => deleteBudgetItem("revenue", index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => {}}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}

                  <TableRow>
                    <TableCell colSpan={showVariance ? 16 : 7}>
                      <Button variant="ghost" size="sm" className="w-full" onClick={() => addBudgetItem("revenue")}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        添加收入项
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">收入总计</TableCell>
                    <TableCell colSpan={showVariance ? 14 : 5} className="font-bold text-right">
                      {formatCurrency(budgetTotals.revenue)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="pt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">支出类别</TableHead>
                    <TableHead>Q1 预算</TableHead>
                    {showVariance && <TableHead>Q1 实际</TableHead>}
                    {showVariance && <TableHead>Q1 差异</TableHead>}
                    <TableHead>Q2 预算</TableHead>
                    {showVariance && <TableHead>Q2 实际</TableHead>}
                    {showVariance && <TableHead>Q2 差异</TableHead>}
                    <TableHead>Q3 预算</TableHead>
                    {showVariance && <TableHead>Q3 实际</TableHead>}
                    {showVariance && <TableHead>Q3 差异</TableHead>}
                    <TableHead>Q4 预算</TableHead>
                    {showVariance && <TableHead>Q4 实际</TableHead>}
                    {showVariance && <TableHead>Q4 差异</TableHead>}
                    <TableHead>年度总计</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.expenses.map((item, index) => {
                    const actual = actualData.expenses[index]
                    const yearTotal = item.q1 + item.q2 + item.q3 + item.q4

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.category}</TableCell>

                        <TableCell>{formatCurrency(item.q1)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q1)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q1, item.q1), false)}>
                            {actual.q1 !== null ? `${calculateVariance(actual.q1, item.q1)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell>{formatCurrency(item.q2)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q2)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q2, item.q2), false)}>
                            {actual.q2 !== null ? `${calculateVariance(actual.q2, item.q2)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell>{formatCurrency(item.q3)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q3)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q3, item.q3), false)}>
                            {actual.q3 !== null ? `${calculateVariance(actual.q3, item.q3)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell>{formatCurrency(item.q4)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q4)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q4, item.q4), false)}>
                            {actual.q4 !== null ? `${calculateVariance(actual.q4, item.q4)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell className="font-bold">{formatCurrency(yearTotal)}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => deleteBudgetItem("expenses", index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => {}}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}

                  <TableRow>
                    <TableCell colSpan={showVariance ? 16 : 7}>
                      <Button variant="ghost" size="sm" className="w-full" onClick={() => addBudgetItem("expenses")}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        添加支出项
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">支出总计</TableCell>
                    <TableCell colSpan={showVariance ? 14 : 5} className="font-bold text-right">
                      {formatCurrency(budgetTotals.expenses)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="capital" className="pt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">资本支出类别</TableHead>
                    <TableHead>Q1 预算</TableHead>
                    {showVariance && <TableHead>Q1 实际</TableHead>}
                    {showVariance && <TableHead>Q1 差异</TableHead>}
                    <TableHead>Q2 预算</TableHead>
                    {showVariance && <TableHead>Q2 实际</TableHead>}
                    {showVariance && <TableHead>Q2 差异</TableHead>}
                    <TableHead>Q3 预算</TableHead>
                    {showVariance && <TableHead>Q3 实际</TableHead>}
                    {showVariance && <TableHead>Q3 差异</TableHead>}
                    <TableHead>Q4 预算</TableHead>
                    {showVariance && <TableHead>Q4 实际</TableHead>}
                    {showVariance && <TableHead>Q4 差异</TableHead>}
                    <TableHead>年度总计</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.capital.map((item, index) => {
                    const actual = actualData.capital[index]
                    const yearTotal = item.q1 + item.q2 + item.q3 + item.q4

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.category}</TableCell>

                        <TableCell>{formatCurrency(item.q1)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q1)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q1, item.q1), false)}>
                            {actual.q1 !== null ? `${calculateVariance(actual.q1, item.q1)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell>{formatCurrency(item.q2)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q2)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q2, item.q2), false)}>
                            {actual.q2 !== null ? `${calculateVariance(actual.q2, item.q2)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell>{formatCurrency(item.q3)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q3)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q3, item.q3), false)}>
                            {actual.q3 !== null ? `${calculateVariance(actual.q3, item.q3)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell>{formatCurrency(item.q4)}</TableCell>
                        {showVariance && <TableCell>{formatCurrency(actual.q4)}</TableCell>}
                        {showVariance && (
                          <TableCell className={getVarianceColor(calculateVariance(actual.q4, item.q4), false)}>
                            {actual.q4 !== null ? `${calculateVariance(actual.q4, item.q4)?.toFixed(1)}%` : "-"}
                          </TableCell>
                        )}

                        <TableCell className="font-bold">{formatCurrency(yearTotal)}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => deleteBudgetItem("capital", index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => {}}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}

                  <TableRow>
                    <TableCell colSpan={showVariance ? 16 : 7}>
                      <Button variant="ghost" size="sm" className="w-full" onClick={() => addBudgetItem("capital")}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        添加资本支出项
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">资本支出总计</TableCell>
                    <TableCell colSpan={showVariance ? 14 : 5} className="font-bold text-right">
                      {formatCurrency(budgetTotals.capital)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">预算摘要</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>总收入:</span>
                  <span className="font-medium">{formatCurrency(budgetTotals.revenue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>总支出:</span>
                  <span className="font-medium">{formatCurrency(budgetTotals.expenses)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>净利润:</span>
                  <span className="font-medium">{formatCurrency(budgetTotals.revenue - budgetTotals.expenses)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>资本支出:</span>
                  <span className="font-medium">{formatCurrency(budgetTotals.capital)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>自由现金流:</span>
                  <span className="font-medium">
                    {formatCurrency(budgetTotals.revenue - budgetTotals.expenses - budgetTotals.capital)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>利润率:</span>
                  <span className="font-medium">
                    {(((budgetTotals.revenue - budgetTotals.expenses) / budgetTotals.revenue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>预算执行进度:</span>
                  <span className="font-medium">50%</span>
                </div>
                <Progress value={50} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>最后更新:</span>
                  <span className="font-medium">2024-05-15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Switch id="auto-calculate" checked={autoCalculate} onCheckedChange={setAutoCalculate} />
          <Label htmlFor="auto-calculate">自动计算</Label>
          <Button variant="outline" size="sm" className="ml-2">
            <Calculator className="mr-2 h-4 w-4" />
            重新计算
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存预算
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
