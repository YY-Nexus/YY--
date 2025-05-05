"use client"

import { createContext, useContext, useRef, type ReactNode } from "react"
import { getSupabase } from "./supabase"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// 创建Supabase上下文
type SupabaseContextType = {
  supabase: SupabaseClient<Database>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

// Supabase提供者组件 - 确保只创建一个实例
export function SupabaseProvider({ children }: { children: ReactNode }) {
  // 使用useRef确保只创建一次实例
  const supabaseRef = useRef(getSupabase())

  return <SupabaseContext.Provider value={{ supabase: supabaseRef.current }}>{children}</SupabaseContext.Provider>
}

// 自定义钩子，用于在组件中访问Supabase客户端
export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase必须在SupabaseProvider内部使用")
  }
  return context.supabase
}
