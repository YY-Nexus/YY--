// 微前端配置
export interface MicroFrontendConfig {
  name: string
  path: string
  remoteEntry: string
  exposedModule: string
  scope: string
}

// 定义系统中的微前端应用
export const microFrontends: MicroFrontendConfig[] = [
  {
    name: "组织治理",
    path: "organization",
    remoteEntry: process.env.NEXT_PUBLIC_ORGANIZATION_URL || "http://localhost:3001/remoteEntry.js",
    exposedModule: "./OrganizationApp",
    scope: "organization",
  },
  {
    name: "员工管理",
    path: "employee",
    remoteEntry: process.env.NEXT_PUBLIC_EMPLOYEE_URL || "http://localhost:3002/remoteEntry.js",
    exposedModule: "./EmployeeApp",
    scope: "employee",
  },
  {
    name: "薪酬绩效",
    path: "compensation",
    remoteEntry: process.env.NEXT_PUBLIC_COMPENSATION_URL || "http://localhost:3003/remoteEntry.js",
    exposedModule: "./CompensationApp",
    scope: "compensation",
  },
  // 可以添加更多微前端应用
]

// 获取特定路径的微前端配置
export function getMicroFrontendByPath(path: string): MicroFrontendConfig | undefined {
  const normalizedPath = path.startsWith("/") ? path.substring(1) : path

  // 处理租户路径格式 - 如果路径包含 tenant/[tenantId]，则提取实际的应用路径
  let segments = normalizedPath.split("/")

  // 如果是租户路径格式 (tenant/[tenantId]/[appPath])
  if (segments[0] === "tenant" && segments.length >= 3) {
    // 从第三段开始才是实际的应用路径
    segments = segments.slice(2)
  }

  const basePath = segments[0]

  // 如果是 dashboard 路径，返回 null 表示使用默认仪表盘
  if (basePath === "dashboard") {
    return undefined
  }

  return microFrontends.find((mf) => mf.path === basePath)
}
