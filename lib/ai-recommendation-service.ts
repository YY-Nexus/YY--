import { createServerSupabaseClient } from "./supabase"
import { type Employee, getEmployeeById, getEmployeePerformance, getEmployeeRiskHistory } from "./employee-service"
import { RiskAssessmentService } from "./risk-assessment-service"

// 建议类型
export interface Recommendation {
  id: string
  title: string
  description: string
  actions: string[]
  priority: "high" | "medium" | "low"
  impact: "high" | "medium" | "low"
  effort: "high" | "medium" | "low"
  category: string
  tags: string[]
  confidence: number
}

// AI建议服务
export class AIRecommendationService {
  // 生成员工保留建议
  static async generateRetentionRecommendations(employeeId: string): Promise<Recommendation[]> {
    try {
      // 获取员工信息
      const employee = await getEmployeeById(employeeId)
      if (!employee) {
        throw new Error("员工不存在")
      }

      // 获取风险评分
      const riskAssessment = await RiskAssessmentService.calculateRiskScore(employeeId)

      // 获取绩效记录
      const performanceRecords = await getEmployeePerformance(employeeId)

      // 获取风险历史
      const riskHistory = await getEmployeeRiskHistory(employeeId)

      // 根据风险因素生成建议
      const recommendations: Recommendation[] = []

      // 分析风险因素并生成相应建议
      for (const [factor, score] of Object.entries(riskAssessment.factors)) {
        if (score >= 60) {
          const factorRecommendations = await this.getRecommendationsForFactor(
            factor,
            score,
            employee,
            performanceRecords,
            riskHistory,
          )

          recommendations.push(...factorRecommendations)
        }
      }

      // 如果没有高风险因素，添加一般性建议
      if (recommendations.length === 0) {
        recommendations.push(...(await this.getGeneralRecommendations(employee)))
      }

      // 按优先级排序
      return this.prioritizeRecommendations(recommendations)
    } catch (error) {
      console.error("生成保留建议失败:", error)
      return []
    }
  }

