import { createServerSupabaseClient } from "./supabase"
import { type Employee, getEmployeeById, getEmployeePerformance, getEmployeeTraining } from "./employee-service"

// 风险因素权重配置
const RISK_FACTOR_WEIGHTS = {
  // 基本因素
  tenure: 0.15, // 工作年限
  performance: 0.2, // 绩效评分
  satisfaction: 0.2, // 满意度评分
  engagement: 0.15, // 参与度评分

  // 次要因素
  salary_competitiveness: 0.1, // 薪资竞争力
  promotion_time: 0.05, // 晋升时间
  training_completion: 0.05, // 培训完成情况
  manager_relationship: 0.05, // 与管理者关系
  work_life_balance: 0.05, // 工作生活平衡
}

// 风险评分计算服务
export class RiskAssessmentService {
  // 计算员工的综合风险评分
  static async calculateRiskScore(employeeId: string): Promise<{
    score: number
    factors: Record<string, number>
    insights: string[]
  }> {
    try {
      // 获取员工基本信息
      const employee = await getEmployeeById(employeeId)
      if (!employee) {
        throw new Error("员工不存在")
      }

      // 获取员工绩效记录
      const performanceRecords = await getEmployeePerformance(employeeId)

      // 获取员工培训记录
      const trainingRecords = await getEmployeeTraining(employeeId)

      // 获取员工满意度和参与度数据
      const { satisfactionData, engagementData } = await this.getEmployeeSurveyData(employeeId)

      // 计算各个风险因素的分数
      const factorScores = await this.calculateFactorScores(
        employee,
        performanceRecords,
        trainingRecords,
        satisfactionData,
        engagementData,
      )

      // 计算加权风险评分
      let weightedScore = 0
      for (const [factor, score] of Object.entries(factorScores)) {
        if (RISK_FACTOR_WEIGHTS[factor as keyof typeof RISK_FACTOR_WEIGHTS]) {
          weightedScore += score * RISK_FACTOR_WEIGHTS[factor as keyof typeof RISK_FACTOR_WEIGHTS]
        }
      }

      // 确保分数在0-100范围内
      const finalScore = Math.min(100, Math.max(0, Math.round(weightedScore)))

      // 生成风险洞察
      const insights = this.generateRiskInsights(finalScore, factorScores, employee)

      return {
        score: finalScore,
        factors: factorScores,
        insights,
      }
    } catch (error) {
      console.error("计算风险评分失败:", error)
      // 返回默认风险评分
      return {
        score: 50,
        factors: {
          engagement: 50,
          performance: 50,
          satisfaction: 50,
          tenure: 50,
          salary_competitiveness: 50,
          promotion_time: 50,
          training_completion: 50,
          manager_relationship: 50,
          work_life_balance: 50,
        },
        insights: ["无法计算准确的风险评分，请检查数据完整性。"],
      }
    }
  }

  // 获取员工满意度和参与度数据
  private static async getEmployeeSurveyData(employeeId: string) {
    const supabase = createServerSupabaseClient()

    // 获取最近的满意度调查数据
    const { data: satisfactionData, error: satisfactionError } = await supabase
      .from("employee_surveys")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("survey_type", "satisfaction")
      .order("survey_date", { ascending: false })
      .limit(1)

    // 获取最近的参与度调查数据
    const { data: engagementData, error: engagementError } = await supabase
      .from("employee_surveys")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("survey_type", "engagement")
      .order("survey_date", { ascending: false })
      .limit(1)

    if (satisfactionError) {
      console.error("获取满意度数据失败:", satisfactionError)
    }

    if (engagementError) {
      console.error("获取参与度数据失败:", engagementError)
    }

    return {
      satisfactionData: satisfactionData && satisfactionData.length > 0 ? satisfactionData[0] : null,
      engagementData: engagementData && engagementData.length > 0 ? engagementData[0] : null,
    }
  }

