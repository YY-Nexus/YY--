import type { Workflow, WorkflowInstance, WorkflowTask, WorkflowNode } from "./workflow-model"
import { getSupabaseApiClient } from "@/lib/api/api-client"
import { getErrorService, ErrorType, ErrorSeverity } from "@/lib/error-service"

// 工作流执行历史类型
interface WorkflowExecutionHistory {
  nodeId: string
  nodeName: string
  nodeType: string
  status: string
  startedAt: string
  completedAt?: string
  input: Record<string, any>
  output?: Record<string, any>
  error?: string
}

// 工作流引擎类
export class WorkflowEngine {
  private errorService = getErrorService()
  private supabaseApi = getSupabaseApiClient()

  // 启动工作流实例
  public async startWorkflow(
    workflowId: string,
    input: Record<string, any>,
    startedBy: string,
  ): Promise<WorkflowInstance> {
    try {
      // 获取工作流定义
      const workflow = await this.getWorkflow(workflowId)
      if (!workflow) {
        throw new Error(`工作流 ${workflowId} 不存在`)
      }

      if (workflow.status !== "active") {
        throw new Error(`工作流 ${workflowId} 不是活动状态`)
      }

      // 验证输入参数
      this.validateWorkflowInput(workflow, input)

      // 创建工作流实例
      const instance: Partial<WorkflowInstance> = {
        workflowId,
        tenantId: workflow.tenantId,
        status: "running",
        startedAt: new Date().toISOString(),
        input,
        history: [],
        createdBy: startedBy,
      }

      // 保存工作流实例
      const createdInstance = await this.supabaseApi.createRecord<WorkflowInstance>("workflow_instances", instance)

      // 查找开始节点
      const startNode = workflow.nodes.find((node) => node.type === "start")
      if (!startNode) {
        throw new Error(`工作流 ${workflowId} 没有开始节点`)
      }

      // 执行开始节点
      await this.executeNode(createdInstance.id, workflow, startNode, input)

      return createdInstance
    } catch (error) {
      this.errorService.captureError({
        type: ErrorType.WORKFLOW,
        severity: ErrorSeverity.HIGH,
        message: `启动工作流失败: ${error instanceof Error ? error.message : String(error)}`,
        context: {
          workflowId,
          input,
          startedBy,
        },
      })
      throw error
    }
  }

  // 获取工作流定义
  private async getWorkflow(workflowId: string): Promise<Workflow | null> {
    return this.supabaseApi.getRecord<Workflow>("workflows", workflowId)
  }

  // 验证工作流输入
  private validateWorkflowInput(workflow: Workflow, input: Record<string, any>): void {
    const inputVariables = workflow.variables.filter((variable) => variable.scope === "input")

    // 检查必填变量
    for (const variable of inputVariables) {
      if (variable.required && (input[variable.name] === undefined || input[variable.name] === null)) {
        throw new Error(`缺少必填输入变量: ${variable.name}`)
      }
    }

    // 检查类型
    for (const variable of inputVariables) {
      if (input[variable.name] !== undefined && input[variable.name] !== null) {
        const value = input[variable.name]
        let isValid = false

        switch (variable.type) {
          case "string":
            isValid = typeof value === "string"
            break
          case "number":
            isValid = typeof value === "number"
            break
          case "boolean":
            isValid = typeof value === "boolean"
            break
          case "date":
            isValid = value instanceof Date || !isNaN(Date.parse(value))
            break
          case "object":
            isValid = typeof value === "object" && !Array.isArray(value)
            break
          case "array":
            isValid = Array.isArray(value)
            break
        }

        if (!isValid) {
          throw new Error(`输入变量 ${variable.name} 类型不匹配，期望 ${variable.type}`)
        }
      }
    }
  }

