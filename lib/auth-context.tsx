"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react"
import { useSupabase } from "./supabase-context"

// 定义权限类型
export type Permission = {
  module: string
  resource: string
  action: "view" | "create" | "edit" | "delete" | "approve"
}

// 定义角色类型
export type Role = {
  id: string
  name: string
  permissions: Permission[]
}

// 定义用户类型
export type User = {
  id: string
  name: string
  email: string
  role: Role
}

// 定义认证上下文类型
type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  hasPermission: (permission: Permission) => boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 模拟用户数据
const mockUser: User = {
  id: "1",
  name: "管理员",
  email: "admin@example.com",
  role: {
    id: "1",
    name: "系统管理员",
    permissions: [
      { module: "组织治理中枢", resource: "组织架构", action: "view" },
      { module: "组织治理中枢", resource: "组织架构", action: "edit" },
      { module: "员工全周期管理", resource: "员工信息", action: "view" },
      { module: "员工全周期管理", resource: "员工信息", action: "edit" },
      { module: "薪酬绩效引擎", resource: "薪酬数据", action: "view" },
      { module: "薪酬绩效引擎", resource: "薪酬数据", action: "edit" },
      // 更多权限...
    ],
  },
}

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = useSupabase()

  // 使用useRef避免在useEffect中的依赖项变化
  const supabaseRef = useRef(supabase)

  // 检查用户是否有特定权限 - 使用useCallback避免不必要的重新创建
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false

      return user.role.permissions.some(
        (p) => p.module === permission.module && p.resource === permission.resource && p.action === permission.action,
      )
    },
    [user],
  )

  // 模拟初始化认证状态
  useEffect(() => {
    // 在实际应用中，这里应该检查本地存储或cookie中的令牌
    // 然后从API获取用户信息
    const checkAuth = async () => {
      try {
        // 获取当前会话
        const {
          data: { session },
        } = await supabaseRef.current.auth.getSession()

        if (session) {
          // 如果有会话，可以从数据库获取用户详细信息
          // 这里仍使用模拟数据
          setUser(mockUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("检查认证状态时出错:", error)
      }
    }

    checkAuth()

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabaseRef.current.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(mockUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, []) // 空依赖数组，只在组件挂载时运行一次

  // 登录功能
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabaseRef.current.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("登录失败:", error.message)
        return false
      }

      return true
    } catch (error) {
      console.error("登录过程中发生错误:", error)
      return false
    }
  }, [])

  // 登出功能
  const logout = useCallback(async () => {
    try {
      await supabaseRef.current.auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("登出过程中发生错误:", error)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, hasPermission, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 自定义钩子，用于在组件中访问认证上下文
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth必须在AuthProvider内部使用")
  }
  return context
}
