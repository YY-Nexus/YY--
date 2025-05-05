// 自然语言查询处理器
// 将用户的自然语言问题转换为结构化查询

import { type AnalysisRequest, type AnalysisType, AIAnalysisEngine } from "./ai-engine"

// 查询意图类型
export type QueryIntent =
  | "trend" // 趋势查询
  | "comparison" // 比较查询
  | "status" // 状态查询
  | "prediction" // 预测查询
  | "recommendation" // 推荐查询
  | "anomaly" // 异常查询
  | "unknown" // 未知意图

// 查询实体类型
export interface QueryEntity {
  type: string // 实体类型，如"department", "metric", "timeRange"等
  value: string // 实体值
  confidence: number // 置信度
}

// 查询结果接口
export interface QueryResult {
  answer: string // 回答文本
  data?: any // 相关数据
  visualizationType?: string // 可视化类型建议
  followupQuestions?: string[] // 后续问题建议
}

// 自然语言查询处理器类
export class NLQueryProcessor {
  // 处理自然语言查询
  static async processQuery(query: string): Promise<QueryResult> {
    // 1. 分析查询意图
    const intent = this.analyzeIntent(query)

    // 2. 提取查询实体
    const entities = this.extractEntities(query)

    // 3. 构建分析请求
    const request = this.buildAnalysisRequest(intent, entities)

    // 4. 执行分析
    let analysisResult
    try {
      if (request) {
        analysisResult = await AIAnalysisEngine.analyze(request)
      }
    } catch (error) {
      console.error("分析执行失败:", error)
    }

    // 5. 生成回答
    return this.generateAnswer(query, intent, entities, analysisResult)
  }

  // 分析查询意图
  private static analyzeIntent(query: string): QueryIntent {
    // 简化的意图识别，基于关键词匹配
    const normalizedQuery = query.toLowerCase()

    // 趋势相关关键词
    if (
      normalizedQuery.includes("趋势") ||
      normalizedQuery.includes("变化") ||
      normalizedQuery.includes("走势") ||
      normalizedQuery.includes("增长") ||
      normalizedQuery.includes("下降")
    ) {
      return "trend"
    }

    // 比较相关关键词
    if (
      normalizedQuery.includes("比较") ||
      normalizedQuery.includes("对比") ||
      normalizedQuery.includes("差异") ||
      normalizedQuery.includes("高于") ||
      normalizedQuery.includes("低于")
    ) {
      return "comparison"
    }

    // 状态查询关键词
    if (
      normalizedQuery.includes("现状") ||
      normalizedQuery.includes("情况") ||
      normalizedQuery.includes("状态") ||
      normalizedQuery.includes("多少") ||
      normalizedQuery.includes("是什么")
    ) {
      return "status"
    }

    // 预测相关关键词
    if (
      normalizedQuery.includes("预测") ||
      normalizedQuery.includes("预期") ||
      normalizedQuery.includes("将会") ||
      normalizedQuery.includes("未来") ||
      normalizedQuery.includes("会怎样")
    ) {
      return "prediction"
    }

    // 推荐相关关键词
    if (
      normalizedQuery.includes("推荐") ||
      normalizedQuery.includes("建议") ||
      normalizedQuery.includes("如何改善") ||
      normalizedQuery.includes("怎么做") ||
      normalizedQuery.includes("应该")
    ) {
      return "recommendation"
    }

    // 异常相关关键词
    if (
      normalizedQuery.includes("异常") ||
      normalizedQuery.includes("问题") ||
      normalizedQuery.includes("不正常") ||
      normalizedQuery.includes("风险") ||
      normalizedQuery.includes("警报")
    ) {
      return "anomaly"
    }

    // 默认为未知意图
    return "unknown"
  }