  // 计算各个风险因素的分数
  private static async calculateFactorScores(
    employee: Employee,
    performanceRecords: any[],
    trainingRecords: any[],
    satisfactionData: any,
    engagementData: any,
  ): Promise<Record<string, number>> {
    const now = new Date()
    const hireDate = new Date(employee.hire_date)

    // 计算工作年限（月）
    const tenureMonths = (now.getFullYear() - hireDate.getFullYear()) * 12 + (now.getMonth() - hireDate.getMonth())

    // 计算工作年限风险分数（工作年限越短，风险越高）
    const tenureScore = this.calculateTenureScore(tenureMonths)

    // 计算绩效风险分数
    const performanceScore = this.calculatePerformanceScore(performanceRecords)

    // 计算满意度风险分数
    const satisfactionScore = this.calculateSatisfactionScore(satisfactionData)

    // 计算参与度风险分数
    const engagementScore = this.calculateEngagementScore(engagementData)

    // 计算薪资竞争力风险分数
    const salaryCompetitivenessScore = await this.calculateSalaryCompetitivenessScore(employee)

    // 计算晋升时间风险分数
    const promotionTimeScore = this.calculatePromotionTimeScore(employee, performanceRecords)

    // 计算培训完成情况风险分数
    const trainingCompletionScore = this.calculateTrainingCompletionScore(trainingRecords)

    // 计算与管理者关系风险分数
    const managerRelationshipScore = this.calculateManagerRelationshipScore(employee)

    // 计算工作生活平衡风险分数
    const workLifeBalanceScore = this.calculateWorkLifeBalanceScore(employee)

    return {
      tenure: tenureScore,
      performance: performanceScore,
      satisfaction: satisfactionScore,
      engagement: engagementScore,
      salary_competitiveness: salaryCompetitivenessScore,
      promotion_time: promotionTimeScore,
      training_completion: trainingCompletionScore,
      manager_relationship: managerRelationshipScore,
      work_life_balance: workLifeBalanceScore,
    }
  }

  // 计算工作年限风险分数
  private static calculateTenureScore(tenureMonths: number): number {
    // 工作年限越短，风险越高
    if (tenureMonths < 6) return 80 // 0-6个月，高风险
    if (tenureMonths < 12) return 70 // 6-12个月，较高风险
    if (tenureMonths < 24) return 50 // 1-2年，中等风险
    if (tenureMonths < 36) return 40 // 2-3年，较低风险
    if (tenureMonths < 60) return 30 // 3-5年，低风险
    return 20 // 5年以上，很低风险
  }

  // 计算绩效风险分数
  private static calculatePerformanceScore(performanceRecords: any[]): number {
    if (!performanceRecords || performanceRecords.length === 0) {
      return 50 // 无绩效记录，默认中等风险
    }

    // 获取最近的绩效评分
    const latestPerformance = performanceRecords[0]
    const performanceRating = latestPerformance.rating || 3 // 默认为3（1-5评分）

    // 绩效评分越低，风险越高
    switch (performanceRating) {
      case 1:
        return 90 // 很差，极高风险
      case 2:
        return 70 // 较差，高风险
      case 3:
        return 50 // 一般，中等风险
      case 4:
        return 30 // 良好，低风险
      case 5:
        return 10 // 优秀，很低风险
      default:
        return 50 // 默认中等风险
    }
  }

  // 计算满意度风险分数
  private static calculateSatisfactionScore(satisfactionData: any): number {
    if (!satisfactionData) {
      return 50 // 无满意度数据，默认中等风险
    }

    // 满意度评分（1-5）
    const satisfactionRating = satisfactionData.overall_rating || 3

    // 满意度越低，风险越高
    switch (satisfactionRating) {
      case 1:
        return 90 // 很不满意，极高风险
      case 2:
        return 70 // 不满意，高风险
      case 3:
        return 50 // 一般，中等风险
      case 4:
        return 30 // 满意，低风险
      case 5:
        return 10 // 很满意，很低风险
      default:
        return 50 // 默认中等风险
    }
  }

  // 计算参与度风险分数
  private static calculateEngagementScore(engagementData: any): number {
    if (!engagementData) {
      return 50 // 无参与度数据，默认中等风险
    }

    // 参与度评分（1-5）
    const engagementRating = engagementData.overall_rating || 3

    // 参与度越低，风险越高
    switch (engagementRating) {
      case 1:
        return 90 // 很低参与度，极高风险
      case 2:
        return 70 // 低参与度，高风险
      case 3:
        return 50 // 一般参与度，中等风险
      case 4:
        return 30 // 高参与度，低风险
      case 5:
        return 10 // 很高参与度，很低风险
      default:
        return 50 // 默认中等风险
    }
  }

