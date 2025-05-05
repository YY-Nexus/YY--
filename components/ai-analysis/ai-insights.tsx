"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, HelpCircle, TrendingDown, TrendingUp, RefreshCw, Download } from "lucide-react"
import type { AnalysisResult } from "@/lib/ai-engine"

interface AIInsightsProps {
  title: string
  description?: string
  insights: AnalysisResult[]
  onRefresh?: () => void
  className?: string
}

export function AIInsights({ title, description, insights, onRefresh, className = "" }: AIInsightsProps) {
  const [activeTab, setActiveTab] = useState("all")

  // 根据类型过滤洞察
  const filteredInsights = activeTab === "all" ? insights : insights.filter((insight) => insight.type === activeTab)

  // 获取洞察类型的中文名称
  const getTypeName = (type: string) => {
    const typeNames: Record<string, string> = {
      trend: "趋势分析",
      anomaly: "异常检测",
      correlation: "相关性分析",
      prediction: "预测分析",
      recommendation: "推荐分析",
      segmentation: "分群分析",
      all: "全部洞察",
    }
    return typeNames[type] || type
  }

  // 获取洞察类型的图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="h-5 w-5" />
      case "anomaly":
        return <AlertTriangle className="h-5 w-5" />
      case "prediction":
        return <TrendingUp className="h-5 w-5" />
      case "recommendation":
        return <CheckCircle className="h-5 w-5" />
      case "correlation":
        return <TrendingDown className="h-5 w-5" />
      case "segmentation":
        return <HelpCircle className="h-5 w-5" />
      default:
        return <HelpCircle className="h-5 w-5" />
    }
  }

  // 获取置信度标签颜色
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800"
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  // 格式化置信度为百分比
  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`
  }

  // 获取洞察类型的背景颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case "trend":
        return "bg-blue-100 text-blue-800"
      case "anomaly":
        return "bg-yellow-100 text-yellow-800"
      case "prediction":
        return "bg-purple-100 text-purple-800"
      case "recommendation":
        return "bg-green-100 text-green-800"
      case "correlation":
        return "bg-indigo-100 text-indigo-800"
      case "segmentation":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新分析
            </Button>
          )}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="trend">趋势</TabsTrigger>
            <TabsTrigger value="anomaly">异常</TabsTrigger>
            <TabsTrigger value="prediction">预测</TabsTrigger>
            <TabsTrigger value="recommendation">建议</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              {filteredInsights.length > 0 ? (
                filteredInsights.map((insight, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className={`rounded-full p-2 h-fit ${getTypeColor(insight.type)}`}>
                          {getTypeIcon(insight.type)}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={getTypeColor(insight.type)}>
                              {getTypeName(insight.type)}
                            </Badge>
                            <Badge variant="outline" className={getConfidenceColor(insight.confidence)}>
                              置信度: {formatConfidence(insight.confidence)}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(insight.timestamp).toLocaleString("zh-CN")}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {insight.insights.map((text, i) => (
                              <p key={i} className="text-sm">
                                {text}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">没有找到相关洞察</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <span>共 {insights.length} 条洞察</span>
          <Button variant="ghost" size="sm" className="h-auto p-0">
            <Download className="h-3 w-3 mr-1" />
            导出分析报告
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
