"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { navigationData, type NavItemType } from "@/lib/navigation-data"

// 定义权限类型
export type Permission = "admin" | "manager" | "employee" | "guest"

// 定义权限映射
const permissionMap: Record<string, Permission[]> = {
  organization: ["admin", "manager"],
  "employee-lifecycle": ["admin", "manager", "employee"],
  compensation: ["admin", "manager"],
  "data-decision": ["admin", "manager"],
  "employee-experience": ["admin", "manager", "employee"],
  "strategic-planning": ["admin"],
  "financial-control": ["admin", "manager"],
  "intelligent-process": ["admin", "manager", "employee"],
  "learning-innovation": ["admin", "manager", "employee"],
  "system-config": ["admin"],
  "life-services": ["admin", "manager", "employee", "guest"],
  "compliance-risk": ["admin", "manager"],
}

// 子菜单权限映射
const subPermissionMap: Record<string, Permission[]> = {
  "org-structure": ["admin", "manager"],
  "org-3d-map": ["admin", "manager"],
  "org-ai-diagnosis": ["admin"],
  "org-dynamic-model": ["admin"],
  "org-permission-radar": ["admin"],
  "org-digital-twin": ["admin", "manager"],
  // 可以继续添加其他子菜单的权限映射
}

export function useNavPermissions() {
  const { user } = useAuth()
  const [filteredNavigation, setFilteredNavigation] = useState<NavItemType[]>(navigationData)

  // 获取当前用户的权限
  const getUserPermission = (): Permission => {
    if (!user) return "guest"
    return (user.role as Permission) || "guest"
  }

  // 检查用户是否有权限访问某个导航项
  const hasPermission = (itemId: string): boolean => {
    const userPermission = getUserPermission()
    const allowedRoles = permissionMap[itemId] || subPermissionMap[itemId] || ["admin"]
    return allowedRoles.includes(userPermission)
  }

  // 过滤导航数据，只显示用户有权限的项
  useEffect(() => {
    const filterNavItems = (items: NavItemType[]): NavItemType[] => {
      return items
        .filter((item) => hasPermission(item.id))
        .map((item) => {
          if (item.children && item.children.length > 0) {
            return {
              ...item,
              children: filterNavItems(item.children),
            }
          }
          return item
        })
    }

    setFilteredNavigation(filterNavItems(navigationData))
  }, [user])

  return { filteredNavigation, hasPermission }
}
