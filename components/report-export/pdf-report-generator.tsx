"use client"

import type React from "react"
import { useState } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, FileDown, Settings, FileType } from "lucide-react"
import { cn } from "@/lib/utils"

interface PDFReportGeneratorProps {
  reportTitle?: string
  contentRef: React.RefObject<HTMLDivElement>
  className?: string
  onExportStart?: () => void
  onExportComplete?: (url: string) => void
  onExportError?: (error: Error) => void
}

export function PDFReportGenerator({
  reportTitle = "财务报表",
  contentRef,
  className,
  onExportStart,
  onExportComplete,
  onExportError,
}: PDFReportGeneratorProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const [paperSize, setPaperSize] = useState<"a4" | "letter" | "legal">("a4")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeTables, setIncludeTables] = useState(true)
  const [includeInsights, setIncludeInsights] = useState(true)
  const [quality, setQuality] = useState<"draft" | "normal" | "high">("normal")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filename, setFilename] = useState(
    reportTitle.replace(/\s+/g, "_").toLowerCase() + "_" + new Date().toISOString().split("T")[0],
  )

  const qualitySettings = {
    draft: { scale: 1, quality: 0.7 },
    normal: { scale: 2, quality: 0.9 },
    high: { scale: 3, quality: 1.0 },
  }

  const paperSizes = {
    a4: { width: 210, height: 297 },
    letter: { width: 215.9, height: 279.4 },
    legal: { width: 215.9, height: 355.6 },
  }

  const exportToPDF = async () => {
    if (!contentRef.current) return

    try {
      setIsExporting(true)
      onExportStart?.()

      // 准备PDF文档
      const settings = qualitySettings[quality]
      const size = paperSizes[paperSize]
      const doc = new jsPDF({
        orientation,
        unit: "mm",
        format: paperSize,
      })

      // 添加报表标题
      doc.setFontSize(18)
      doc.text(reportTitle, 14, 22)
      doc.setFontSize(10)
      doc.text(`生成日期: ${new Date().toLocaleDateString("zh-CN")}`, 14, 30)
      doc.line(14, 32, size.width - 14, 32)

      // 过滤要导出的内容
      const contentElements = contentRef.current.children || []
      const elementsToExport: HTMLElement[] = []

      for (let i = 0; i < contentElements.length; i++) {
        const element = contentElements[i] as HTMLElement
        if (!element) continue // 跳过不存在的元素

        const isChart = element.classList?.contains("chart-container")
        const isTable = element.classList?.contains("table-container")
        const isInsight = element.classList?.contains("insight-container")

        if (
          (isChart && includeCharts) ||
          (isTable && includeTables) ||
          (isInsight && includeInsights) ||
          (!isChart && !isTable && !isInsight)
        ) {
          elementsToExport.push(element)
        }
      }

      // 逐个渲染元素到PDF
      let yOffset = 40 // 标题后的起始位置

      for (let i = 0; i < elementsToExport.length; i++) {
        const element = elementsToExport[i]

        // 使用html2canvas捕获元素
        const canvas = await html2canvas(element, {
          scale: settings.scale,
          useCORS: true,
          logging: false,
          allowTaint: true,
        })

        // 计算在PDF中的尺寸
        const imgWidth = size.width - 28 // 左右各留14mm边距
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // 检查是否需要新页
        if (yOffset + imgHeight > size.height - 20) {
          doc.addPage()
          yOffset = 20 // 新页面的起始位置
        }

        // 将canvas转为图片并添加到PDF
        const imgData = canvas.toDataURL("image/jpeg", settings.quality)
        doc.addImage(imgData, "JPEG", 14, yOffset, imgWidth, imgHeight)

        // 更新垂直位置
        yOffset += imgHeight + 10 // 元素间距10mm
      }

      // 添加页脚
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(`第 ${i} 页，共 ${pageCount} 页 | ${reportTitle}`, size.width / 2, size.height - 10, {
          align: "center",
        })
      }

      // 保存PDF
      const pdfOutput = doc.output("dataurlstring")
      doc.save(`${filename}.pdf`)

      onExportComplete?.(pdfOutput)
      setIsExporting(false)
    } catch (error) {
      console.error("PDF导出错误:", error)
      onExportError?.(error as Error)
      setIsExporting(false)
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileType className="mr-2 h-5 w-5" />
          报表导出
        </CardTitle>
        <CardDescription>将当前财务分析导出为高质量PDF报表</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">基本设置</TabsTrigger>
            <TabsTrigger value="advanced" onClick={() => setShowAdvanced(true)}>
              高级设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filename">文件名称</Label>
                  <Input
                    id="filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="报表文件名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paperSize">纸张大小</Label>
                  <Select value={paperSize} onValueChange={(value) => setPaperSize(value as any)}>
                    <SelectTrigger id="paperSize">
                      <SelectValue placeholder="选择纸张大小" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orientation">页面方向</Label>
                  <Select value={orientation} onValueChange={(value) => setOrientation(value as any)}>
                    <SelectTrigger id="orientation">
                      <SelectValue placeholder="选择页面方向" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">纵向</SelectItem>
                      <SelectItem value="landscape">横向</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quality">输出质量</Label>
                  <Select value={quality} onValueChange={(value) => setQuality(value as any)}>
                    <SelectTrigger id="quality">
                      <SelectValue placeholder="选择输出质量" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">草稿 (较小文件)</SelectItem>
                      <SelectItem value="normal">标准</SelectItem>
                      <SelectItem value="high">高质量 (较大文件)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="includeCharts">包含图表</Label>
                  <p className="text-sm text-muted-foreground">在报表中包含所有图表可视化</p>
                </div>
                <Switch id="includeCharts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="includeTables">包含数据表格</Label>
                  <p className="text-sm text-muted-foreground">在报表中包含详细数据表格</p>
                </div>
                <Switch id="includeTables" checked={includeTables} onCheckedChange={setIncludeTables} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="includeInsights">包含分析洞察</Label>
                  <p className="text-sm text-muted-foreground">在报表中包含自动生成的分析洞察</p>
                </div>
                <Switch id="includeInsights" checked={includeInsights} onCheckedChange={setIncludeInsights} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
          <Settings className="mr-2 h-4 w-4" />
          {showAdvanced ? "隐藏高级设置" : "显示高级设置"}
        </Button>
        <Button onClick={exportToPDF} disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              正在生成PDF...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              导出PDF报表
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
