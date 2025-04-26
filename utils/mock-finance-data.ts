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

// 生成模拟财务数据
export function getMockFinancialData(companyId = "comp_001", userId = "usr_001"): FinancialData[] {
  const data: FinancialData[] = []

  // 生成2023年和2024年的季度数据
  for (const year of [2023, 2024]) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      // 如果是2024年且季度>1，则跳过（假设当前只有2024年Q1的数据）
      if (year === 2024 && quarter > 1) continue

      // 基础数值，随着时间增长而增加
      const baseRevenue = 1000000 + (year - 2023) * 200000 + (quarter - 1) * 50000
      const baseExpenses = baseRevenue * 0.8
      const baseProfit = baseRevenue - baseExpenses
      const baseCashFlow = baseProfit * 0.9
      const baseAssets = 5000000 + (year - 2023) * 500000 + (quarter - 1) * 100000
      const baseLiabilities = baseAssets * 0.4
      const baseEquity = baseAssets - baseLiabilities

      // 添加一些随机波动
      const randomFactor = 0.9 + Math.random() * 0.2 // 0.9到1.1之间的随机数

      data.push({
        id: `fin_${year}_${quarter}`,
        year,
        quarter,
        revenue: Math.round(baseRevenue * randomFactor),
        expenses: Math.round(baseExpenses * randomFactor),
        profit: Math.round(baseProfit * randomFactor),
        cashFlow: Math.round(baseCashFlow * randomFactor),
        assets: Math.round(baseAssets * randomFactor),
        liabilities: Math.round(baseLiabilities * randomFactor),
        equity: Math.round(baseEquity * randomFactor),
        companyId,
        userId,
      })
    }
  }

  return data
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
