import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function flattenOrganizationData(data, level = 0, department = null) {
  let result = []

  // 添加当前节点
  result.push({
    name: data.name,
    title: data.title,
    level: level,
    department: department,
    subordinates: data.children ? data.children.length : 0,
  })

  // 递归处理子节点
  if (data.children && data.children.length > 0) {
    const currentDept = level === 0 ? null : level === 1 ? data.name : department

    for (const child of data.children) {
      result = result.concat(flattenOrganizationData(child, level + 1, currentDept))
    }
  }

  return result
}
