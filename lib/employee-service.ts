import { createServerSupabaseClient } from "./supabase"
import { cache } from "react"

// 员工类型定义
export interface Employee {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  position: string
  department_id: string
  manager_id: string | null
  hire_date: string
  salary: number
  status: "active" | "inactive" | "on_leave"
  location: string
  avatar_url: string | null
  departments?: {
    name: string
    id: string
  }
  manager?: {
    id: string
    first_name: string
    last_name: string
  }
}

// 风险评分类型定义
export interface RiskAssessment {
  id: string
  employee_id: string
  date: string
  score: number
  factors: {
    engagement: number
    performance: number
    satisfaction: number
    [key: string]: number
  }
  created_by: string
  created_at: string
}

// 保留计划类型定义
export interface RetentionPlan {
  id: string
  employee_id: string
  plan_name: string
  plan_type: string
  description: string
  owner_id: string
  deadline: string
  status: "draft" | "active" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

// 会议类型定义
export interface Meeting {
  id: string
  employee_id: string
  meeting_type: string
  date: string
  time: string
  duration: number
  location: string
  agenda: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  created_by: string
  created_at: string
}

// 薪资调整类型定义
export interface SalaryAdjustment {
  id: string
  employee_id: string
  current_salary: number
  new_salary: number
  adjustment_type: string
  effective_date: string
  reason: string
  status: "pending" | "approved" | "rejected"
  approver_id?: string
  approval_date?: string
  created_by: string
  created_at: string
}

// 获取员工详情
export const getEmployeeById = cache(async (id: string): Promise<Employee | null> => {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      departments(id, name),
      manager:manager_id(id, first_name, last_name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("获取员工详情失败:", error)
    return null
  }

  return data
})

// 获取员工风险评分历史
export const getEmployeeRiskHistory = cache(async (id: string): Promise<RiskAssessment[]> => {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("risk_assessments")
    .select("*")
    .eq("employee_id", id)
    .order("date", { ascending: true })

  if (error) {
    console.error("获取风险评分历史失败:", error)
    return []
  }

  if (!data || data.length === 0) {
    console.log("未找到风险评分数据，使用模拟数据")
    // 返回模拟数据
    return [
      {
        id: "1",
        employee_id: id,
        date: "2023-12-01",
        score: 25,
        factors: { engagement: 20, performance: 15, satisfaction: 40 },
        created_by: "system",
        created_at: "2023-12-01T00:00:00Z",
      },
      {
        id: "2",
        employee_id: id,
        date: "2024-01-01",
        score: 35,
        factors: { engagement: 30, performance: 25, satisfaction: 50 },
        created_by: "system",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "3",
        employee_id: id,
        date: "2024-02-01",
        score: 45,
        factors: { engagement: 40, performance: 35, satisfaction: 60 },
        created_by: "system",
        created_at: "2024-02-01T00:00:00Z",
      },
      {
        id: "4",
        employee_id: id,
        date: "2024-03-01",
        score: 40,
        factors: { engagement: 35, performance: 30, satisfaction: 55 },
        created_by: "system",
        created_at: "2024-03-01T00:00:00Z",
      },
      {
        id: "5",
        employee_id: id,
        date: "2024-04-01",
        score: 30,
        factors: { engagement: 25, performance: 20, satisfaction: 45 },
        created_by: "system",
        created_at: "2024-04-01T00:00:00Z",
      },
      {
        id: "6",
        employee_id: id,
        date: "2024-05-01",
        score: 35,
        factors: { engagement: 30, performance: 25, satisfaction: 50 },
        created_by: "system",
        created_at: "2024-05-01T00:00:00Z",
      },
    ]
  }

  return data
})

// 获取员工保留计划
export const getEmployeeRetentionPlans = cache(async (id: string): Promise<RetentionPlan[]> => {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("retention_plans")
    .select("*")
    .eq("employee_id", id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("获取保留计划失败:", error)
    return []
  }

  return data || []
})

// 获取员工会议记录
export const getEmployeeMeetings = cache(async (id: string): Promise<Meeting[]> => {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("employee_id", id)
    .order("date", { ascending: false })

  if (error) {
    console.error("获取会议记录失败:", error)
    return []
  }

  return data || []
})

// 获取员工薪资调整记录
export const getEmployeeSalaryAdjustments = cache(async (id: string): Promise<SalaryAdjustment[]> => {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("salary_adjustments")
    .select("*")
    .eq("employee_id", id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("获取薪资调整记录失败:", error)
    return []
  }

  return data || []
})

// 创建员工保留计划
export async function createRetentionPlan(data: Omit<RetentionPlan, "id" | "created_at" | "updated_at">) {
  const supabase = createServerSupabaseClient()

  const { data: result, error } = await supabase
    .from("retention_plans")
    .insert([
      {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("创建保留计划失败:", error)
    return { success: false, error }
  }

  return { success: true, data: result[0] }
}

// 安排员工面谈
export async function scheduleMeeting(data: Omit<Meeting, "id" | "created_at">) {
  const supabase = createServerSupabaseClient()

  const { data: result, error } = await supabase
    .from("meetings")
    .insert([
      {
        ...data,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("安排面谈失败:", error)
    return { success: false, error }
  }

  return { success: true, data: result[0] }
}

// 提交薪资调整
export async function submitSalaryAdjustment(data: Omit<SalaryAdjustment, "id" | "created_at">) {
  const supabase = createServerSupabaseClient()

  const { data: result, error } = await supabase
    .from("salary_adjustments")
    .insert([
      {
        ...data,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("提交薪资调整失败:", error)
    return { success: false, error }
  }

  return { success: true, data: result[0] }
}

// 获取员工的直接下属
export const getEmployeeDirectReports = cache(async (managerId: string): Promise<Employee[]> => {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      departments(id, name)
    `)
    .eq("manager_id", managerId)
    .eq("status", "active")

  if (error) {
    console.error("获取直接下属失败:", error)
    return []
  }

  return data || []
})

// 获取员工的绩效记录
export const getEmployeePerformance = cache(async (id: string): Promise<any[]> => {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("performance_reviews")
    .select("*")
    .eq("employee_id", id)
    .order("review_date", { ascending: false })

  if (error) {
    console.error("获取绩效记录失败:", error)
    return []
  }

  return data || []
})

// 获取员工的培训记录
export const getEmployeeTraining = cache(async (id: string): Promise<any[]> => {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("training_records")
    .select("*")
    .eq("employee_id", id)
    .order("completion_date", { ascending: false })

  if (error) {
    console.error("获取培训记录失败:", error)
    return []
  }

  return data || []
})
