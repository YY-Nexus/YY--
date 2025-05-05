"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OnboardingStats } from "@/components/employee-lifecycle/onboarding-stats"
import { OnboardingProgress } from "@/components/employee-lifecycle/onboarding-progress"
import { OnboardingTasks } from "@/components/employee-lifecycle/onboarding-tasks"
import { OnboardingFeedback } from "@/components/employee-lifecycle/onboarding-feedback"
import { OnboardingCalendar } from "@/components/employee-lifecycle/onboarding-calendar"
import { PlusCircle, Filter, Download, RefreshCw } from "lucide-react"

export function OnboardingDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">数字化入职</h2>
          <p className="text-muted-foreground">为新员工提供无缝的入职体验</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>新增入职</span>
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <OnboardingStats />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>入职进度追踪</CardTitle>
            <CardDescription>实时监控新员工入职流程进度</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="active">进行中</TabsTrigger>
                  <TabsTrigger value="completed">已完成</TabsTrigger>
                  <TabsTrigger value="upcoming">即将入职</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  <span>导出</span>
                </Button>
              </div>

              <TabsContent value="active">
                <OnboardingProgress />
              </TabsContent>

              <TabsContent value="completed">
                <div className="text-center py-8 text-muted-foreground">最近30天内没有已完成的入职流程</div>
              </TabsContent>

              <TabsContent value="upcoming">
                <div className="text-center py-8 text-muted-foreground">未来30天内没有计划中的入职流程</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>入职任务</CardTitle>
            <CardDescription>待完成的入职相关任务</CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingTasks />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>入职反馈</CardTitle>
            <CardDescription>新员工入职体验反馈分析</CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingFeedback />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>入职日历</CardTitle>
            <CardDescription>即将入职的员工安排</CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingCalendar />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