  // 计算薪资竞争力风险分数
  private static async calculateSalaryCompetitivenessScore(employee: Employee): Promise<number> {
    try {
      const supabase = createServerSupabaseClient()

      // 获取同部门同职位的平均薪资
      const { data, error } = await supabase
        .from("employees")
        .select("salary")
        .eq("department_id", employee.department_id)
        .eq("position", employee.position)
        .neq("id", employee.id)

      if (error || !data || data.length === 0) {
        return 50 // 无法比较，默认中等风险
      }

      // 计算平均薪资
      const avgSalary = data.reduce((sum, emp) => sum + emp.salary, 0) / data.length

      // 计算薪资比例（员工薪资/平均薪资）
      const salaryRatio = employee.salary / avgSalary

      // 薪资越低于平均值，风险越高
      if (salaryRatio < 0.8) return 80 // 显著低于平均值，高风险
      if (salaryRatio < 0.9) return 60 // 低于平均值，中高风险
      if (salaryRatio < 1.1) return 40 // 接近平均值，中低风险
      if (salaryRatio < 1.2) return 30 // 高于平均值，低风险
      return 20 // 显著高于平均值，很低风险
    } catch (error) {
      console.error("计算薪资竞争力失败:", error)
      return 50 // 出错，默认中等风险
    }
  }

  // 计算晋升时间风险分数
  private static calculatePromotionTimeScore(employee: Employee, performanceRecords: any[]): number {
    // 如果没有绩效记录或绩效不佳，则不考虑晋升时间
    if (!performanceRecords || performanceRecords.length === 0 || performanceRecords[0].rating < 4) {
      return 50
    }

    // 获取最近一次晋升时间
    const lastPromotion = performanceRecords.find((record) => record.promotion === true)

    if (!lastPromotion) {
      // 从未晋升，计算入职时间
      const now = new Date()
      const hireDate = new Date(employee.hire_date)
      const monthsSinceHire = (now.getFullYear() - hireDate.getFullYear()) * 12 + (now.getMonth() - hireDate.getMonth())

      // 入职时间越长没晋升，风险越高
      if (monthsSinceHire > 36) return 80 // 3年以上未晋升，高风险
      if (monthsSinceHire > 24) return 60 // 2-3年未晋升，中高风险
      if (monthsSinceHire > 12) return 40 // 1-2年未晋升，中低风险
      return 20 // 入职1年内，很低风险
    } else {
      // 计算上次晋升至今的时间
      const now = new Date()
      const promotionDate = new Date(lastPromotion.review_date)
      const monthsSincePromotion =
        (now.getFullYear() - promotionDate.getFullYear()) * 12 + (now.getMonth() - promotionDate.getMonth())

      // 上次晋升时间越久，风险越高
      if (monthsSincePromotion > 36) return 70 // 3年以上未晋升，高风险
      if (monthsSincePromotion > 24) return 50 // 2-3年未晋升，中等风险
      if (monthsSincePromotion > 12) return 30 // 1-2年未晋升，低风险
      return 10 // 1年内晋升，很低风险
    }
  }

  // 计算培训完成情况风险分数
  private static calculateTrainingCompletionScore(trainingRecords: any[]): number {
    if (!trainingRecords || trainingRecords.length === 0) {
      return 60 // 无培训记录，中高风险
    }

    // 计算过去一年完成的培训数量
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const recentTrainings = trainingRecords.filter((record) => {
      const completionDate = new Date(record.completion_date)
      return completionDate >= oneYearAgo
    })

    // 根据培训数量评估风险
    const trainingCount = recentTrainings.length

    if (trainingCount === 0) return 70 // 一年内无培训，高风险
    if (trainingCount === 1) return 50 // 一年内1次培训，中等风险
    if (trainingCount === 2) return 40 // 一年内2次培训，中低风险
    if (trainingCount <= 4) return 30 // 一年内3-4次培训，低风险
    return 20 // 一年内5次以上培训，很低风险
  }

  // 计算与管理者关系风险分数
  private static calculateManagerRelationshipScore(employee: Employee): number {
    // 这里需要实际的管理者关系数据
    // 由于数据可能不可用，我们使用一个模拟值
    return 40 // 默认中低风险
  }

