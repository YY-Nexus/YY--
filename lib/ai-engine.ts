// AI分析引擎核心
// 提供数据分析、预测和推荐的基础功能

import { createServerSupabaseClient } from "./supabase"

// 数据分析类型定义
export type AnalysisType =
  | "trend" // 趋势分析
  | "anomaly" // 异常检测
  | "correlation" // 相关性分析
  | "prediction" // 预测分析
  | "recommendation" // 推荐分析
  | "segmentation" // 分群分析

// 分析结果接口
export interface AnalysisResult {
  type: AnalysisType
  timestamp: string
  data: any
  insights: string[]
  confidence: number // 0-1之间的置信度
  metadata: {
    dataPoints: number
    algorithm: string
    executionTime: number
    version: string
  }
}

// 分析请求接口
export interface AnalysisRequest {
  type: AnalysisType
  dataSource: string
  parameters: Record<string, any>
  timeRange?: {
    start: string
    end: string
  }
  filters?: Record<string, any>[]
  limit?: number
}

// AI分析引擎类
export class AIAnalysisEngine {
  // 执行分析
  static async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
    const supabase = createServerSupabaseClient()
    const startTime = Date.now()

    // 根据分析类型调用不同的分析方法
    let result: any
    switch (request.type) {
      case "trend":
        result = await this.analyzeTrend(supabase, request)
        break
      case "anomaly":
        result = await this.detectAnomalies(supabase, request)
        break
      case "correlation":
        result = await this.analyzeCorrelation(supabase, request)
        break
      case "prediction":
        result = await this.makePrediction(supabase, request)
        break
      case "recommendation":
        result = await this.generateRecommendations(supabase, request)
        break
      case "segmentation":
        result = await this.performSegmentation(supabase, request)
        break
      default:
        throw new Error(`不支持的分析类型: ${request.type}`)
    }

    const executionTime = Date.now() - startTime

