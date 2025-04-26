"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { FinancialHealthScore } from "@/components/financial-health/financial-health-score"
import { FinancialAnomalyDetector } from "@/components/financial-health/financial-anomaly-detector"
import { ImprovementSuggestions } from "@/components/financial-health/improvement-suggestions"
import { RiskAlertSystem } from "@/components/financial-health/risk-alert-system"
import { getMockFinancialData } from "@/utils/mock-finance-data"
import { calculateFinancialHealthScore } from "@/utils/financial-health-calculator"
import { detectFinancialAnomalies } from "@/utils/financial-anomaly-detector"
import { evaluateFinancialRisks } from "@/utils/financial-risk-evaluator"
import { Download, FileText, Share2 } from "lucide-react"

export default function FinancialHealthDiagnosisPage() {
  const [financialData, setFinancialData] = useState<any>(null)
  const [healthScore, setHealthScore] = useState<any>(null)
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [risks, setRisks] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取财务数据
    const data = getMockFinancialData()
    setFinancialData(data)

    // 计算健康评分
    const score = calculateFinancialHealthScore(data)
    setHealthScore(score)

    // 检测异常
    const detectedAnomalies = detectFinancialAnomalies(data)
    setAnomalies(detectedAnomalies)

    // 评估风险
    const evaluatedRisks = evaluateFinancialRisks(data)
    setRisks(evaluatedRisks)

    setLoading(false)
  }, [])

  return (
    <DashboardLayout title="财务健康诊断">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-300">财务健康诊断</h1>
            <p className="text-cyan-500">全面评估企业财务状况，识别风险并提供改进建议</p>
          </div>
          <div className="flex items-center gap-3">
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              className="bg-cyan-950 border-cyan-800 text-cyan-300"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-cyan-300 border-cyan-700 bg-cyan-950/50 hover:bg-cyan-900"
              >
                <FileText className="mr-2 h-4 w-4" />
                生成报告
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-cyan-300 border-cyan-700 bg-cyan-950/50 hover:bg-cyan-900"
              >
                <Share2 className="mr-2 h-4 w-4" />
                分享
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-cyan-300 border-cyan-700 bg-cyan-950/50 hover:bg-cyan-900"
              >
                <Download className="mr-2 h-4 w-4" />
                导出
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-cyan-950/30 border-cyan-900">
                <CardHeader>
                  <div className="h-6 bg-cyan-900/50 rounded w-1/3 animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-cyan-900/30 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinancialHealthScore
                financialData={financialData}
                period={selectedDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
              />
              <FinancialAnomalyDetector
                financialData={financialData}
                period={selectedDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ImprovementSuggestions financialData={financialData} healthScore={healthScore} anomalies={anomalies} />
              <RiskAlertSystem
                financialData={financialData}
                period={selectedDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
              />
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-cyan-950/50 border border-cyan-900">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-100"
                >
                  总览
                </TabsTrigger>
                <TabsTrigger
                  value="profitability"
                  className="data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-100"
                >
                  盈利能力
                </TabsTrigger>
                <TabsTrigger
                  value="liquidity"
                  className="data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-100"
                >
                  流动性
                </TabsTrigger>
                <TabsTrigger
                  value="solvency"
                  className="data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-100"
                >
                  偿债能力
                </TabsTrigger>
                <TabsTrigger
                  value="efficiency"
                  className="data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-100"
                >
                  运营效率
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <Card className="bg-cyan-950/30 border-cyan-900">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">财务健康总览</CardTitle>
                    <CardDescription className="text-cyan-500">企业财务状况的全面概览</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center text-cyan-500">
                      详细财务健康总览图表将在这里显示
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profitability" className="mt-4">
                <Card className="bg-cyan-950/30 border-cyan-900">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">盈利能力分析</CardTitle>
                    <CardDescription className="text-cyan-500">企业创造利润的能力分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center text-cyan-500">
                      盈利能力详细分析将在这里显示
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="liquidity" className="mt-4">
                <Card className="bg-cyan-950/30 border-cyan-900">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">流动性分析</CardTitle>
                    <CardDescription className="text-cyan-500">企业偿还短期债务能力分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center text-cyan-500">
                      流动性详细分析将在这里显示
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="solvency" className="mt-4">
                <Card className="bg-cyan-950/30 border-cyan-900">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">偿债能力分析</CardTitle>
                    <CardDescription className="text-cyan-500">企业偿还长期债务能力分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center text-cyan-500">
                      偿债能力详细分析将在这里显示
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="efficiency" className="mt-4">
                <Card className="bg-cyan-950/30 border-cyan-900">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">运营效率分析</CardTitle>
                    <CardDescription className="text-cyan-500">企业资源利用效率分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center text-cyan-500">
                      运营效率详细分析将在这里显示
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