  // 计算工作生活平衡风险分数
  private static calculateWorkLifeBalanceScore(employee: Employee): number {
    // 这里需要实际的工作生活平衡数据
    // 由于数据可能不可用，我们使用一个模拟值
    return 45 // 默认中等风险
  }

  // 生成风险洞察
  private static generateRiskInsights(
    finalScore: number,
    factorScores: Record<string, number>,
    employee: Employee,
  ): string[] {
    const insights: string[] = []

    // 根据总体风险评分生成洞察
    if (finalScore >= 70) {
      insights.push(`该员工离职风险极高，建议立即采取干预措施。`)
    } else if (finalScore >= 50) {
      insights.push(`该员工离职风险较高，建议密切关注并制定保留计划。`)
    } else if (finalScore >= 30) {
      insights.push(`该员工离职风险中等，建议定期关注其工作状态。`)
    } else {
      insights.push(`该员工离职风险较低，建议保持良好的工作环境。`)
    }

    // 找出风险最高的因素（分数最高的前三个因素）
    const sortedFactors = Object.entries(factorScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    if (sortedFactors.length > 0) {
      insights.push(
        `主要风险因素包括：${sortedFactors
          .map(([factor, score]) => {
            const factorName = this.getFactorChineseName(factor)
            return `${factorName}(${score}分)`
          })
          .join("、")}。`,
      )
    }

    // 根据具体因素生成具体洞察
    for (const [factor, score] of sortedFactors) {
      if (score >= 60) {
        switch (factor) {
          case "tenure":
            insights.push(`员工工作年限较短(${this.calculateTenureInYears(employee.hire_date)}年)，处于高流失风险期。`)
            break
          case "performance":
            insights.push(`员工绩效表现不佳，可能影响其工作积极性和归属感。`)
            break
          case "satisfaction":
            insights.push(`员工工作满意度较低，建议了解具体不满因素并改善。`)
            break
          case "engagement":
            insights.push(`员工工作投入度不足，可能已经在考虑其他工作机会。`)
            break
          case "salary_competitiveness":
            insights.push(`员工薪资竞争力不足，存在被竞争对手挖角的风险。`)
            break
          case "promotion_time":
            insights.push(`员工晋升周期过长，可能影响其职业发展预期。`)
            break
          case "training_completion":
            insights.push(`员工培训参与度不足，可能缺乏技能提升和职业发展机会。`)
            break
          case "manager_relationship":
            insights.push(`员工与管理者关系可能存在问题，建议改善沟通和领导方式。`)
            break
          case "work_life_balance":
            insights.push(`员工工作生活平衡状况不佳，可能导致工作倦怠。`)
            break
        }
      }
    }

    return insights
  }

  // 获取因素的中文名称
  private static getFactorChineseName(factor: string): string {
    const factorNames: Record<string, string> = {
      tenure: "工作年限",
      performance: "绩效表现",
      satisfaction: "工作满意度",
      engagement: "工作投入度",
      salary_competitiveness: "薪资竞争力",
      promotion_time: "晋升周期",
      training_completion: "培训参与",
      manager_relationship: "管理者关系",
      work_life_balance: "工作生活平衡",
    }

    return factorNames[factor] || factor
  }

  // 计算工作年限（年）
  private static calculateTenureInYears(hireDateStr: string): number {
    const hireDate = new Date(hireDateStr)
    const now = new Date()

    const yearDiff = now.getFullYear() - hireDate.getFullYear()
    const monthDiff = now.getMonth() - hireDate.getMonth()

    let tenure = yearDiff

    if (monthDiff < 0) {
      tenure -= 1
    } else if (monthDiff === 0) {
      if (now.getDate() < hireDate.getDate()) {
        tenure -= 1
      }
    }

    return Math.max(0, tenure)
  }
}

// 风险预测服务
export class RiskPredictionService {
  // 预测未来风险趋势
  static async predictRiskTrend(
    employeeId: string,
    months = 6,
  ): Promise<{
    predictions: Array<{ month: string; score: number }>
    trend: "increasing" | "decreasing" | "stable"
    confidence: number
  }> {
    try {
      // 获取历史风险评分数据
      const riskHistory = await this.getEmployeeRiskHistory(employeeId)

      if (riskHistory.length < 3) {
        // 历史数据不足，使用简单预测
        return this.simpleRiskPrediction(riskHistory, months)
      }

      // 使用线性回归预测未来趋势
      return this.linearRegressionPrediction(riskHistory, months)
    } catch (error) {
      console.error("预测风险趋势失败:", error)
      // 返回默认预测
      return {
        predictions: Array.from({ length: months }, (_, i) => ({
          month: this.getMonthLabel(i),
          score: 50,
        })),
        trend: "stable",
        confidence: 0.5,
      }
    }
  }

