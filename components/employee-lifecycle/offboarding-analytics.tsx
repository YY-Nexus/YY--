"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TurnoverAnalysis } from "@/components/employee-lifecycle/turnover-analysis"
import { ExitInterviews } from "@/components/employee-lifecycle/exit-interviews"
import { RetentionRisk } from "@/components/employee-lifecycle/retention-risk"
import { RetentionStrategies } from "@/components/employee-lifecycle/retention-strategies"
import { Filter, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function OffboardingAnalytics() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">智能离职分析</h2>
          <p className="text-muted-foreground">员工离职原因分析与人才保留策略</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              <SelectItem value="dev">研发部</SelectItem>
              <SelectItem value="marketing">市场部</SelectItem>
              <SelectItem value="sales">销售部</SelectItem>
              <SelectItem value="hr">人力资源部</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="turnover" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="turnover">离职率分析</TabsTrigger>
          <TabsTrigger value="interviews">离职面谈</TabsTrigger>
          <TabsTrigger value="risk">保留风险</TabsTrigger>
          <TabsTrigger value="strategies">保留策略</TabsTrigger>
        </TabsList>

        <TabsContent value="turnover" className="space-y-4">
          <TurnoverAnalysis />
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <ExitInterviews />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <RetentionRisk />
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <RetentionStrategies />
        </TabsContent>
      </Tabs>
    </div>
  )
}
