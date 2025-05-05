"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type EdgeTypes,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Workflow, WorkflowNodeType } from "@/lib/workflow/workflow-model"
import { StartNode } from "./nodes/start-node"
import { EndNode } from "./nodes/end-node"
import { TaskNode } from "./nodes/task-node"
import { ApprovalNode } from "./nodes/approval-node"
import { ConditionNode } from "./nodes/condition-node"
import { ParallelNode } from "./nodes/parallel-node"
import { WaitNode } from "./nodes/wait-node"
import { NotificationNode } from "./nodes/notification-node"
import { ScriptNode } from "./nodes/script-node"
import { ServiceNode } from "./nodes/service-node"
import { FormNode } from "./nodes/form-node"
import { SubworkflowNode } from "./nodes/subworkflow-node"
import { CustomEdge } from "./edges/custom-edge"
import { ConditionalEdge } from "./edges/conditional-edge"
import { Plus, Save, Play, Settings, ChevronDown, Trash2 } from "lucide-react"

// 定义 WorkflowConnectionType 类型
type WorkflowConnectionType = "success" | "failure" | "condition" | "default"

// 节点类型映射
const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  approval: ApprovalNode,
  condition: ConditionNode,
  parallel: ParallelNode,
  wait: WaitNode,
  notification: NotificationNode,
  script: ScriptNode,
  service: ServiceNode,
  form: FormNode,
  subworkflow: SubworkflowNode,
}

// 边类型映射
const edgeTypes: EdgeTypes = {
  default: CustomEdge,
  condition: ConditionalEdge,
}

// 工作流设计器属性
interface WorkflowDesignerProps {
  initialWorkflow?: Workflow
  onSave?: (workflow: Workflow) => void
  readOnly?: boolean
}