  // 获取员工风险历史数据
  private static async getEmployeeRiskHistory(employeeId: string): Promise<any[]> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("risk_assessments")
      .select("*")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("获取员工风险历史数据失败:", error)
      return []
    }

    return data || []
  }

  // 简单风险预测（数据不足时使用）
  private static simpleRiskPrediction(
    riskHistory: any[],
    months: number,
  ): {
    predictions: Array<{ month: string; score: number }>
    trend: "increasing" | "decreasing" | "stable"
    confidence: number
  } {
    // 如果没有历史数据，返回稳定预测
    if (riskHistory.length === 0) {
      return {
        predictions: Array.from({ length: months }, (_, i) => ({
          month: this.getMonthLabel(i),
          score: 50,
        })),
        trend: "stable",
        confidence: 0.3,
      }
    }

    // 获取最近的风险评分
    const latestScore = riskHistory[riskHistory.length - 1].score

    // 简单预测：保持当前分数不变
    const predictions = Array.from({ length: months }, (_, i) => ({
      month: this.getMonthLabel(i),
      score: latestScore,
    }))

    return {
      predictions,
      trend: "stable",
      confidence: 0.4,
    }
  }

  // 使用线性回归预测风险趋势
  private static linearRegressionPrediction(
    riskHistory: any[],
    months: number,
  ): {
    predictions: Array<{ month: string; score: number }>
    trend: "increasing" | "decreasing" | "stable"
    confidence: number
  } {
    // 提取历史数据点
    const dataPoints = riskHistory.map((record, index) => ({
      x: index,
      y: record.score,
    }))

    // 计算线性回归参数
    const { slope, intercept, rSquared } = this.calculateLinearRegression(dataPoints)

    // 预测未来分数
    const predictions = Array.from({ length: months }, (_, i) => {
      const x = dataPoints.length + i
      let predictedScore = Math.round(slope * x + intercept)

      // 确保分数在0-100范围内
      predictedScore = Math.min(100, Math.max(0, predictedScore))

      return {
        month: this.getMonthLabel(i),
        score: predictedScore,
      }
    })

    // 确定趋势方向
    let trend: "increasing" | "decreasing" | "stable" = "stable"
    if (slope > 1) {
      trend = "increasing"
    } else if (slope < -1) {
      trend = "decreasing"
    }

    return {
      predictions,
      trend,
      confidence: rSquared,
    }
  }

  // 计算线性回归参数
  private static calculateLinearRegression(dataPoints: Array<{ x: number; y: number }>): {
    slope: number
    intercept: number
    rSquared: number
  } {
    const n = dataPoints.length

    // 计算平均值
    const avgX = dataPoints.reduce((sum, point) => sum + point.x, 0) / n
    const avgY = dataPoints.reduce((sum, point) => sum + point.y, 0) / n

    // 计算斜率和截距
    let numerator = 0
    let denominator = 0

    for (const point of dataPoints) {
      numerator += (point.x - avgX) * (point.y - avgY)
      denominator += Math.pow(point.x - avgX, 2)
    }

    const slope = denominator !== 0 ? numerator / denominator : 0
    const intercept = avgY - slope * avgX

    // 计算R²值（拟合优度）
    let totalSS = 0
    let residualSS = 0

    for (const point of dataPoints) {
      const predictedY = slope * point.x + intercept
      totalSS += Math.pow(point.y - avgY, 2)
      residualSS += Math.pow(point.y - predictedY, 2)
    }

    const rSquared = totalSS !== 0 ? 1 - residualSS / totalSS : 0

    return { slope, intercept, rSquared }
  }

  // 获取月份标签
  private static getMonthLabel(monthsAhead: number): string {
    const date = new Date()
    date.setMonth(date.getMonth() + monthsAhead + 1)

    return date.toLocaleDateString("zh-CN", { year: "numeric", month: "short" })
  }
}
