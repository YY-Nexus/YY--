"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BudgetPlanner } from "@/components/advanced-analysis/budget-planner"
import { CashFlowForecast } from "@/components/advanced-analysis/cash-flow-forecast"
import { ROIAnalyzer } from "@/components/advanced-analysis/roi-analyzer"
import { FileDown, Save, Settings, RefreshCw } from "lucide-react"

export default function AdvancedAnalysisPage() {
  const [activeTab, setActiveTab] = useState("budget")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">高级财务分析</h1>
          <p className="text-muted-foreground">预算规划、现金流预测和投资回报分析工具</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新数据
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            分析设置
          </Button>
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            保存分析
          </Button>
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            导出报告
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="budget">预算规划与控制</TabsTrigger>
          <TabsTrigger value="cashflow">现金流预测与管理</TabsTrigger>
          <TabsTrigger value="roi">投资回报分析</TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="mt-6">
          <BudgetPlanner />
        </TabsContent>

        <TabsContent value="cashflow" className="mt-6">
          <CashFlowForecast />
        </TabsContent>

        <TabsContent value="roi" className="mt-6">
          <ROIAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  )
}
