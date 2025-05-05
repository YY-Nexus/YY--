// 这个脚本用于将Supabase数据导出为CSV或JSON格式
// 可以通过 `npx tsx scripts/export-data.ts` 运行

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { Parser } from "json2csv"

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("缺少Supabase环境变量")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 命令行参数
const args = process.argv.slice(2)
const format = args[0] || "json" // 默认为JSON格式
const table = args[1] // 要导出的表名
const outputDir = path.join(__dirname, "../exports")

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function exportData() {
  console.log("开始导出数据...")

  if (table) {
    // 导出指定表
    await exportTable(table)
  } else {
    // 导出所有表
    const tables = [
      "employees",
      "departments",
      "performance_reviews",
      "salary_records",
      "notifications",
      "onboarding_tasks",
    ]
    for (const t of tables) {
      await exportTable(t)
    }
  }

  console.log("数据导出完成！")
}

async function exportTable(tableName: string) {
  console.log(`导出表 ${tableName}...`)

  try {
    // 从Supabase获取表数据
    const { data, error } = await supabase.from(tableName).select("*")

    if (error) {
      console.error(`获取表 ${tableName} 数据失败:`, error)
      return
    }

    if (!data || data.length === 0) {
      console.log(`表 ${tableName} 没有数据`)
      return
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const fileName = `${tableName}_${timestamp}`

    if (format === "csv") {
      // 导出为CSV
      const fields = Object.keys(data[0])
      const parser = new Parser({ fields })
      const csv = parser.parse(data)

      fs.writeFileSync(path.join(outputDir, `${fileName}.csv`), csv)
      console.log(`表 ${tableName} 已导出为CSV: ${fileName}.csv`)
    } else {
      // 导出为JSON
      fs.writeFileSync(path.join(outputDir, `${fileName}.json`), JSON.stringify(data, null, 2))
      console.log(`表 ${tableName} 已导出为JSON: ${fileName}.json`)
    }
  } catch (error) {
    console.error(`导出表 ${tableName} 失败:`, error)
  }
}

exportData().catch(console.error)
