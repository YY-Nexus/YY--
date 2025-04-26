"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateImprovementSuggestions } from "@/utils/improvement-suggestion-generator"
import { LightbulbIcon, TrendingUp, DollarSign, BarChart3, Clock } from "lucide-react"

interface ImprovementSuggestionsProps {
  financialData: any
  healthScore: any
  anomalies: any[]
}

export function ImprovementSuggestions({ financialData, healthScore, anomalies }: ImprovementSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any>({
    profitability: [],
    liquidity: [],
    solvency: [],
    efficiency: [],
    growth: [],
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (financialData && healthScore && anomalies) {
      // 生成改进建议
      const generatedSuggestions = generateImprovementSuggestions(financialData, healthScore, anomalies)
      setSuggestions(generatedSuggestions)
      setLoading(false)
    }
  }, [financialData, healthScore, anomalies])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "profitability":
        return <TrendingUp className="h-5 w-5" />
      case "liquidity":
        return <DollarSign className="h-5 w-5" />
      case "solvency":
        return <BarChart3 className="h-5 w-5" />
      case "efficiency":
        return <Clock className="h-5 w-5" />
      default:
        return <LightbulbIcon className="h-5 w-5" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "profitability":
        return "盈利能力"
      case "liquidity":
        return "流动性"
      case "solvency":
        return "偿债能力"
      case "efficiency":
        return "运营效率"
      case "growth":
        return "增长潜力"
      default:
        return category
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>改进建议</CardTitle>
          <CardDescription>正在生成财务改进建议...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 获取所有类别中的建议总数
  const totalSuggestions = Object.values(suggestions).reduce(
    (total, categorySuggestions: any[]) => total + categorySuggestions.length,
    0,
  )

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
          <span>财务改进建议</span>
        </CardTitle>
        <CardDescription>基于财务健康评分和异常检测结果生成的改进建议</CardDescription>
      </CardHeader>
      <CardContent>
        {totalSuggestions === 0 ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">财务状况良好</h3>
            <p className="mt-2 text-sm text-gray-500">当前财务状况良好，无需特别改进建议</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="profitability">盈利能力</TabsTrigger>
              <TabsTrigger value="liquidity">流动性</TabsTrigger>
              <TabsTrigger value="solvency">偿债能力</TabsTrigger>
              <TabsTrigger value="efficiency">运营效率</TabsTrigger>
              <TabsTrigger value="growth">增长潜力</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-6">
                {Object.entries(suggestions).map(
                  ([category, categorySuggestions]: [string, any[]]) =>
                    categorySuggestions.length > 0 && (
                      <div key={category} className="space-y-3">
                        <h3 className="text-md font-medium flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <span>{getCategoryLabel(category)}</span>
                        </h3>
                        <div className="space-y-3 pl-7">
                          {categorySuggestions.map((suggestion, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-gray-50">
                              <div className="font-medium text-sm">{suggestion.title}</div>
                              <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                              {suggestion.actions && (
                                <div className="mt-2">
                                  <div className="text-xs font-medium text-gray-500 mb-1">建议行动:</div>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {suggestion.actions.map((action: string, actionIndex: number) => (
                                      <li key={actionIndex}>{action}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                )}
              </div>
            </TabsContent>

            {Object.entries(suggestions).map(([category, categorySuggestions]: [string, any[]]) => (
              <TabsContent key={category} value={category} className="mt-4">
                {categorySuggestions.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">该类别暂无改进建议</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categorySuggestions.map((suggestion, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <div className="font-medium">{suggestion.title}</div>
                        <p className="text-sm text-gray-600 mt-2">{suggestion.description}</p>
                        {suggestion.actions && (
                          <div className="mt-3">
                            <div className="text-xs font-medium text-gray-500 mb-1">建议行动:</div>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {suggestion.actions.map((action: string, actionIndex: number) => (
                                <li key={actionIndex}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
