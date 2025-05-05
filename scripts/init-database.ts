// 这个脚本用于初始化Supabase数据库
// 可以通过 `npx tsx scripts/init-database.ts` 运行

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("缺少Supabase环境变量")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initDatabase() {
  console.log("开始初始化数据库...")

  // 创建表结构
  await createTables()

  // 插入示例数据
  await insertSampleData()

  console.log("数据库初始化完成！")
}

async function createTables() {
  console.log("创建表结构...")

  // 创建employees表
  const { error: employeesError } = await supabase.rpc("create_employees_table")
  if (employeesError) {
    console.error("创建employees表失败:", employeesError)
  } else {
    console.log("employees表创建成功")
  }

  // 创建departments表
  const { error: departmentsError } = await supabase.rpc("create_departments_table")
  if (departmentsError) {
    console.error("创建departments表失败:", departmentsError)
  } else {
    console.log("departments表创建成功")
  }

  // 创建performance_reviews表
  const { error: reviewsError } = await supabase.rpc("create_performance_reviews_table")
  if (reviewsError) {
    console.error("创建performance_reviews表失败:", reviewsError)
  } else {
    console.log("performance_reviews表创建成功")
  }

  // 创建notifications表
  const { error: notificationsError } = await supabase.rpc("create_notifications_table")
  if (notificationsError) {
    console.error("创建notifications表失败:", notificationsError)
  } else {
    console.log("notifications表创建成功")
  }

  // 创建salary_records表
  const { error: salaryError } = await supabase.rpc("create_salary_records_table")
  if (salaryError) {
    console.error("创建salary_records表失败:", salaryError)
  } else {
    console.log("salary_records表创建成功")
  }

  // 创建onboarding_tasks表
  const { error: tasksError } = await supabase.rpc("create_onboarding_tasks_table")
  if (tasksError) {
    console.error("创建onboarding_tasks表失败:", tasksError)
  } else {
    console.log("onboarding_tasks表创建成功")
  }
}

async function insertSampleData() {
  console.log("插入示例数据...")

  // 插入部门数据
  const departments = [
    { name: "研发部", code: "RD", headcount: 50, budget: 5000000, description: "负责产品研发" },
    { name: "市场部", code: "MKT", headcount: 20, budget: 3000000, description: "负责市场营销" },
    { name: "销售部", code: "SALES", headcount: 30, budget: 4000000, description: "负责销售业务" },
    { name: "人力资源部", code: "HR", headcount: 10, budget: 1000000, description: "负责人力资源管理" },
    { name: "财务部", code: "FIN", headcount: 8, budget: 800000, description: "负责财务管理" },
  ]

  for (const dept of departments) {
    const { error } = await supabase.from("departments").insert(dept)
    if (error) {
      console.error(`插入部门 ${dept.name} 失败:`, error)
    }
  }

  // 插入员工数据
  const employees = [
    {
      name: "张明",
      email: "zhang.ming@example.com",
      department: "研发部",
      position: "高级工程师",
      hire_date: "2021-05-15",
      status: "active",
    },
    {
      name: "李娜",
      email: "li.na@example.com",
      department: "市场部",
      position: "市场经理",
      hire_date: "2020-03-10",
      status: "active",
    },
    {
      name: "王强",
      email: "wang.qiang@example.com",
      department: "销售部",
      position: "销售总监",
      hire_date: "2019-08-22",
      status: "active",
    },
    // 更多员工...
  ]

  for (const emp of employees) {
    const { error } = await supabase.from("employees").insert(emp)
    if (error) {
      console.error(`插入员工 ${emp.name} 失败:`, error)
    }
  }

  // 插入绩效评估数据
  // 插入薪资记录数据
  // 插入通知数据
  // 插入入职任务数据
  // ...
}

initDatabase().catch(console.error)
