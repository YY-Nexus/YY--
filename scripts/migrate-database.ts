// 这个脚本用于执行数据库迁移
// 可以通过 `npx tsx scripts/migrate-database.ts` 运行

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("缺少Supabase环境变量")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateDatabase() {
  console.log("开始执行数据库迁移...")

  // 读取迁移文件目录
  const migrationsDir = path.join(__dirname, "migrations")

  // 确保迁移目录存在
  if (!fs.existsSync(migrationsDir)) {
    console.log("创建迁移目录...")
    fs.mkdirSync(migrationsDir, { recursive: true })
  }

  // 获取已执行的迁移记录
  const { data: executedMigrations, error: fetchError } = await supabase.from("migrations").select("name")

  if (fetchError) {
    console.error("获取已执行迁移记录失败:", fetchError)

    // 如果是因为表不存在，则创建迁移表
    if (fetchError.code === "42P01") {
      console.log("创建迁移表...")
      const { error: createError } = await supabase.rpc("create_migrations_table")

      if (createError) {
        console.error("创建迁移表失败:", createError)
        process.exit(1)
      }
    } else {
      process.exit(1)
    }
  }

  const executedMigrationNames = executedMigrations?.map((m) => m.name) || []

  // 读取迁移文件
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort()

  // 执行未执行的迁移
  for (const file of migrationFiles) {
    if (!executedMigrationNames.includes(file)) {
      console.log(`执行迁移: ${file}`)

      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8")

      // 执行SQL
      const { error } = await supabase.rpc("run_sql", { sql })

      if (error) {
        console.error(`执行迁移 ${file} 失败:`, error)
        process.exit(1)
      }

      // 记录已执行的迁移
      const { error: insertError } = await supabase
        .from("migrations")
        .insert({ name: file, executed_at: new Date().toISOString() })

      if (insertError) {
        console.error(`记录迁移 ${file} 失败:`, insertError)
        process.exit(1)
      }

      console.log(`迁移 ${file} 执行成功`)
    } else {
      console.log(`跳过已执行的迁移: ${file}`)
    }
  }

  console.log("数据库迁移完成！")
}

migrateDatabase().catch(console.error)
