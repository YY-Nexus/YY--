// 工作流模型定义

// 工作流状态
export type WorkflowStatus = "draft" | "active" | "inactive" | "archived"

// 工作流触发类型
export type WorkflowTriggerType = "manual" | "event" | "schedule" | "condition"

// 工作流节点类型
export type WorkflowNodeType =
  | "start"
  | "end"
  | "task"
  | "approval"
  | "condition"
  | "parallel"
  | "wait"
  | "notification"
  | "script"
  | "service"
  | "form"
  | "subworkflow"

// 工作流连接类型
export type WorkflowConnectionType = "success" | "failure" | "condition" | "default"

// 工作流接口
export interface Workflow {
  id: string
  tenantId: string
  name: string
  description?: string
  version: number
  status: WorkflowStatus
  trigger: WorkflowTrigger
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  variables: WorkflowVariable[]
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  category?: string
  tags?: string[]
}

// 工作流触发器接口
export interface WorkflowTrigger {
  type: WorkflowTriggerType
  config: any
}

// 工作流节点接口
export interface WorkflowNode {
  id: string
  type: WorkflowNodeType
  name: string
  description?: string
  config: any
  position: {
    x: number
    y: number
  }
}

// 工作流连接接口
export interface WorkflowConnection {
  id: string
  sourceNodeId: string
  targetNodeId: string
  type: WorkflowConnectionType
  condition?: string
}

// 工作流变量接口
export interface WorkflowVariable {
  id: string
  name: string
  description?: string
  type: "string" | "number" | "boolean" | "date" | "object" | "array"
  defaultValue?: any
  required: boolean
  scope: "input" | "output" | "local"
}

// 工作流实例接口
export interface WorkflowInstance {
  id: string
  workflowId: string
  tenantId: string
  status: "running" | "completed" | "failed" | "cancelled" | "suspended"
  startedAt: string
  completedAt?: string
  input: Record<string, any>
  output?: Record<string, any>
  currentNodeId?: string
  history: WorkflowExecutionHistory[]
  createdBy: string
}

// 工作流执行历史接口
export interface WorkflowExecutionHistory {
  nodeId: string
  nodeName: string
  nodeType: WorkflowNodeType
  status: "pending" | "running" | "completed" | "failed" | "skipped"
  startedAt: string
  completedAt?: string
  input?: Record<string, any>
  output?: Record<string, any>
  error?: string
  assignee?: string
  comments?: string
}

// 工作流任务接口
export interface WorkflowTask {
  id: string
  instanceId: string
  nodeId: string
  nodeName: string
  nodeType: WorkflowNodeType
  status: "pending" | "running" | "completed" | "failed"
  assignee?: string
  dueDate?: string
  priority: "low" | "medium" | "high"
  input?: Record<string, any>
  output?: Record<string, any>
  createdAt: string
  updatedAt: string
}
