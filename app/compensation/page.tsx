import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompensationHeader } from "@/components/compensation/compensation-header"
import { SalarySystem } from "@/components/compensation/salary-system"
import { PerformanceCockpit } from "@/components/compensation/performance-cockpit"
import { EquityPlan } from "@/components/compensation/equity-plan"
import { CompensationInsights } from "@/components/compensation/compensation-insights"

export const metadata: Metadata = {
  title: "薪酬绩效引擎 | 言语「逸品」数字驾驶舱",
  description: "智能薪酬体系、绩效驾驶舱与股权激励沙盘",
}

export default function CompensationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CompensationHeader />

      <main className="flex-1 space-y-6 p-6 pt-4 md:p-8 md:pt-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">薪酬绩效引擎</h1>
          <p className="text-muted-foreground">智能薪酬体系、绩效驾驶舱与股权激励沙盘</p>
        </div>

        <Tabs defaultValue="salary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="salary">智能薪酬体系</TabsTrigger>
            <TabsTrigger value="performance">绩效驾驶舱</TabsTrigger>
            <TabsTrigger value="equity">股权激励沙盘</TabsTrigger>
            <TabsTrigger value="insights">薪酬绩效洞察</TabsTrigger>
          </TabsList>

          <TabsContent value="salary" className="space-y-4">
            <SalarySystem />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <PerformanceCockpit />
          </TabsContent>

          <TabsContent value="equity" className="space-y-4">
            <EquityPlan />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <CompensationInsights />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
