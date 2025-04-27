"use client"

import type React from "react"
import { useAuth } from "@/lib/auth"
import { hasPermission, type Permission } from "@/lib/permissions"

interface PermissionGuardProps {
  permission: Permission | Permission[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const { user } = useAuth()

  if (!user) {
    return fallback
  }

  const userRole = user.role as any // 类型转换为 Role

  // 检查是否有权限
  const hasAccess = Array.isArray(permission)
    ? permission.some((p) => hasPermission(userRole, p))
    : hasPermission(userRole, permission)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}
