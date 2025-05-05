import { createServerSupabaseClient } from "./supabase"

// HR系统集成服务
export class HRIntegrationService {
  // 获取审批流程配置
  static async getApprovalWorkflows() {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("approval_workflows")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("获取审批流程配置失败:", error)
      return []
    }

    return data || []
  }

  // 获取特定类型的审批流程
  static async getApprovalWorkflowByType(type: string) {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("approval_workflows").select("*").eq("workflow_type", type).single()

    if (error) {
      console.error(`获取${type}审批流程失败:`, error)
      return null
    }

    return data
  }

  // 创建审批请求
  static async createApprovalRequest(requestData: {
    workflow_id: string
    request_type: string
    requester_id: string
    subject_id?: string
    details: any
    priority?: "low" | "medium" | "high"
  }) {
    const supabase = createServerSupabaseClient()

    // 获取审批流程
    const { data: workflow, error: workflowError } = await supabase
      .from("approval_workflows")
      .select("*")
      .eq("id", requestData.workflow_id)
      .single()

    if (workflowError || !workflow) {
      console.error("获取审批流程失败:", workflowError)
      return { success: false, error: "审批流程不存在" }
    }

    // 获取第一个审批步骤
    const firstStep = workflow.steps[0]

    if (!firstStep) {
      return { success: false, error: "审批流程步骤配置错误" }
    }

    // 创建审批请求
    const { data: request, error: requestError } = await supabase
      .from("approval_requests")
      .insert([
        {
          workflow_id: requestData.workflow_id,
          request_type: requestData.request_type,
          requester_id: requestData.requester_id,
          subject_id: requestData.subject_id || null,
          details: requestData.details,
          status: "pending",
          current_step: 0,
          priority: requestData.priority || "medium",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (requestError || !request) {
      console.error("创建审批请求失败:", requestError)
      return { success: false, error: requestError?.message || "创建审批请求失败" }
    }

    // 创建审批任务
    const { error: taskError } = await supabase.from("approval_tasks").insert([
      {
        request_id: request[0].id,
        step_index: 0,
        step_name: firstStep.name,
        assignee_id:
          firstStep.assignee_type === "role"
            ? null // 需要根据角色查找实际审批人
            : firstStep.assignee_id,
        assignee_role: firstStep.assignee_type === "role" ? firstStep.assignee_id : null,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])

    if (taskError) {
      console.error("创建审批任务失败:", taskError)
      // 回滚审批请求
      await supabase.from("approval_requests").delete().eq("id", request[0].id)

      return { success: false, error: taskError.message || "创建审批任务失败" }
    }

    // 发送通知给审批人
    await this.sendApprovalNotification(request[0].id, firstStep)

    return {
      success: true,
      data: request[0],
      message: "审批请求已创建，等待审批。",
    }
  }

  // 审批请求
  static async approveRequest(taskId: string, approverId: string, comments?: string) {
    const supabase = createServerSupabaseClient()

    // 获取审批任务
    const { data: task, error: taskError } = await supabase.from("approval_tasks").select("*").eq("id", taskId).single()

    if (taskError || !task) {
      console.error("获取审批任务失败:", taskError)
      return { success: false, error: "审批任务不存在" }
    }

    // 获取审批请求
    const { data: request, error: requestError } = await supabase
      .from("approval_requests")
      .select("*")
      .eq("id", task.request_id)
      .single()

    if (requestError || !request) {
      console.error("获取审批请求失败:", requestError)
      return { success: false, error: "审批请求不存在" }
    }

    // 获取审批流程
    const { data: workflow, error: workflowError } = await supabase
      .from("approval_workflows")
      .select("*")
      .eq("id", request.workflow_id)
      .single()

    if (workflowError || !workflow) {
      console.error("获取审批流程失败:", workflowError)
      return { success: false, error: "审批流程不存在" }
    }

    // 更新当前任务状态
    const { error: updateTaskError } = await supabase
      .from("approval_tasks")
      .update({
        status: "approved",
        approver_id: approverId,
        comments: comments || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)

    if (updateTaskError) {
      console.error("更新审批任务失败:", updateTaskError)
      return { success: false, error: updateTaskError.message || "更新审批任务失败" }
    }

    // 检查是否有下一步
    const nextStepIndex = task.step_index + 1
    const nextStep = workflow.steps[nextStepIndex]

    if (nextStep) {
      // 创建下一步审批任务
      const { error: nextTaskError } = await supabase.from("approval_tasks").insert([
        {
          request_id: request.id,
          step_index: nextStepIndex,
          step_name: nextStep.name,
          assignee_id:
            nextStep.assignee_type === "role"
              ? null // 需要根据角色查找实际审批人
              : nextStep.assignee_id,
          assignee_role: nextStep.assignee_type === "role" ? nextStep.assignee_id : null,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (nextTaskError) {
        console.error("创建下一步审批任务失败:", nextTaskError)
        return { success: false, error: nextTaskError.message || "创建下一步审批任务失败" }
      }

      // 更新请求状态
      const { error: updateRequestError } = await supabase
        .from("approval_requests")
        .update({
          current_step: nextStepIndex,
          updated_at: new Date().toISOString(),
        })
        .eq("id", request.id)

      if (updateRequestError) {
        console.error("更新审批请求失败:", updateRequestError)
        return { success: false, error: updateRequestError.message || "更新审批请求失败" }
      }

      // 发送通知给下一步审批人
      await this.sendApprovalNotification(request.id, nextStep)

      return {
        success: true,
        message: "当前步骤已审批通过，等待下一步审批。",
      }
    } else {
      // 最后一步已审批，完成整个流程
      const { error: completeRequestError } = await supabase
        .from("approval_requests")
        .update({
          status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", request.id)

      if (completeRequestError) {
        console.error("完成审批请求失败:", completeRequestError)
        return { success: false, error: completeRequestError.message || "完成审批请求失败" }
      }

      // 执行审批后的操作
      await this.executePostApprovalActions(request)

      // 发送通知给申请人
      await this.sendRequestCompletionNotification(request.id, "approved")

      return {
        success: true,
        message: "审批流程已完成，请求已通过。",
      }
    }
  }

  // 拒绝请求
  static async rejectRequest(taskId: string, rejecterId: string, reason: string) {
    const supabase = createServerSupabaseClient()

    // 获取审批任务
    const { data: task, error: taskError } = await supabase.from("approval_tasks").select("*").eq("id", taskId).single()

    if (taskError || !task) {
      console.error("获取审批任务失败:", taskError)
      return { success: false, error: "审批任务不存在" }
    }

    // 更新任务状态
    const { error: updateTaskError } = await supabase
      .from("approval_tasks")
      .update({
        status: "rejected",
        approver_id: rejecterId,
        comments: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)

    if (updateTaskError) {
      console.error("更新审批任务失败:", updateTaskError)
      return { success: false, error: updateTaskError.message || "更新审批任务失败" }
    }

    // 更新请求状态
    const { error: updateRequestError } = await supabase
      .from("approval_requests")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", task.request_id)

    if (updateRequestError) {
      console.error("更新审批请求失败:", updateRequestError)
      return { success: false, error: updateRequestError.message || "更新审批请求失败" }
    }

    // 发送通知给申请人
    await this.sendRequestCompletionNotification(task.request_id, "rejected")

    return {
      success: true,
      message: "请求已拒绝。",
    }
  }

  // 发送审批通知
  private static async sendApprovalNotification(requestId: string, step: any) {
    const supabase = createServerSupabaseClient()

    // 获取请求详情
    const { data: request, error: requestError } = await supabase
      .from("approval_requests")
      .select(`
        *,
        requester:requester_id(id, first_name, last_name)
      `)
      .eq("id", requestId)
      .single()

    if (requestError || !request) {
      console.error("获取审批请求失败:", requestError)
      return
    }

    // 确定通知接收者
    let recipientIds: string[] = []

    if (step.assignee_type === "user") {
      recipientIds = [step.assignee_id]
    } else if (step.assignee_type === "role") {
      // 获取具有特定角色的用户
      const { data: users, error: usersError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role_id", step.assignee_id)

      if (!usersError && users) {
        recipientIds = users.map((ur) => ur.user_id)
      }
    }

    // 创建通知
    for (const recipientId of recipientIds) {
      await supabase.from("notifications").insert([
        {
          user_id: recipientId,
          type: "approval_request",
          title: `新的审批请求: ${request.request_type}`,
          content: `${request.requester.first_name} ${request.requester.last_name}提交了一个${request.request_type}审批请求，等待您的审批。`,
          data: {
            request_id: requestId,
            request_type: request.request_type,
            step_name: step.name,
          },
          read: false,
          created_at: new Date().toISOString(),
        },
      ])
    }
  }

  // 发送请求完成通知
  private static async sendRequestCompletionNotification(requestId: string, status: "approved" | "rejected") {
    const supabase = createServerSupabaseClient()

    // 获取请求详情
    const { data: request, error: requestError } = await supabase
      .from("approval_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (requestError || !request) {
      console.error("获取审批请求失败:", requestError)
      return
    }

    // 创建通知
    await supabase.from("notifications").insert([
      {
        user_id: request.requester_id,
        type: "approval_result",
        title: `审批结果: ${request.request_type}`,
        content:
          status === "approved"
            ? `您的${request.request_type}审批请求已通过。`
            : `您的${request.request_type}审批请求已被拒绝。`,
        data: {
          request_id: requestId,
          request_type: request.request_type,
          status,
        },
        read: false,
        created_at: new Date().toISOString(),
      },
    ])
  }

  // 执行审批后的操作
  private static async executePostApprovalActions(request: any) {
    const supabase = createServerSupabaseClient()

    try {
      switch (request.request_type) {
        case "salary_adjustment":
          // 更新员工薪资
          if (request.details.employee_id && request.details.new_salary) {
            await supabase
              .from("employees")
              .update({
                salary: request.details.new_salary,
                updated_at: new Date().toISOString(),
              })
              .eq("id", request.details.employee_id)

            // 记录薪资调整历史
            await supabase
              .from("salary_adjustments")
              .update({
                status: "approved",
                approval_date: new Date().toISOString(),
              })
              .eq("id", request.details.adjustment_id)
          }
          break

        case "retention_plan":
          // 更新保留计划状态
          if (request.details.plan_id) {
            await supabase
              .from("retention_plans")
              .update({
                status: "active",
                updated_at: new Date().toISOString(),
              })
              .eq("id", request.details.plan_id)
          }
          break

        // 其他类型的请求处理...

        default:
          console.log(`没有为${request.request_type}类型的请求定义后续操作`)
      }
    } catch (error) {
      console.error("执行审批后操作失败:", error)
    }
  }
}