  // 提取查询实体
  private static extractEntities(query: string): QueryEntity[] {
    const entities: QueryEntity[] = []
    const normalizedQuery = query.toLowerCase()

    // 提取部门实体
    const departments = ["研发", "销售", "市场", "人力资源", "财务", "运营", "客服", "行政", "法务", "产品"]
    departments.forEach((dept) => {
      if (normalizedQuery.includes(dept.toLowerCase())) {
        entities.push({
          type: "department",
          value: dept,
          confidence: 0.9,
        })
      }
    })

    // 提取指标实体
    const metrics = [
      { name: "员工数", aliases: ["人数", "人员", "员工总数"] },
      { name: "流失率", aliases: ["离职率", "流动率", "人员流失"] },
      { name: "满意度", aliases: ["满意程度", "幸福感"] },
      { name: "绩效", aliases: ["业绩", "表现", "成绩"] },
      { name: "薪酬", aliases: ["工资", "薪资", "报酬"] },
      { name: "招聘", aliases: ["招人", "雇佣", "入职"] },
    ]

    metrics.forEach((metric) => {
      if (normalizedQuery.includes(metric.name.toLowerCase())) {
        entities.push({
          type: "metric",
          value: metric.name,
          confidence: 0.9,
        })
      } else {
        for (const alias of metric.aliases) {
          if (normalizedQuery.includes(alias.toLowerCase())) {
            entities.push({
              type: "metric",
              value: metric.name,
              confidence: 0.8,
            })
            break
          }
        }
      }
    })

    // 提取时间范围实体
    const timePatterns = [
      { regex: /过去(\d+)个?(天|周|月|季度|年)/g, type: "past" },
      { regex: /未来(\d+)个?(天|周|月|季度|年)/g, type: "future" },
      { regex: /今(天|周|月|年)/g, type: "current" },
      { regex: /上(周|月|季度|年)/g, type: "previous" },
      { regex: /下(周|月|季度|年)/g, type: "next" },
    ]

    timePatterns.forEach((pattern) => {
      const matches = [...normalizedQuery.matchAll(pattern.regex)]
      matches.forEach((match) => {
        entities.push({
          type: "timeRange",
          value: match[0],
          confidence: 0.85,
        })
      })
    })

    return entities
  }

  // 构建分析请求
  private static buildAnalysisRequest(intent: QueryIntent, entities: QueryEntity[]): AnalysisRequest | null {
    // 根据意图和实体构建不同类型的分析请求

    // 默认参数
    let dataSource = "employees"
    let analysisType: AnalysisType = "trend"
    const parameters: Record<string, any> = {}

    // 根据意图设置分析类型
    switch (intent) {
      case "trend":
        analysisType = "trend"
        parameters.valueField = "count"
        break
      case "comparison":
        analysisType = "correlation"
        parameters.field1 = "department_size"
        parameters.field2 = "performance_score"
        break
      case "prediction":
        analysisType = "prediction"
        parameters.valueField = "count"
        parameters.periods = 6
        parameters.windowSize = 3
        break
      case "recommendation":
        analysisType = "recommendation"
        parameters.scenario = "retention"
        break
      case "anomaly":
        analysisType = "anomaly"
        parameters.valueField = "count"
        parameters.threshold = 2
        break
      case "status":
        // 状态查询可能不需要复杂分析，直接返回数据
        return null
      case "unknown":
        // 未知意图，无法构建请求
        return null
    }

    // 根据实体调整参数
    entities.forEach((entity) => {
      if (entity.type === "department") {
        parameters.department = entity.value
      } else if (entity.type === "metric") {
        // 根据指标调整数据源和字段
        switch (entity.value) {
          case "员工数":
            dataSource = "employees"
            parameters.valueField = "count"
            break
          case "流失率":
            dataSource = "turnover"
            parameters.valueField = "rate"
            break
          case "满意度":
            dataSource = "satisfaction_surveys"
            parameters.valueField = "score"
            break
          case "绩效":
            dataSource = "performance_reviews"
            parameters.valueField = "rating"
            break
          case "薪酬":
            dataSource = "salary_records"
            parameters.valueField = "amount"
            break
          case "招聘":
            dataSource = "recruitment"
            parameters.valueField = "time_to_fill"
            break
        }
      } else if (entity.type === "timeRange") {
        // 设置时间范围
        // 这里简化处理，实际应该解析具体的时间范围
        parameters.timeRange = entity.value
      }
    })

    // 如果是推荐分析，根据指标调整场景
    if (analysisType === "recommendation") {
      const metricEntity = entities.find((e) => e.type === "metric")
      if (metricEntity) {
        switch (metricEntity.value) {
          case "流失率":
            parameters.scenario = "retention"
            break
          case "绩效":
            parameters.scenario = "performance"
            break
          case "招聘":
            parameters.scenario = "recruitment"
            break
        }
      }
    }

    return {
      type: analysisType,
      dataSource,
      parameters,
      filters: [],
    }
  }

