// 生成改进建议

export function generateImprovementSuggestions(financialData: any, healthScore: any, anomalies: any[]) {
  // 模拟生成改进建议
  // 实际应用中，这里应该基于财务健康评分和检测到的异常生成更有针对性的建议

  const suggestions = {
    profitability: [] as any[],
    liquidity: [] as any[],
    solvency: [] as any[],
    efficiency: [] as any[],
    growth: [] as any[],
  }

  // 根据健康评分生成建议
  if (healthScore.profitability < 70) {
    suggestions.profitability.push({
      title: "提高毛利率",
      description: "当前毛利率低于行业平均水平，影响整体盈利能力。",
      actions: [
        "优化产品结构，提高高毛利产品的销售比例",
        "与供应商重新谈判，降低原材料采购成本",
        "适当提高产品定价，关注价值营销",
      ],
    })

    suggestions.profitability.push({
      title: "控制销售费用",
      description: "销售费用率高于历史平均水平，挤压利润空间。",
      actions: [
        "审查销售渠道效率，优化低效渠道",
        "加强销售费用预算管理，设定合理的费用上限",
        "提高销售团队效率，优化激励机制",
      ],
    })
  }

  if (healthScore.liquidity < 75) {
    suggestions.liquidity.push({
      title: "改善现金流管理",
      description: "经营活动现金流量不足，可能面临短期偿债压力。",
      actions: [
        "加强应收账款管理，缩短回款周期",
        "优化存货管理，减少资金占用",
        "与供应商协商延长付款期限",
        "考虑实施现金折扣政策，鼓励客户提前付款",
      ],
    })
  }

  if (healthScore.efficiency < 65) {
    suggestions.efficiency.push({
      title: "提高存货周转率",
      description: "存货周转率低于行业平均，资金占用效率不高。",
      actions: [
        "实施精益库存管理，减少安全库存",
        "优化需求预测，减少过量采购",
        "处理滞销和过时库存",
        "考虑实施JIT（准时制）生产模式",
      ],
    })

    suggestions.efficiency.push({
      title: "提高应收账款周转率",
      description: "应收账款周转率下降，回款效率降低。",
      actions: [
        "审查客户信用政策，对高风险客户实施更严格的信用条件",
        "加强应收账款跟踪和催收",
        "考虑实施早付折扣政策",
        "对长期拖欠的客户采取法律措施",
      ],
    })
  }

  // 根据检测到的异常生成建议
  anomalies.forEach((anomaly) => {
    if (anomaly.title.includes("毛利率")) {
      if (!suggestions.profitability.some((s) => s.title === "提高毛利率")) {
        suggestions.profitability.push({
          title: "提高毛利率",
          description: "毛利率异常下降，需要采取措施恢复盈利能力。",
          actions: [
            "分析产品成本结构，识别成本上升的关键因素",
            "考虑产品重新定价或调整产品组合",
            "寻找替代供应商或原材料，降低成本",
          ],
        })
      }
    }

    if (anomaly.title.includes("现金流")) {
      if (!suggestions.liquidity.some((s) => s.title === "改善现金流管理")) {
        suggestions.liquidity.push({
          title: "改善现金流管理",
          description: "现金流量比率过低，需要加强现金流管理。",
          actions: [
            "制定详细的现金流预测和管理计划",
            "考虑出售非核心资产，回收现金",
            "评估是否需要寻求短期融资支持",
            "暂缓非必要的资本支出",
          ],
        })
      }
    }

    if (anomaly.title.includes("应收账款")) {
      if (!suggestions.efficiency.some((s) => s.title === "提高应收账款周转率")) {
        suggestions.efficiency.push({
          title: "提高应收账款周转率",
          description: "应收账款周转率异常下降，需要加强应收账款管理。",
          actions: [
            "实施更严格的信用审核流程",
            "为销售团队设定应收账款管理目标",
            "考虑使用保理服务加速回款",
            "定期审查大额应收账款",
          ],
        })
      }
    }
  })

  // 添加一些增长相关的建议
  suggestions.growth.push({
    title: "拓展新市场",
    description: "当前市场增长放缓，需要寻找新的增长点。",
    actions: [
      "研究潜在的新市场机会",
      "开发针对新细分市场的产品或服务",
      "考虑通过合作伙伴关系进入新市场",
      "评估国际市场扩张的可行性",
    ],
  })

  suggestions.growth.push({
    title: "提高客户留存率",
    description: "提高现有客户的留存率和复购率，降低获客成本。",
    actions: [
      "实施客户忠诚度计划",
      "加强售后服务和客户支持",
      "定期收集客户反馈并及时响应",
      "开发交叉销售和追加销售策略",
    ],
  })

  return suggestions
}
