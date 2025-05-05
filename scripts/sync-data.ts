// 这个脚本用于从外部数据源同步数据到Supabase
// 可以通过 `npx tsx scripts/sync-data.ts` 运行

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import axios from "axios"

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const apiBaseUrl = process.env.API_BASE_URL

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("缺少Supabase环境变量")
  process.exit(1)
}

if (!apiBaseUrl) {
  console.error("缺少API基础URL环境变量")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function syncData() {
  console.log("开始同步数据...")

  try {
    // 同步员工数据
    await syncEmployees()

    // 同步部门数据
    await syncDepartments()

    // 同步绩效评估数据
    await syncPerformanceReviews()

    // 同步薪资数据
    await syncSalaryRecords()

    console.log("数据同步完成！")
  } catch (error) {
    console.error("数据同步失败:", error)
  }
}

async function syncEmployees() {
  console.log("同步员工数据...")

  try {
    // 从外部API获取员工数据
    const response = await axios.get(`${apiBaseUrl}/employees`)
    const employees = response.data

    // 批量更新员工数据
    for (const employee of employees) {
      const { error } = await supabase.from("employees").upsert({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        hire_date: employee.hire_date,
        status: employee.status,
        manager_id: employee.manager_id,
        salary: employee.salary,
        performance_rating: employee.performance_rating,
        avatar_url: employee.avatar_url,
      })

      if (error) {
        console.error(`更新员工 ${employee.name} 失败:`, error)
      }
    }

    console.log(`同步了 ${employees.length} 条员工数据`)
  } catch (error) {
    console.error("同步员工数据失败:", error)
  }
}

async function syncDepartments() {
  console.log("同步部门数据...")

  try {
    // 从外部API获取部门数据
    const response = await axios.get(`${apiBaseUrl}/departments`)
    const departments = response.data

    // 批量更新部门数据
    for (const department of departments) {
      const { error } = await supabase.from("departments").upsert({
        id: department.id,
        name: department.name,
        code: department.code,
        manager_id: department.manager_id,
        parent_id: department.parent_id,
        headcount: department.headcount,
        budget: department.budget,
        description: department.description,
      })

      if (error) {
        console.error(`更新部门 ${department.name} 失败:`, error)
      }
    }

    console.log(`同步了 ${departments.length} 条部门数据`)
  } catch (error) {
    console.error("同步部门数据失败:", error)
  }
}

async function syncPerformanceReviews() {
  console.log("同步绩效评估数据...")

  try {
    // 从外部API获取绩效评估数据
    const response = await axios.get(`${apiBaseUrl}/performance-reviews`)
    const reviews = response.data

    // 批量更新绩效评估数据
    for (const review of reviews) {
      const { error } = await supabase.from("performance_reviews").upsert({
        id: review.id,
        employee_id: review.employee_id,
        review_period: review.review_period,
        rating: review.rating,
        reviewer_id: review.reviewer_id,
        goals_achieved: review.goals_achieved,
        strengths: review.strengths,
        areas_for_improvement: review.areas_for_improvement,
        comments: review.comments,
        status: review.status,
      })

      if (error) {
        console.error(`更新绩效评估 ID:${review.id} 失败:`, error)
      }
    }

    console.log(`同步了 ${reviews.length} 条绩效评估数据`)
  } catch (error) {
    console.error("同步绩效评估数据失败:", error)
  }
}

async function syncSalaryRecords() {
  console.log("同步薪资记录数据...")

  try {
    // 从外部API获取薪资记录数据
    const response = await axios.get(`${apiBaseUrl}/salary-records`)
    const salaryRecords = response.data

    // 批量更新薪资记录数据
    for (const record of salaryRecords) {
      const { error } = await supabase.from("salary_records").upsert({
        id: record.id,
        employee_id: record.employee_id,
        effective_date: record.effective_date,
        amount: record.amount,
        currency: record.currency,
        reason: record.reason,
        approved_by: record.approved_by,
        status: record.status,
      })

      if (error) {
        console.error(`更新薪资记录 ID:${record.id} 失败:`, error)
      }
    }

    console.log(`同步了 ${salaryRecords.length} 条薪资记录数据`)
  } catch (error) {
    console.error("同步薪资记录数据失败:", error)
  }
}

syncData().catch(console.error)
