// 财务数据类型定义
export interface FinancialSummary {
  totalRevenue: number
  revenueChange: number
  totalExpenses: number
  expensesChange: number
  netProfit: number
  profitChange: number
  cashFlow: number
  cashFlowChange: number
}

export interface FinancialTrend {
  date: string
  revenue: number
  expenses: number
  profit: number
}

export interface FinancialBreakdownItem {
  category: string
  amount: number
  percentage: number
}

export interface FinancialMetric {
  name: string
  value: number
  change: number
  description: string
}

export interface FinancialReport {
  title: string
  description: string
  date: string
  url: string
}

export interface FinancialInsight {
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
  actionable: boolean
  action?: string
}

export interface FinancialData {
  summary: FinancialSummary
  trends: FinancialTrend[]
  breakdown: FinancialBreakdownItem[]
  metrics: FinancialMetric[]
  reports: FinancialReport[]
  insights: FinancialInsight[]
}

// API函数
export async function fetchFinancialData(period: string): Promise<FinancialData> {
  try {
    // 实际应用中，这里应该调用真实的API
    // const response = await fetch(`/api/financial-data?period=${period}`)
    // if (!response.ok) throw new Error('Failed to fetch financial data')
    // return await response.json()

    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 返回模拟数据
    return {
      summary: {
        totalRevenue: 1250000 + Math.random() * 100000,
        revenueChange: 12.5,
        totalExpenses: 850000 + Math.random() * 50000,
        expensesChange: 8.3,
        netProfit: 400000 + Math.random() * 30000,
        profitChange: 15.2,
        cashFlow: 320000 + Math.random() * 20000,
        cashFlowChange: 10.8,
      },
      trends: [
        { date: "1月", revenue: 100000, expenses: 70000, profit: 30000 },
        { date: "2月", revenue: 120000, expenses: 75000, profit: 45000 },
        { date: "3月", revenue: 130000, expenses: 80000, profit: 50000 },
        { date: "4月", revenue: 140000, expenses: 85000, profit: 55000 },
        { date: "5月", revenue: 150000, expenses: 90000, profit: 60000 },
        { date: "6月", revenue: 160000, expenses: 95000, profit: 65000 },
      ],
      breakdown: [
        { category: "产品销售", amount: 750000, percentage: 60 },
        { category: "服务收入", amount: 375000, percentage: 30 },
        { category: "其他收入", amount: 125000, percentage: 10 },
      ],
      metrics: [
        { name: "毛利率", value: 35.2, change: 2.1, description: "销售收入减去销售成本后的百分比" },
        { name: "净利率", value: 18.5, change: 1.5, description: "净利润与总收入的比率" },
        { name: "资产回报率", value: 12.3, change: 0.8, description: "净利润与总资产的比率" },
        { name: "股本回报率", value: 21.5, change: 1.2, description: "净利润与股东权益的比率" },
        { name: "流动比率", value: 2.1, change: 0.3, description: "流动资产与流动负债的比率" },
        { name: "速动比率", value: 1.5, change: 0.2, description: "速动资产与流动负债的比率" },
      ],
      reports: [
        { title: "月度财务报告", description: "详细的月度财务状况和业绩分析", date: "2023-06-30", url: "#" },
        { title: "季度财务报告", description: "第二季度财务状况和业绩的综合分析", date: "2023-06-30", url: "#" },
        { title: "年度财务报告", description: "年度财务状况和业绩的全面分析", date: "2022-12-31", url: "#" },
      ],
      insights: [
        {
          title: "收入增长趋势强劲",
          description: "过去6个月的收入持续增长，显示业务扩展良好。",
          impact: "positive",
          actionable: false,
        },
        {
          title: "费用增长率高于预期",
          description: "运营费用增长率超过预算，需要进一步控制成本。",
          impact: "negative",
          actionable: true,
          action: "审查成本结构并识别节约机会",
        },
        {
          title: "现金流状况稳定",
          description: "现金流保持稳定，足以支持当前的业务运营和短期投资。",
          impact: "neutral",
          actionable: false,
        },
      ],
    }
  } catch (error) {
    console.error("获取财务数据失败:", error)
    throw new Error("获取财务数据失败")
  }
}
