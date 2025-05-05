"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, CalendarClock, ClipboardList, DollarSign, MessageSquare, UserCog } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { HRIntegrationService } from "@/lib/hr-integration-service"

interface ActionSidebarProps {
  employeeId: string
  retentionPlans?: any[]
  meetings?: any[]
  salaryAdjustments?: any[]
}

export function ActionSidebar({
  employeeId,
  retentionPlans = [],
  meetings = [],
  salaryAdjustments = [],
}: ActionSidebarProps) {
  const [isRetentionPlanOpen, setIsRetentionPlanOpen] = useState(false)
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false)
  const [isSalaryAdjustmentOpen, setIsSalaryAdjustmentOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"actions" | "history">("actions")

  // 表单状态
  const [retentionPlanForm, setRetentionPlanForm] = useState({
    planName: "",
    planType: "career",
    description: "",
    owner: "",
    deadline: "",
  })

  const [meetingForm, setMeetingForm] = useState({
    meetingType: "retention",
    date: "",
    time: "",
    duration: "60",
    location: "",
    agenda: "",
  })

  const [salaryForm, setSalaryForm] = useState({
    currentSalary: "",
    newSalary: "",
    adjustmentType: "merit",
    effectiveDate: "",
    reason: "",
  })

  // 处理保留计划提交
  const handleRetentionPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 获取薪资调整审批流程
      const workflow = await HRIntegrationService.getApprovalWorkflowByType("retention_plan")

      if (!workflow) {
        toast({
          title: "审批流程不存在",
          description: "无法找到保留计划审批流程，请联系管理员。",
          variant: "destructive",
        })
        return
      }

      // 创建保留计划
      const planData = {
        employee_id: employeeId,
        plan_name: retentionPlanForm.planName,
        plan_type: retentionPlanForm.planType,
        description: retentionPlanForm.description,
        owner_id: retentionPlanForm.owner || "current_user", // 实际应用中应使用真实用户ID
        deadline: retentionPlanForm.deadline,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // 创建审批请求
      const result = await HRIntegrationService.createApprovalRequest({
        workflow_id: workflow.id,
        request_type: "retention_plan",
        requester_id: "current_user", // 实际应用中应使用真实用户ID
        subject_id: employeeId,
        details: {
          plan_data: planData,
        },
        priority: "medium",
      })

      if (result.success) {
        toast({
          title: "保留计划已创建",
          description: result.message || "员工保留计划已成功创建并提交审批。",
        })
        setIsRetentionPlanOpen(false)

        // 重置表单
        setRetentionPlanForm({
          planName: "",
          planType: "career",
          description: "",
          owner: "",
          deadline: "",
        })
      } else {
        toast({
          title: "创建保留计划失败",
          description: result.error || "请稍后重试或联系管理员。",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("创建保留计划失败:", error)
      toast({
        title: "创建保留计划失败",
        description: "请稍后重试或联系管理员。",
        variant: "destructive",
      })
    }
  }

  // 处理会议安排提交
  const handleScheduleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 创建会议记录
      const meetingData = {
        employee_id: employeeId,
        meeting_type: meetingForm.meetingType,
        date: meetingForm.date,
        time: meetingForm.time,
        duration: Number.parseInt(meetingForm.duration),
        location: meetingForm.location,
        agenda: meetingForm.agenda,
        status: "scheduled",
        created_by: "current_user", // 实际应用中应使用真实用户ID
        created_at: new Date().toISOString(),
      }

      // 这里应该有实际的提交逻辑
      // 模拟成功响应
      toast({
        title: "会议已安排",
        description: "一对一面谈已成功安排，相关人员将收到通知。",
      })
      setIsScheduleMeetingOpen(false)

      // 重置表单
      setMeetingForm({
        meetingType: "retention",
        date: "",
        time: "",
        duration: "60",
        location: "",
        agenda: "",
      })
    } catch (error) {
      console.error("安排会议失败:", error)
      toast({
        title: "安排会议失败",
        description: "请稍后重试或联系管理员。",
        variant: "destructive",
      })
    }
  }

  // 处理薪资调整提交
  const handleSalaryAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 获取薪资调整审批流程
      const workflow = await HRIntegrationService.getApprovalWorkflowByType("salary_adjustment")

      if (!workflow) {
        toast({
          title: "审批流程不存在",
          description: "无法找到薪资调整审批流程，请联系管理员。",
          variant: "destructive",
        })
        return
      }

      // 创建薪资调整记录
      const adjustmentData = {
        employee_id: employeeId,
        current_salary: Number.parseFloat(salaryForm.currentSalary),
        new_salary: Number.parseFloat(salaryForm.newSalary),
        adjustment_type: salaryForm.adjustmentType,
        effective_date: salaryForm.effectiveDate,
        reason: salaryForm.reason,
        status: "pending",
        created_by: "current_user", // 实际应用中应使用真实用户ID
        created_at: new Date().toISOString(),
      }

      // 创建审批请求
      const result = await HRIntegrationService.createApprovalRequest({
        workflow_id: workflow.id,
        request_type: "salary_adjustment",
        requester_id: "current_user", // 实际应用中应使用真实用户ID
        subject_id: employeeId,
        details: {
          adjustment_data: adjustmentData,
        },
        priority: "high",
      })

      if (result.success) {
        toast({
          title: "薪资调整已提交",
          description: result.message || "薪资调整申请已提交，等待审批。",
        })
        setIsSalaryAdjustmentOpen(false)

        // 重置表单
        setSalaryForm({
          currentSalary: "",
          newSalary: "",
          adjustmentType: "merit",
          effectiveDate: "",
          reason: "",
        })
      } else {
        toast({
          title: "提交薪资调整失败",
          description: result.error || "请稍后重试或联系管理员。",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("提交薪资调整失败:", error)
      toast({
        title: "提交薪资调整失败",
        description: "请稍后重试或联系管理员。",
        variant: "destructive",
      })
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  // 获取状态标签和颜色
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
      case "pending":
        return { label: "待审批", color: "bg-yellow-500 text-white" }
      case "active":
      case "scheduled":
      case "approved":
        return { label: "已批准", color: "bg-green-500 text-white" }
      case "completed":
        return { label: "已完成", color: "bg-blue-500 text-white" }
      case "cancelled":
      case "rejected":
        return { label: "已拒绝", color: "bg-red-500 text-white" }
      default:
        return { label: status, color: "bg-gray-500 text-white" }
    }
  }

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow sticky top-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">员工行动中心</CardTitle>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "actions" | "history")}>
          <TabsList>
            <TabsTrigger value="actions">可执行操作</TabsTrigger>
            <TabsTrigger value="history">历史记录</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-4">
        <TabsContent value="actions" className="mt-0">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsRetentionPlanOpen(true)}>
              <ClipboardList className="mr-2 h-4 w-4" />
              制定保留计划
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => setIsScheduleMeetingOpen(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              安排一对一面谈
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => setIsSalaryAdjustmentOpen(true)}>
              <DollarSign className="mr-2 h-4 w-4" />
              调整薪资
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <UserCog className="mr-2 h-4 w-4" />
              调整工作职责
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              安排培训课程
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <CalendarClock className="mr-2 h-4 w-4" />
              调整工作时间
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="pt-2">
            <Button className="w-full">查看所有可用操作</Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Tabs defaultValue="retention-plans">
            <TabsList className="w-full">
              <TabsTrigger value="retention-plans" className="flex-1">
                保留计划
              </TabsTrigger>
              <TabsTrigger value="meetings" className="flex-1">
                面谈记录
              </TabsTrigger>
              <TabsTrigger value="salary" className="flex-1">
                薪资调整
              </TabsTrigger>
            </TabsList>

            <TabsContent value="retention-plans" className="mt-4">
              {retentionPlans.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">暂无保留计划记录</div>
              ) : (
                <div className="space-y-3">
                  {retentionPlans.map((plan, index) => {
                    const statusBadge = getStatusBadge(plan.status)

                    return (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{plan.plan_name}</div>
                            <div className="text-sm text-muted-foreground">截止日期: {formatDate(plan.deadline)}</div>
                          </div>
                          <Badge className={cn(statusBadge.color)}>{statusBadge.label}</Badge>
                        </div>
                        <div className="text-sm mt-2 line-clamp-2">{plan.description}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="meetings" className="mt-4">
              {meetings.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">暂无面谈记录</div>
              ) : (
                <div className="space-y-3">
                  {meetings.map((meeting, index) => {
                    const statusBadge = getStatusBadge(meeting.status)

                    return (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {meeting.meeting_type === "retention"
                                ? "保留面谈"
                                : meeting.meeting_type === "feedback"
                                  ? "反馈面谈"
                                  : meeting.meeting_type === "career"
                                    ? "职业发展面谈"
                                    : meeting.meeting_type === "performance"
                                      ? "绩效面谈"
                                      : meeting.meeting_type}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(meeting.date)} {meeting.time}
                            </div>
                          </div>
                          <Badge className={cn(statusBadge.color)}>{statusBadge.label}</Badge>
                        </div>
                        <div className="text-sm mt-2 line-clamp-2">{meeting.agenda}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="salary" className="mt-4">
              {salaryAdjustments.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">暂无薪资调整记录</div>
              ) : (
                <div className="space-y-3">
                  {salaryAdjustments.map((adjustment, index) => {
                    const statusBadge = getStatusBadge(adjustment.status)
                    const percentChange =
                      ((adjustment.new_salary - adjustment.current_salary) / adjustment.current_salary) * 100

                    return (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              薪资调整 ({percentChange > 0 ? "+" : ""}
                              {percentChange.toFixed(1)}%)
                            </div>
                            <div className="text-sm text-muted-foreground">
                              生效日期: {formatDate(adjustment.effective_date)}
                            </div>
                          </div>
                          <Badge className={cn(statusBadge.color)}>{statusBadge.label}</Badge>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                          <span>调整前: {adjustment.current_salary}</span>
                          <span>调整后: {adjustment.new_salary}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </CardContent>

      {/* 制定保留计划对话框 */}
      <Dialog open={isRetentionPlanOpen} onOpenChange={setIsRetentionPlanOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>制定员工保留计划</DialogTitle>
            <DialogDescription>创建一个定制化的员工保留计划，以降低离职风险。</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRetentionPlanSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="plan-name">计划名称</Label>
                <Input
                  id="plan-name"
                  placeholder="输入计划名称"
                  required
                  value={retentionPlanForm.planName}
                  onChange={(e) => setRetentionPlanForm({ ...retentionPlanForm, planName: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="plan-type">计划类型</Label>
                <select
                  id="plan-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={retentionPlanForm.planType}
                  onChange={(e) => setRetentionPlanForm({ ...retentionPlanForm, planType: e.target.value })}
                >
                  <option value="career">职业发展</option>
                  <option value="compensation">薪酬调整</option>
                  <option value="work_life_balance">工作生活平衡</option>
                  <option value="training">培训发展</option>
                  <option value="engagement">员工敬业度</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="plan-description">计划描述</Label>
                <textarea
                  id="plan-description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="详细描述保留计划内容和目标..."
                  required
                  value={retentionPlanForm.description}
                  onChange={(e) => setRetentionPlanForm({ ...retentionPlanForm, description: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="plan-owner">负责人</Label>
                <Input
                  id="plan-owner"
                  placeholder="输入负责人姓名或ID"
                  value={retentionPlanForm.owner}
                  onChange={(e) => setRetentionPlanForm({ ...retentionPlanForm, owner: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="plan-deadline">截止日期</Label>
                <Input
                  id="plan-deadline"
                  type="date"
                  required
                  value={retentionPlanForm.deadline}
                  onChange={(e) => setRetentionPlanForm({ ...retentionPlanForm, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsRetentionPlanOpen(false)}>
                取消
              </Button>
              <Button type="submit">提交计划</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 安排一对一面谈对话框 */}
      <Dialog open={isScheduleMeetingOpen} onOpenChange={setIsScheduleMeetingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>安排一对一面谈</DialogTitle>
            <DialogDescription>安排与员工的一对一面谈，讨论职业发展或解决问题。</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleMeetingSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="meeting-type">面谈类型</Label>
                <select
                  id="meeting-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={meetingForm.meetingType}
                  onChange={(e) => setMeetingForm({ ...meetingForm, meetingType: e.target.value })}
                >
                  <option value="retention">保留面谈</option>
                  <option value="feedback">反馈面谈</option>
                  <option value="career">职业发展面谈</option>
                  <option value="performance">绩效面谈</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="meeting-date">日期</Label>
                  <Input
                    id="meeting-date"
                    type="date"
                    required
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="meeting-time">时间</Label>
                  <Input
                    id="meeting-time"
                    type="time"
                    required
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meeting-duration">时长（分钟）</Label>
                <select
                  id="meeting-duration"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={meetingForm.duration}
                  onChange={(e) => setMeetingForm({ ...meetingForm, duration: e.target.value })}
                >
                  <option value="30">30分钟</option>
                  <option value="45">45分钟</option>
                  <option value="60">60分钟</option>
                  <option value="90">90分钟</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meeting-location">地点</Label>
                <Input
                  id="meeting-location"
                  placeholder="会议室或线上会议链接"
                  required
                  value={meetingForm.location}
                  onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meeting-agenda">议程</Label>
                <textarea
                  id="meeting-agenda"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="描述会议议程和讨论要点..."
                  value={meetingForm.agenda}
                  onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsScheduleMeetingOpen(false)}>
                取消
              </Button>
              <Button type="submit">安排会议</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 薪资调整对话框 */}
      <Dialog open={isSalaryAdjustmentOpen} onOpenChange={setIsSalaryAdjustmentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>薪资调整申请</DialogTitle>
            <DialogDescription>提交员工薪资调整申请，需要经过审批流程。</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSalaryAdjustmentSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-salary">当前薪资</Label>
                  <Input
                    id="current-salary"
                    type="number"
                    placeholder="0.00"
                    required
                    value={salaryForm.currentSalary}
                    onChange={(e) => setSalaryForm({ ...salaryForm, currentSalary: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="new-salary">调整后薪资</Label>
                  <Input
                    id="new-salary"
                    type="number"
                    placeholder="0.00"
                    required
                    value={salaryForm.newSalary}
                    onChange={(e) => setSalaryForm({ ...salaryForm, newSalary: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="adjustment-type">调整类型</Label>
                <select
                  id="adjustment-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={salaryForm.adjustmentType}
                  onChange={(e) => setSalaryForm({ ...salaryForm, adjustmentType: e.target.value })}
                >
                  <option value="merit">绩效调薪</option>
                  <option value="promotion">晋升调薪</option>
                  <option value="market_adjustment">市场调整</option>
                  <option value="retention">保留调薪</option>
                  <option value="annual">年度调薪</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="effective-date">生效日期</Label>
                <Input
                  id="effective-date"
                  type="date"
                  required
                  value={salaryForm.effectiveDate}
                  onChange={(e) => setSalaryForm({ ...salaryForm, effectiveDate: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="adjustment-reason">调整理由</Label>
                <textarea
                  id="adjustment-reason"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="详细说明薪资调整的原因和依据..."
                  required
                  value={salaryForm.reason}
                  onChange={(e) => setSalaryForm({ ...salaryForm, reason: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsSalaryAdjustmentOpen(false)}>
                取消
              </Button>
              <Button type="submit">提交申请</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
