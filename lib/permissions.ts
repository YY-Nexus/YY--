// 权限类型定义
export type Permission =
  | "dashboard:view"
  | "dashboard:edit"
  | "reports:view"
  | "reports:create"
  | "reports:export"
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  | "settings:view"
  | "settings:edit"
  | "system:view"
  | "system:edit"
  | "logs:view"
  | "backup:view"
  | "backup:create"
  | "backup:restore"
  | "admin:access"

// 角色类型定义
export type Role = "admin" | "manager" | "analyst" | "user" | "readonly"

// 角色权限映射
export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "dashboard:view",
    "dashboard:edit",
    "reports:view",
    "reports:create",
    "reports:export",
    "users:view",
    "users:create",
    "users:edit",
    "users:delete",
    "settings:view",
    "settings:edit",
    "system:view",
    "system:edit",
    "logs:view",
    "backup:view",
    "backup:create",
    "backup:restore",
    "admin:access",
  ],
  manager: [
    "dashboard:view",
    "dashboard:edit",
    "reports:view",
    "reports:create",
    "reports:export",
    "users:view",
    "settings:view",
    "logs:view",
  ],
  analyst: ["dashboard:view", "dashboard:edit", "reports:view", "reports:create", "reports:export"],
  user: ["dashboard:view", "reports:view", "reports:create"],
  readonly: ["dashboard:view", "reports:view"],
}

// 检查用户是否有特定权限
export function hasPermission(userRole: Role, permission: Permission): boolean {
  return rolePermissions[userRole]?.includes(permission) || false
}

// 检查用户是否有多个权限中的任意一个
export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

// 检查用户是否有所有指定的权限
export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission))
}

// 获取用户所有权限
export function getUserPermissions(userRole: Role): Permission[] {
  return rolePermissions[userRole] || []
}
