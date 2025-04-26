"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  AlertCircle,
  Save,
  RefreshCw,
  Settings,
  Calculator,
  Plus,
  Trash2,
  Copy,
  FileDown,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ROIAnalyzerProps {
  className?: string
  initialData?: any
  onSave?: (data: any) => void
}

export function ROIAnalyzer({ className, initialData, onSave }: ROIAnalyzerProps) {
  const [activeTab, setActiveTab] = useState("projects")
  const [discountRate, setDiscountRate] = useState(8)
  const [taxRate, setTaxRate] = useState(25)
  const [inflationRate, setInflationRate] = useState(3)
  const [riskAdjusted, setRiskAdjusted] = useState(true)
  const [comparisonMethod, setComparisonMethod] = useState("npv")

  // 模拟投资项目数据
  const [projects, setProjects] = useState([
    {
      id: "proj-001",
      name: "生产线自动化升级",
      initialInvestment: 5000000,
      cashFlows: [1200000, 1800000, 2200000, 2500000, 2000000],
      riskLevel: "medium", // low, medium, high
      category: "equipment",
      description: "升级现有生产线，引入自动化设备，提高生产效率和产品质量",
    },
    {
      id: "proj-002",
      name: "新产品研发",
      initialInvestment: 3500000,
      cashFlows: [500000, 1500000, 2500000, 3000000, 3500000],
      riskLevel: "high",
      category: "product",
      description: "研发新一代产品，拓展市场份额，提高竞争力",
    },
    {
      id: "proj-003",
      name: "ERP系统实施",
      initialInvestment: 2000000,
      cashFlows: [400000, 800000, 1200000, 1500000, 1500000],
      riskLevel: "low",
      category: "it",
      description: "实施企业资源规划系统，优化业务流程，提高运营效率",
    },
    {
      id: "proj-004",
      name: "市场营销活动",
      initialInvestment: 1500000,
      cashFlows: [800000, 1200000, 900000, 600000, 300000],
      riskLevel: "medium",
      category: "marketing",
      description: "开展全国性市场营销活动，提高品牌知名度，扩大市场份额",
    },
    {
      id: "proj-005",
      name: "海外市场拓展",
      initialInvestment: 4000000,
      cashFlows: [600000, 1200000, 2000000, 2800000, 3500000],
      riskLevel: "high",
      category: "expansion",
      description: "拓展海外市场，建立销售渠道，提高国际市场份额",
    },
  ])

  // 计算净现值 (NPV)
  const calculateNPV = (
    initialInvestment: number,
    cashFlows: number[],
    rate: number,
    riskAdjustment = false,
    riskLevel = "medium",
  ) => {
    // 风险调整后的折现率
    let adjustedRate = rate
    if (riskAdjustment) {
      if (riskLevel === "low") adjustedRate += 2
      else if (riskLevel === "medium") adjustedRate += 5
      else if (riskLevel === "high") adjustedRate += 10
    }

    // 考虑通货膨胀
    adjustedRate += inflationRate

    // 折现率转为小数
    const discountFactor = adjustedRate / 100

    // 计算NPV
    let npv = -initialInvestment

    for (let i = 0; i < cashFlows.length; i++) {
      // 考虑税率
      const afterTaxCashFlow = cashFlows[i] * (1 - taxRate / 100)
      npv += afterTaxCashFlow / Math.pow(1 + discountFactor, i + 1)
    }

    return npv
  }

  // 计算内部收益率 (IRR)
  const calculateIRR = (initialInvestment: number, cashFlows: number[]) => {
    // 简化的IRR计算，使用迭代法
    const maxIterations = 1000
    const tolerance = 0.0001

    let guess = 0.1 // 初始猜测值

    // 考虑税率的现金流
    const afterTaxCashFlows = cashFlows.map((cf) => cf * (1 - taxRate / 100))

    for (let i = 0; i < maxIterations; i++) {
      let npv = -initialInvestment

      for (let j = 0; j < afterTaxCashFlows.length; j++) {
        npv += afterTaxCashFlows[j] / Math.pow(1 + guess, j + 1)
      }

      if (Math.abs(npv) < tolerance) {
        return guess * 100 // 转为百分比
      }

      // 调整猜测值
      const npvDerivative = afterTaxCashFlows.reduce((sum, cf, idx) => {
        return sum - ((idx + 1) * cf) / Math.pow(1 + guess, idx + 2)
      }, 0)

      guess = guess - npv / npvDerivative

      // 防止发散
      if (guess < -1) return null
      if (guess > 1) return 100
    }

    return null // 无法收敛
  }

  // 计算回收期 (Payback Period)
  const calculatePaybackPeriod = (initialInvestment: number, cashFlows: number[]) => {
    let cumulativeCashFlow = -initialInvestment
    let paybackPeriod = 0

    // 考虑税率的现金流
    const afterTaxCashFlows = cashFlows.map((cf) => cf * (1 - taxRate / 100))

    for (let i = 0; i < afterTaxCashFlows.length; i++) {
      cumulativeCashFlow += afterTaxCashFlows[i]

      if (cumulativeCashFlow >= 0) {
        // 如果在这一年内回收，计算具体的小数部分
        if (i > 0 && cumulativeCashFlow - afterTaxCashFlows[i] < 0) {
          const fraction = (0 - (cumulativeCashFlow - afterTaxCashFlows[i])) / afterTaxCashFlows[i]
          paybackPeriod = i + fraction
        } else {
          paybackPeriod = i + 1
        }
        break
      }
    }

    // 如果在预测期内无法回收
    if (cumulativeCashFlow < 0) {
      return null
    }

    return paybackPeriod
  }

  // 计算投资回报率 (ROI)
  const calculateROI = (initialInvestment: number, cashFlows: number[]) => {
    // 考虑税率的现金流
    const afterTaxCashFlows = cashFlows.map((cf) => cf * (1 - taxRate / 100))

    const totalReturn = afterTaxCashFlows.reduce((sum, cf) => sum + cf, 0)
    const roi = ((totalReturn - initialInvestment) / initialInvestment) * 100

    return roi
  }

  // 计算收益成本比 (Benefit-Cost Ratio)
  const calculateBCR = (initialInvestment: number, cashFlows: number[], rate: number) => {
    // 折现率转为小数
    const discountFactor = (rate + inflationRate) / 100

    // 计算折现后的收益总和
    let presentValueOfBenefits = 0

    for (let i = 0; i < cashFlows.length; i++) {
      // 考虑税率
      const afterTaxCashFlow = cashFlows[i] * (1 - taxRate / 100)
      presentValueOfBenefits += afterTaxCashFlow / Math.pow(1 + discountFactor, i + 1)
    }

    // 收益成本比
    const bcr = presentValueOfBenefits / initialInvestment

    return bcr
  }

  // 计算项目指标
  const calculateProjectMetrics = (project: any) => {
    const npv = calculateNPV(
      project.initialInvestment,
      project.cashFlows,
      discountRate,
      riskAdjusted,
      project.riskLevel,
    )
    const irr = calculateIRR(project.initialInvestment, project.cashFlows)
    const paybackPeriod = calculatePaybackPeriod(project.initialInvestment, project.cashFlows)
    const roi = calculateROI(project.initialInvestment, project.cashFlows)
    const bcr = calculateBCR(project.initialInvestment, project.cashFlows, discountRate)

    return {
      npv,
      irr,
      paybackPeriod,
      roi,
      bcr,
    }
  }

  // 计算所有项目的指标
  const projectsWithMetrics = projects.map((project) => ({
    ...project,
    metrics: calculateProjectMetrics(project),
  }))

  // 根据选择的方法对项目进行排序
  const sortedProjects = [...projectsWithMetrics].sort((a, b) => {
    if (comparisonMethod === "npv") {
      return b.metrics.npv - a.metrics.npv
    } else if (comparisonMethod === "irr") {
      return (b.metrics.irr || 0) - (a.metrics.irr || 0)
    } else if (comparisonMethod === "payback") {
      // 对于回收期，较短的更好
      if (a.metrics.paybackPeriod === null) return 1
      if (b.metrics.paybackPeriod === null) return -1
      return a.metrics.paybackPeriod - b.metrics.paybackPeriod
    } else if (comparisonMethod === "roi") {
      return b.metrics.roi - a.metrics.roi
    } else {
      // bcr
      return b.metrics.bcr - a.metrics.bcr
    }
  })

  // 格式化金额
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // 获取风险等级标签
  const getRiskLevelLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "低风险"
      case "medium":
        return "中等风险"
      case "high":
        return "高风险"
      default:
        return "未知风险"
    }
  }

  // 获取风险等级颜色
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取项目类别标签
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "equipment":
        return "设备投资"
      case "product":
        return "产品研发"
      case "it":
        return "IT系统"
      case "marketing":
        return "市场营销"
      case "expansion":
        return "业务拓展"
      default:
        return "其他投资"
    }
  }

  // 获取项目类别颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "equipment":
        return "#3b82f6" // blue
      case "product":
        return "#10b981" // green
      case "it":
        return "#8b5cf6" // purple
      case "marketing":
        return "#f59e0b" // amber
      case "expansion":
        return "#ef4444" // red
      default:
        return "#6b7280" // gray
    }
  }

  // 添加新项目
  const addNewProject = () => {
    const newProject = {
      id: `proj-${(projects.length + 1).toString().padStart(3, "0")}`,
      name: "新投资项目",
      initialInvestment: 1000000,
      cashFlows: [300000, 500000, 700000, 800000, 900000],
      riskLevel: "medium",
      category: "other",
      description: "请输入项目描述",
    }

    setProjects([...projects, newProject])
  }

  // 删除项目
  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  // 更新项目
  const updateProject = (id: string, field: string, value: any) => {
    setProjects(
      projects.map((project) => {
        if (project.id === id) {
          return { ...project, [field]: value }
        }
        return project
      }),
    )
  }

  // 更新项目现金流
  const updateProjectCashFlow = (id: string, index: number, value: number) => {
    setProjects(
      projects.map((project) => {
        if (project.id === id) {
          const newCashFlows = [...project.cashFlows]
          newCashFlows[index] = value
          return { ...project, cashFlows: newCashFlows }
        }
        return project
      }),
    )
  }

  // 保存分析
  const handleSave = () => {
    const data = {
      projects,
      settings: {
        discountRate,
        taxRate,
        inflationRate,
        riskAdjusted,
        comparisonMethod,
      },
      results: projectsWithMetrics,
    }

    onSave?.(data)
    alert("投资回报分析已保存")
  }

  // 导出分析
  const handleExport = () => {
    const data = {
      projects,
      settings: {
        discountRate,
        taxRate,
        inflationRate,
        riskAdjusted,
        comparisonMethod,
      },
      results: projectsWithMetrics,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `投资回报分析_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 自定义图表提示
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{`第 ${Number.parseInt(label) + 1} 年`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>投资回报分析</CardTitle>
            <CardDescription>评估和比较不同投资项目的回报率和价值</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="discount-rate" className="w-24">
                折现率:
              </Label>
              <Slider
                id="discount-rate"
                value={[discountRate]}
                onValueChange={(value) => setDiscountRate(value[0])}
                min={1}
                max={20}
                step={0.5}
                className="w-32"
              />
              <span className="text-sm w-8">{discountRate}%</span>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="tax-rate" className="w-24">
                税率:
              </Label>
              <Slider
                id="tax-rate"
                value={[taxRate]}
                onValueChange={(value) => setTaxRate(value[0])}
                min={0}
                max={40}
                step={1}
                className="w-32"
              />
              <span className="text-sm w-8">{taxRate}%</span>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="risk-adjusted" checked={riskAdjusted} onCheckedChange={setRiskAdjusted} />
              <Label htmlFor="risk-adjusted">风险调整</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">投资项目</TabsTrigger>
            <TabsTrigger value="comparison">项目比较</TabsTrigger>
            <TabsTrigger value="analysis">深度分析</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="pt-4 space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">项目名称</TableHead>
                    <TableHead>初始投资</TableHead>
                    <TableHead>年度现金流</TableHead>
                    <TableHead>风险等级</TableHead>
                    <TableHead>类别</TableHead>
                    <TableHead>NPV</TableHead>
                    <TableHead>IRR</TableHead>
                    <TableHead>回收期</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectsWithMetrics.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{formatCurrency(project.initialInvestment)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {project.cashFlows.map((cf, index) => (
                            <div
                              key={index}
                              className="h-8 w-8 flex items-center justify-center text-xs bg-blue-100 rounded"
                              title={`第${index + 1}年: ${formatCurrency(cf)}`}
                            >
                              {index + 1}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(project.riskLevel)}`}>
                          {getRiskLevelLabel(project.riskLevel)}
                        </span>
                      </TableCell>
                      <TableCell>{getCategoryLabel(project.category)}</TableCell>
                      <TableCell className={project.metrics.npv >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(project.metrics.npv)}
                      </TableCell>
                      <TableCell>
                        {project.metrics.irr !== null ? `${project.metrics.irr.toFixed(1)}%` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {project.metrics.paybackPeriod !== null
                          ? `${project.metrics.paybackPeriod.toFixed(1)}年`
                          : ">5年"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {}}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell colSpan={9}>
                      <Button variant="ghost" size="sm" className="w-full" onClick={addNewProject}>
                        <Plus className="mr-2 h-4 w-4" />
                        添加投资项目
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">项目详情</h3>
                {projectsWithMetrics.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">项目名称</Label>
                      <Input
                        id="project-name"
                        value={projectsWithMetrics[0].name}
                        onChange={(e) => updateProject(projectsWithMetrics[0].id, "name", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="project-investment">初始投资</Label>
                      <Input
                        id="project-investment"
                        type="number"
                        value={projectsWithMetrics[0].initialInvestment}
                        onChange={(e) =>
                          updateProject(
                            projectsWithMetrics[0].id,
                            "initialInvestment",
                            Number.parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label>年度现金流</Label>
                      <div className="grid grid-cols-5 gap-2 mt-1">
                        {projectsWithMetrics[0].cashFlows.map((cf, index) => (
                          <div key={index}>
                            <Label htmlFor={`cf-${index}`} className="text-xs">
                              第{index + 1}年
                            </Label>
                            <Input
                              id={`cf-${index}`}
                              type="number"
                              value={cf}
                              onChange={(e) =>
                                updateProjectCashFlow(
                                  projectsWithMetrics[0].id,
                                  index,
                                  Number.parseFloat(e.target.value),
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="project-risk">风险等级</Label>
                        <Select
                          value={projectsWithMetrics[0].riskLevel}
                          onValueChange={(value) => updateProject(projectsWithMetrics[0].id, "riskLevel", value)}
                        >
                          <SelectTrigger id="project-risk">
                            <SelectValue placeholder="选择风险等级" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">低风险</SelectItem>
                            <SelectItem value="medium">中等风险</SelectItem>
                            <SelectItem value="high">高风险</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="project-category">项目类别</Label>
                        <Select
                          value={projectsWithMetrics[0].category}
                          onValueChange={(value) => updateProject(projectsWithMetrics[0].id, "category", value)}
                        >
                          <SelectTrigger id="project-category">
                            <SelectValue placeholder="选择项目类别" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equipment">设备投资</SelectItem>
                            <SelectItem value="product">产品研发</SelectItem>
                            <SelectItem value="it">IT系统</SelectItem>
                            <SelectItem value="marketing">市场营销</SelectItem>
                            <SelectItem value="expansion">业务拓展</SelectItem>
                            <SelectItem value="other">其他投资</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="project-description">项目描述</Label>
                      <textarea
                        id="project-description"
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        value={projectsWithMetrics[0].description}
                        onChange={(e) => updateProject(projectsWithMetrics[0].id, "description", e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">现金流分析</h3>
                {projectsWithMetrics.length > 0 && (
                  <div className="space-y-4">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "初始投资", value: -projectsWithMetrics[0].initialInvestment },
                            ...projectsWithMetrics[0].cashFlows.map((cf, index) => ({
                              name: `第${index + 1}年`,
                              value: cf,
                            })),
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Bar
                            dataKey="value"
                            name="现金流"
                            fill={(data) => (data.value >= 0 ? "#10b981" : "#ef4444")}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">净现值 (NPV)</div>
                        <div
                          className={`text-xl font-bold ${projectsWithMetrics[0].metrics.npv >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatCurrency(projectsWithMetrics[0].metrics.npv)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">内部收益率 (IRR)</div>
                        <div className="text-xl font-bold">
                          {projectsWithMetrics[0].metrics.irr !== null
                            ? `${projectsWithMetrics[0].metrics.irr.toFixed(1)}%`
                            : "N/A"}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">回收期</div>
                        <div className="text-xl font-bold">
                          {projectsWithMetrics[0].metrics.paybackPeriod !== null
                            ? `${projectsWithMetrics[0].metrics.paybackPeriod.toFixed(1)}年`
                            : ">5年"}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">投资回报率 (ROI)</div>
                        <div className="text-xl font-bold">{`${projectsWithMetrics[0].metrics.roi.toFixed(1)}%`}</div>
                      </div>
                    </div>

                    <Alert
                      variant="default"
                      className={
                        projectsWithMetrics[0].metrics.npv >= 0
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }
                    >
                      <AlertCircle
                        className={`h-4 w-4 ${projectsWithMetrics[0].metrics.npv >= 0 ? "text-green-600" : "text-red-600"}`}
                      />
                      <AlertTitle
                        className={projectsWithMetrics[0].metrics.npv >= 0 ? "text-green-800" : "text-red-800"}
                      >
                        投资建议
                      </AlertTitle>
                      <AlertDescription
                        className={projectsWithMetrics[0].metrics.npv >= 0 ? "text-green-700" : "text-red-700"}
                      >
                        {projectsWithMetrics[0].metrics.npv >= 0
                          ? `该项目净现值为正，内部收益率${projectsWithMetrics[0].metrics.irr !== null ? `为${projectsWithMetrics[0].metrics.irr.toFixed(1)}%，` : ""}高于折现率${discountRate}%，建议投资。`
                          : `该项目净现值为负，内部收益率${projectsWithMetrics[0].metrics.irr !== null ? `为${projectsWithMetrics[0].metrics.irr.toFixed(1)}%，` : ""}低于折现率${discountRate}%，不建议投资。`}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="pt-4 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">项目比较</h3>
              <div className="flex items-center space-x-2">
                <Label htmlFor="comparison-method">比较方法:</Label>
                <Select value={comparisonMethod} onValueChange={setComparisonMethod}>
                  <SelectTrigger id="comparison-method" className="w-[180px]">
                    <SelectValue placeholder="选择比较方法" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="npv">净现值 (NPV)</SelectItem>
                    <SelectItem value="irr">内部收益率 (IRR)</SelectItem>
                    <SelectItem value="payback">回收期</SelectItem>
                    <SelectItem value="roi">投资回报率 (ROI)</SelectItem>
                    <SelectItem value="bcr">收益成本比 (BCR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">项目排名</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sortedProjects.map((project) => ({
                        name: project.name,
                        value:
                          comparisonMethod === "npv"
                            ? project.metrics.npv
                            : comparisonMethod === "irr"
                              ? project.metrics.irr
                              : comparisonMethod === "payback"
                                ? project.metrics.paybackPeriod
                                : comparisonMethod === "roi"
                                  ? project.metrics.roi
                                  : project.metrics.bcr,
                        category: project.category,
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        formatter={(value) => {
                          if (comparisonMethod === "npv") return formatCurrency(value as number)
                          if (comparisonMethod === "irr" || comparisonMethod === "roi")
                            return `${(value as number).toFixed(1)}%`
                          if (comparisonMethod === "payback") return `${(value as number).toFixed(1)}年`
                          return (value as number).toFixed(2)
                        }}
                      />
                      <Bar
                        dataKey="value"
                        name={
                          comparisonMethod === "npv"
                            ? "净现值"
                            : comparisonMethod === "irr"
                              ? "内部收益率"
                              : comparisonMethod === "payback"
                                ? "回收期"
                                : comparisonMethod === "roi"
                                  ? "投资回报率"
                                  : "收益成本比"
                        }
                        fill={(data) => getCategoryColor(data.category)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">投资组合分析</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectsWithMetrics.map((project) => ({
                            name: project.name,
                            value: project.initialInvestment,
                            category: project.category,
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {projectsWithMetrics.map((project, index) => (
                            <Cell key={`cell-${index}`} fill={getCategoryColor(project.category)} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center text-sm">投资分布</div>
                  </div>

                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectsWithMetrics.map((project) => ({
                            name: project.name,
                            value: project.metrics.npv > 0 ? project.metrics.npv : 0,
                            category: project.category,
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {projectsWithMetrics.map((project, index) => (
                            <Cell key={`cell-${index}`} fill={getCategoryColor(project.category)} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center text-sm">价值分布</div>
                  </div>

                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "低风险",
                              value: projectsWithMetrics
                                .filter((p) => p.riskLevel === "low")
                                .reduce((sum, p) => sum + p.initialInvestment, 0),
                            },
                            {
                              name: "中等风险",
                              value: projectsWithMetrics
                                .filter((p) => p.riskLevel === "medium")
                                .reduce((sum, p) => sum + p.initialInvestment, 0),
                            },
                            {
                              name: "高风险",
                              value: projectsWithMetrics
                                .filter((p) => p.riskLevel === "high")
                                .reduce((sum, p) => sum + p.initialInvestment, 0),
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          <Cell fill="#10b981" /> {/* 低风险 - 绿色 */}
                          <Cell fill="#f59e0b" /> {/* 中等风险 - 黄色 */}
                          <Cell fill="#ef4444" /> {/* 高风险 - 红色 */}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center text-sm">风险分布</div>
                  </div>

                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "设备投资",
                              value: projectsWithMetrics
                                .filter((p) => p.category === "equipment")
                                .reduce((sum, p) => sum + p.initialInvestment, 0),
                            },
                            {
                              name: "产品研发",
                              value: projectsWithMetrics
                                .filter((p) => p.category === "product")
                                .reduce((sum, p) => sum + p.initialInvestment, 0),
                            },
                            {
                              name: "IT系统",
                              value: projectsWithMetrics
                                .filter((p) => p.category === "it")
                                .reduce((sum, p) => sum + p.initialInvestment, 0),
                            },
                            {
                              name: "市场营销",
                              value: projectsWithMetrics
                                .filter((p) => p.category === "marketing")
                                .reduce((sum, p) => sum + p.initialInvestment, 0),
                            },
                            {
                              name: "业务拓展",
                              value: projectsWithMetrics
                                .filter((p) => p.category === "expansion")
                                .reduce((sum, p) => sum + p.initialInvestment, 0),
                            },
                            {
                              name: "其他投资",
                              value: projectsWithMetrics
                                .filter((p) => p.category === "other")
                                .reduce((sum, p) => sum + p.initialInvestment, 0),
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          <Cell fill="#3b82f6" /> {/* 设备投资 - 蓝色 */}
                          <Cell fill="#10b981" /> {/* 产品研发 - 绿色 */}
                          <Cell fill="#8b5cf6" /> {/* IT系统 - 紫色 */}
                          <Cell fill="#f59e0b" /> {/* 市场营销 - 黄色 */}
                          <Cell fill="#ef4444" /> {/* 业务拓展 - 红色 */}
                          <Cell fill="#6b7280" /> {/* 其他投资 - 灰色 */}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center text-sm">类别分布</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="font-medium text-blue-800">投资组合分析</div>
                  <p className="text-sm text-blue-700 mt-1">
                    当前投资组合总投资额为
                    {formatCurrency(projectsWithMetrics.reduce((sum, p) => sum + p.initialInvestment, 0))}，
                    预计总净现值为{formatCurrency(projectsWithMetrics.reduce((sum, p) => sum + p.metrics.npv, 0))}。
                    {projectsWithMetrics.reduce((sum, p) => sum + p.metrics.npv, 0) > 0
                      ? "整体投资组合预期创造正向价值。"
                      : "整体投资组合预期无法创造正向价值，建议重新评估。"}
                    {projectsWithMetrics.filter((p) => p.riskLevel === "high").length > 0 &&
                      `高风险项目占比${((projectsWithMetrics.filter((p) => p.riskLevel === "high").reduce((sum, p) => sum + p.initialInvestment, 0) / projectsWithMetrics.reduce((sum, p) => sum + p.initialInvestment, 0)) * 100).toFixed(1)}%，建议关注风险管理。`}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>项目名称</TableHead>
                    <TableHead>初始投资</TableHead>
                    <TableHead>净现值 (NPV)</TableHead>
                    <TableHead>内部收益率 (IRR)</TableHead>
                    <TableHead>回收期</TableHead>
                    <TableHead>投资回报率 (ROI)</TableHead>
                    <TableHead>收益成本比 (BCR)</TableHead>
                    <TableHead>风险等级</TableHead>
                    <TableHead>建议</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{formatCurrency(project.initialInvestment)}</TableCell>
                      <TableCell className={project.metrics.npv >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(project.metrics.npv)}
                      </TableCell>
                      <TableCell>
                        {project.metrics.irr !== null ? `${project.metrics.irr.toFixed(1)}%` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {project.metrics.paybackPeriod !== null
                          ? `${project.metrics.paybackPeriod.toFixed(1)}年`
                          : ">5年"}
                      </TableCell>
                      <TableCell>{`${project.metrics.roi.toFixed(1)}%`}</TableCell>
                      <TableCell>{project.metrics.bcr.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(project.riskLevel)}`}>
                          {getRiskLevelLabel(project.riskLevel)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {project.metrics.npv >= 0 ? (
                          <span className="text-green-600">建议投资</span>
                        ) : (
                          <span className="text-red-600">不建议投资</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">敏感性分析</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="sensitivity-discount" className="w-24">
                      折现率:
                    </Label>
                    <Slider
                      id="sensitivity-discount"
                      value={[discountRate]}
                      onValueChange={(value) => setDiscountRate(value[0])}
                      min={1}
                      max={20}
                      step={0.5}
                      className="w-32"
                    />
                    <span className="text-sm w-8">{discountRate}%</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label htmlFor="sensitivity-tax" className="w-24">
                      税率:
                    </Label>
                    <Slider
                      id="sensitivity-tax"
                      value={[taxRate]}
                      onValueChange={(value) => setTaxRate(value[0])}
                      min={0}
                      max={40}
                      step={1}
                      className="w-32"
                    />
                    <span className="text-sm w-8">{taxRate}%</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label htmlFor="sensitivity-inflation" className="w-24">
                      通货膨胀率:
                    </Label>
                    <Slider
                      id="sensitivity-inflation"
                      value={[inflationRate]}
                      onValueChange={(value) => setInflationRate(value[0])}
                      min={0}
                      max={10}
                      step={0.5}
                      className="w-32"
                    />
                    <span className="text-sm w-8">{inflationRate}%</span>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          {
                            rate: 1,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              1,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                          {
                            rate: 2,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              2,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                          {
                            rate: 4,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              4,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                          {
                            rate: 6,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              6,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                          {
                            rate: 8,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              8,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                          {
                            rate: 10,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              10,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                          {
                            rate: 12,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              12,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                          {
                            rate: 14,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              14,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                          {
                            rate: 16,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              16,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                          {
                            rate: 18,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              18,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                          {
                            rate: 20,
                            npv: calculateNPV(
                              projectsWithMetrics[0].initialInvestment,
                              projectsWithMetrics[0].cashFlows,
                              20,
                              riskAdjusted,
                              projectsWithMetrics[0].riskLevel,
                            ),
                          },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rate" label={{ value: "折现率 (%)", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "净现值 (NPV)", angle: -90, position: "insideLeft" }} />
                        <Tooltip
                          formatter={(value) => formatCurrency(value as number)}
                          labelFormatter={(value) => `折现率: ${value}%`}
                        />
                        <Line
                          type="monotone"
                          dataKey="npv"
                          name="净现值"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey={() => 0}
                          name="盈亏平衡线"
                          stroke="#888888"
                          strokeDasharray="3 3"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="font-medium text-blue-800">敏感性分析结果</div>
                    <p className="text-sm text-blue-700 mt-1">
                      当折现率超过
                      {projectsWithMetrics[0].metrics.irr !== null
                        ? `${projectsWithMetrics[0].metrics.irr.toFixed(1)}%`
                        : "N/A"}
                      时，项目净现值将变为负值。 当前折现率为{discountRate}%，项目净现值为
                      {formatCurrency(projectsWithMetrics[0].metrics.npv)}。
                      {projectsWithMetrics[0].metrics.npv > 0
                        ? `项目对折现率变化的敏感度${Math.abs(projectsWithMetrics[0].metrics.irr - discountRate) < 3 ? "较高" : "较低"}。`
                        : "项目在当前折现率下不具备投资价值。"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">情景分析</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="font-medium text-green-800">乐观情景</div>
                      <div className="text-sm text-green-700 mt-1">
                        <div>NPV: {formatCurrency(projectsWithMetrics[0].metrics.npv * 1.2)}</div>
                        <div>
                          IRR:{" "}
                          {projectsWithMetrics[0].metrics.irr !== null
                            ? `${(projectsWithMetrics[0].metrics.irr * 1.15).toFixed(1)}%`
                            : "N/A"}
                        </div>
                        <div>
                          回收期:{" "}
                          {projectsWithMetrics[0].metrics.paybackPeriod !== null
                            ? `${(projectsWithMetrics[0].metrics.paybackPeriod * 0.85).toFixed(1)}年`
                            : ">5年"}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="font-medium text-blue-800">基准情景</div>
                      <div className="text-sm text-blue-700 mt-1">
                        <div>NPV: {formatCurrency(projectsWithMetrics[0].metrics.npv)}</div>
                        <div>
                          IRR:{" "}
                          {projectsWithMetrics[0].metrics.irr !== null
                            ? `${projectsWithMetrics[0].metrics.irr.toFixed(1)}%`
                            : "N/A"}
                        </div>
                        <div>
                          回收期:{" "}
                          {projectsWithMetrics[0].metrics.paybackPeriod !== null
                            ? `${projectsWithMetrics[0].metrics.paybackPeriod.toFixed(1)}年`
                            : ">5年"}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="font-medium text-red-800">悲观情景</div>
                      <div className="text-sm text-red-700 mt-1">
                        <div>NPV: {formatCurrency(projectsWithMetrics[0].metrics.npv * 0.8)}</div>
                        <div>
                          IRR:{" "}
                          {projectsWithMetrics[0].metrics.irr !== null
                            ? `${(projectsWithMetrics[0].metrics.irr * 0.85).toFixed(1)}%`
                            : "N/A"}
                        </div>
                        <div>
                          回收期:{" "}
                          {projectsWithMetrics[0].metrics.paybackPeriod !== null
                            ? `${(projectsWithMetrics[0].metrics.paybackPeriod * 1.15).toFixed(1)}年`
                            : ">5年"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[0, 1, 2, 3, 4].map((year) => ({
                          year: year,
                          optimistic:
                            year === 0
                              ? -projectsWithMetrics[0].initialInvestment
                              : projectsWithMetrics[0].cashFlows[year - 1] * 1.2,
                          base:
                            year === 0
                              ? -projectsWithMetrics[0].initialInvestment
                              : projectsWithMetrics[0].cashFlows[year - 1],
                          pessimistic:
                            year === 0
                              ? -projectsWithMetrics[0].initialInvestment
                              : projectsWithMetrics[0].cashFlows[year - 1] * 0.8,
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: "年份", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "现金流", angle: -90, position: "insideLeft" }} />
                        <Tooltip
                          formatter={(value) => formatCurrency(value as number)}
                          labelFormatter={(value) => `第 ${value} 年`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="optimistic"
                          name="乐观情景"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="base"
                          name="基准情景"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="pessimistic"
                          name="悲观情景"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="font-medium text-yellow-800">情景分析结果</div>
                    <p className="text-sm text-yellow-700 mt-1">
                      在乐观情景下，项目净现值为{formatCurrency(projectsWithMetrics[0].metrics.npv * 1.2)}，内部收益率为
                      {projectsWithMetrics[0].metrics.irr !== null
                        ? `${(projectsWithMetrics[0].metrics.irr * 1.15).toFixed(1)}%`
                        : "N/A"}
                      。 在悲观情景下，项目净现值为{formatCurrency(projectsWithMetrics[0].metrics.npv * 0.8)}
                      ，内部收益率为
                      {projectsWithMetrics[0].metrics.irr !== null
                        ? `${(projectsWithMetrics[0].metrics.irr * 0.85).toFixed(1)}%`
                        : "N/A"}
                      。
                      {projectsWithMetrics[0].metrics.npv * 0.8 > 0
                        ? "即使在悲观情景下，项目仍具有投资价值，显示出较强的抗风险能力。"
                        : "在悲观情景下，项目可能无法创造正向价值，需谨慎评估风险。"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium mb-4">投资决策建议</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="font-medium text-green-800 flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                      最佳投资选择
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      {sortedProjects[0].name}是当前最佳投资选择，
                      {comparisonMethod === "npv"
                        ? `净现值为${formatCurrency(sortedProjects[0].metrics.npv)}`
                        : comparisonMethod === "irr"
                          ? `内部收益率为${sortedProjects[0].metrics.irr?.toFixed(1)}%`
                          : comparisonMethod === "payback"
                            ? `回收期为${sortedProjects[0].metrics.paybackPeriod?.toFixed(1)}年`
                            : comparisonMethod === "roi"
                              ? `投资回报率为${sortedProjects[0].metrics.roi.toFixed(1)}%`
                              : `收益成本比为${sortedProjects[0].metrics.bcr.toFixed(2)}`}
                      ， 风险等级为{getRiskLevelLabel(sortedProjects[0].riskLevel)}。 建议优先考虑该项目。
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="font-medium text-blue-800 flex items-center">
                      <Settings className="mr-2 h-5 w-5 text-blue-600" />
                      投资组合建议
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      建议构建包含{sortedProjects.filter((p) => p.metrics.npv > 0).length}个项目的投资组合， 总投资额为
                      {formatCurrency(
                        sortedProjects
                          .filter((p) => p.metrics.npv > 0)
                          .reduce((sum, p) => sum + p.initialInvestment, 0),
                      )}
                      ， 预计总净现值为
                      {formatCurrency(
                        sortedProjects.filter((p) => p.metrics.npv > 0).reduce((sum, p) => sum + p.metrics.npv, 0),
                      )}
                      。
                      {sortedProjects.filter((p) => p.metrics.npv <= 0).length > 0 &&
                        `不建议投资的项目包括：${sortedProjects
                          .filter((p) => p.metrics.npv <= 0)
                          .map((p) => p.name)
                          .join("、")}。`}
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="font-medium text-yellow-800 flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5 text-yellow-600" />
                      风险管理建议
                    </div>
                    <p className="text-sm text-yellow-700 mt-2">
                      {sortedProjects.filter((p) => p.riskLevel === "high").length > 0
                        ? `高风险项目（${sortedProjects
                            .filter((p) => p.riskLevel === "high")
                            .map((p) => p.name)
                            .join(
                              "、",
                            )}）需要特别关注，建议制定详细的风险管理计划，定期监控项目进展，设置明确的退出机制。`
                        : "当前投资组合风险相对可控，建议定期评估项目进展，关注市场变化，及时调整投资策略。"}
                      {projectsWithMetrics.some((p) => p.metrics.npv < 0) &&
                        "对于净现值为负的项目，建议重新评估或寻找替代方案。"}
                    </p>
                  </div>
                </div>

                <Alert variant="default" className="bg-purple-50 border-purple-200">
                  <AlertCircle className="h-4 w-4 text-purple-600" />
                  <AlertTitle className="text-purple-800">综合投资建议</AlertTitle>
                  <AlertDescription className="text-purple-700">
                    基于当前分析，建议优先投资{sortedProjects[0].name}和{sortedProjects[1].name}， 这两个项目
                    {comparisonMethod === "npv"
                      ? "净现值"
                      : comparisonMethod === "irr"
                        ? "内部收益率"
                        : comparisonMethod === "payback"
                          ? "回收期"
                          : comparisonMethod === "roi"
                            ? "投资回报率"
                            : "收益成本比"}
                    表现最佳， 预期能为企业创造最大价值。对于
                    {sortedProjects.filter((p) => p.metrics.npv <= 0).length > 0
                      ? sortedProjects
                          .filter((p) => p.metrics.npv <= 0)
                          .map((p) => p.name)
                          .join("和")
                      : sortedProjects[sortedProjects.length - 1].name}
                    ， 建议
                    {sortedProjects.filter((p) => p.metrics.npv <= 0).length > 0
                      ? "暂缓投资或重新评估项目可行性"
                      : "在资金充足的情况下考虑投资"}
                    。
                    {riskAdjusted
                      ? "当前分析已考虑风险调整，结果更加稳健。"
                      : "建议开启风险调整选项，以获得更加稳健的分析结果。"}
                  </AlertDescription>
                </Alert>
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
            <Calculator className="mr-2 h-4 w-4" />
            重新计算
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            导出分析
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存分析
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
