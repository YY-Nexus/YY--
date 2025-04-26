// 检测财务异常

export function detectFinancialAnomalies(financialData: any) {
  // 模拟检测财务异常
  // 实际应用中，这里应该有更复杂的异常检测逻辑

  const anomalies = []

  // 模拟一些可能的异常
  if (Math.random() > 0.7) {
    anomalies.push({
      title: "毛利率异常下降",
      description: "最近三个月毛利率持续下降，低于行业平均水平。",
      severity: "高",
      metrics: {
        当前毛利率: "18.5%",
        行业平均: "26.3%",
        变化趋势: "↓ 5.2%",
      },
    })
  }

  if (Math.random() > 0.6) {
    anomalies.push({
      title: "应收账款周转率下降",
      description: "应收账款周转率低于历史平均水平，可能存在回款问题。",
      severity: "中",
      metrics: {
        当前周转率: "4.2次/年",
        历史平均: "6.8次/年",
        变化趋势: "↓ 38.2%",
      },
    })
  }

  if (Math.random() > 0.8) {
    anomalies.push({
      title: "现金流量比率过低",
      description: "经营活动现金流量净额与流动负债比率过低，可能面临短期偿债压力。",
      severity: "高",
      metrics: {
        当前比率: "0.32",
        安全水平: ">0.5",
        变化趋势: "↓ 15.8%",
      },
    })
  }

  if (Math.random() > 0.75) {
    anomalies.push({
      title: "存货周转率异常",
      description: "存货周转率显著低于行业平均，可能存在库存积压问题。",
      severity: "中",
      metrics: {
        当前周转率: "3.1次/年",
        行业平均: "5.4次/年",
        变化趋势: "↓ 12.5%",
      },
    })
  }

  if (Math.random() > 0.85) {
    anomalies.push({
      title: "销售费用率异常增长",
      description: "销售费用占收入比例持续上升，高于历史水平。",
      severity: "低",
      metrics: {
        当前比率: "15.8%",
        历史平均: "12.3%",
        变化趋势: "↑ 28.5%",
      },
    })
  }

  return anomalies
}