  // 生成回答
  private static generateAnswer(
    query: string,
    intent: QueryIntent,
    entities: QueryEntity[],
    analysisResult?: any,
  ): QueryResult {
    // 根据意图、实体和分析结果生成自然语言回答

    let answer = ""
    let visualizationType = "table"
    const followupQuestions: string[] = []

    // 如果有分析结果，使用其洞察作为回答基础
    if (analysisResult && analysisResult.insights && analysisResult.insights.length > 0) {
      answer = analysisResult.insights.join("\n\n")

      // 根据分析类型设置可视化类型
      switch (analysisResult.type) {
        case "trend":
          visualizationType = "line"
          break
        case "correlation":
          visualizationType = "scatter"
          break
        case "anomaly":
          visualizationType = "line-with-threshold"
          break
        case "prediction":
          visualizationType = "line-with-forecast"
          break
        case "recommendation":
          visualizationType = "card-list"
          break
        case "segmentation":
          visualizationType = "bar-grouped"
          break
      }

      // 生成后续问题
      if (analysisResult.type === "trend") {
        followupQuestions.push("这一趋势的主要驱动因素是什么？")
        followupQuestions.push("未来3个月的预测是怎样的？")
      } else if (analysisResult.type === "anomaly") {
        followupQuestions.push("这些异常的可能原因是什么？")
        followupQuestions.push("如何防止类似异常再次发生？")
      } else if (analysisResult.type === "prediction") {
        followupQuestions.push("影响这一预测的关键因素有哪些？")
        followupQuestions.push("如何提高预测准确度？")
      } else if (analysisResult.type === "recommendation") {
        followupQuestions.push("实施这些建议的预期效果如何？")
        followupQuestions.push("有哪些实施这些建议的最佳实践？")
      }
    } else {
      // 没有分析结果，根据意图生成通用回答
      switch (intent) {
        case "trend":
          answer = "我们目前没有足够的数据来分析这一趋势。请尝试指定更具体的指标或时间范围。"
          followupQuestions.push("您想了解哪个部门的趋势？")
          followupQuestions.push("您关注的是哪个具体指标？")
          break
        case "comparison":
          answer = "要进行有效的比较，我需要知道您想比较的具体指标和对象。"
          followupQuestions.push("您想比较哪些部门？")
          followupQuestions.push("您想基于哪些指标进行比较？")
          break
        case "status":
          answer = "要查询当前状态，请指定您感兴趣的具体指标或部门。"
          followupQuestions.push("您想了解哪个部门的状态？")
          followupQuestions.push("您关注的是哪个具体指标？")
          break
        case "prediction":
          answer = "要进行预测分析，我需要更多关于您感兴趣的指标和时间范围的信息。"
          followupQuestions.push("您想预测哪个指标的未来趋势？")
          followupQuestions.push("您关注的预测时间范围是多久？")
          break
        case "recommendation":
          answer = "要提供针对性的建议，我需要了解您的具体关注点。"
          followupQuestions.push("您想改善哪个方面的表现？")
          followupQuestions.push("您面临的主要挑战是什么？")
          break
        case "anomaly":
          answer = "要检测异常，请指定您想监控的具体指标和时间范围。"
          followupQuestions.push("您想检测哪个指标的异常？")
          followupQuestions.push("您关注的时间范围是多久？")
          break
        case "unknown":
          answer = "我不太理解您的问题。请尝试用不同的方式提问，或者指定具体的指标、部门或时间范围。"
          followupQuestions.push("您是想了解某个指标的趋势吗？")
          followupQuestions.push("您是想获取某个方面的改进建议吗？")
          break
      }
    }

    return {
      answer,
      data: analysisResult?.data,
      visualizationType,
      followupQuestions,
    }
  }
}
