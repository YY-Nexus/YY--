"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Filter, Play, Plus, RefreshCw, ThumbsDown, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Recommendation {
  id: string
  title: string
  description: string
  actions: string[]
  priority: "high" | "medium" | "low"
  impact: "high" | "medium" | "low"
  effort: "high" | "medium" | "low"
  category: string
  tags: string[]
  confidence: number
  status?: "pending" | "in_progress" | "completed" | "rejected"
}

interface PersonalizedRecommendationsProps {
  employeeId: string
  recommendations: Recommendation[]
  savedRecommendations?: Recommendation[]
  onRefresh?: () => void
  onUpdateStatus?: (id: string, status: string) => Promise<{ success: boolean }>
}

export function PersonalizedRecommendations({
  employeeId,
  recommendations,
  savedRecommendations = [],
  onRefresh,
  onUpdateStatus,
}: PersonalizedRecommendationsProps) {
  const [activeTab, setActiveTab] = useState("new")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)
  const [isImplementDialogOpen, setIsImplementDialogOpen] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null)
  const [implementationNotes, setImplementationNotes] = useState("")
  const [assignee, setAssignee] = useState("")
  const [dueDate, setDueDate] = useState("")

  // 获取所有可用的类别
  const allCategories = Array.from(
    new Set([...recommendations.map((r) => r.category), ...savedRecommendations.map((r) => r.category)]),
  )

  // 获取优先级标签和颜色
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return { label: "高", color: "bg-red-500 text-white" }
      case "medium":
        return { label: "中", color: "bg-yellow-500 text-white" }
      case "low":
        return { label: "低", color: "bg-green-500 text-white" }
      default:
        return { label: priority, color: "bg-gray-500 text-white" }
    }
  }

  // 获取影响力标签和颜色
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return { label: "高", color: "bg-blue-500 text-white" }
      case "medium":
        return { label: "中", color: "bg-blue-400 text-white" }
      case "low":
        return { label: "低", color: "bg-blue-300 text-white" }
      default:
        return { label: impact, color: "bg-gray-500 text-white" }
    }
  }

  // 获取工作量标签和颜色
  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case "high":
        return { label: "高", color: "bg-purple-500 text-white" }
      case "medium":
        return { label: "中", color: "bg-purple-400 text-white" }
      case "low":
        return { label: "低", color: "bg-purple-300 text-white" }
      default:
        return { label: effort, color: "bg-gray-500 text-white" }
    }
  }

  // 获取状态标签和颜色
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "待处理", color: "bg-gray-500 text-white", icon: <Clock className="h-3 w-3 mr-1" /> }
      case "in_progress":
        return { label: "进行中", color: "bg-blue-500 text-white", icon: <Play className="h-3 w-3 mr-1" /> }
      case "completed":
        return { label: "已完成", color: "bg-green-500 text-white", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
      case "rejected":
        return { label: "已拒绝", color: "bg-red-500 text-white", icon: <XCircle className="h-3 w-3 mr-1" /> }
      default:
        return { label: status, color: "bg-gray-500 text-white", icon: null }
    }
  }

  // 获取类别中文名称
  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      engagement: "工作投入",
      satisfaction: "工作满意度",
      performance: "绩效表现",
      compensation: "薪酬福利",
      career: "职业发展",
      wellbeing: "健康福祉",
      leadership: "领导力",
      development: "能力发展",
      onboarding: "入职融入",
      culture: "组织文化",
      job_design: "工作设计",
    }

    return categoryNames[category] || category
  }

  // 过滤建议
  const filterRecommendations = (recs: Recommendation[]) => {
    return recs.filter((r) => {
      if (selectedCategory && r.category !== selectedCategory) return false
      if (selectedPriority && r.priority !== selectedPriority) return false
      return true
    })
  }

  // 处理实施建议
  const handleImplementRecommendation = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation)
    setImplementationNotes("")
    setAssignee("")
    setDueDate("")
    setIsImplementDialogOpen(true)
  }

  // 提交实施计划
  const handleSubmitImplementation = async () => {
    if (!selectedRecommendation) return

    try {
      if (onUpdateStatus) {
        const result = await onUpdateStatus(selectedRecommendation.id, "in_progress")

        if (result.success) {
          toast({
            title: "实施计划已创建",
            description: "建议已标记为进行中，实施计划已保存。",
          })

          setIsImplementDialogOpen(false)

          // 刷新数据
          if (onRefresh) {
            onRefresh()
          }
        } else {
          toast({
            title: "创建实施计划失败",
            description: "请稍后重试或联系管理员。",
            variant: "destructive",
          })
        }
      } else {
        // 模拟成功
        toast({
          title: "实施计划已创建",
          description: "建议已标记为进行中，实施计划已保存。",
        })

        setIsImplementDialogOpen(false)
      }
    } catch (error) {
      console.error("提交实施计划失败:", error)
      toast({
        title: "创建实施计划失败",
        description: "请稍后重试或联系管理员。",
        variant: "destructive",
      })
    }
  }

  // 处理完成建议
  const handleCompleteRecommendation = async (recommendation: Recommendation) => {
    try {
      if (onUpdateStatus) {
        const result = await onUpdateStatus(recommendation.id, "completed")

        if (result.success) {
          toast({
            title: "建议已完成",
            description: "建议已标记为已完成。",
          })

          // 刷新数据
          if (onRefresh) {
            onRefresh()
          }
        } else {
          toast({
            title: "更新建议状态失败",
            description: "请稍后重试或联系管理员。",
            variant: "destructive",
          })
        }
      } else {
        // 模拟成功
        toast({
          title: "建议已完成",
          description: "建议已标记为已完成。",
        })
      }
    } catch (error) {
      console.error("更新建议状态失败:", error)
      toast({
        title: "更新建议状态失败",
        description: "请稍后重试或联系管理员。",
        variant: "destructive",
      })
    }
  }

  // 处理拒绝建议
  const handleRejectRecommendation = async (recommendation: Recommendation) => {
    try {
      if (onUpdateStatus) {
        const result = await onUpdateStatus(recommendation.id, "rejected")

        if (result.success) {
          toast({
            title: "建议已拒绝",
            description: "建议已标记为已拒绝。",
          })

          // 刷新数据
          if (onRefresh) {
            onRefresh()
          }
        } else {
          toast({
            title: "更新建议状态失败",
            description: "请稍后重试或联系管理员。",
            variant: "destructive",
          })
        }
      } else {
        // 模拟成功
        toast({
          title: "建议已拒绝",
          description: "建议已标记为已拒绝。",
        })
      }
    } catch (error) {
      console.error("更新建议状态失败:", error)
      toast({
        title: "更新建议状态失败",
        description: "请稍后重试或联系管理员。",
        variant: "destructive",
      })
    }
  }

  // 过滤后的建议
  const filteredNewRecommendations = filterRecommendations(recommendations)
  const filteredSavedRecommendations = filterRecommendations(savedRecommendations)

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">个性化保留建议</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            刷新建议
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="new" className="relative">
                新建议
                {recommendations.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {recommendations.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="saved" className="relative">
                已保存
                {savedRecommendations.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {savedRecommendations.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="类别筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部类别</SelectItem>
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPriority || ""} onValueChange={(value) => setSelectedPriority(value || null)}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="优先级筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部优先级</SelectItem>
                  <SelectItem value="high">高优先级</SelectItem>
                  <SelectItem value="medium">中优先级</SelectItem>
                  <SelectItem value="low">低优先级</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="new">
            {filteredNewRecommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">没有符合条件的新建议</div>
            ) : (
              <div className="space-y-4">
                {filteredNewRecommendations.map((recommendation) => {
                  const priorityBadge = getPriorityBadge(recommendation.priority)
                  const impactBadge = getImpactBadge(recommendation.impact)
                  const effortBadge = getEffortBadge(recommendation.effort)

                  return (
                    <Card key={recommendation.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-md font-medium">{recommendation.title}</h3>
                          <div className="flex items-center space-x-1">
                            <Badge className={cn("font-normal", priorityBadge.color)}>
                              {priorityBadge.label}优先级
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">建议行动</h4>
                            <ul className="text-sm space-y-1">
                              {recommendation.actions.map((action, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-muted-foreground mr-2">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">建议详情</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">影响力</span>
                                <Badge variant="outline" className={cn("font-normal", impactBadge.color)}>
                                  {impactBadge.label}
                                </Badge>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">实施难度</span>
                                <Badge variant="outline" className={cn("font-normal", effortBadge.color)}>
                                  {effortBadge.label}
                                </Badge>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">类别</span>
                                <Badge variant="outline">{getCategoryName(recommendation.category)}</Badge>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">置信度</span>
                                <span className="text-sm font-medium">
                                  {Math.round(recommendation.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-wrap gap-1">
                            {recommendation.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="font-normal">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectRecommendation(recommendation)}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              拒绝
                            </Button>
                            <Button size="sm" onClick={() => handleImplementRecommendation(recommendation)}>
                              <Plus className="h-4 w-4 mr-1" />
                              实施
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {filteredSavedRecommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">没有符合条件的已保存建议</div>
            ) : (
              <div className="space-y-4">
                {filteredSavedRecommendations.map((recommendation) => {
                  const priorityBadge = getPriorityBadge(recommendation.priority)
                  const impactBadge = getImpactBadge(recommendation.impact)
                  const effortBadge = getEffortBadge(recommendation.effort)
                  const statusBadge = getStatusBadge(recommendation.status || "pending")

                  return (
                    <Card key={recommendation.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-md font-medium">{recommendation.title}</h3>
                          <div className="flex items-center space-x-1">
                            <Badge className={cn("font-normal", statusBadge.color)}>
                              <span className="flex items-center">
                                {statusBadge.icon}
                                {statusBadge.label}
                              </span>
                            </Badge>
                            <Badge className={cn("font-normal", priorityBadge.color)}>
                              {priorityBadge.label}优先级
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">建议行动</h4>
                            <ul className="text-sm space-y-1">
                              {recommendation.actions.map((action, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-muted-foreground mr-2">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">建议详情</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">影响力</span>
                                <Badge variant="outline" className={cn("font-normal", impactBadge.color)}>
                                  {impactBadge.label}
                                </Badge>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">实施难度</span>
                                <Badge variant="outline" className={cn("font-normal", effortBadge.color)}>
                                  {effortBadge.label}
                                </Badge>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">类别</span>
                                <Badge variant="outline">{getCategoryName(recommendation.category)}</Badge>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">置信度</span>
                                <span className="text-sm font-medium">
                                  {Math.round(recommendation.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-wrap gap-1">
                            {recommendation.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="font-normal">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center space-x-2">
                            {recommendation.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRejectRecommendation(recommendation)}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  拒绝
                                </Button>
                                <Button size="sm" onClick={() => handleImplementRecommendation(recommendation)}>
                                  <Plus className="h-4 w-4 mr-1" />
                                  实施
                                </Button>
                              </>
                            )}

                            {recommendation.status === "in_progress" && (
                              <Button size="sm" onClick={() => handleCompleteRecommendation(recommendation)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                完成
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* 实施建议对话框 */}
      <Dialog open={isImplementDialogOpen} onOpenChange={setIsImplementDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>实施建议</DialogTitle>
            <DialogDescription>创建实施计划，将建议转化为具体行动。</DialogDescription>
          </DialogHeader>

          {selectedRecommendation && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <h3 className="font-medium">{selectedRecommendation.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedRecommendation.description}</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignee">负责人</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择负责人" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current_user">当前用户</SelectItem>
                    <SelectItem value="manager">直接主管</SelectItem>
                    <SelectItem value="hr">人力资源</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="due-date">截止日期</Label>
                <input
                  id="due-date"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="implementation-notes">实施备注</Label>
                <Textarea
                  id="implementation-notes"
                  placeholder="输入实施计划的详细信息和备注"
                  className="min-h-[100px]"
                  value={implementationNotes}
                  onChange={(e) => setImplementationNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImplementDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitImplementation}>创建实施计划</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
