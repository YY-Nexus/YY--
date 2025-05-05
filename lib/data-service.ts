// 更新导入
import { getSupabase, createServerSupabaseClient } from "./supabase"
import { cache } from "react"

// 客户端数据服务函数使用getSupabase()
// 服务端数据服务函数使用createServerSupabaseClient()

// 例如:
export async function fetchClientData() {
  const supabase = getSupabase()
  // 使用supabase客户端...
}

export async function fetchServerData() {
  const supabase = createServerSupabaseClient()
  // 使用supabase服务端客户端...
}

// 使用React的cache函数缓存数据请求
export const getEmployeeStats = cache(async () => {
  const supabaseServer = createServerSupabaseClient()

  // 获取员工总数
  const { count: totalEmployees } = await supabaseServer
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  // 获取本月入职员工数
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

  const { count: newHires } = await supabaseServer
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .gte("hire_date", firstDayOfMonth)
    .lte("hire_date", lastDayOfMonth)

  // 获取人才保留率（假设计算方法是：1 - 过去3个月离职人数/期初员工总数）
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  const { count: leftEmployees } = await supabaseServer
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "inactive")
    .gte("updated_at", threeMonthsAgo.toISOString())

  // 假设3个月前的员工总数是当前员工总数 + 离职员工数的95%（简化计算）
  const employeesThreeMonthsAgo = Math.round((totalEmployees + leftEmployees) / 0.95)
  const retentionRate =
    employeesThreeMonthsAgo > 0
      ? (((employeesThreeMonthsAgo - leftEmployees) / employeesThreeMonthsAgo) * 100).toFixed(1)
      : "100.0"

  // 获取平均在职时长
  const { data: employeesData } = await supabaseServer.from("employees").select("hire_date").eq("status", "active")

  let totalTenure = 0
  if (employeesData) {
    const now = new Date()
    employeesData.forEach((emp) => {
      const hireDate = new Date(emp.hire_date)
      const tenureInYears = (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      totalTenure += tenureInYears
    })
  }

  const averageTenure =
    employeesData && employeesData.length > 0 ? (totalTenure / employeesData.length).toFixed(1) : "0.0"

  return {
    totalEmployees: totalEmployees || 0,
    newHires: newHires || 0,
    retentionRate,
    averageTenure,
  }
})

export const getDepartmentStats = cache(async () => {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer.from("departments").select("*")

  if (error) {
    console.error("Error fetching department stats:", error)
    return []
  }

  return data || []
})

export const getPerformanceStats = cache(async () => {
  const supabaseServer = createServerSupabaseClient()

  // 获取最近一个季度的绩效评估数据
  const { data, error } = await supabaseServer
    .from("performance_reviews")
    .select("rating")
    .order("created_at", { ascending: false })
    .limit(500) // 假设我们只关心最近的500条记录

  if (error) {
    console.error("Error fetching performance stats:", error)
    return {
      averageScore: "0",
      ratingDistribution: { A: 0, "B+": 0, B: 0, C: 0 },
    }
  }

  // 计算评分分布
  const ratingDistribution = {
    A: 0,
    "B+": 0,
    B: 0,
    C: 0,
  }

  let totalScore = 0
  let count = 0

  data.forEach((review) => {
    if (review.rating in ratingDistribution) {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++
      count++

      // 计算评分对应的分数
      switch (review.rating) {
        case "A":
          totalScore += 4
          break
        case "B+":
          totalScore += 3.5
          break
        case "B":
          totalScore += 3
          break
        case "C":
          totalScore += 2
          break
      }
    }
  })

  // 计算平均分
  const averageScore = count > 0 ? (totalScore / count).toFixed(2) : "0"

  // 计算百分比
  const total = Object.values(ratingDistribution).reduce((sum, val) => sum + val, 0)
  const percentages = {} as Record<string, number>

  if (total > 0) {
    Object.entries(ratingDistribution).forEach(([key, value]) => {
      percentages[key] = Number.parseFloat(((value / total) * 100).toFixed(1))
    })
  } else {
    Object.keys(ratingDistribution).forEach((key) => {
      percentages[key] = 0
    })
  }

  return {
    averageScore,
    ratingDistribution: percentages,
  }
})