  // 执行工作流节点
  private async executeNode(
    instanceId: string,
    workflow: Workflow,
    node: WorkflowNode,
    input: Record<string, any>,
  ): Promise<void> {
    try {
      // 更新实例状态
      await this.supabaseApi.updateRecord("workflow_instances", instanceId, {
        currentNodeId: node.id,
      })

      // 添加执行历史记录
      const historyEntry: WorkflowExecutionHistory = {
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        status: "running",
        startedAt: new Date().toISOString(),
        input,
      }

      await this.supabaseApi.executeQuery(
        `
        UPDATE workflow_instances 
        SET history = array_append(history, $1::jsonb) 
        WHERE id = $2
      `,
        [JSON.stringify(historyEntry), instanceId],
      )

      // 根据节点类型执行不同的逻辑
      let output: Record<string, any> = {}
      let nextNodes: WorkflowNode[] = []

      switch (node.type) {
        case "start":
          // 开始节点，直接找下一个节点
          nextNodes = this.findNextNodes(workflow, node.id, "success")
          break

        case "end":
          // 结束节点，完成工作流
          await this.completeWorkflowInstance(instanceId, input)
          return

        case "task":
          // 创建任务
          await this.createTask(instanceId, node, input)
          return // 任务完成后会继续工作流

        case "approval":
          // 创建审批任务
          await this.createApprovalTask(instanceId, node, input)
          return // 审批完成后会继续工作流

        case "condition":
          // 条件节点，评估条件并确定下一步
          const conditionResult = await this.evaluateCondition(node.config.condition, input)
          nextNodes = this.findNextNodes(workflow, node.id, conditionResult ? "success" : "failure")
          break

        case "parallel":
          // 并行节点，同时执行多个分支
          await this.executeParallelBranches(instanceId, workflow, node, input)
          return // 所有分支完成后会继续工作流

        case "wait":
          // 等待节点，设置定时器
          await this.scheduleWaitCompletion(instanceId, workflow, node, input)
          return // 等待完成后会继续工作流

        case "notification":
          // 发送通知
          await this.sendNotification(node.config, input)
          nextNodes = this.findNextNodes(workflow, node.id, "success")
          break

        case "script":
          // 执行脚本
          output = await this.executeScript(node.config.script, input)
          nextNodes = this.findNextNodes(workflow, node.id, "success")
          break

        case "service":
          // 调用服务
          output = await this.callService(node.config.service, node.config.operation, input)
          nextNodes = this.findNextNodes(workflow, node.id, "success")
          break

        case "form":
          // 创建表单任务
          await this.createFormTask(instanceId, node, input)
          return // 表单提交后会继续工作流

        case "subworkflow":
          // 启动子工作流
          await this.startSubworkflow(instanceId, node.config.workflowId, input)
          return // 子工作流完成后会继续工作流
      }

      // 更新执行历史
      await this.updateExecutionHistory(instanceId, node.id, {
        status: "completed",
        completedAt: new Date().toISOString(),
        output,
      })

      // 执行下一个节点
      for (const nextNode of nextNodes) {
        await this.executeNode(instanceId, workflow, nextNode, { ...input, ...output })
      }

      // 如果没有下一个节点，检查是否所有分支都已完成
      if (nextNodes.length === 0) {
        await this.checkWorkflowCompletion(instanceId, workflow)
      }
    } catch (error) {
      // 记录错误并更新执行历史
      this.errorService.captureError({
        type: ErrorType.WORKFLOW,
        severity: ErrorSeverity.MEDIUM,
        message: `执行工作流节点失败: ${error instanceof Error ? error.message : String(error)}`,
        context: {
          instanceId,
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
        },
      })

      await this.updateExecutionHistory(instanceId, node.id, {
        status: "failed",
        completedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      })

      // 更新实例状态为失败
      await this.supabaseApi.updateRecord("workflow_instances", instanceId, {
        status: "failed",
        completedAt: new Date().toISOString(),
      })
    }
  }

  // 查找下一个节点
  private findNextNodes(workflow: Workflow, currentNodeId: string, connectionType: string): WorkflowNode[] {
    const connections = workflow.connections.filter(
      (conn) => conn.sourceNodeId === currentNodeId && conn.type === connectionType,
    )

    return connections.map((conn) => workflow.nodes.find((node) => node.id === conn.targetNodeId)!).filter(Boolean)
  }

