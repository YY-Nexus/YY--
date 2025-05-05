import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// 使用环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 创建一个安全的全局对象引用，兼容浏览器和服务器环境
const getGlobalObject = () => {
  if (typeof window !== "undefined") {
    return window
  }
  if (typeof global !== "undefined") {
    return global
  }
  // 如果两者都不存在，返回一个空对象
  return {}
}

// 使用闭包实现单例模式，避免依赖全局对象
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// 获取Supabase客户端实例（单例模式）
export const getSupabase = () => {
  // 检查是否已经存在实例
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// 导出supabase客户端实例
export const supabase = getSupabase()

// 服务端Supabase客户端（使用service role key，具有更高权限）
let serverSupabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // 在服务端环境中也使用单例模式
  if (typeof window === "undefined" && !serverSupabaseInstance) {
    serverSupabaseInstance = createClient<Database>(supabaseUrl, supabaseServiceKey)
    return serverSupabaseInstance
  } else if (typeof window === "undefined" && serverSupabaseInstance) {
    return serverSupabaseInstance
  }

  // 客户端环境中创建新实例
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}
