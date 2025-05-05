"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Download, Filter, ThumbsUp, ThumbsDown } from "lucide-react"
import { useState } from "react"

interface Recommendation {
  id: string
  title: string
  description: string
  impact: string
  effort: string
  priority: number
}

interface RecommendationsProps {
  title: string
  description?: string
  recommendations: Recommendation[]
  scenario: string
  className?: string
  onImplement?: (id: string) => void
  onDismiss?: (id: string) => void
}

export function Recommendations({
  title,
  description,
  recommendations,
  scenario,
  className = "",
  onImplement,
  onDismiss,
}: RecommendationsProps) {
  const [activeTab, setActiveTab] = useState("priority")
  const [filter, setFilter] = useState<string | null>(null)

  // 根据标签过滤推荐
  const filteredRecommendations = filter
    ? recommendations.filter((rec) => rec.impact === filter || rec.effort === filter)
    : recommendations

  // 根据标签排序推荐
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    if (activeTab === "priority") {
      return a.priority - b.priority
    } else if (activeTab === "impact") {
      const impactOrder = { 高: 0, 中: 1, 低: 2 }
      return impactOrder[a.impact as keyof typeof impactOrder] - impactOrder[b.impact as keyof typeof impactOrder]
    } else if (activeTab === "effort") {
      const effortOrder = { 低: 0, 中: 1, 高: 2 }
      return effortOrder[a.effort as keyof typeof effortOrder] - effortOrder[b.effort as keyof typeof effortOrder]
    }
    return 0
  })

  // 获取场景名称
  const getScenarioName = (scenario: string) => {
    const scenarioNames: Record<string, string> = {
      retention: "人才保留",
      performance: "绩效管理",
      recruitment: "招聘优化",
      compensation: "薪酬管理",
      workforce: "人力规划",
      learning: "学习发展",
    }
    return scenarioNames[scenario] || scenario
  }

  // 获取影响力标签颜色
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "高":
        return "bg-red-100 text-red-800"
      case "中":
        return "bg-yellow-100 text-yellow-800"
      case "低":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取工作量标签颜色
  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "高":
        return "bg-red-100 text-red-800"
      case "中":
        return "bg-yellow-100 text-yellow-800"
      case "低":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {getScenarioName(scenario)}
          </Badge>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="priority" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="priority">优先级</TabsTrigger>
              <TabsTrigger value="impact">影响力</TabsTrigger>
              <TabsTrigger value="effort">工作量</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${filter ? "bg-muted" : ""}`}
                onClick={() => setFilter(filter ? null : "高")}
              >
                <Filter className="h-4 w-4 mr-1" />
                筛选
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              {sortedRecommendations.length > 0 ? (
                sortedRecommendations.map((recommendation, index) => (
                  <Card key={recommendation.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="rounded-full p-2 h-fit bg-green-100 text-green-800">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium">{recommendation.title}</h4>
                            <Badge variant="outline" className={getImpactColor(recommendation.impact)}>
                              影响: {recommendation.impact}
                            </Badge>
                            <Badge variant="outline" className={getEffortColor(recommendation.effort)}>
                              工作量: {recommendation.effort}
                            </Badge>
                            <Badge variant="outline">优先级: {recommendation.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{recommendation.description}</p>

                          {(onImplement || onDismiss) && (
                            <div className="flex gap-2 mt-2">
                              {onImplement && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => onImplement(recommendation.id)}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  采纳
                                </Button>
                              )}
                              {onDismiss && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => onDismiss(recommendation.id)}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  忽略
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">没有找到相关推荐</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <span>共 {recommendations.length} 条推荐</span>
          <Button variant="ghost" size="sm" className="h-auto p-0">
            <Download className="h-3 w-3 mr-1" />
            导出推荐报告
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
