"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CareerPathPlanner } from "@/components/employee-lifecycle/career-path-planner"
import { SkillsMatrix } from "@/components/employee-lifecycle/skills-matrix"
import { PerformanceTracker } from "@/components/employee-lifecycle/performance-tracker"
import { LearningRecommendations } from "@/components/employee-lifecycle/learning-recommendations"
import { Filter, RefreshCw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function DevelopmentMatrix() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">在职发展矩阵</h2>
          <p className="text-muted-foreground">员工职业发展与能力提升规划</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="搜索员工..." className="pl-8 w-[200px]" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="career" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="career">职业发展路径</TabsTrigger>
          <TabsTrigger value="skills">能力素质矩阵</TabsTrigger>
          <TabsTrigger value="performance">绩效追踪</TabsTrigger>
          <TabsTrigger value="learning">学习发展建议</TabsTrigger>
        </TabsList>

        <TabsContent value="career" className="space-y-4">
          <CareerPathPlanner />
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <SkillsMatrix />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceTracker />
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <LearningRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  )
}
