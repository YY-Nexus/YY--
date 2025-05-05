"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Sparkles, MessageSquare, History, Loader2 } from "lucide-react"
import { NLQueryProcessor, type QueryResult } from "@/lib/nl-query-processor"

interface NLQueryProps {
  title?: string
  description?: string
  className?: string
  suggestedQueries?: string[]
}

export function NLQuery({
  title = "智能数据分析",
  description = "用自然语言提问，获取数据洞察",
  className = "",
  suggestedQueries = [
    "过去3个月的员工流失率趋势如何？",
    "哪个部门的绩效最高？",
    "预测未来6个月的招聘需求",
    "如何提高员工保留率？",
    "有哪些异常的薪酬数据？",
  ],
}: NLQueryProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [activeTab, setActiveTab] = useState("query")
  const [recentQueries, setRecentQueries] = useState<string[]>([])

  // 处理查询
  const handleQuery = async (queryText: string = query) => {
    if (!queryText.trim()) return

    setIsLoading(true)
    setQuery(queryText)

    try {
      // 调用自然语言处理器
      const queryResult = await NLQueryProcessor.processQuery(queryText)
      setResult(queryResult)

      // 添加到最近查询
      if (!recentQueries.includes(queryText)) {
        setRecentQueries((prev) => [queryText, ...prev].slice(0, 10))
      }

      // 切换到结果标签
      setActiveTab("result")
    } catch (error) {
      console.error("查询处理失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理建议查询点击
  const handleSuggestedQuery = (query: string) => {
    setQuery(query)
    handleQuery(query)
  }

  // 处理后续问题点击
  const handleFollowupQuestion = (question: string) => {
    handleQuery(question)
  }

  // 渲染查询结果
  const renderQueryResult = () => {
    if (!result) return null

    return (
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-medium text-sm">您的问题</p>
          <p>{query}</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-sm">回答</p>
          <div className="bg-card border rounded-lg p-4">
            {result.answer.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-2">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {result.data && (
          <div className="space-y-2">
            <p className="font-medium text-sm">数据可视化</p>
            <div className="bg-card border rounded-lg p-4 h-64 flex items-center justify-center">
              <p className="text-muted-foreground">数据可视化将在这里显示</p>
            </div>
          </div>
        )}

        {result.followupQuestions && result.followupQuestions.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium text-sm">您可能还想了解</p>
            <div className="flex flex-wrap gap-2">
              {result.followupQuestions.map((question, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => handleFollowupQuestion(question)}>
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="输入您的问题，例如：过去3个月的员工流失率趋势如何？"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuery()}
            className="flex-1"
          />
          <Button onClick={() => handleQuery()} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="query" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              建议问题
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              历史记录
            </TabsTrigger>
            <TabsTrigger value="result" className="flex items-center gap-1" disabled={!result}>
              <Sparkles className="h-4 w-4" />
              分析结果
            </TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQueries.map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => handleSuggestedQuery(q)}
                >
                  <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-left">{q}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            {recentQueries.length > 0 ? (
              <div className="space-y-2">
                {recentQueries.map((q, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto py-2"
                    onClick={() => handleSuggestedQuery(q)}
                  >
                    <History className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left truncate">{q}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">暂无历史记录</div>
            )}
          </TabsContent>

          <TabsContent value="result" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">正在分析数据...</span>
              </div>
            ) : (
              renderQueryResult()
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        提示：尝试询问特定指标的趋势、部门对比或未来预测
      </CardFooter>
    </Card>
  )
}
