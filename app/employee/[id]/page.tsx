import { Suspense } from "react"
import { notFound } from "next/navigation"
import {
  getEmployeeById,
  getEmployeeRiskHistory,
  getEmployeeRetentionPlans,
  getEmployeeMeetings,
  getEmployeeSalaryAdjustments,
} from "@/lib/employee-service"
import { RiskPredictionService } from "@/lib/risk-assessment-service"
import { AIRecommendationService } from "@/lib/ai-recommendation-service"
import { EmployeeHeader } from "@/components/employee/employee-header"
import { RiskDashboard } from "@/components/employee/risk-dashboard"
import { RiskTrend } from "@/components/employee/risk-trend"
import { RiskFactors } from "@/components/employee/risk-factors"
import { RiskHistory } from "@/components/employee/risk-history"
import { RiskHistoryAnalysis } from "@/components/employee/risk-history-analysis"
import { ActionSidebar } from "@/components/employee/action-sidebar"
import { PersonalizedRecommendations } from "@/components/employee/personalized-recommendations"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 加载状态组件
function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const employee = await getEmployeeById(params.id)

  if (!employee) {
    notFound()
  }

  // 获取风险评分历史
  const riskHistory = await getEmployeeRiskHistory(params.id)
  const currentRisk = riskHistory[riskHistory.length - 1]

  // 获取风险预测
  const riskPrediction = await RiskPredictionService.predictRiskTrend(params.id)

  // 获取保留计划
  const retentionPlans = await getEmployeeRetentionPlans(params.id)

  // 获取会议记录
  const meetings = await getEmployeeMeetings(params.id)

  // 获取薪资调整记录
  const salaryAdjustments = await getEmployeeSalaryAdjustments(params.id)

  // 获取个性化建议
  const recommendations = await AIRecommendationService.generateRetentionRecommendations(params.id)
  const savedRecommendations = await AIRecommendationService.getSavedRecommendations(params.id)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EmployeeHeader employee={employee} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <RiskDashboard score={currentRisk.score} />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <RiskTrend history={riskHistory} predictions={riskPrediction.predictions} />
            </Suspense>
          </div>

          <Tabs defaultValue="risk-analysis">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="risk-analysis">风险分析</TabsTrigger>
              <TabsTrigger value="history-analysis">历史分析</TabsTrigger>
              <TabsTrigger value="recommendations">个性化建议</TabsTrigger>
            </TabsList>

            <TabsContent value="risk-analysis">
              <div className="space-y-6">
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <RiskFactors factors={currentRisk.factors} />
                </Suspense>

                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <RiskHistory history={riskHistory} />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="history-analysis">
              <div className="space-y-6">
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <RiskHistoryAnalysis history={riskHistory} predictions={riskPrediction.predictions} />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              <div className="space-y-6">
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <PersonalizedRecommendations
                    employeeId={params.id}
                    recommendations={recommendations}
                    savedRecommendations={savedRecommendations}
                    onUpdateStatus={AIRecommendationService.updateRecommendationStatus}
                  />
                </Suspense>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Suspense fallback={<Skeleton className="h-full w-full min-h-[400px]" />}>
            <ActionSidebar
              employeeId={params.id}
              retentionPlans={retentionPlans}
              meetings={meetings}
              salaryAdjustments={salaryAdjustments}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
