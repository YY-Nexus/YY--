"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalaryStructure } from "@/components/compensation/salary-structure"
import { MarketBenchmark } from "@/components/compensation/market-benchmark"
import { BudgetManagement } from "@/components/compensation/budget-management"
import { SalaryAdjustment } from "@/components/compensation/salary-adjustment"
import { Filter, RefreshCw, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SalarySystem() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">智能薪酬体系</h2>
          <p className="text-muted-foreground">薪酬结构设计、市场对标分析与预算管理</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="2023">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择年份" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024年</SelectItem>
              <SelectItem value="2023">2023年</SelectItem>
              <SelectItem value="2022">2022年</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            <span>新建方案</span>
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="structure" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="structure">薪酬结构</TabsTrigger>
          <TabsTrigger value="benchmark">市场对标</TabsTrigger>
          <TabsTrigger value="budget">预算管理</TabsTrigger>
          <TabsTrigger value="adjustment">调薪规划</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <SalaryStructure />
        </TabsContent>

        <TabsContent value="benchmark" className="space-y-4">
          <MarketBenchmark />
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <BudgetManagement />
        </TabsContent>

        <TabsContent value="adjustment" className="space-y-4">
          <SalaryAdjustment />
        </TabsContent>
      </Tabs>
    </div>
  )
}
