// 报表模型定义

// 报表类型
export type ReportType = "table" | "chart" | "dashboard" | "card" | "list"

// 报表状态
export type ReportStatus = "draft" | "published" | "archived"

// 图表类型
export type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "area"
  | "radar"
  | "heatmap"
  | "treemap"
  | "funnel"
  | "gauge"
  | "sankey"

// 数据源类型
export type DataSourceType = "database" | "api" | "file" | "manual"

// 报表接口
export interface Report {
  id: string
  tenantId: string
  name: string
  description?: string
  type: ReportType
  status: ReportStatus
  config: ReportConfig
  dataSource: DataSource
  schedule?: ReportSchedule
  permissions: ReportPermission[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  lastRunAt?: string
  category?: string
  tags?: string[]
}

// 报表配置接口
export interface ReportConfig {
  layout: ReportLayout
  components: ReportComponent[]
  filters?: ReportFilter[]
  parameters?: ReportParameter[]
  theme?: string
  options?: Record<string, any>
}

// 报表布局接口
export interface ReportLayout {
  type: "grid" | "flex" | "fixed"
  config: any
}

// 报表组件接口
export interface ReportComponent {
  id: string
  type: "table" | "chart" | "card" | "text" | "image" | "filter" | "custom"
  name: string
  dataIndex?: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  config: any
}

// 报表过滤器接口
export interface ReportFilter {
  id: string
  name: string
  field: string
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "nin" | "contains" | "between"
  value?: any
  defaultValue?: any
  type: "text" | "number" | "date" | "select" | "multiselect" | "daterange"
  options?: { label: string; value: any }[]
  required?: boolean
}

// 报表参数接口
export interface ReportParameter {
  id: string
  name: string
  type: "string" | "number" | "boolean" | "date" | "object" | "array"
  defaultValue?: any
  required?: boolean
}

// 数据源接口
export interface DataSource {
  type: DataSourceType
  config: any
  query?: string
  transformation?: string
}

// 报表计划接口
export interface ReportSchedule {
  enabled: boolean
  frequency: "once" | "hourly" | "daily" | "weekly" | "monthly"
  time?: string
  dayOfWeek?: number
  dayOfMonth?: number
  recipients: string[]
  format: "pdf" | "excel" | "csv" | "html"
  subject?: string
  message?: string
}

// 报表权限接口
export interface ReportPermission {
  role: string
  access: "view" | "edit" | "delete" | "share"
}

// 报表执行结果接口
export interface ReportResult {
  id: string
  reportId: string
  executedAt: string
  executedBy: string
  parameters?: Record<string, any>
  filters?: Record<string, any>
  data: any
  status: "success" | "error" | "partial"
  error?: string
  executionTime: number
}

// 报表导出接口
export interface ReportExport {
  id: string
  reportId: string
  format: "pdf" | "excel" | "csv" | "html"
  createdAt: string
  createdBy: string
  url: string
  expiresAt: string
  status: "pending" | "processing" | "completed" | "error"
  error?: string
}