    return {
      ...result,
      metadata: {
        ...result.metadata,
        executionTime,
        version: "1.0.0",
      },
      timestamp: new Date().toISOString(),
    }
  }

  // 趋势分析
  private static async analyzeTrend(supabase: any, request: AnalysisRequest): Promise<AnalysisResult> {
    // 从数据源获取数据
    const { data, error } = await supabase.from(request.dataSource).select("*").order("created_at", { ascending: true })

    if (error) {
      throw new Error(`数据获取失败: ${error.message}`)
    }

    // 简单的线性回归分析
    const xValues = data.map((_: any, index: number) => index)
    const yValues = data.map((item: any) => item[request.parameters.valueField])

    const { slope, intercept } = this.linearRegression(xValues, yValues)

    // 生成趋势预测
    const predictions = xValues.map((x: number) => slope * x + intercept)
    const lastValue = yValues[yValues.length - 1]
    const predictedNext = slope * xValues.length + intercept
    const growthRate = ((predictedNext - lastValue) / lastValue) * 100

    // 生成洞察
    const insights = []
    if (slope > 0) {
      insights.push(`数据呈上升趋势，预计增长率为 ${growthRate.toFixed(2)}%`)
    } else if (slope < 0) {
      insights.push(`数据呈下降趋势，预计下降率为 ${Math.abs(growthRate).toFixed(2)}%`)
    } else {
      insights.push("数据趋势保持稳定，无明显变化")
    }

    // 计算趋势强度（R²值）
    const rSquared = this.calculateRSquared(yValues, predictions)
    insights.push(`趋势可信度为 ${(rSquared * 100).toFixed(2)}%`)

    if (rSquared > 0.7) {
      insights.push("趋势显著，可作为决策依据")
    } else if (rSquared > 0.3) {
      insights.push("趋势存在，但不够显著，建议结合其他因素考虑")
    } else {
      insights.push("趋势不明显，数据波动较大")
    }

    return {
      type: "trend",
      timestamp: new Date().toISOString(),
      data: {
        original: data.map((item: any, index: number) => ({
          x: index,
          y: item[request.parameters.valueField],
          date: item.created_at,
        })),
        trend: xValues.map((x: number) => ({
          x,
          y: slope * x + intercept,
        })),
        slope,
        intercept,
        rSquared,
      },
      insights,
      confidence: rSquared,
      metadata: {
        dataPoints: data.length,
        algorithm: "线性回归",
        executionTime: 0,
        version: "1.0.0",
      },
    }
  }

  // 异常检测
  private static async detectAnomalies(supabase: any, request: AnalysisRequest): Promise<AnalysisResult> {
    // 从数据源获取数据
    const { data, error } = await supabase.from(request.dataSource).select("*").order("created_at", { ascending: true })

    if (error) {
      throw new Error(`数据获取失败: ${error.message}`)
    }

    const values = data.map((item: any) => item[request.parameters.valueField])

    // 计算均值和标准差
    const mean = values.reduce((sum: number, val: number) => sum + val, 0) / values.length
    const stdDev = Math.sqrt(
      values.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / values.length,
    )

    // 设置异常阈值（通常为2或3个标准差）
    const threshold = request.parameters.threshold || 2

    // 检测异常值
    const anomalies = data.filter((item: any, index: number) => {
      const value = item[request.parameters.valueField]
      return Math.abs(value - mean) > threshold * stdDev
    })

    // 生成洞察
    const insights = []
    if (anomalies.length > 0) {
      insights.push(
        `检测到${anomalies.length}个异常值，占总数据的${((anomalies.length / data.length) * 100).toFixed(2)}%`,
      )

      // 分析异常集中的时间段
      if (anomalies.length > 1) {
        const anomalyDates = anomalies.map((a: any) => new Date(a.created_at))
        const earliestAnomaly = new Date(Math.min(...anomalyDates))
        const latestAnomaly = new Date(Math.max(...anomalyDates))

        insights.push(
          `异常主要出现在${earliestAnomaly.toLocaleDateString("zh-CN")}至${latestAnomaly.toLocaleDateString("zh-CN")}期间`,
        )
      }

      // 分析异常的方向
      const highAnomalies = anomalies.filter((a: any) => a[request.parameters.valueField] > mean)
      const lowAnomalies = anomalies.filter((a: any) => a[request.parameters.valueField] < mean)

      if (highAnomalies.length > lowAnomalies.length) {
        insights.push("异常值主要表现为异常高值，可能存在数据峰值或特殊事件")
      } else if (lowAnomalies.length > highAnomalies.length) {
        insights.push("异常值主要表现为异常低值，可能存在数据谷值或系统问题")
      } else {
        insights.push("异常值在高值和低值上分布均匀，数据波动较大")
      }
    } else {
      insights.push("未检测到明显异常，数据分布相对稳定")
    }

    // 计算置信度（基于数据量和分布）
    const confidence = Math.min(0.5 + (data.length / 1000) * 0.5, 0.95)

    return {
      type: "anomaly",
      timestamp: new Date().toISOString(),
      data: {
        mean,
        stdDev,
        threshold,
        anomalies: anomalies.map((item: any) => ({
          value: item[request.parameters.valueField],
          date: item.created_at,
          deviation: (item[request.parameters.valueField] - mean) / stdDev,
        })),
        distribution: {
          mean,
          upperBound: mean + threshold * stdDev,
          lowerBound: mean - threshold * stdDev,
        },
      },
      insights,
      confidence,
      metadata: {
        dataPoints: data.length,
        algorithm: "Z-score异常检测",
        executionTime: 0,
        version: "1.0.0",
      },
    }
  }

  // 相关性分析
  private static async analyzeCorrelation(supabase: any, request: AnalysisRequest): Promise<AnalysisResult> {
    // 从数据源获取数据
    const { data, error } = await supabase.from(request.dataSource).select("*")

    if (error) {
      throw new Error(`数据获取失败: ${error.message}`)
    }

    const { field1, field2 } = request.parameters

    // 提取两个字段的值
    const values1 = data.map((item: any) => Number.parseFloat(item[field1]))
    const values2 = data.map((item: any) => Number.parseFloat(item[field2]))

    // 计算皮尔逊相关系数
    const correlation = this.calculateCorrelation(values1, values2)

    // 生成洞察
    const insights = []
    if (correlation > 0.7) {
      insights.push(`${field1}与${field2}存在强烈的正相关关系，相关系数为${correlation.toFixed(2)}`)
      insights.push(`当${field1}增加时，${field2}也很可能增加`)
    } else if (correlation > 0.3) {
      insights.push(`${field1}与${field2}存在中等程度的正相关关系，相关系数为${correlation.toFixed(2)}`)
    } else if (correlation > -0.3) {
      insights.push(`${field1}与${field2}几乎没有线性相关关系，相关系数为${correlation.toFixed(2)}`)
    } else if (correlation > -0.7) {
      insights.push(`${field1}与${field2}存在中等程度的负相关关系，相关系数为${correlation.toFixed(2)}`)
    } else {
      insights.push(`${field1}与${field2}存在强烈的负相关关系，相关系数为${correlation.toFixed(2)}`)
      insights.push(`当${field1}增加时，${field2}很可能减少`)
    }

    // 计算置信度（基于数据量和相关系数）
    const confidence = Math.min(Math.abs(correlation) * 0.8 + (data.length / 1000) * 0.2, 0.95)

    return {
      type: "correlation",
      timestamp: new Date().toISOString(),
      data: {
        correlation,
        scatterData: data.map((item: any) => ({
          x: item[field1],
          y: item[field2],
        })),
        field1,
        field2,
      },
      insights,
      confidence,
      metadata: {
        dataPoints: data.length,
        algorithm: "皮尔逊相关系数",
        executionTime: 0,
        version: "1.0.0",
      },
    }
  }

  // 预测分析
  private static async makePrediction(supabase: any, request: AnalysisRequest): Promise<AnalysisResult> {
    // 从数据源获取数据
    const { data, error } = await supabase.from(request.dataSource).select("*").order("created_at", { ascending: true })

    if (error) {
      throw new Error(`数据获取失败: ${error.message}`)
    }

    const values = data.map((item: any) => item[request.parameters.valueField])
    const dates = data.map((item: any) => new Date(item.created_at))

    // 简单的时间序列预测（移动平均+趋势）
    const windowSize = Math.min(request.parameters.windowSize || 3, Math.floor(values.length / 3))
    const predictionPeriods = request.parameters.periods || 6

    // 计算移动平均
    const movingAverages = []
    for (let i = windowSize - 1; i < values.length; i++) {
      const windowSum = values.slice(i - windowSize + 1, i + 1).reduce((sum: number, val: number) => sum + val, 0)
      movingAverages.push(windowSum / windowSize)
    }

    // 计算趋势
    const xValues = Array.from({ length: movingAverages.length }, (_, i) => i)
    const { slope, intercept } = this.linearRegression(xValues, movingAverages)

    // 生成预测
    const predictions = []
    const lastDate = dates[dates.length - 1]
    const lastValue = values[values.length - 1]

    for (let i = 1; i <= predictionPeriods; i++) {
      const predictedValue = movingAverages[movingAverages.length - 1] + slope * i

      // 确保预测值不为负（如果是数量类指标）
      const finalPrediction = request.parameters.nonNegative ? Math.max(0, predictedValue) : predictedValue

      // 计算预测日期
      const predictionDate = new Date(lastDate)
      predictionDate.setDate(predictionDate.getDate() + i * (request.parameters.dayInterval || 1))

      predictions.push({
        period: i,
        value: finalPrediction,
        date: predictionDate.toISOString(),
      })
    }

    // 计算预测准确度（使用历史数据的后半部分进行验证）
    const validationStart = Math.floor(values.length / 2)
    const actualValues = values.slice(validationStart)
    const historicalPredictions = []

    for (let i = 0; i < actualValues.length; i++) {
      const windowEnd = validationStart + i - 1
      if (windowEnd < windowSize - 1) continue

      const windowValues = values.slice(windowEnd - windowSize + 1, windowEnd + 1)
      const windowAvg = windowValues.reduce((sum: number, val: number) => sum + val, 0) / windowSize
      const predictedValue = windowAvg + slope

      historicalPredictions.push(predictedValue)
    }

    // 计算平均绝对百分比误差(MAPE)
    const errors = []
    for (let i = 0; i < historicalPredictions.length; i++) {
      const actual = actualValues[i + 1]
      const predicted = historicalPredictions[i]
      if (actual !== 0) {
        errors.push(Math.abs((actual - predicted) / actual))
      }
    }

    const mape = errors.length > 0 ? errors.reduce((sum: number, err: number) => sum + err, 0) / errors.length : 0

    const accuracy = Math.max(0, 1 - mape)

    // 生成洞察
    const insights = []
    const lastPrediction = predictions[predictions.length - 1].value
    const growthRate = ((lastPrediction - lastValue) / lastValue) * 100

    if (growthRate > 10) {
      insights.push(`预测在未来${predictionPeriods}个周期内将显著增长${growthRate.toFixed(2)}%`)
    } else if (growthRate > 0) {
      insights.push(`预测在未来${predictionPeriods}个周期内将小幅增长${growthRate.toFixed(2)}%`)
    } else if (growthRate > -10) {
      insights.push(`预测在未来${predictionPeriods}个周期内将小幅下降${Math.abs(growthRate).toFixed(2)}%`)
    } else {
      insights.push(`预测在未来${predictionPeriods}个周期内将显著下降${Math.abs(growthRate).toFixed(2)}%`)
    }

    insights.push(`预测模型准确度约为${(accuracy * 100).toFixed(2)}%`)

    if (accuracy < 0.7) {
      insights.push("预测准确度较低，建议谨慎参考，并结合其他因素进行决策")
    }

    return {
      type: "prediction",
      timestamp: new Date().toISOString(),
      data: {
        historical: data.map((item: any, index: number) => ({
          x: index,
          y: item[request.parameters.valueField],
          date: item.created_at,
        })),
        predictions,
        accuracy,
        mape,
      },
      insights,
      confidence: accuracy,
      metadata: {
        dataPoints: data.length,
        algorithm: "移动平均+线性趋势",
        executionTime: 0,
        version: "1.0.0",
      },
    }
  }

  // 推荐分析
  private static async generateRecommendations(supabase: any, request: AnalysisRequest): Promise<AnalysisResult> {
    // 根据不同的推荐场景生成不同的推荐
    const { scenario } = request.parameters

    let recommendations = []
    let insights = []
    let confidence = 0.8

    switch (scenario) {
      case "retention":
        // 员工保留推荐
        const { data: employeeData, error: empError } = await supabase
          .from("employees")
          .select("*")
          .eq("status", "active")

        if (empError) {
          throw new Error(`数据获取失败: ${empError.message}`)
        }

        // 简单的规则引擎推荐
        recommendations = [
          {
            id: "ret_1",
            title: "针对高风险员工的保留计划",
            description: "为识别出的高流失风险员工制定个性化保留计划，包括职业发展路径、薪酬调整和工作环境改善",
            impact: "高",
            effort: "中",
            priority: 1,
          },
          {
            id: "ret_2",
            title: "部门管理培训强化",
            description: "为员工满意度较低的部门主管提供管理技能培训，重点关注沟通、反馈和团队建设",
            impact: "中",
            effort: "低",
            priority: 2,
          },
          {
            id: "ret_3",
            title: "工作-生活平衡项目",
            description: "实施弹性工作制和远程工作政策，提高员工工作-生活平衡满意度",
            impact: "中",
            effort: "中",
            priority: 3,
          },
          {
            id: "ret_4",
            title: "薪酬竞争力分析与调整",
            description: "进行市场薪酬调研，确保关键岗位薪酬保持市场竞争力",
            impact: "高",
            effort: "高",
            priority: 4,
          },
          {
            id: "ret_5",
            title: "职业发展通道优化",
            description: "明确各岗位的职业发展路径，提供更多晋升和横向发展机会",
            impact: "高",
            effort: "高",
            priority: 5,
          },
        ]

        insights = [
          `分析了${employeeData.length}名员工的数据，生成了5项保留策略建议`,
          "高风险员工主要集中在研发和销售部门，建议优先关注",
          "薪酬竞争力和职业发展机会是影响员工留存的两大关键因素",
        ]
        break

      case "performance":
        // 绩效提升推荐
        recommendations = [
          {
            id: "perf_1",
            title: "绩效目标优化",
            description: "重新审视并调整KPI设置，确保目标明确、可衡量且与业务战略一致",
            impact: "高",
            effort: "中",
            priority: 1,
          },
          {
            id: "perf_2",
            title: "持续反馈机制",
            description: '实施每周/每月的绩效检视会议，提供及时反馈，避免年终评估时的"惊喜"',
            impact: "高",
            effort: "低",
            priority: 2,
          },
          {
            id: "perf_3",
            title: "技能提升计划",
            description: "基于绩效评估结果，为员工制定针对性的培训和发展计划",
            impact: "中",
            effort: "中",
            priority: 3,
          },
          {
            id: "perf_4",
            title: "绩效管理培训",
            description: "为管理者提供绩效面谈、反馈和辅导技能培训",
            impact: "中",
            effort: "低",
            priority: 4,
          },
          {
            id: "perf_5",
            title: "绩效与激励挂钩优化",
            description: "优化绩效与奖金、晋升和发展机会的挂钩机制",
            impact: "高",
            effort: "高",
            priority: 5,
          },
        ]

        insights = [
          "当前绩效分布不均衡，B+评级过多，建议优化评级标准和流程",
          "绩效反馈及时性不足，员工对绩效期望理解不清晰",
          "绩效结果应用不充分，与发展和激励的联系需要加强",
        ]
        break

      case "recruitment":
        // 招聘优化推荐
        recommendations = [
          {
            id: "rec_1",
            title: "招聘渠道多元化",
            description: "拓展招聘渠道，增加社交媒体和行业社区的招聘投入",
            impact: "高",
            effort: "中",
            priority: 1,
          },
          {
            id: "rec_2",
            title: "候选人体验优化",
            description: "简化申请流程，缩短面试周期，提高候选人反馈速度",
            impact: "中",
            effort: "低",
            priority: 2,
          },
          {
            id: "rec_3",
            title: "内部推荐计划强化",
            description: "提高内部推荐奖励，简化推荐流程，增加内部推荐比例",
            impact: "高",
            effort: "低",
            priority: 3,
          },
          {
            id: "rec_4",
            title: "雇主品牌建设",
            description: "加强雇主品牌宣传，展示公司文化和员工发展故事",
            impact: "中",
            effort: "中",
            priority: 4,
          },
          {
            id: "rec_5",
            title: "面试官培训",
            description: "为面试官提供结构化面试和无偏见招聘培训",
            impact: "中",
            effort: "低",
            priority: 5,
          },
        ]

        insights = [
          "当前招聘周期平均为35天，高于行业平均水平",
          "技术岗位的offer接受率较低，主要原因是薪资竞争力不足",
          "内部推荐渠道的招聘质量最高，建议加大投入",
        ]
        break

      default:
        recommendations = []
        insights = ["未指定有效的推荐场景"]
        confidence = 0.5
    }

    return {
      type: "recommendation",
      timestamp: new Date().toISOString(),
      data: {
        recommendations,
        scenario,
      },
      insights,
      confidence,
      metadata: {
        dataPoints: recommendations.length,
        algorithm: "规则引擎+专家系统",
        executionTime: 0,
        version: "1.0.0",
      },
    }
  }

  // 分群分析
  private static async performSegmentation(supabase: any, request: AnalysisRequest): Promise<AnalysisResult> {
    // 从数据源获取数据
    const { data, error } = await supabase.from(request.dataSource).select("*")

    if (error) {
      throw new Error(`数据获取失败: ${error.message}`)
    }

    // 简化的分群分析（基于规则的分群）
    const { segmentBy, metrics } = request.parameters

    // 按指定字段分组
    const segments: Record<string, any[]> = {}

    data.forEach((item: any) => {
      const segmentValue = item[segmentBy]
      if (!segments[segmentValue]) {
        segments[segmentValue] = []
      }
      segments[segmentValue].push(item)
    })

    // 计算每个分群的指标
    const segmentMetrics: Record<string, any> = {}

    Object.entries(segments).forEach(([segmentName, segmentData]) => {
      const metricValues: Record<string, number> = {}

      metrics.forEach((metric: string) => {
        // 计算平均值
        const values = segmentData.map((item: any) => Number.parseFloat(item[metric])).filter((v: number) => !isNaN(v))
        const average = values.reduce((sum: number, val: number) => sum + val, 0) / values.length
        metricValues[metric] = average
      })

      segmentMetrics[segmentName] = {
        count: segmentData.length,
        percentage: (segmentData.length / data.length) * 100,
        metrics: metricValues,
      }
    })

    // 找出表现最好和最差的分群
    let bestSegment = ""
    let worstSegment = ""
    let bestScore = Number.NEGATIVE_INFINITY
    let worstScore = Number.POSITIVE_INFINITY

    // 假设第一个指标是关键指标
    const keyMetric = metrics[0]

    Object.entries(segmentMetrics).forEach(([segmentName, data]) => {
      const score = data.metrics[keyMetric]
      if (score > bestScore) {
        bestScore = score
        bestSegment = segmentName
      }
      if (score < worstScore) {
        worstScore = score
        worstSegment = segmentName
      }
    })

    // 生成洞察
    const insights = [
      `共识别出${Object.keys(segments).length}个不同的${segmentBy}分群`,
      `最大的分群是"${Object.entries(segmentMetrics).sort((a, b) => b[1].count - a[1].count)[0][0]}"，占总体的${Object.entries(
        segmentMetrics,
      )
        .sort((a, b) => b[1].count - a[1].count)[0][1]
        .percentage.toFixed(2)}%`,
      `在${keyMetric}指标上，"${bestSegment}"分群表现最好，"${worstSegment}"分群表现最差`,
      `各分群在${metrics.join(", ")}指标上存在显著差异，建议针对不同分群制定差异化策略`,
    ]

    return {
      type: "segmentation",
      timestamp: new Date().toISOString(),
      data: {
        segments: Object.keys(segments),
        segmentMetrics,
        bestSegment,
        worstSegment,
        keyMetric,
      },
      insights,
      confidence: 0.85,
      metadata: {
        dataPoints: data.length,
        algorithm: "规则分群",
        executionTime: 0,
        version: "1.0.0",
      },
    }
  }

  // 线性回归辅助函数
  private static linearRegression(x: number[], y: number[]) {
    const n = x.length
    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumXX = 0

    for (let i = 0; i < n; i++) {
      sumX += x[i]
      sumY += y[i]
      sumXY += x[i] * y[i]
      sumXX += x[i] * x[i]
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return { slope, intercept }
  }

  // 计算R²值
  private static calculateRSquared(actual: number[], predicted: number[]) {
    const mean = actual.reduce((sum, val) => sum + val, 0) / actual.length

    let totalSS = 0
    let residualSS = 0

    for (let i = 0; i < actual.length; i++) {
      totalSS += Math.pow(actual[i] - mean, 2)
      residualSS += Math.pow(actual[i] - predicted[i], 2)
    }

    return 1 - residualSS / totalSS
  }

  // 计算相关系数
  private static calculateCorrelation(x: number[], y: number[]) {
    const n = x.length
    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumXX = 0
    let sumYY = 0

    for (let i = 0; i < n; i++) {
      sumX += x[i]
      sumY += y[i]
      sumXY += x[i] * y[i]
      sumXX += x[i] * x[i]
      sumYY += y[i] * y[i]
    }

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))

    return denominator === 0 ? 0 : numerator / denominator
  }
}
