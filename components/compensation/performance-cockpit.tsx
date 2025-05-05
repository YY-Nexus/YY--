"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformanceGoals } from "@/components/compensation/performance-goals"
import { PerformanceProcess } from "@/components/compensation/performance-process"
import { PerformanceAnalytics } from "@/components/compensation/performance-analytics"
import { PerformanceCalibration } from "@/components/compensation/performance-calibration"
import { Filter, RefreshCw, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PerformanceCockpit() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">绩效驾驶舱</h2>
          <p className="text-muted-foreground">绩效目标设定、评估流程管理与分析</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="2023-Q4">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="选择绩效周期" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-Q1">2024年Q1</SelectItem>
              <SelectItem value="2023-Q4">2023年Q4</SelectItem>
              <SelectItem value="2023-Q3">2023年Q3</SelectItem>
              <SelectItem value="2023-Q2">2023年Q2</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            <span>新建周期</span>
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">目标管理</TabsTrigger>
          <TabsTrigger value="process">评估流程</TabsTrigger>
          <TabsTrigger value="analytics">绩效分析</TabsTrigger>
          <TabsTrigger value="calibration">绩效校准</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <PerformanceGoals />
        </TabsContent>

        <TabsContent value="process" className="space-y-4">
          <PerformanceProcess />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <PerformanceAnalytics />
        </TabsContent>

        <TabsContent value="calibration" className="space-y-4">
          <PerformanceCalibration />
        </TabsContent>
      </Tabs>
    </div>
  )
}