export const getRecentActivities = cache(async (limit = 5) => {
  const supabaseServer = createServerSupabaseClient()

  // 获取最近的员工变动
  const { data: newEmployees } = await supabaseServer
    .from("employees")
    .select("id, name, created_at, status")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit)

  // 获取最近的绩效评估
  const { data: recentReviews } = await supabaseServer
    .from("performance_reviews")
    .select("id, employee_id, rating, created_at, employees(name)")
    .order("created_at", { ascending: false })
    .limit(limit)

  // 获取最近的薪资调整
  const { data: recentSalaryChanges } = await supabaseServer
    .from("salary_records")
    .select("id, employee_id, amount, created_at, reason, employees(name)")
    .order("created_at", { ascending: false })
    .limit(limit)

  // 合并活动并按时间排序
  const activities = [
    ...(newEmployees || []).map((emp) => ({
      id: `emp-${emp.id}`,
      type: "入职",
      description: `${emp.name}已完成入职流程`,
      time: new Date(emp.created_at),
      icon: "👋",
    })),
    ...(recentReviews || []).map((review) => ({
      id: `review-${review.id}`,
      type: "绩效",
      description: `${review.employees?.name || "员工"}的绩效评级为${review.rating}`,
      time: new Date(review.created_at),
      icon: "📊",
    })),
    ...(recentSalaryChanges || []).map((salary) => ({
      id: `salary-${salary.id}`,
      type: "薪酬",
      description: `${salary.employees?.name || "员工"}的薪资已${salary.reason}`,
      time: new Date(salary.created_at),
      icon: "💰",
    })),
  ]

  // 按时间排序，最新的在前
  activities.sort((a, b) => b.time.getTime() - a.time.getTime())

  // 格式化时间
  return activities.slice(0, limit).map((activity) => {
    const now = new Date()
    const diff = now.getTime() - activity.time.getTime()

    let formattedTime
    if (diff < 60 * 1000) {
      formattedTime = "刚刚"
    } else if (diff < 60 * 60 * 1000) {
      formattedTime = `${Math.floor(diff / (60 * 1000))}分钟前`
    } else if (diff < 24 * 60 * 60 * 1000) {
      formattedTime = `${Math.floor(diff / (60 * 60 * 1000))}小时前`
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      formattedTime = `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
    } else {
      formattedTime = activity.time.toLocaleDateString("zh-CN")
    }

    return {
      ...activity,
      formattedTime,
    }
  })
})

export const getOnboardingStats = cache(async () => {
  const supabaseServer = createServerSupabaseClient()

  // 获取本月入职员工数
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

  const { count: monthlyHires } = await supabaseServer
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .gte("hire_date", firstDayOfMonth)
    .lte("hire_date", lastDayOfMonth)

  // 获取正在入职中的员工数（假设有一个onboarding_status字段）
  const { count: onboardingCount } = await supabaseServer
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "onboarding")

  // 获取入职任务完成率
  const { data: onboardingTasks } = await supabaseServer.from("onboarding_tasks").select("status")

  let completedTasks = 0
  const totalTasks = onboardingTasks?.length || 0

  if (onboardingTasks) {
    completedTasks = onboardingTasks.filter((task) => task.status === "completed").length
  }

  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0.0"

  // 获取平均入职时长（假设有入职开始和完成时间）
  // 这里简化处理，使用固定值
  const averageOnboardingDays = "5.2"

  return {
    monthlyHires: monthlyHires || 0,
    onboardingCount: onboardingCount || 0,
    completionRate,
    averageOnboardingDays,
  }
})

export const getKeyMetricsData = cache(async () => {
  const supabaseServer = createServerSupabaseClient()

  // 获取过去6个月的数据
  const months = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = month.toLocaleDateString("zh-CN", { month: "short" })
    months.push({
      date: month,
      name: monthName,
    })
  }

  // 为每个月获取数据
  const metricsData = await Promise.all(
    months.map(async (month) => {
      const startDate = new Date(month.date)
      const endDate = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 0)

      // 组织健康度 - 假设是基于多个指标的综合评分
      // 这里简化为随机生成，实际应基于真实数据计算
      const orgHealth = 70 + Math.floor(Math.random() * 20)

      // 人才流失率
      const { count: leftEmployees } = await supabaseServer
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("status", "inactive")
        .gte("updated_at", startDate.toISOString())
        .lte("updated_at", endDate.toISOString())

      // 假设当月员工总数
      const { count: totalEmployees } = await supabaseServer
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .lte("hire_date", endDate.toISOString())

      const turnoverRate =
        totalEmployees > 0 ? Number.parseFloat(((leftEmployees / totalEmployees) * 100).toFixed(1)) : 0

      // 员工满意度 - 假设有调查数据
      // 这里简化为随机生成，实际应基于真实数据
      const satisfaction = 75 + Math.floor(Math.random() * 15)

      return {
        name: month.name,
        组织健康度: orgHealth,
        人才流失率: turnoverRate,
        员工满意度: satisfaction,
      }
    }),
  )

  return metricsData
})

// 更多数据服务函数...
