import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeLifecycleHeader } from "@/components/employee-lifecycle/employee-lifecycle-header"
import { OnboardingDashboard } from "@/components/employee-lifecycle/onboarding-dashboard"
import { DevelopmentMatrix } from "@/components/employee-lifecycle/development-matrix"
import { OffboardingAnalytics } from "@/components/employee-lifecycle/offboarding-analytics"
import { EmployeeInsights } from "@/components/employee-lifecycle/employee-insights"

export const metadata: Metadata = {
  title: "员工全周期管理 | 言语「逸品」数字驾驶舱",
  description: "数字化入职体验、在职发展矩阵与智能离职分析",
}

export default function EmployeeLifecyclePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <EmployeeLifecycleHeader />

      <main className="flex-1 space-y-6 p-6 pt-4 md:p-8 md:pt-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">员工全周期管理</h1>
          <p className="text-muted-foreground">数字化入职体验、在职发展矩阵与智能离职分析</p>
        </div>

        <Tabs defaultValue="onboarding" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="onboarding">数字化入职</TabsTrigger>
            <TabsTrigger value="development">在职发展矩阵</TabsTrigger>
            <TabsTrigger value="offboarding">智能离职分析</TabsTrigger>
            <TabsTrigger value="insights">员工洞察</TabsTrigger>
          </TabsList>

          <TabsContent value="onboarding" className="space-y-4">
            <OnboardingDashboard />
          </TabsContent>

          <TabsContent value="development" className="space-y-4">
            <DevelopmentMatrix />
          </TabsContent>

          <TabsContent value="offboarding" className="space-y-4">
            <OffboardingAnalytics />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <EmployeeInsights />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
