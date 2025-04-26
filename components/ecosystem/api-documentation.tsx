"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Key, Lock, Search, Server, Code, FileJson, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApiDocumentationProps {
  className?: string
}

export function ApiDocumentation({ className }: ApiDocumentationProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [apiVersion, setApiVersion] = useState("v1")
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)

  // 模拟API端点数据
  const apiEndpoints = [
    {
      id: "auth",
      name: "认证",
      endpoints: [
        {
          id: "auth-token",
          method: "POST",
          path: "/api/v1/auth/token",
          description: "获取访问令牌",
          auth: true,
          params: [
            { name: "client_id", type: "string", required: true, description: "API客户端ID" },
            { name: "client_secret", type: "string", required: true, description: "API客户端密钥" },
            { name: "grant_type", type: "string", required: true, description: "授权类型，通常为'client_credentials'" },
          ],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`,
            },
            {
              code: 401,
              description: "认证失败",
              example: `{
  "error": "invalid_client",
  "error_description": "客户端认证失败"
}`,
            },
          ],
        },
        {
          id: "auth-refresh",
          method: "POST",
          path: "/api/v1/auth/refresh",
          description: "刷新访问令牌",
          auth: true,
          params: [
            { name: "refresh_token", type: "string", required: true, description: "刷新令牌" },
            { name: "client_id", type: "string", required: true, description: "API客户端ID" },
            { name: "grant_type", type: "string", required: true, description: "授权类型，必须为'refresh_token'" },
          ],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def502..."
}`,
            },
          ],
        },
      ],
    },
    {
      id: "dashboards",
      name: "仪表盘",
      endpoints: [
        {
          id: "dashboards-list",
          method: "GET",
          path: "/api/v1/dashboards",
          description: "获取仪表盘列表",
          auth: true,
          params: [
            { name: "page", type: "integer", required: false, description: "页码，默认为1" },
            { name: "limit", type: "integer", required: false, description: "每页数量，默认为20" },
            { name: "sort", type: "string", required: false, description: "排序字段，如'created_at'" },
            { name: "order", type: "string", required: false, description: "排序方向，'asc'或'desc'" },
          ],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "data": [
    {
      "id": "dash-001",
      "name": "销售分析仪表盘",
      "description": "销售部门使用的分析仪表盘",
      "created_at": "2024-01-15T08:30:00Z",
      "updated_at": "2024-04-20T14:15:30Z"
    },
    {
      "id": "dash-002",
      "name": "财务概览",
      "description": "财务部门使用的概览仪表盘",
      "created_at": "2024-02-10T10:45:00Z",
      "updated_at": "2024-04-18T09:20:15Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20
  }
}`,
            },
          ],
        },
        {
          id: "dashboards-get",
          method: "GET",
          path: "/api/v1/dashboards/{id}",
          description: "获取单个仪表盘详情",
          auth: true,
          params: [{ name: "id", type: "string", required: true, description: "仪表盘ID" }],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "id": "dash-001",
  "name": "销售分析仪表盘",
  "description": "销售部门使用的分析仪表盘",
  "layout": {
    "widgets": [
      {
        "id": "widget-001",
        "type": "chart",
        "position": { "x": 0, "y": 0, "w": 6, "h": 4 },
        "config": { "chartType": "bar", "dataSource": "sales_data" }
      },
      {
        "id": "widget-002",
        "type": "kpi",
        "position": { "x": 6, "y": 0, "w": 3, "h": 2 },
        "config": { "metric": "total_sales", "format": "currency" }
      }
    ]
  },
  "created_at": "2024-01-15T08:30:00Z",
  "updated_at": "2024-04-20T14:15:30Z"
}`,
            },
            {
              code: 404,
              description: "未找到",
              example: `{
  "error": "not_found",
  "error_description": "找不到指定的仪表盘"
}`,
            },
          ],
        },
        {
          id: "dashboards-create",
          method: "POST",
          path: "/api/v1/dashboards",
          description: "创建新仪表盘",
          auth: true,
          params: [
            { name: "name", type: "string", required: true, description: "仪表盘名称" },
            { name: "description", type: "string", required: false, description: "仪表盘描述" },
            { name: "layout", type: "object", required: false, description: "仪表盘布局配置" },
          ],
          responses: [
            {
              code: 201,
              description: "创建成功",
              example: `{
  "id": "dash-003",
  "name": "营销效果分析",
  "description": "营销部门使用的效果分析仪表盘",
  "layout": {
    "widgets": []
  },
  "created_at": "2024-05-01T09:45:00Z",
  "updated_at": "2024-05-01T09:45:00Z"
}`,
            },
          ],
        },
        {
          id: "dashboards-update",
          method: "PUT",
          path: "/api/v1/dashboards/{id}",
          description: "更新仪表盘",
          auth: true,
          params: [
            { name: "id", type: "string", required: true, description: "仪表盘ID" },
            { name: "name", type: "string", required: false, description: "仪表盘名称" },
            { name: "description", type: "string", required: false, description: "仪表盘描述" },
            { name: "layout", type: "object", required: false, description: "仪表盘布局配置" },
          ],
          responses: [
            {
              code: 200,
              description: "更新成功",
              example: `{
  "id": "dash-001",
  "name": "销售分析仪表盘 - 更新版",
  "description": "销售部门使用的分析仪表盘，包含最新指标",
  "layout": {
    "widgets": [
      {
        "id": "widget-001",
        "type": "chart",
        "position": { "x": 0, "y": 0, "w": 6, "h": 4 },
        "config": { "chartType": "bar", "dataSource": "sales_data" }
      },
      {
        "id": "widget-002",
        "type": "kpi",
        "position": { "x": 6, "y": 0, "w": 3, "h": 2 },
        "config": { "metric": "total_sales", "format": "currency" }
      },
      {
        "id": "widget-003",
        "type": "table",
        "position": { "x": 0, "y": 4, "w": 9, "h": 4 },
        "config": { "dataSource": "sales_details", "pagination": true }
      }
    ]
  },
  "updated_at": "2024-05-01T10:30:00Z"
}`,
            },
          ],
        },
        {
          id: "dashboards-delete",
          method: "DELETE",
          path: "/api/v1/dashboards/{id}",
          description: "删除仪表盘",
          auth: true,
          params: [{ name: "id", type: "string", required: true, description: "仪表盘ID" }],
          responses: [
            {
              code: 204,
              description: "删除成功",
              example: "",
            },
          ],
        },
      ],
    },
    {
      id: "data",
      name: "数据",
      endpoints: [
        {
          id: "data-sources",
          method: "GET",
          path: "/api/v1/data/sources",
          description: "获取数据源列表",
          auth: true,
          params: [
            { name: "type", type: "string", required: false, description: "数据源类型过滤" },
            { name: "page", type: "integer", required: false, description: "页码，默认为1" },
            { name: "limit", type: "integer", required: false, description: "每页数量，默认为20" },
          ],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "data": [
    {
      "id": "src-001",
      "name": "销售数据库",
      "type": "database",
      "connection": {
        "type": "mysql",
        "host": "db.example.com"
      },
      "created_at": "2024-01-10T08:00:00Z"
    },
    {
      "id": "src-002",
      "name": "营销数据API",
      "type": "api",
      "connection": {
        "type": "rest",
        "url": "https://api.marketing.example.com"
      },
      "created_at": "2024-02-05T14:30:00Z"
    }
  ],
  "meta": {
    "total": 8,
    "page": 1,
    "limit": 20
  }
}`,
            },
          ],
        },
        {
          id: "data-query",
          method: "POST",
          path: "/api/v1/data/query",
          description: "执行数据查询",
          auth: true,
          params: [
            { name: "source_id", type: "string", required: true, description: "数据源ID" },
            { name: "query", type: "object", required: true, description: "查询参数" },
            { name: "cache", type: "boolean", required: false, description: "是否使用缓存，默认为true" },
            { name: "timeout", type: "integer", required: false, description: "查询超时时间（秒）" },
          ],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "data": [
    {
      "date": "2024-04-01",
      "sales": 12500,
      "customers": 450
    },
    {
      "date": "2024-04-02",
      "sales": 13200,
      "customers": 485
    },
    {
      "date": "2024-04-03",
      "sales": 11800,
      "customers": 420
    }
  ],
  "meta": {
    "total_rows": 3,
    "execution_time": 0.35,
    "cached": false
  }
}`,
            },
          ],
        },
        {
          id: "data-export",
          method: "POST",
          path: "/api/v1/data/export",
          description: "导出数据",
          auth: true,
          params: [
            { name: "source_id", type: "string", required: true, description: "数据源ID" },
            { name: "query", type: "object", required: true, description: "查询参数" },
            { name: "format", type: "string", required: true, description: "导出格式，支持'csv'、'excel'、'json'" },
            { name: "filename", type: "string", required: false, description: "导出文件名" },
          ],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "export_url": "https://api.example.com/exports/export-20240501-123456.csv",
  "expires_at": "2024-05-02T12:34:56Z",
  "format": "csv",
  "rows": 1250
}`,
            },
          ],
        },
      ],
    },
    {
      id: "reports",
      name: "报表",
      endpoints: [
        {
          id: "reports-list",
          method: "GET",
          path: "/api/v1/reports",
          description: "获取报表列表",
          auth: true,
          params: [
            { name: "type", type: "string", required: false, description: "报表类型过滤" },
            { name: "page", type: "integer", required: false, description: "页码，默认为1" },
            { name: "limit", type: "integer", required: false, description: "每页数量，默认为20" },
          ],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "data": [
    {
      "id": "rep-001",
      "name": "月度销售报表",
      "type": "sales",
      "schedule": "monthly",
      "created_at": "2024-01-20T10:00:00Z"
    },
    {
      "id": "rep-002",
      "name": "季度财务报表",
      "type": "financial",
      "schedule": "quarterly",
      "created_at": "2024-02-15T11:30:00Z"
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 20
  }
}`,
            },
          ],
        },
        {
          id: "reports-generate",
          method: "POST",
          path: "/api/v1/reports/{id}/generate",
          description: "生成报表",
          auth: true,
          params: [
            { name: "id", type: "string", required: true, description: "报表ID" },
            { name: "parameters", type: "object", required: false, description: "报表参数" },
            { name: "format", type: "string", required: false, description: "报表格式，支持'pdf'、'excel'、'html'" },
          ],
          responses: [
            {
              code: 202,
              description: "已接受请求，正在处理",
              example: `{
  "task_id": "task-20240501-123456",
  "status": "processing",
  "estimated_completion": "2024-05-01T12:40:00Z"
}`,
            },
          ],
        },
        {
          id: "reports-status",
          method: "GET",
          path: "/api/v1/reports/tasks/{task_id}",
          description: "获取报表生成任务状态",
          auth: true,
          params: [{ name: "task_id", type: "string", required: true, description: "任务ID" }],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "task_id": "task-20240501-123456",
  "status": "completed",
  "report_url": "https://api.example.com/reports/report-20240501-123456.pdf",
  "expires_at": "2024-05-08T12:34:56Z"
}`,
            },
          ],
        },
      ],
    },
    {
      id: "plugins",
      name: "插件",
      endpoints: [
        {
          id: "plugins-list",
          method: "GET",
          path: "/api/v1/plugins",
          description: "获取已安装插件列表",
          auth: true,
          params: [
            { name: "status", type: "string", required: false, description: "插件状态过滤，如'active'、'inactive'" },
            { name: "page", type: "integer", required: false, description: "页码，默认为1" },
            { name: "limit", type: "integer", required: false, description: "每页数量，默认为20" },
          ],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "data": [
    {
      "id": "plugin-001",
      "name": "高级数据可视化",
      "version": "1.2.0",
      "status": "active",
      "installed_at": "2024-03-10T09:15:00Z"
    },
    {
      "id": "plugin-002",
      "name": "数据导出增强",
      "version": "0.9.5",
      "status": "active",
      "installed_at": "2024-04-05T14:20:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20
  }
}`,
            },
          ],
        },
        {
          id: "plugins-install",
          method: "POST",
          path: "/api/v1/plugins/install",
          description: "安装插件",
          auth: true,
          params: [
            { name: "plugin_id", type: "string", required: true, description: "插件商店中的插件ID" },
            { name: "version", type: "string", required: false, description: "插件版本，默认为最新版" },
            { name: "options", type: "object", required: false, description: "安装选项" },
          ],
          responses: [
            {
              code: 202,
              description: "已接受请求，正在处理",
              example: `{
  "task_id": "task-20240501-123456",
  "status": "processing",
  "plugin_id": "plugin-003",
  "plugin_name": "预测分析工具",
  "version": "1.0.0"
}`,
            },
          ],
        },
        {
          id: "plugins-uninstall",
          method: "DELETE",
          path: "/api/v1/plugins/{id}",
          description: "卸载插件",
          auth: true,
          params: [
            { name: "id", type: "string", required: true, description: "已安装的插件ID" },
            { name: "keep_data", type: "boolean", required: false, description: "是否保留插件数据，默认为false" },
          ],
          responses: [
            {
              code: 202,
              description: "已接受请求，正在处理",
              example: `{
  "task_id": "task-20240501-123457",
  "status": "processing",
  "plugin_id": "plugin-002",
  "plugin_name": "数据导出增强"
}`,
            },
          ],
        },
        {
          id: "plugins-configure",
          method: "PUT",
          path: "/api/v1/plugins/{id}/configure",
          description: "配置插件",
          auth: true,
          params: [
            { name: "id", type: "string", required: true, description: "已安装的插件ID" },
            { name: "config", type: "object", required: true, description: "插件配置" },
          ],
          responses: [
            {
              code: 200,
              description: "配置成功",
              example: `{
  "plugin_id": "plugin-001",
  "plugin_name": "高级数据可视化",
  "status": "active",
  "config": {
    "default_theme": "dark",
    "enable_animations": true,
    "cache_timeout": 300
  },
  "updated_at": "2024-05-01T12:34:56Z"
}`,
            },
          ],
        },
      ],
    },
    {
      id: "users",
      name: "用户",
      endpoints: [
        {
          id: "users-list",
          method: "GET",
          path: "/api/v1/users",
          description: "获取用户列表",
          auth: true,
          params: [
            { name: "role", type: "string", required: false, description: "角色过滤" },
            { name: "status", type: "string", required: false, description: "状态过滤，如'active'、'inactive'" },
            { name: "page", type: "integer", required: false, description: "页码，默认为1" },
            { name: "limit", type: "integer", required: false, description: "每页数量，默认为20" },
          ],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "data": [
    {
      "id": "user-001",
      "username": "admin",
      "email": "admin@example.com",
      "role": "administrator",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "user-002",
      "username": "analyst",
      "email": "analyst@example.com",
      "role": "analyst",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 20
  }
}`,
            },
          ],
        },
        {
          id: "users-create",
          method: "POST",
          path: "/api/v1/users",
          description: "创建新用户",
          auth: true,
          params: [
            { name: "username", type: "string", required: true, description: "用户名" },
            { name: "email", type: "string", required: true, description: "电子邮箱" },
            { name: "password", type: "string", required: true, description: "密码" },
            { name: "role", type: "string", required: true, description: "角色" },
            { name: "status", type: "string", required: false, description: "状态，默认为'active'" },
          ],
          responses: [
            {
              code: 201,
              description: "创建成功",
              example: `{
  "id": "user-003",
  "username": "manager",
  "email": "manager@example.com",
  "role": "manager",
  "status": "active",
  "created_at": "2024-05-01T12:34:56Z"
}`,
            },
          ],
        },
      ],
    },
    {
      id: "webhooks",
      name: "Webhooks",
      endpoints: [
        {
          id: "webhooks-list",
          method: "GET",
          path: "/api/v1/webhooks",
          description: "获取Webhook列表",
          auth: true,
          params: [
            { name: "event", type: "string", required: false, description: "事件类型过滤" },
            { name: "page", type: "integer", required: false, description: "页码，默认为1" },
            { name: "limit", type: "integer", required: false, description: "每页数量，默认为20" },
          ],
          responses: [
            {
              code: 200,
              description: "成功",
              example: `{
  "data": [
    {
      "id": "webhook-001",
      "name": "报表生成通知",
      "url": "https://example.com/webhooks/reports",
      "events": ["report.generated", "report.failed"],
      "status": "active",
      "created_at": "2024-03-15T09:30:00Z"
    },
    {
      "id": "webhook-002",
      "name": "数据源更新通知",
      "url": "https://example.com/webhooks/data",
      "events": ["data.updated", "data.error"],
      "status": "active",
      "created_at": "2024-04-10T14:45:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20
  }
}`,
            },
          ],
        },
        {
          id: "webhooks-create",
          method: "POST",
          path: "/api/v1/webhooks",
          description: "创建新Webhook",
          auth: true,
          params: [
            { name: "name", type: "string", required: true, description: "Webhook名称" },
            { name: "url", type: "string", required: true, description: "回调URL" },
            { name: "events", type: "array", required: true, description: "要监听的事件数组" },
            { name: "secret", type: "string", required: false, description: "用于签名的密钥" },
            { name: "status", type: "string", required: false, description: "状态，默认为'active'" },
          ],
          responses: [
            {
              code: 201,
              description: "创建成功",
              example: `{
  "id": "webhook-003",
  "name": "用户活动通知",
  "url": "https://example.com/webhooks/users",
  "events": ["user.created", "user.updated", "user.deleted"],
  "status": "active",
  "created_at": "2024-05-01T12:34:56Z"
}`,
            },
          ],
        },
      ],
    },
  ]

  // 根据搜索查询过滤端点
  const filteredEndpoints = apiEndpoints.map((group) => ({
    ...group,
    endpoints: group.endpoints.filter(
      (endpoint) =>
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }))

  // 获取当前选中的端点详情
  const getSelectedEndpointDetails = () => {
    if (!selectedEndpoint) return null

    for (const group of apiEndpoints) {
      const endpoint = group.endpoints.find((e) => e.id === selectedEndpoint)
      if (endpoint) return endpoint
    }

    return null
  }

  const selectedEndpointDetails = getSelectedEndpointDetails()

  // 复制代码到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("已复制到剪贴板")
  }

  // 生成示例代码
  const generateSampleCode = (endpoint: any, language: string) => {
    if (language === "curl") {
      let curlCommand = `curl -X ${endpoint.method} "${endpoint.path}"`

      if (endpoint.auth) {
        curlCommand += ' \\\n  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"'
      }

      curlCommand += ' \\\n  -H "Content-Type: application/json"'

      // 添加请求体参数
      if (endpoint.method === "POST" || endpoint.method === "PUT") {
        const bodyParams = endpoint.params.filter((p: any) => !p.name.includes("{") && p.name !== "id")
        if (bodyParams.length > 0) {
          const bodyObj: any = {}
          bodyParams.forEach((param: any) => {
            if (param.type === "string") bodyObj[param.name] = "value"
            else if (param.type === "integer") bodyObj[param.name] = 1
            else if (param.type === "boolean") bodyObj[param.name] = true
            else if (param.type === "array") bodyObj[param.name] = []
            else if (param.type === "object") bodyObj[param.name] = {}
          })
          curlCommand += ` \\\n  -d '${JSON.stringify(bodyObj, null, 2)}'`
        }
      }

      return curlCommand
    } else if (language === "javascript") {
      let jsCode = `// 使用fetch API调用${endpoint.path}
async function call${endpoint.id
        .split("-")
        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("")}() {
  const url = "${endpoint.path}";
  
  const options = {
    method: "${endpoint.method}",
    headers: {
      "Content-Type": "application/json",`

      if (endpoint.auth) {
        jsCode += `
      "Authorization": "Bearer YOUR_ACCESS_TOKEN",`
      }

      jsCode += `
    },`

      // 添加请求体参数
      if (endpoint.method === "POST" || endpoint.method === "PUT") {
        const bodyParams = endpoint.params.filter((p: any) => !p.name.includes("{") && p.name !== "id")
        if (bodyParams.length > 0) {
          const bodyObj: any = {}
          bodyParams.forEach((param: any) => {
            if (param.type === "string") bodyObj[param.name] = "value"
            else if (param.type === "integer") bodyObj[param.name] = 1
            else if (param.type === "boolean") bodyObj[param.name] = true
            else if (param.type === "array") bodyObj[param.name] = []
            else if (param.type === "object") bodyObj[param.name] = {}
          })
          jsCode += `
    body: JSON.stringify(${JSON.stringify(bodyObj, null, 2)}),`
        }
      }

      jsCode += `
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// 调用函数
call${endpoint.id
        .split("-")
        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("")}();`

      return jsCode
    } else if (language === "python") {
      let pythonCode = `# 使用requests库调用${endpoint.path}
import requests
import json

def call_${endpoint.id.replace(/-/g, "_")}():
    url = "${endpoint.path}"
    
    headers = {
        "Content-Type": "application/json",`

      if (endpoint.auth) {
        pythonCode += `
        "Authorization": "Bearer YOUR_ACCESS_TOKEN",`
      }

      pythonCode += `
    }
    
    `

      // 添加请求体参数
      if (endpoint.method === "POST" || endpoint.method === "PUT") {
        const bodyParams = endpoint.params.filter((p: any) => !p.name.includes("{") && p.name !== "id")
        if (bodyParams.length > 0) {
          const bodyObj: any = {}
          bodyParams.forEach((param: any) => {
            if (param.type === "string") bodyObj[param.name] = "value"
            else if (param.type === "integer") bodyObj[param.name] = 1
            else if (param.type === "boolean") bodyObj[param.name] = true
            else if (param.type === "array") bodyObj[param.name] = []
            else if (param.type === "object") bodyObj[param.name] = {}
          })
          pythonCode += `    payload = ${JSON.stringify(bodyObj, null, 4)
            .replace(/"True"/g, "True")
            .replace(/"False"/g, "False")}
    
    `
        }
      }

      pythonCode += `    try:
        `

      if (endpoint.method === "GET") {
        pythonCode += `response = requests.get(url, headers=headers)`
      } else if (endpoint.method === "POST") {
        pythonCode += `response = requests.post(url, headers=headers, json=payload)`
      } else if (endpoint.method === "PUT") {
        pythonCode += `response = requests.put(url, headers=headers, json=payload)`
      } else if (endpoint.method === "DELETE") {
        pythonCode += `response = requests.delete(url, headers=headers)`
      }

      pythonCode += `
        response.raise_for_status()
        data = response.json()
        print(data)
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        raise

# 调用函数
call_${endpoint.id.replace(/-/g, "_")}()`

      return pythonCode
    }

    return "暂不支持该语言的示例代码"
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>API文档</CardTitle>
            <CardDescription>探索和了解可用的API端点，以便集成和扩展</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={apiVersion} onValueChange={setApiVersion}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="API版本" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v1">API v1</SelectItem>
                <SelectItem value="v2">API v2 (Beta)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Key className="mr-2 h-4 w-4" />
              获取API密钥
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="endpoints">API端点</TabsTrigger>
            <TabsTrigger value="authentication">认证</TabsTrigger>
            <TabsTrigger value="sdks">SDK和工具</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">快速开始</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>在开发者控制台创建API密钥</li>
                    <li>使用API密钥获取访问令牌</li>
                    <li>在请求头中包含访问令牌</li>
                    <li>开始调用API端点</li>
                  </ol>
                  <Button className="w-full mt-4" size="sm">
                    查看详细指南
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">API限制</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>请求速率限制:</span>
                      <span className="font-medium">100次/分钟</span>
                    </div>
                    <div className="flex justify-between">
                      <span>并发请求限制:</span>
                      <span className="font-medium">10个</span>
                    </div>
                    <div className="flex justify-between">
                      <span>最大响应大小:</span>
                      <span className="font-medium">10MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>最大请求大小:</span>
                      <span className="font-medium">5MB</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    查看完整限制
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">API状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>API服务:</span>
                      <Badge className="bg-green-500">正常运行</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>数据服务:</span>
                      <Badge className="bg-green-500">正常运行</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>认证服务:</span>
                      <Badge className="bg-green-500">正常运行</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>最近更新:</span>
                      <span className="text-xs">2024-04-28</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    查看状态页面
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">最新更新</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">API v1.5.0 发布</h4>
                        <span className="text-xs text-muted-foreground">2024-04-15</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        新增数据导出API，支持更多格式和自定义选项。改进了认证流程，提高了安全性。
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Webhook支持</h4>
                        <span className="text-xs text-muted-foreground">2024-03-20</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        新增Webhook支持，允许订阅系统事件并接收实时通知。
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Python SDK更新</h4>
                        <span className="text-xs text-muted-foreground">2024-02-28</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Python SDK更新至v2.0.0，支持异步操作和改进的错误处理。
                      </p>
                    </div>
                  </div>
                  <Button variant="link" className="px-0 mt-2" size="sm">
                    查看所有更新
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">常见问题</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm">如何获取API密钥？</AccordionTrigger>
                      <AccordionContent className="text-sm">
                        登录到开发者控制台，导航至"API密钥"部分，点击"创建新密钥"按钮。选择适当的权限范围，然后点击"生成"。请妥善保管您的API密钥，它不会再次显示。
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-sm">API请求返回401错误怎么办？</AccordionTrigger>
                      <AccordionContent className="text-sm">
                        401错误表示认证失败。请检查您的访问令牌是否有效，是否已过期，以及是否正确包含在请求头中。您可能需要刷新访问令牌或重新获取新的令牌。
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-sm">如何处理API速率限制？</AccordionTrigger>
                      <AccordionContent className="text-sm">
                        当您达到API速率限制时，请求会返回429状态码。建议实现指数退避策略，并在应用中缓存常用数据以减少API调用次数。如需更高的速率限制，请联系我们的销售团队。
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-sm">支持哪些编程语言？</AccordionTrigger>
                      <AccordionContent className="text-sm">
                        我们提供官方SDK支持JavaScript/TypeScript、Python、Java、Go和PHP。对于其他语言，您可以直接使用RESTful
                        API进行集成。
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Button variant="link" className="px-0 mt-2" size="sm">
                    查看所有问题
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="pt-4">
            <div className="flex mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索API端点..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 border rounded-md">
                <div className="p-4 border-b">
                  <h3 className="font-medium">API端点分类</h3>
                </div>
                <div className="p-2">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredEndpoints.map((group) => (
                      <AccordionItem key={group.id} value={group.id}>
                        <AccordionTrigger className="px-2">
                          {group.name}
                          <Badge className="ml-2 text-xs">{group.endpoints.length}</Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-1">
                            {group.endpoints.map((endpoint) => (
                              <Button
                                key={endpoint.id}
                                variant={selectedEndpoint === endpoint.id ? "secondary" : "ghost"}
                                className="w-full justify-start text-sm h-auto py-1.5"
                                onClick={() => setSelectedEndpoint(endpoint.id)}
                              >
                                <div className="flex items-center">
                                  <Badge
                                    className={`mr-2 ${endpoint.method === "GET" ? "bg-blue-500" : endpoint.method === "POST" ? "bg-green-500" : endpoint.method === "PUT" ? "bg-yellow-500" : "bg-red-500"}`}
                                  >
                                    {endpoint.method}
                                  </Badge>
                                  <span className="truncate">{endpoint.path}</span>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>

              <div className="md:col-span-2 border rounded-md">
                {selectedEndpointDetails ? (
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge
                          className={`mr-2 ${selectedEndpointDetails.method === "GET" ? "bg-blue-500" : selectedEndpointDetails.method === "POST" ? "bg-green-500" : selectedEndpointDetails.method === "PUT" ? "bg-yellow-500" : "bg-red-500"}`}
                        >
                          {selectedEndpointDetails.method}
                        </Badge>
                        <h2 className="text-lg font-medium">{selectedEndpointDetails.path}</h2>
                      </div>
                      {selectedEndpointDetails.auth && (
                        <Badge variant="outline" className="flex items-center">
                          <Lock className="mr-1 h-3 w-3" />
                          需要认证
                        </Badge>
                      )}
                    </div>

                    <p className="mt-2 text-muted-foreground">{selectedEndpointDetails.description}</p>

                    <div className="mt-4">
                      <h3 className="font-medium mb-2">请求参数</h3>
                      <div className="border rounded-md">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-2 text-left text-sm font-medium">参数名</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">类型</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">必填</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">描述</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedEndpointDetails.params.map((param: any, index: number) => (
                              <tr
                                key={index}
                                className={index < selectedEndpointDetails.params.length - 1 ? "border-b" : ""}
                              >
                                <td className="px-4 py-2 text-sm">{param.name}</td>
                                <td className="px-4 py-2 text-sm">
                                  <Badge variant="outline">{param.type}</Badge>
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  {param.required ? (
                                    <Badge className="bg-red-500">必填</Badge>
                                  ) : (
                                    <Badge variant="outline">可选</Badge>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-sm">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-medium mb-2">响应</h3>
                      <div className="border rounded-md">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-2 text-left text-sm font-medium">状态码</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">描述</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedEndpointDetails.responses.map((response: any, index: number) => (
                              <tr
                                key={index}
                                className={index < selectedEndpointDetails.responses.length - 1 ? "border-b" : ""}
                              >
                                <td className="px-4 py-2 text-sm">
                                  <Badge
                                    className={`${response.code >= 200 && response.code < 300 ? "bg-green-500" : response.code >= 400 && response.code < 500 ? "bg-yellow-500" : "bg-red-500"}`}
                                  >
                                    {response.code}
                                  </Badge>
                                </td>
                                <td className="px-4 py-2 text-sm">{response.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-medium mb-2">示例</h3>
                      <Tabs defaultValue="curl">
                        <TabsList className="mb-2">
                          <TabsTrigger value="curl">cURL</TabsTrigger>
                          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                          <TabsTrigger value="python">Python</TabsTrigger>
                        </TabsList>
                        <TabsContent value="curl">
                          <div className="relative">
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                              {generateSampleCode(selectedEndpointDetails, "curl")}
                            </pre>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(generateSampleCode(selectedEndpointDetails, "curl"))}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TabsContent>
                        <TabsContent value="javascript">
                          <div className="relative">
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                              {generateSampleCode(selectedEndpointDetails, "javascript")}
                            </pre>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(generateSampleCode(selectedEndpointDetails, "javascript"))}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TabsContent>
                        <TabsContent value="python">
                          <div className="relative">
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                              {generateSampleCode(selectedEndpointDetails, "python")}
                            </pre>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(generateSampleCode(selectedEndpointDetails, "python"))}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {selectedEndpointDetails.responses.length > 0 && selectedEndpointDetails.responses[0].example && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">响应示例</h3>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                            {selectedEndpointDetails.responses[0].example}
                          </pre>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(selectedEndpointDetails.responses[0].example)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full p-8">
                    <div className="text-center">
                      <Server className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">选择一个API端点</h3>
                      <p className="mt-1 text-sm text-muted-foreground">从左侧列表中选择一个API端点以查看详细信息</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="authentication" className="pt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>认证概述</CardTitle>
                <CardDescription>了解如何获取和使用API访问令牌</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  我们的API使用OAuth
                  2.0客户端凭证流程进行认证。要访问API，您需要先获取访问令牌，然后在后续请求中使用该令牌。
                </p>

                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground mr-2 text-xs">
                        1
                      </span>
                      获取API密钥
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      在开发者控制台中创建API密钥。您将获得client_id和client_secret，这些是获取访问令牌所必需的。
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Key className="mr-2 h-4 w-4" />
                      创建API密钥
                    </Button>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground mr-2 text-xs">
                        2
                      </span>
                      获取访问令牌
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      使用您的client_id和client_secret向令牌端点发送POST请求，以获取访问令牌。
                    </p>
                    <div className="mt-2 bg-muted p-4 rounded-md text-sm">
                      <pre>
                        {`POST /api/v1/auth/token
Content-Type: application/json

{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "grant_type": "client_credentials"
}`}
                      </pre>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">响应示例：</p>
                    <div className="mt-1 bg-muted p-4 rounded-md text-sm">
                      <pre>
                        {`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground mr-2 text-xs">
                        3
                      </span>
                      使用访问令牌
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      在所有API请求的Authorization头中包含访问令牌。令牌有效期为1小时，过期后需要获取新令牌。
                    </p>
                    <div className="mt-2 bg-muted p-4 rounded-md text-sm">
                      <pre>
                        {`GET /api/v1/dashboards
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>安全最佳实践</CardTitle>
                <CardDescription>保护您的API密钥和访问令牌的建议</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">不要在客户端代码中嵌入API密钥</h3>
                  <p className="text-sm text-muted-foreground">
                    永远不要在前端JavaScript代码或移动应用中嵌入API密钥或client_secret。这些应该只在服务器端代码中使用。
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">使用环境变量</h3>
                  <p className="text-sm text-muted-foreground">
                    将API密钥存储在环境变量中，而不是硬编码在源代码中。这样可以防止密钥被意外提交到版本控制系统。
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">实施IP限制</h3>
                  <p className="text-sm text-muted-foreground">
                    在开发者控制台中为您的API密钥配置IP限制，只允许来自特定IP地址或范围的请求。
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">定期轮换密钥</h3>
                  <p className="text-sm text-muted-foreground">
                    定期更新您的API密钥，特别是在员工离职或怀疑密钥可能已泄露的情况下。
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">监控API使用情况</h3>
                  <p className="text-sm text-muted-foreground">
                    定期检查API使用日志，寻找可能表明未授权访问的异常模式。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>错误处理</CardTitle>
                <CardDescription>了解API认证错误及其解决方法</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left text-sm font-medium">错误代码</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">描述</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">解决方法</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-sm">
                          <Badge className="bg-yellow-500">401</Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">未授权 - 缺少或无效的访问令牌</td>
                        <td className="px-4 py-2 text-sm">检查访问令牌是否正确包含在请求头中，或获取新的访问令牌</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-sm">
                          <Badge className="bg-yellow-500">invalid_client</Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">客户端认证失败 - 无效的client_id或client_secret</td>
                        <td className="px-4 py-2 text-sm">
                          检查您的API密钥是否正确，或在开发者控制台中创建新的API密钥
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-sm">
                          <Badge className="bg-yellow-500">invalid_grant</Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">无效的授权类型</td>
                        <td className="px-4 py-2 text-sm">确保grant_type参数设置为"client_credentials"</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">
                          <Badge className="bg-red-500">403</Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">禁止访问 - 权限不足</td>
                        <td className="px-4 py-2 text-sm">
                          检查您的API密钥是否有权访问请求的资源，或联系管理员获取更多权限
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdks" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>官方SDK</CardTitle>
                  <CardDescription>我们提供多种编程语言的官方SDK</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                          <span className="text-yellow-600 font-bold">JS</span>
                        </div>
                        <div>
                          <h4 className="font-medium">JavaScript/TypeScript</h4>
                          <p className="text-xs text-muted-foreground">v2.3.0 - 2024-04-10</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileJson className="mr-2 h-4 w-4" />
                          文档
                        </Button>
                        <Button size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          安装
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-bold">Py</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Python</h4>
                          <p className="text-xs text-muted-foreground">v2.0.0 - 2024-02-28</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileJson className="mr-2 h-4 w-4" />
                          文档
                        </Button>
                        <Button size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          安装
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          <span className="text-red-600 font-bold">Ja</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Java</h4>
                          <p className="text-xs text-muted-foreground">v1.8.2 - 2024-03-15</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileJson className="mr-2 h-4 w-4" />
                          文档
                        </Button>
                        <Button size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          安装
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center mr-3">
                          <span className="text-cyan-600 font-bold">Go</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Go</h4>
                          <p className="text-xs text-muted-foreground">v1.5.0 - 2024-01-20</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileJson className="mr-2 h-4 w-4" />
                          文档
                        </Button>
                        <Button size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          安装
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-bold">PHP</span>
                        </div>
                        <div>
                          <h4 className="font-medium">PHP</h4>
                          <p className="text-xs text-muted-foreground">v1.2.1 - 2023-12-05</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileJson className="mr-2 h-4 w-4" />
                          文档
                        </Button>
                        <Button size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          安装
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>社区SDK和工具</CardTitle>
                  <CardDescription>由社区开发和维护的SDK和工具</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold">C#</span>
                        </div>
                        <div>
                          <h4 className="font-medium">C# / .NET</h4>
                          <p className="text-xs text-muted-foreground">由 @developer123 维护</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                          <span className="text-orange-600 font-bold">Ru</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Ruby</h4>
                          <p className="text-xs text-muted-foreground">由 @rubydev 维护</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-bold">R</span>
                        </div>
                        <div>
                          <h4 className="font-medium">R语言包</h4>
                          <p className="text-xs text-muted-foreground">由 @dataanalyst 维护</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <span className="text-gray-600 font-bold">CLI</span>
                        </div>
                        <div>
                          <h4 className="font-medium">命令行工具</h4>
                          <p className="text-xs text-muted-foreground">由 @devops-team 维护</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <h4 className="text-sm font-medium">贡献您自己的SDK</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      如果您为我们的API开发了SDK或工具，请联系我们以将其添加到此列表中。
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      提交您的SDK
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>示例应用</CardTitle>
                <CardDescription>探索使用我们API的示例应用</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md overflow-hidden">
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      <div className="text-4xl">📊</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">数据可视化示例</h3>
                      <p className="text-sm text-muted-foreground mt-1">使用JavaScript SDK创建交互式数据可视化仪表盘</p>
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          演示
                        </Button>
                        <Button size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          源代码
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      <div className="text-4xl">📱</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">移动应用集成</h3>
                      <p className="text-sm text-muted-foreground mt-1">在React Native移动应用中集成API的示例</p>
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          演示
                        </Button>
                        <Button size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          源代码
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      <div className="text-4xl">🤖</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">自动化报表生成</h3>
                      <p className="text-sm text-muted-foreground mt-1">使用Python SDK自动生成和发送定期报表</p>
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          演示
                        </Button>
                        <Button size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          源代码
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <FileJson className="mr-2 h-4 w-4" />
          下载OpenAPI规范
        </Button>
        <Button>
          <ExternalLink className="mr-2 h-4 w-4" />
          访问开发者门户
        </Button>
      </CardFooter>
    </Card>
  )
}