  // 根据特定风险因素生成建议
  private static async getRecommendationsForFactor(
    factor: string,
    score: number,
    employee: Employee,
    performanceRecords: any[],
    riskHistory: any[],
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []

    switch (factor) {
      case "engagement":
        recommendations.push({
          id: `eng_${Date.now()}`,
          title: "提高工作投入度",
          description: "员工工作投入度较低，可能导致工作积极性下降和离职风险增加。",
          actions: [
            "安排一对一面谈，了解员工的职业期望和工作中的挑战",
            "为员工分配更有挑战性和意义的工作任务",
            "鼓励员工参与团队决策和项目规划",
            "提供更多的认可和反馈",
          ],
          priority: score >= 80 ? "high" : score >= 70 ? "medium" : "low",
          impact: "high",
          effort: "medium",
          category: "engagement",
          tags: ["投入度", "面谈", "任务分配"],
          confidence: 0.85,
        })

        // 检查是否长时间没有参与培训
        const hasRecentTraining = performanceRecords.some(
          (record) =>
            record.training_completed &&
            new Date(record.review_date) >= new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        )

        if (!hasRecentTraining) {
          recommendations.push({
            id: `train_${Date.now()}`,
            title: "提供技能发展机会",
            description: "员工近期未参与培训活动，提供学习和发展机会可以提高工作投入度和满意度。",
            actions: [
              "与员工讨论感兴趣的技能发展方向",
              "提供相关的培训课程或学习资源",
              "安排导师指导或工作轮换机会",
              "创建个人发展计划",
            ],
            priority: "medium",
            impact: "high",
            effort: "medium",
            category: "development",
            tags: ["培训", "技能发展", "学习机会"],
            confidence: 0.8,
          })
        }
        break

      case "satisfaction":
        recommendations.push({
          id: `sat_${Date.now()}`,
          title: "提高工作满意度",
          description: "员工工作满意度较低，可能与工作环境、团队关系或工作内容有关。",
          actions: [
            "进行满意度调查，了解具体不满因素",
            "改善工作环境和团队氛围",
            "提供更多的工作自主权和灵活性",
            "调整工作内容，使其更符合员工的兴趣和技能",
          ],
          priority: score >= 80 ? "high" : score >= 70 ? "medium" : "low",
          impact: "high",
          effort: "medium",
          category: "satisfaction",
          tags: ["满意度", "工作环境", "团队氛围"],
          confidence: 0.8,
        })
        break

      case "performance":
        recommendations.push({
          id: `perf_${Date.now()}`,
          title: "改善绩效表现",
          description: "员工绩效表现不佳，可能影响其自信心和职业发展。",
          actions: ["明确绩效期望和目标", "提供必要的培训和资源", "定期进行绩效反馈和辅导", "识别并解决绩效障碍"],
          priority: score >= 80 ? "high" : score >= 70 ? "medium" : "low",
          impact: "high",
          effort: "high",
          category: "performance",
          tags: ["绩效", "培训", "反馈"],
          confidence: 0.85,
        })
        break

      case "salary_competitiveness":
        recommendations.push({
          id: `sal_${Date.now()}`,
          title: "提高薪资竞争力",
          description: "员工薪资低于市场或内部同类职位，可能导致不满和离职风险。",
          actions: [
            "进行薪资市场调研",
            "制定薪资调整计划",
            "考虑提供其他形式的补偿或福利",
            "与员工沟通薪资结构和发展路径",
          ],
          priority: score >= 80 ? "high" : score >= 70 ? "medium" : "low",
          impact: "high",
          effort: "high",
          category: "compensation",
          tags: ["薪资", "调整", "市场竞争力"],
          confidence: 0.9,
        })
        break

      case "promotion_time":
        recommendations.push({
          id: `prom_${Date.now()}`,
          title: "提供职业发展机会",
          description: "员工晋升周期过长，可能影响其职业发展预期和工作积极性。",
          actions: [
            "明确职业发展路径和晋升标准",
            "提供更多的职责和挑战",
            "考虑横向发展或专业发展路径",
            "定期进行职业发展面谈",
          ],
          priority: score >= 80 ? "high" : score >= 70 ? "medium" : "low",
          impact: "high",
          effort: "medium",
          category: "career",
          tags: ["职业发展", "晋升", "职责"],
          confidence: 0.85,
        })
        break

      case "work_life_balance":
        recommendations.push({
          id: `wlb_${Date.now()}`,
          title: "改善工作生活平衡",
          description: "员工工作生活平衡状况不佳，可能导致压力和倦怠。",
          actions: ["评估工作量和工作时间", "提供灵活的工作安排", "鼓励休假和休息时间", "提供压力管理和健康支持"],
          priority: score >= 80 ? "high" : score >= 70 ? "medium" : "low",
          impact: "medium",
          effort: "low",
          category: "wellbeing",
          tags: ["工作生活平衡", "灵活工作", "健康"],
          confidence: 0.8,
        })
        break

      case "manager_relationship":
        recommendations.push({
          id: `mgr_${Date.now()}`,
          title: "改善管理者关系",
          description: "员工与管理者关系可能存在问题，影响工作满意度和团队协作。",
          actions: [
            "安排管理者与员工的一对一沟通",
            "提供管理者领导力和沟通技能培训",
            "建立定期反馈机制",
            "考虑调整团队结构或汇报关系",
          ],
          priority: score >= 80 ? "high" : score >= 70 ? "medium" : "low",
          impact: "high",
          effort: "medium",
          category: "leadership",
          tags: ["管理关系", "沟通", "领导力"],
          confidence: 0.8,
        })
        break

      case "training_completion":
        recommendations.push({
          id: `tc_${Date.now()}`,
          title: "增加培训参与度",
          description: "员工培训参与度不足，可能缺乏技能提升和职业发展机会。",
          actions: [
            "了解员工的培训需求和兴趣",
            "提供针对性的培训计划",
            "创造学习时间和空间",
            "将培训与职业发展和绩效挂钩",
          ],
          priority: score >= 80 ? "high" : score >= 70 ? "medium" : "low",
          impact: "medium",
          effort: "medium",
          category: "development",
          tags: ["培训", "技能发展", "学习"],
          confidence: 0.75,
        })
        break

      case "tenure":
        // 针对不同工作年限的建议
        const hireDate = new Date(employee.hire_date)
        const now = new Date()
        const tenureMonths = (now.getFullYear() - hireDate.getFullYear()) * 12 + (now.getMonth() - hireDate.getMonth())

        if (tenureMonths < 12) {
          // 新员工
          recommendations.push({
            id: `new_${Date.now()}`,
            title: "加强新员工融入",
            description: "员工入职时间较短，可能仍在适应组织文化和工作环境。",
            actions: ["完善入职培训和指导", "分配导师或伙伴", "定期检查适应情况", "提供清晰的期望和反馈"],
            priority: "high",
            impact: "high",
            effort: "medium",
            category: "onboarding",
            tags: ["新员工", "入职", "适应"],
            confidence: 0.9,
          })
        }
        break
    }

    return recommendations
  }