// 工作流设计器组件
export function WorkflowDesigner({ initialWorkflow, onSave, readOnly = false }: WorkflowDesignerProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false)
  const [isEdgeDialogOpen, setIsEdgeDialogOpen] = useState(false)
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")

  // 初始化工作流
  useEffect(() => {
    if (initialWorkflow) {
      setWorkflowName(initialWorkflow.name)
      setWorkflowDescription(initialWorkflow.description || "")

      // 转换节点
      const flowNodes = initialWorkflow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.name,
          description: node.description,
          config: node.config,
        },
      }))

      // 转换连接
      const flowEdges = initialWorkflow.connections.map((conn) => ({
        id: conn.id,
        source: conn.sourceNodeId,
        target: conn.targetNodeId,
        type: conn.type === "condition" ? "condition" : "default",
        label: conn.condition,
        data: {
          type: conn.type,
          condition: conn.condition,
        },
      }))

      setNodes(flowNodes)
      setEdges(flowEdges)
    } else {
      // 创建默认的开始和结束节点
      const startNode = {
        id: "start",
        type: "start",
        position: { x: 250, y: 50 },
        data: { label: "开始" },
      }

      const endNode = {
        id: "end",
        type: "end",
        position: { x: 250, y: 350 },
        data: { label: "结束" },
      }

      setNodes([startNode, endNode])
    }
  }, [initialWorkflow, setNodes, setEdges])

  // 处理连接
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: "default" }, eds))
    },
    [setEdges],
  )

  // 处理节点点击
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node)
      setSelectedEdge(null)
      setIsNodeDialogOpen(true)
    },
    [setSelectedNode],
  )

  // 处理边点击
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge)
      setSelectedNode(null)
      setIsEdgeDialogOpen(true)
    },
    [setSelectedEdge],
  )

  // 添加新节点
  const addNode = (type: WorkflowNodeType) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      position: { x: 250, y: 200 },
      data: { label: `新${getNodeTypeName(type)}` },
    }

    setNodes((nds) => [...nds, newNode])
  }

  // 获取节点类型名称
  const getNodeTypeName = (type: WorkflowNodeType): string => {
    const typeNames: Record<WorkflowNodeType, string> = {
      start: "开始",
      end: "结束",
      task: "任务",
      approval: "审批",
      condition: "条件",
      parallel: "并行",
      wait: "等待",
      notification: "通知",
      script: "脚本",
      service: "服务",
      form: "表单",
      subworkflow: "子工作流",
    }
    return typeNames[type] || type
  }

  // 更新节点
  const updateNode = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          }
        }
        return node
      }),
    )
    setIsNodeDialogOpen(false)
  }

  // 更新边
  const updateEdge = (edgeId: string, data: any) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            label: data.condition,
            data: {
              ...edge.data,
              ...data,
            },
          }
        }
        return edge
      }),
    )
    setIsEdgeDialogOpen(false)
  }

  // 删除节点
  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
    setIsNodeDialogOpen(false)
  }

  // 删除边
  const deleteEdge = (edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
    setIsEdgeDialogOpen(false)
  }

  // 保存工作流
  const saveWorkflow = () => {
    if (!workflowName) {
      alert("请输入工作流名称")
      return
    }

    // 转换为工作流模型
    const workflow: Partial<Workflow> = {
      name: workflowName,
      description: workflowDescription,
      version: initialWorkflow?.version || 1,
      status: initialWorkflow?.status || "draft",
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type as WorkflowNodeType,
        name: node.data.label,
        description: node.data.description,
        config: node.data.config || {},
        position: node.position,
      })),
      connections: edges.map((edge) => ({
        id: edge.id,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        type: (edge.data?.type || "success") as WorkflowConnectionType,
        condition: edge.data?.condition,
      })),
      variables: initialWorkflow?.variables || [],
      trigger: initialWorkflow?.trigger || {
        type: "manual",
        config: {},
      },
    }

    if (onSave) {
      onSave(workflow as Workflow)
    }
  }

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <div>
              <Label htmlFor="workflow-name">工作流名称</Label>
              <Input
                id="workflow-name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="输入工作流名称"
                className="w-64"
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="workflow-description">描述</Label>
              <Input
                id="workflow-description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="输入工作流描述"
                className="w-96"
                disabled={readOnly}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {!readOnly && (
              <Button onClick={saveWorkflow}>
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
            )}
            <Button variant="outline">
              <Play className="mr-2 h-4 w-4" />
              运行
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              设置
            </Button>
          </div>
        </div>

        <div className="flex-1 h-[600px]" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-right"
            minZoom={0.2}
            maxZoom={4}
            defaultEdgeOptions={{ type: "default" }}
            proOptions={{ hideAttribution: true }}
            readOnly={readOnly}
          >
            <Background />
            <Controls />
            <MiniMap />
            {!readOnly && (
              <Panel position="top-left" className="bg-background border rounded-md shadow-sm">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Plus className="h-4 w-4" />
                      添加节点
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>选择节点类型</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => addNode("task")}>任务节点</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNode("approval")}>审批节点</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNode("condition")}>条件节点</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNode("parallel")}>并行节点</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNode("wait")}>等待节点</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNode("notification")}>通知节点</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNode("script")}>脚本节点</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNode("service")}>服务节点</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNode("form")}>表单节点</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNode("subworkflow")}>子工作流节点</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* 节点编辑对话框 */}
        <Dialog open={isNodeDialogOpen} onOpenChange={setIsNodeDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                编辑{selectedNode?.type && getNodeTypeName(selectedNode.type as WorkflowNodeType)}节点
              </DialogTitle>
              <DialogDescription>配置节点属性和行为</DialogDescription>
            </DialogHeader>
            {selectedNode && (
              <Tabs defaultValue="basic">
                <TabsList>
                  <TabsTrigger value="basic">基本信息</TabsTrigger>
                  <TabsTrigger value="config">配置</TabsTrigger>
                  <TabsTrigger value="advanced">高级</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="node-name" className="text-right">
                        名称
                      </Label>
                      <Input
                        id="node-name"
                        value={selectedNode.data.label || ""}
                        onChange={(e) => {
                          setSelectedNode({
                            ...selectedNode,
                            data: { ...selectedNode.data, label: e.target.value },
                          })
                        }}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="node-description" className="text-right">
                        描述
                      </Label>
                      <Input
                        id="node-description"
                        value={selectedNode.data.description || ""}
                        onChange={(e) => {
                          setSelectedNode({
                            ...selectedNode,
                            data: { ...selectedNode.data, description: e.target.value },
                          })
                        }}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="config" className="space-y-4">
                  {/* 根据节点类型显示不同的配置选项 */}
                  {selectedNode.type === "task" && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="task-assignee" className="text-right">
                          执行人
                        </Label>
                        <Input
                          id="task-assignee"
                          value={selectedNode.data.config?.assignee || ""}
                          onChange={(e) => {
                            setSelectedNode({
                              ...selectedNode,
                              data: {
                                ...selectedNode.data,
                                config: { ...selectedNode.data.config, assignee: e.target.value },
                              },
                            })
                          }}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="task-priority" className="text-right">
                          优先级
                        </Label>
                        <select
                          id="task-priority"
                          value={selectedNode.data.config?.priority || "medium"}
                          onChange={(e) => {
                            setSelectedNode({
                              ...selectedNode,
                              data: {
                                ...selectedNode.data,
                                config: { ...selectedNode.data.config, priority: e.target.value },
                              },
                            })
                          }}
                          className="col-span-3 p-2 border rounded"
                        >
                          <option value="low">低</option>
                          <option value="medium">中</option>
                          <option value="high">高</option>
                        </select>
                      </div>
                    </div>
                  )}
                  {/* 其他节点类型的配置... */}
                </TabsContent>
                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="node-id" className="text-right">
                        节点ID
                      </Label>
                      <Input id="node-id" value={selectedNode.id} disabled className="col-span-3" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            <DialogFooter className="flex justify-between">
              <Button variant="destructive" onClick={() => deleteNode(selectedNode?.id || "")}>
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsNodeDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => updateNode(selectedNode?.id || "", selectedNode?.data)}>确定</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 边编辑对话框 */}
        <Dialog open={isEdgeDialogOpen} onOpenChange={setIsEdgeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑连接</DialogTitle>
              <DialogDescription>配置节点之间的连接</DialogDescription>
            </DialogHeader>
            {selectedEdge && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edge-type" className="text-right">
                    连接类型
                  </Label>
                  <select
                    id="edge-type"
                    value={selectedEdge.data?.type || "success"}
                    onChange={(e) => {
                      setSelectedEdge({
                        ...selectedEdge,
                        data: { ...selectedEdge.data, type: e.target.value },
                      })
                    }}
                    className="col-span-3 p-2 border rounded"
                  >
                    <option value="success">成功</option>
                    <option value="failure">失败</option>
                    <option value="condition">条件</option>
                    <option value="default">默认</option>
                  </select>
                </div>
                {selectedEdge.data?.type === "condition" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edge-condition" className="text-right">
                      条件表达式
                    </Label>
                    <Input
                      id="edge-condition"
                      value={selectedEdge.data?.condition || ""}
                      onChange={(e) => {
                        setSelectedEdge({
                          ...selectedEdge,
                          data: { ...selectedEdge.data, condition: e.target.value },
                        })
                      }}
                      placeholder="例如: amount > 1000"
                      className="col-span-3"
                    />
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="flex justify-between">
              <Button variant="destructive" onClick={() => deleteEdge(selectedEdge?.id || "")}>
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEdgeDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => updateEdge(selectedEdge?.id || "", selectedEdge?.data)}>确定</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ReactFlowProvider>
  )
}
