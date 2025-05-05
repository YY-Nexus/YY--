"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Download, FileText, Share2, Printer, ChevronRight } from "lucide-react"
import type { Report, ReportSection } from "@/lib/report-generator"
import { useState } from "react"

interface AnalysisReportProps {
  report: Report
  className?: string
}

export function AnalysisReport({ report, className = "" }: AnalysisReportProps) {
  const [activeTab, setActiveTab] = useState("summary")

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  // 渲染可视化内容
  const renderVisualization = (section: ReportSection) => {
    if (!section.visualizationType || !section.visualizationData) {
      return (
        <div className="bg-muted h-64 rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">无可视化数据</p>
        </div>
      )
    }

    return (
      <div className="bg-muted h-64 rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">{section.visualizationType} 可视化将在这里显示</p>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{report.title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              分享
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" />
              打印
            </Button>
            <Button variant="default" size="sm">
              <Download className="h-4 w-4 mr-1" />
              导出
            </Button>
          </div>
        </div>
        <CardDescription>
          分析周期: {formatDate(report.metadata.timeRange.start)} 至 {formatDate(report.metadata.timeRange.end)}·
          生成时间: {formatDate(report.generatedAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">摘要</TabsTrigger>
            <TabsTrigger value="details">详细分析</TabsTrigger>
            <TabsTrigger value="recommendations">建议</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-0">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-2">报告摘要</h3>
                  <p className="text-muted-foreground">{report.summary}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.sections.map((section, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h3 className="text-md font-medium mb-2 flex items-center">
                        {section.title}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{section.content}</p>
                      <Button variant="ghost" size="sm" className="mt-2 h-8" onClick={() => setActiveTab("details")}>
                        查看详情
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            <Accordion type="single" collapsible className="space-y-4">
              {report.sections.map((section, index) => (
                <AccordionItem key={index} value={`section-${index}`} className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4 py-2 hover:no-underline">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{section.content}</p>

                      {renderVisualization(section)}

                      {section.insights.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <h4 className="text-sm font-medium">主要洞察</h4>
                          <ul className="space-y-1">
                            {section.insights.map((insight, i) => (
                              <li key={i} className="text-sm flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {section.recommendations && section.recommendations.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <h4 className="text-sm font-medium">相关建议</h4>
                          <ul className="space-y-1">
                            {section.recommendations.map((recommendation, i) => (
                              <li key={i} className="text-sm flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-0">
            <div className="space-y-4">
              {report.sections
                .filter((section) => section.recommendations && section.recommendations.length > 0)
                .map((section, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{section.title}相关建议</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.recommendations?.map((recommendation, i) => (
                          <li key={i} className="flex items-start">
                            <Badge className="mt-0.5 mr-2 bg-green-100 text-green-800">{i + 1}</Badge>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <span>
            数据点: {report.metadata.dataPoints} · 版本: {report.metadata.version}
          </span>
          <span>AI分析报告 - 仅供参考</span>
        </div>
      </CardFooter>
    </Card>
  )
}
