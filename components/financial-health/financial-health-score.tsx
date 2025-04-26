"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateFinancialHealthScore } from "@/utils/financial-health-calculator"
import { AnimatedCounter } from "@/components/animated-counter"

interface FinancialHealthScoreProps {
  financialData: any
  period?: string
}

export function FinancialHealthScore({ financialData, period = "当前" }: FinancialHealthScoreProps) {
  const [scores, setScores] = useState({
    overall: 0,
    profitability: 0,
    liquidity: 0,
    solvency: 0,
    efficiency: 0,
    growth: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (financialData) {
      // 计算各项评分
      const calculatedScores = calculateFinancialHealthScore(financialData)
      setScores(calculatedScores)
      setLoading(false)
    }
  }, [financialData])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "优秀"
    if (score >= 60) return "良好"
    if (score >= 40) return "一般"
    return "风险"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>财务健康评分</CardTitle>
          <CardDescription>正在计算财务健康评分...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-pulse w-32 h-32 rounded-full bg-gray-200"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>财务健康评分</CardTitle>
        <CardDescription>{period}期间的财务健康状况评估</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <CircularProgress
                value={scores.overall}
                maxValue={100}
                size={160}
                strokeWidth={12}
                progressColor={scores.overall >= 80 ? "#10B981" : scores.overall >= 60 ? "#FBBF24" : "#EF4444"}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(scores.overall)}`}>
                  <AnimatedCounter value={Math.round(scores.overall)} duration={1500} />
                </span>
                <span className="text-sm text-gray-500">总体评分</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className={`text-lg font-semibold ${getScoreColor(scores.overall)}`}>
                {getScoreLabel(scores.overall)}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <Tabs defaultValue="detail" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="detail">详细评分</TabsTrigger>
                <TabsTrigger value="trend">评分趋势</TabsTrigger>
              </TabsList>

              <TabsContent value="detail" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ScoreItem label="盈利能力" score={scores.profitability} description="衡量企业创造利润的能力" />
                  <ScoreItem label="流动性" score={scores.liquidity} description="衡量企业偿还短期债务的能力" />
                  <ScoreItem label="偿债能力" score={scores.solvency} description="衡量企业偿还长期债务的能力" />
                  <ScoreItem label="运营效率" score={scores.efficiency} description="衡量企业资源利用效率" />
                </div>
              </TabsContent>

              <TabsContent value="trend">
                <div className="h-48 flex items-center justify-center text-gray-500">
                  历史评分趋势图将在收集足够的历史数据后显示
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ScoreItemProps {
  label: string
  score: number
  description: string
}

function ScoreItem({ label, score, description }: ScoreItemProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="p-3 border rounded-lg">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{label}</span>
        <span className={`font-bold ${getScoreColor(score)}`}>{Math.round(score)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
        <div
          className={`h-2 rounded-full ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )
}