  // 更新执行历史
  private async updateExecutionHistory(
    instanceId: string,
    nodeId: string,
    update: Partial<WorkflowExecutionHistory>,
  ): Promise<void> {
    await this.supabaseApi.executeQuery(
      `
      UPDATE workflow_instances 
      SET history = (
        SELECT jsonb_agg(
          CASE 
            WHEN item->>'nodeId' = $2 
            THEN item || $3::jsonb 
            ELSE item 
          END
        )
        FROM jsonb_array_elements(history) AS item
      )
      WHERE id = $1
    `,
      [instanceId, nodeId, JSON.stringify(update)],
    )
  }

  // 完成工作流实例
  private async completeWorkflowInstance(instanceId: string, output: Record<string, any>): Promise<void> {
    await this.supabaseApi.updateRecord("workflow_instances", instanceId, {
      status: "completed",
      completedAt: new Date().toISOString(),
      output,
    })
  }

  // 创建任务
  private async createTask(instanceId: string, node: WorkflowNode, input: Record<string, any>): Promise<void> {
    const task: Partial<WorkflowTask> = {
      instanceId,
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      status: "pending",
      assignee: node.config.assignee,
      dueDate: node.config.dueDate,
      priority: node.config.priority || "medium",
      input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await this.supabaseApi.createRecord("workflow_tasks", task)
  }

  // 创建审批任务
  private async createApprovalTask(instanceId: string, node: WorkflowNode, input: Record<string, any>): Promise<void> {
    const task: Partial<WorkflowTask> = {
      instanceId,
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      status: "pending",
      assignee: node.config.approver,
      dueDate: node.config.dueDate,
      priority: node.config.priority || "medium",
      input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await this.supabaseApi.createRecord("workflow_tasks", task)
  }

  // 评估条件
  private async evaluateCondition(condition: string, context: Record<string, any>): Promise<boolean> {
    try {
      // 创建一个安全的函数执行环境
      const safeEval = new Function(
        ...Object.keys(context),
        `
        "use strict";
        try {
          return ${condition};
        } catch (e) {
          return false;
        }
      `,
      )

      return !!safeEval(...Object.values(context))
    } catch (error) {
      console.error("条件评估失败:", error)
      return false
    }
  }

  // 执行并行分支
  private async executeParallelBranches(
    instanceId: string,
    workflow: Workflow,
    node: WorkflowNode,
    input: Record<string, any>,
  ): Promise<void> {
    const nextNodes = this.findNextNodes(workflow, node.id, "success")

    // 记录并行分支信息
    await this.supabaseApi.executeQuery(
      `
      UPDATE workflow_instances 
      SET parallel_branches = $2::jsonb 
      WHERE id = $1
    `,
      [
        instanceId,
        JSON.stringify({
          parentNodeId: node.id,
          totalBranches: nextNodes.length,
          completedBranches: 0,
          branchStatus: nextNodes.map((n) => ({ nodeId: n.id, status: "pending" })),
        }),
      ],
    )

    // 并行执行所有分支
    for (const nextNode of nextNodes) {
      // 使用setTimeout确保分支在单独的事件循环中执行
      setTimeout(() => {
        this.executeNode(instanceId, workflow, nextNode, input).catch((error) => {
          console.error(`执行并行分支失败 (${nextNode.id}):`, error)
        })
      }, 0)
    }
  }

  // 安排等待节点完成
  private async scheduleWaitCompletion(
    instanceId: string,
    workflow: Workflow,
    node: WorkflowNode,
    input: Record<string, any>,
  ): Promise<void> {
    let waitTime = 0

    if (node.config.waitType === "duration") {
      // 等待指定时长
      waitTime = node.config.duration * 1000 // 转换为毫秒
    } else if (node.config.waitType === "until") {
      // 等待到指定时间
      const targetTime = new Date(node.config.dateTime).getTime()
      const now = Date.now()
      waitTime = Math.max(0, targetTime - now)
    }

    // 记录等待信息
    await this.supabaseApi.executeQuery(
      `
      UPDATE workflow_instances 
      SET wait_info = $2::jsonb 
      WHERE id = $1
    `,
      [
        instanceId,
        JSON.stringify({
          nodeId: node.id,
          waitUntil: new Date(Date.now() + waitTime).toISOString(),
        }),
      ],
    )

    // 在实际系统中，应该使用定时任务系统而不是setTimeout
    // 这里仅作为示例
    setTimeout(async () => {
      try {
        // 获取实例状态，确保它仍在运行
        const instance = await this.supabaseApi.getRecord<WorkflowInstance>("workflow_instances", instanceId)
        if (instance && instance.status === "running" && instance.currentNodeId === node.id) {
          // 更新执行历史
          await this.updateExecutionHistory(instanceId, node.id, {
            status: "completed",
            completedAt: new Date().toISOString(),
          })

          // 清除等待信息
          await this.supabaseApi.executeQuery(
            `
            UPDATE workflow_instances 
            SET wait_info = NULL 
            WHERE id = $1
          `,
            [instanceId],
          )

          // 执行下一个节点
          const nextNodes = this.findNextNodes(workflow, node.id, "success")
          for (const nextNode of nextNodes) {
            await this.executeNode(instanceId, workflow, nextNode, input)
          }
        }
      } catch (error) {
        console.error("等待节点完成处理失败:", error)
      }
    }, waitTime)
  }

  // 发送通知
  private async sendNotification(config: any, context: Record<string, any>): Promise<void> {
    // 在实际系统中，这里应该调用通知服务
    console.log("发送通知:", {
      type: config.type,
      recipients: config.recipients,
      subject: this.replaceTemplateVariables(config.subject, context),
      content: this.replaceTemplateVariables(config.content, context),
    })
  }

  // 替换模板变量
  private replaceTemplateVariables(template: string, context: Record<string, any>): string {
    return template.replace(/\${([^}]+)}/g, (match, key) => {
      const value = key
        .split(".")
        .reduce((obj, prop) => (obj && obj[prop] !== undefined ? obj[prop] : undefined), context)
      return value !== undefined ? String(value) : match
    })
  }

  // 执行脚本
  private async executeScript(script: string, context: Record<string, any>): Promise<Record<string, any>> {
    try {
      // 创建一个安全的函数执行环境
      const safeEval = new Function(
        ...Object.keys(context),
        "return",
        `
        "use strict";
        let result = {};
        try {
          ${script}
        } catch (e) {
          console.error("脚本执行错误:", e);
        }
        return result;
      `,
      )

      return safeEval(...Object.values(context), {}) || {}
    } catch (error) {
      console.error("脚本执行失败:", error)
      return {}
    }
  }

  // 调用服务
  private async callService(
    service: string,
    operation: string,
    params: Record<string, any>,
  ): Promise<Record<string, any>> {
    // 在实际系统中，这里应该调用相应的服务
    // 这里仅作为示例
    console.log("调用服务:", { service, operation, params })
    return { success: true, timestamp: new Date().toISOString() }
  }

  // 创建表单任务
  private async createFormTask(instanceId: string, node: WorkflowNode, input: Record<string, any>): Promise<void> {
    const task: Partial<WorkflowTask> = {
      instanceId,
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      status: "pending",
      assignee: node.config.assignee,
      dueDate: node.config.dueDate,
      priority: node.config.priority || "medium",
      input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await this.supabaseApi.createRecord("workflow_tasks", task)
  }

  // 启动子工作流
  private async startSubworkflow(
    parentInstanceId: string,
    subworkflowId: string,
    input: Record<string, any>,
  ): Promise<void> {
    try {
      // 获取父实例信息
      const parentInstance = await this.supabaseApi.getRecord<WorkflowInstance>("workflow_instances", parentInstanceId)
      if (!parentInstance) {
        throw new Error(`父工作流实例 ${parentInstanceId} 不存在`)
      }

      // 启动子工作流
      const subInstance = await this.startWorkflow(subworkflowId, input, parentInstance.createdBy)

      // 记录子工作流信息
      await this.supabaseApi.executeQuery(
        `
        UPDATE workflow_instances 
        SET subworkflow_info = $2::jsonb 
        WHERE id = $1
      `,
        [
          parentInstanceId,
          JSON.stringify({
            subworkflowId,
            subInstanceId: subInstance.id,
            status: "running",
          }),
        ],
      )
    } catch (error) {
      throw new Error(`启动子工作流失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // 检查工作流是否完成
  private async checkWorkflowCompletion(instanceId: string, workflow: Workflow): Promise<void> {
    // 获取实例信息
    const instance = await this.supabaseApi.getRecord<WorkflowInstance>("workflow_instances", instanceId)
    if (!instance || instance.status !== "running") {
      return
    }

    // 检查是否有未完成的并行分支
    const parallelBranches = instance.history.filter((h) => h.nodeType === "parallel" && h.status === "running").length

    if (parallelBranches > 0) {
      return
    }

    // 检查是否有未完成的任务
    const pendingTasks = await this.supabaseApi.getTable<WorkflowTask>("workflow_tasks", {
      filter: { instanceId, status: "pending" },
    })

    if (pendingTasks.length > 0) {
      return
    }

    // 检查是否有未完成的子工作流
    if (instance.subworkflow_info && instance.subworkflow_info.status === "running") {
      return
    }

    // 如果没有未完成的任务，完成工作流
    await this.completeWorkflowInstance(instanceId, instance.output || {})
  }

  // 完成任务
  public async completeTask(
    taskId: string,
    output: Record<string, any>,
    status: "completed" | "failed" = "completed",
  ): Promise<void> {
    try {
      // 获取任务信息
      const task = await this.supabaseApi.getRecord<WorkflowTask>("workflow_tasks", taskId)
      if (!task) {
        throw new Error(`任务 ${taskId} 不存在`)
      }

      if (task.status !== "pending" && task.status !== "running") {
        throw new Error(`任务 ${taskId} 不是待处理或运行状态`)
      }

      // 更新任务状态
      await this.supabaseApi.updateRecord("workflow_tasks", taskId, {
        status,
        output,
        updatedAt: new Date().toISOString(),
      })

      // 获取工作流实例
      const instance = await this.supabaseApi.getRecord<WorkflowInstance>("workflow_instances", task.instanceId)
      if (!instance || instance.status !== "running") {
        return
      }

      // 获取工作流定义
      const workflow = await this.getWorkflow(instance.workflowId)
      if (!workflow) {
        throw new Error(`工作流 ${instance.workflowId} 不存在`)
      }

      // 更新执行历史
      await this.updateExecutionHistory(task.instanceId, task.nodeId, {
        status: status === "completed" ? "completed" : "failed",
        completedAt: new Date().toISOString(),
        output,
      })

      // 如果任务成功完成，继续执行下一个节点
      if (status === "completed") {
        const node = workflow.nodes.find((n) => n.id === task.nodeId)
        if (node) {
          const nextNodes = this.findNextNodes(workflow, node.id, "success")
          for (const nextNode of nextNodes) {
            await this.executeNode(task.instanceId, workflow, nextNode, { ...task.input, ...output })
          }
        }
      } else {
        // 如果任务失败，更新实例状态
        await this.supabaseApi.updateRecord("workflow_instances", task.instanceId, {
          status: "failed",
          completedAt: new Date().toISOString(),
        })
      }
    } catch (error) {
      this.errorService.captureError({
        type: ErrorType.WORKFLOW,
        severity: ErrorSeverity.MEDIUM,
        message: `完成任务失败: ${error instanceof Error ? error.message : String(error)}`,
        context: {
          taskId,
          output,
          status,
        },
      })
      throw error
    }
  }
}

// 创建工作流引擎实例
let workflowEngineInstance: WorkflowEngine | null = null

export function getWorkflowEngine(): WorkflowEngine {
  if (!workflowEngineInstance) {
    workflowEngineInstance = new WorkflowEngine()
  }
  return workflowEngineInstance
}
