// 模拟财务数据生成工具

// 财务数据接口定义
export interface FinancialData {
  id: string
  year: number
  quarter: number
  revenue: number
  expenses: number
  profit: number
  cashFlow: number
  assets: number
  liabilities: number
  equity: number
  companyId: string
  userId: string
}

// 修改 getMockFinancialData 函数，确保它返回包含 summary 对象的数据结构

export function getMockFinancialData(period = "month"): {
  summary: {
    totalRevenue: number
    revenueChange: number
    totalExpenses: number
    expensesChange: number
    netProfit: number
    profitChange: number
    cashFlow: number
    cashFlowChange: number
  }
  trends: Array<{ date: string; revenue: number; expenses: number; profit: number }>
  breakdown: Array<{ category: string; amount: number; percentage: number }>
  metrics: Array<{ name: string; value: number; change: number; status: "up" | "down" | "neutral" }>
  reports: Array<{ title: string; description: string; url: string }>
  insights: Array<{ title: string; description: string; impact: "positive" | "negative" | "neutral" }>
} {
  // 基于选择的时间段调整数据
  const multiplier = period === "day" ? 1 : period === "week" ? 7 : period === "month" ? 30 : 365

  // 生成摘要数据
  const summary = {
    totalRevenue: 1250000 * multiplier,
    revenueChange: 12.5,
    totalExpenses: 875000 * multiplier,
    expensesChange: 8.3,
    netProfit: 375000 * multiplier,
    profitChange: 15.2,
    cashFlow: 425000 * multiplier,
    cashFlowChange: 10.8,
  }

  // 生成趋势数据
  const trends = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const date = new Date(now)
    date.setMonth(now.getMonth() - i)
    const monthName = date.toLocaleString("zh-CN", { month: "short" })

    trends.unshift({
      date: monthName,
      revenue: Math.round(800000 + Math.random() * 400000),
      expenses: Math.round(600000 + Math.random() * 200000),
      profit: Math.round(200000 + Math.random() * 200000),
    })
  }

  // 生成收支明细数据
  const breakdown = [
    { category: "销售收入", amount: 850000, percentage: 68 },
    { category: "服务费", amount: 250000, percentage: 20 },
    { category: "其他收入", amount: 150000, percentage: 12 },
    { category: "人力成本", amount: 450000, percentage: 51.4 },
    { category: "运营成本", amount: 200000, percentage: 22.9 },
    { category: "市场营销", amount: 125000, percentage: 14.3 },
    { category: "其他支出", amount: 100000, percentage: 11.4 },
  ]

  // 生成财务指标数据
  const metrics = [
    { name: "利润率", value: 30, change: 2.5, status: "up" as const },
    { name: "资产回报率", value: 15.2, change: 1.8, status: "up" as const },
    { name: "负债比率", value: 42, change: -3.5, status: "down" as const },
    { name: "流动比率", value: 2.1, change: 0.3, status: "up" as const },
    { name: "存货周转率", value: 8.5, change: 0.7, status: "up" as const },
    { name: "应收账款周转率", value: 12.3, change: -0.5, status: "down" as const },
    { name: "营运资金", value: 750000, change: 12.5, status: "up" as const },
    { name: "股本回报率", value: 22.5, change: 3.2, status: "up" as const },
  ]

  // 生成报告数据
  const reports = [
    {
      title: "月度财务报告",
      description: "详细的月度财务状况和业绩分析",
      url: "/reports/monthly",
    },
    {
      title: "季度财务报告",
      description: "季度财务表现和趋势分析",
      url: "/reports/quarterly",
    },
    {
      title: "年度财务报告",
      description: "全面的年度财务分析和预测",
      url: "/reports/annual",
    },
    {
      title: "现金流报告",
      description: "详细的现金流入和流出分析",
      url: "/reports/cash-flow",
    },
    {
      title: "预算执行报告",
      description: "预算执行情况和差异分析",
      url: "/reports/budget",
    },
    {
      title: "投资回报分析",
      description: "各项投资的回报率和绩效分析",
      url: "/reports/roi",
    },
  ]

  // 生成洞察数据
  const insights = [
    {
      title: "收入增长趋势积极",
      description: "过去三个月的收入增长率持续上升，表明市场需求强劲。",
      impact: "positive" as const,
    },
    {
      title: "运营成本上升",
      description: "运营成本比上季度增加了8.3%，需要关注成本控制。",
      impact: "negative" as const,
    },
    {
      title: "新产品线表现优异",
      description: "新推出的产品线贡献了15%的总收入，超过预期目标。",
      impact: "positive" as const,
    },
    {
      title: "现金流状况改善",
      description: "现金流比上季度增加了10.8%，财务状况更加稳健。",
      impact: "positive" as const,
    },
    {
      title: "应收账款周转率下降",
      description: "应收账款周转率下降，表明收款效率降低，需要加强应收账款管理。",
      impact: "negative" as const,
    },
    {
      title: "毛利率保持稳定",
      description: "尽管成本上升，毛利率仍保持在30%左右，表明定价策略有效。",
      impact: "neutral" as const,
    },
  ]

  return {
    summary,
    trends,
    breakdown,
    metrics,
    reports,
    insights,
  }
}

// 获取财务指标
export function getFinancialMetrics(data: FinancialData[]) {
  if (!data || data.length === 0) return null

  const latestData = data[data.length - 1]
  const previousData = data.length > 1 ? data[data.length - 2] : null

  // 计算关键财务指标
  const profitMargin = (latestData.profit / latestData.revenue) * 100
  const returnOnAssets = (latestData.profit / latestData.assets) * 100
  const debtToEquity = latestData.liabilities / latestData.equity
  const currentRatio = 1.5 // 假设的流动比率

  // 计算同比变化
  const yoyChange = previousData
    ? {
        revenue: ((latestData.revenue - previousData.revenue) / previousData.revenue) * 100,
        profit: ((latestData.profit - previousData.profit) / previousData.profit) * 100,
        cashFlow: ((latestData.cashFlow - previousData.cashFlow) / previousData.cashFlow) * 100,
      }
    : null

  return {
    profitMargin,
    returnOnAssets,
    debtToEquity,
    currentRatio,
    yoyChange,
  }
}
