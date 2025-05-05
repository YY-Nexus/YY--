"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"

interface RiskFactorsProps {
  factors: {
    engagement: number
    performance: number
    satisfaction: number
    [key: string]: number
  }
}

export function RiskFactors({ factors }: RiskFactorsProps) {
  // 风险因素描述
  const factorDescriptions = {
    engagement: {
      title: "工作投入度",
      description: "员工对工作的热情和投入程度",
      indicators: [
        { name: "会议参与率", value: factors.engagement - 10, trend: "down" },
        { name: "加班频率", value: factors.engagement - 5, trend: "down" },
        { name: "主动提案数", value: factors.engagement - 15, trend: "down" },
      ],
    },
    performance: {
      title: "工作表现",
      description: "员工的工作质量和效率",
      indicators: [
        { name: "任务完成率", value: factors.performance - 5, trend: "down" },
        { name: "工作质量评分", value: factors.performance - 10, trend: "down" },
        { name: "目标达成率", value: factors.performance, trend: "stable" },
      ],
    },
    satisfaction: {
      title: "工作满意度",
      description: "员工对工作环境和条件的满意程度",
      indicators: [
        { name: "团队氛围评分", value: factors.satisfaction - 20, trend: "down" },
        { name: "薪酬满意度", value: factors.satisfaction - 15, trend: "down" },
        { name: "职业发展评分", value: factors.satisfaction - 10, trend: "down" },
      ],
    },
  }

  // 获取风险等级和颜色
  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: "低风险", color: "text-green-600" }
    if (score < 50) return { level: "中等风险", color: "text-yellow-600" }
    if (score < 70) return { level: "高风险", color: "text-orange-600" }
    return { level: "极高风险", color: "text-red-600" }
  }

  // 获取进度条颜色
  const getProgressColor = (score: number) => {
    if (score < 30) return "bg-green-600"
    if (score < 50) return "bg-yellow-600"
    if (score < 70) return "bg-orange-600"
    return "bg-red-600"
  }

  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-red-600" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-green-600" />
    return null
  }

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-medium">风险因素分析</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="engagement">工作投入度</TabsTrigger>
            <TabsTrigger value="performance">工作表现</TabsTrigger>
            <TabsTrigger value="satisfaction">工作满意度</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {Object.entries(factors).map(([key, value]) => {
                const factor = factorDescriptions[key as keyof typeof factorDescriptions]
                const { level, color } = getRiskLevel(value)

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{factor.title}</div>
                        <div className="text-sm text-muted-foreground">{factor.description}</div>
                      </div>
                      <div className={`font-medium ${color}`}>
                        {level} ({value})
                      </div>
                    </div>
                    <Progress value={value} className="h-2" indicatorClassName={getProgressColor(value)} />
                  </div>
                )
              })}

              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">主要风险提示</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      员工工作满意度显著下降，特别是在团队氛围和薪酬满意度方面。建议安排一对一面谈，了解具体原因并制定改进计划。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {Object.entries(factorDescriptions).map(([key, factor]) => (
            <TabsContent key={key} value={key}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{factor.title}</div>
                      <div className="text-sm text-muted-foreground">{factor.description}</div>
                    </div>
                    <div className={`font-medium ${getRiskLevel(factors[key]).color}`}>
                      {getRiskLevel(factors[key]).level} ({factors[key]})
                    </div>
                  </div>
                  <Progress value={factors[key]} className="h-2" indicatorClassName={getProgressColor(factors[key])} />
                </div>

                <div className="space-y-4 mt-6">
                  <h4 className="font-medium">详细指标</h4>
                  {factor.indicators.map((indicator, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(indicator.trend)}
                        <span>{indicator.name}</span>
                      </div>
                      <div className={getRiskLevel(indicator.value).color}>{indicator.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div>
                      <h4 className="font-medium text-blue-800">改进建议</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {key === "engagement" &&
                          "安排更多团队建设活动，提高员工参与感和归属感。定期举行团队会议，鼓励员工分享想法和建议。"}
                        {key === "performance" &&
                          "提供更明确的工作目标和期望，定期进行绩效反馈，帮助员工了解自己的优势和改进空间。"}
                        {key === "satisfaction" &&
                          "进行薪酬满意度调查，了解员工对薪酬的具体期望。改善团队沟通和协作，创造更积极的工作环境。"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
