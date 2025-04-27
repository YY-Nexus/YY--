"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Role } from "@/lib/permissions"

interface User {
  id: string
  name: string
  email: string
  image?: string
  role: Role
  mfaEnabled?: boolean
  lastLogin?: string
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  verifyMfa: (code: string) => Promise<boolean>
  signOut: () => void
  requiresMfa: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requiresMfa, setRequiresMfa] = useState(false)
  const [pendingUser, setPendingUser] = useState<User | null>(null)
  const router = useRouter()

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 从本地存储获取用户信息
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          // 如果没有登录，重定向到登录页面
          router.push("/login")
        }
      } catch (err) {
        console.error("认证检查失败:", err)
        setError("认证检查失败")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // 登录函数
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // 检查是否是管理员账号
      if (email === "yy@0379.email" && password === "My151001") {
        // 管理员账号
        const adminUser: User = {
          id: "admin-1",
          name: "系统管理员",
          email: email,
          image: "/admin-avatar.png",
          role: "admin",
          mfaEnabled: true,
          lastLogin: new Date().toISOString(),
        }

        // 记录登录尝试
        await logAudit({
          action: "LOGIN_ATTEMPT",
          userId: "admin-1",
          email: email,
          details: "管理员登录尝试",
          ip: "127.0.0.1", // 实际应用中应获取真实IP
          userAgent: navigator.userAgent,
        })

        // 如果启用了MFA，设置待验证用户并要求MFA
        if (adminUser.mfaEnabled) {
          setPendingUser(adminUser)
          setRequiresMfa(true)
          return
        }

        // 保存到本地存储
        localStorage.setItem("user", JSON.stringify(adminUser))
        setUser(adminUser)

        // 记录登录成功
        await logAudit({
          action: "LOGIN_SUCCESS",
          userId: "admin-1",
          email: email,
          details: "管理员登录成功",
          ip: "127.0.0.1",
          userAgent: navigator.userAgent,
        })

        // 登录成功后重定向到仪表盘
        router.push("/dashboard")
        return
      }

      // 模拟API调用
      // 实际应用中，这里应该调用真实的API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟用户数据
      const mockUser: User = {
        id: "user-1",
        name: "测试用户",
        email: email,
        image: "/mystical-forest-spirit.png",
        role: "user",
        lastLogin: new Date().toISOString(),
      }

      // 保存到本地存储
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)

      // 记录登录成功
      await logAudit({
        action: "LOGIN_SUCCESS",
        userId: "user-1",
        email: email,
        details: "用户登录成功",
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })

      // 登录成功后重定向到仪表盘
      router.push("/dashboard")
    } catch (err) {
      console.error("登录失败:", err)
      setError("登录失败，请检查您的邮箱和密码")

      // 记录登录失败
      await logAudit({
        action: "LOGIN_FAILURE",
        email: email,
        details: "登录失败",
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
    } finally {
      setLoading(false)
    }
  }

  // 验证MFA代码
  const verifyMfa = async (code: string): Promise<boolean> => {
    if (!pendingUser) return false

    try {
      setLoading(true)

      // 模拟MFA验证
      // 实际应用中，这里应该调用真实的API验证MFA代码
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 简单验证：对管理员，任何6位数都视为有效
      const isValid = /^\d{6}$/.test(code)

      if (isValid) {
        // MFA验证成功
        localStorage.setItem("user", JSON.stringify(pendingUser))
        setUser(pendingUser)
        setRequiresMfa(false)
        setPendingUser(null)

        // 记录MFA验证成功
        await logAudit({
          action: "MFA_SUCCESS",
          userId: pendingUser.id,
          email: pendingUser.email,
          details: "MFA验证成功",
          ip: "127.0.0.1",
          userAgent: navigator.userAgent,
        })

        // 重定向到仪表盘
        router.push("/dashboard")
        return true
      } else {
        // MFA验证失败
        setError("验证码无效，请重试")

        // 记录MFA验证失败
        await logAudit({
          action: "MFA_FAILURE",
          userId: pendingUser.id,
          email: pendingUser.email,
          details: "MFA验证失败",
          ip: "127.0.0.1",
          userAgent: navigator.userAgent,
        })

        return false
      }
    } catch (err) {
      console.error("MFA验证失败:", err)
      setError("MFA验证失败，请重试")
      return false
    } finally {
      setLoading(false)
    }
  }

  // 登出函数
  const signOut = async () => {
    if (user) {
      // 记录登出
      await logAudit({
        action: "LOGOUT",
        userId: user.id,
        email: user.email,
        details: "用户登出",
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
    }

    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, verifyMfa, signOut, requiresMfa }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// 审计日志接口
interface AuditLogEntry {
  action: string
  timestamp?: string
  userId?: string
  email?: string
  details?: string
  ip?: string
  userAgent?: string
}

// 记录审计日志
async function logAudit(entry: AuditLogEntry): Promise<void> {
  // 添加时间戳
  const logEntry = {
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  }

  try {
    // 获取现有日志
    const existingLogs = JSON.parse(localStorage.getItem("auditLogs") || "[]")

    // 添加新日志
    const updatedLogs = [logEntry, ...existingLogs].slice(0, 1000) // 限制存储最近1000条

    // 保存回本地存储
    localStorage.setItem("auditLogs", JSON.stringify(updatedLogs))

    // 实际应用中，这里应该调用API将日志发送到服务器
    console.log("审计日志:", logEntry)
  } catch (error) {
    console.error("记录审计日志失败:", error)
  }
}
