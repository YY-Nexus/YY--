import { getSupabaseApiClient } from "./api-client"

// 员工类型
export interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  hire_date: string
  status: "active" | "inactive" | "onboarding"
  manager_id?: string
  created_at: string
  updated_at: string
}

// 员工统计类型
export interface EmployeeStats {
  totalEmployees: number
  newHires: number
  retentionRate: string
  averageTenure: string
}

// 员工服务类
export class EmployeeService {
  private api = getSupabaseApiClient()

  // 获取所有员工
  public async getAllEmployees(options?: {
    department?: string
    status?: string
    limit?: number
    offset?: number
  }): Promise<Employee[]> {
    return this.api.getTable<Employee>("employees", {
      filter: {
        department: options?.department,
        status: options?.status,
      },
      limit: options?.limit,
      offset: options?.offset,
      orderBy: { column: "name" },
    })
  }

  // 获取员工详情
  public async getEmployee(id: string): Promise<Employee | null> {
    return this.api.getRecord<Employee>("employees", id)
  }

  // 创建员工
  public async createEmployee(data: Omit<Employee, "id" | "created_at" | "updated_at">): Promise<Employee> {
    return this.api.createRecord<Employee>("employees", data)
  }

  // 更新员工
  public async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    return this.api.updateRecord<Employee>("employees", id, data)
  }

  // 删除员工
  public async deleteEmployee(id: string): Promise<void> {
    return this.api.deleteRecord("employees", id)
  }

  // 获取员工统计数据
  public async getEmployeeStats(): Promise<EmployeeStats> {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM employees WHERE status = 'active') as total_employees,
        (SELECT COUNT(*) FROM employees WHERE status = 'active' AND hire_date >= date_trunc('month', now())) as new_hires,
        (SELECT 
          ROUND(
            (1 - (COUNT(*) FILTER (WHERE status = 'inactive' AND updated_at >= now() - interval '3 months') / 
            NULLIF(COUNT(*) FILTER (WHERE status = 'active' OR (status = 'inactive' AND updated_at >= now() - interval '3 months')), 0))
            * 100, 1
          )::text
        FROM employees) as retention_rate,
        (SELECT 
          ROUND(
            AVG(EXTRACT(YEAR FROM age(now(), hire_date))), 1
          )::text
        FROM employees WHERE status = 'active') as average_tenure
    `

    const result = await this.api.executeQuery<EmployeeStats>(query)
    return result[0]
  }

  // 获取部门员工数量
  public async getDepartmentCounts(): Promise<{ department: string; count: number }[]> {
    const query = `
      SELECT department, COUNT(*) as count
      FROM employees
      WHERE status = 'active'
      GROUP BY department
      ORDER BY count DESC
    `

    return this.api.executeQuery<{ department: string; count: number }>(query)
  }
}

// 创建员工服务实例
let employeeServiceInstance: EmployeeService | null = null

export function getEmployeeService(): EmployeeService {
  if (!employeeServiceInstance) {
    employeeServiceInstance = new EmployeeService()
  }
  return employeeServiceInstance
}
