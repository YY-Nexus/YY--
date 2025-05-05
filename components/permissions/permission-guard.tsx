"use client"

import type { ReactNode } from "react"
import { useAuth, type Permission } from "@/lib/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

interface PermissionGuardProps {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (hasPermission(permission)) {
    return <>{children}</>
  }

  // 如果没有权限，显示fallback或默认的无权限提示
  return fallback ? (
    <>{fallback}</>
  ) : (
    <Alert variant="destructive">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>权限不足</AlertTitle>
      <AlertDescription>您没有访问此资源的权限。如需帮助，请联系系统管理员。</AlertDescription>
    </Alert>
  )
}