  // 获取一般性建议
  private static async getGeneralRecommendations(employee: Employee): Promise<Recommendation[]> {
    return [
      {
        id: `gen1_${Date.now()}`,
        title: "定期职业发展面谈",
        description: "定期与员工进行职业发展面谈，了解其职业目标和期望。",
        actions: ["每季度安排一次职业发展面谈", "讨论职业目标和发展计划", "提供相关的发展机会和资源", "跟踪发展进度"],
        priority: "medium",
        impact: "medium",
        effort: "low",
        category: "career",
        tags: ["职业发展", "面谈", "规划"],
        confidence: 0.7,
      },
      {
        id: `gen2_${Date.now()}`,
        title: "增强团队归属感",
        description: "增强员工的团队归属感和组织认同感，提高留任意愿。",
        actions: ["组织团队建设活动", "鼓励跨团队协作", "分享组织愿景和目标", "认可团队和个人贡献"],
        priority: "medium",
        impact: "medium",
        effort: "medium",
        category: "culture",
        tags: ["团队建设", "归属感", "认同感"],
        confidence: 0.75,
      },
      {
        id: `gen3_${Date.now()}`,
        title: "优化工作内容",
        description: "根据员工的技能和兴趣优化工作内容，提高工作满意度。",
        actions: ["了解员工的技能和兴趣", "调整工作任务和职责", "提供更多自主权和决策权", "创造创新和创造的机会"],
        priority: "low",
        impact: "medium",
        effort: "medium",
        category: "job_design",
        tags: ["工作内容", "技能匹配", "自主权"],
        confidence: 0.7,
      },
    ]
  }

  // 按优先级排序建议
  private static prioritizeRecommendations(recommendations: Recommendation[]): Recommendation[] {
    // 优先级映射
    const priorityMap = {
      high: 3,
      medium: 2,
      low: 1,
    }

    // 按优先级和影响力排序
    return recommendations.sort((a, b) => {
      const priorityDiff = priorityMap[b.priority] - priorityMap[a.priority]
      if (priorityDiff !== 0) return priorityDiff

      const impactDiff = priorityMap[b.impact] - priorityMap[a.impact]
      if (impactDiff !== 0) return impactDiff

      return priorityMap[a.effort] - priorityMap[b.effort] // 低努力优先
    })
  }

  // 保存建议到数据库
  static async saveRecommendations(employeeId: string, recommendations: Recommendation[]) {
    const supabase = createServerSupabaseClient()

    for (const recommendation of recommendations) {
      const { error } = await supabase.from("employee_recommendations").insert([
        {
          employee_id: employeeId,
          recommendation_id: recommendation.id,
          title: recommendation.title,
          description: recommendation.description,
          actions: recommendation.actions,
          priority: recommendation.priority,
          impact: recommendation.impact,
          effort: recommendation.effort,
          category: recommendation.category,
          tags: recommendation.tags,
          confidence: recommendation.confidence,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("保存建议失败:", error)
      }
    }
  }

  // 获取员工的保存建议
  static async getSavedRecommendations(employeeId: string): Promise<any[]> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("employee_recommendations")
      .select("*")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("获取保存建议失败:", error)
      return []
    }

    return data || []
  }

  // 更新建议状态
  static async updateRecommendationStatus(
    recommendationId: string,
    status: "pending" | "in_progress" | "completed" | "rejected",
  ) {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from("employee_recommendations")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("recommendation_id", recommendationId)

    if (error) {
      console.error("更新建议状态失败:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }
}
