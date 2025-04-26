"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PDFReportGenerator } from "./pdf-report-generator"
import { PPTReportGenerator } from "./ppt-report-generator"
import { ReportTemplateManager } from "./report-template-manager"
import { FileDown, FileText, Presentation, FileCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ReportExportPanelProps {
  reportTitle?: string
  contentRef: React.RefObject<HTMLDivElement>
  className?: string
}

export function ReportExportPanel({ reportTitle = "财务报表", contentRef, className }: ReportExportPanelProps) {
  const [activeTab, setActiveTab] = useState("pdf")
  const [lastExportedUrl, setLastExportedUrl] = useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const handleExportStart = () => {
    setExportSuccess(false)
    setExportError(null)
    setLastExportedUrl(null)
  }

  const handleExportComplete = (url?: string) => {
    setExportSuccess(true)
    if (url) setLastExportedUrl(url)

    // 5秒后自动清除成功消息
    setTimeout(() => {
      setExportSuccess(false)
    }, 5000)
  }

  const handleExportError = (error: Error) => {
    setExportError(error.message || "导出过程中发生错误")

    // 5秒后自动清除错误消息
    setTimeout(() => {
      setExportError(null)
    }, 5000)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileDown className="mr-2 h-5 w-5" />
          报表导出中心
        </CardTitle>
        <CardDescription>将财务分析导出为多种格式，方便分享和演示</CardDescription>
      </CardHeader>
      <CardContent>
        {exportSuccess && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <FileText className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">导出成功</AlertTitle>
            <AlertDescription className="text-green-700">
              报表已成功导出。
              {lastExportedUrl && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-green-700 underline"
                  onClick={() => window.open(lastExportedUrl, "_blank")}
                >
                  点击查看
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {exportError && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <FileText className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-600">导出失败</AlertTitle>
            <AlertDescription className="text-red-700">{exportError}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="pdf" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-3">
            <TabsTrigger value="pdf" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              PDF报表
            </TabsTrigger>
            <TabsTrigger value="ppt" className="flex items-center">
              <Presentation className="mr-2 h-4 w-4" />
              PowerPoint
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center">
              <FileCode className="mr-2 h-4 w-4" />
              模板管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdf">
            <PDFReportGenerator
              reportTitle={reportTitle}
              contentRef={contentRef}
              onExportStart={handleExportStart}
              onExportComplete={handleExportComplete}
              onExportError={handleExportError}
            />
          </TabsContent>

          <TabsContent value="ppt">
            <PPTReportGenerator
              reportTitle={reportTitle}
              contentRef={contentRef}
              onExportStart={handleExportStart}
              onExportComplete={() => handleExportComplete()}
              onExportError={handleExportError}
            />
          </TabsContent>

          <TabsContent value="templates">
            <ReportTemplateManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
