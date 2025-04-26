"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, FileDown, Settings, Presentation } from "lucide-react"
import { cn } from "@/lib/utils"
import html2canvas from "html2canvas"
import pptxgen from "pptxgenjs"

interface PPTReportGeneratorProps {
  reportTitle?: string
  contentRef: React.RefObject<HTMLDivElement>
  className?: string
  onExportStart?: () => void
  onExportComplete?: () => void
  onExportError?: (error: Error) => void
}

export function PPTReportGenerator({
  reportTitle = "财务报表",
  contentRef,
  className,
  onExportStart,
  onExportComplete,
  onExportError,
}: PPTReportGeneratorProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [slideSize, setSlideSize] = useState<"16x9" | "4x3" | "widescreen">("16x9")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeTables, setIncludeTables] = useState(true)
  const [includeInsights, setIncludeInsights] = useState(true)
  const [includeTitle, setIncludeTitle] = useState(true)
  const [includeFooter, setIncludeFooter] = useState(true)
  const [quality, setQuality] = useState<"draft" | "normal" | "high">("normal")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filename, setFilename] = useState(
    reportTitle.replace(/\s+/g, "_").toLowerCase() + "_" + new Date().toISOString().split("T")[0],
  )
  const [template, setTemplate] = useState<"default" | "corporate" | "minimal">("default")

  const qualitySettings = {
    draft: { scale: 1, quality: 0.7 },
    normal: { scale: 2, quality: 0.9 },
    high: { scale: 3, quality: 1.0 },
  }

  const templateSettings = {
    default: {
      background: "#ffffff",
      titleColor: "#333333",
      textColor: "#666666",
      accentColor: "#4472C4",
    },
    corporate: {
      background: "#f5f5f5",
      titleColor: "#003366",
      textColor: "#333333",
      accentColor: "#0066cc",
    },
    minimal: {
      background: "#ffffff",
      titleColor: "#000000",
      textColor: "#333333",
      accentColor: "#999999",
    },
  }

  const exportToPPT = async () => {
    if (!contentRef.current) return

    try {
      setIsExporting(true)
      onExportStart?.()

      // 创建PPT实例
      const pptx = new pptxgen()

      // 设置幻灯片大小
      if (slideSize === "16x9") pptx.layout = "LAYOUT_16x9"
      else if (slideSize === "4x3") pptx.layout = "LAYOUT_4x3"
      else pptx.layout = "LAYOUT_WIDE"

      // 获取模板设置
      const theme = templateSettings[template]

      // 创建封面幻灯片
      if (includeTitle) {
        const titleSlide = pptx.addSlide()

        // 设置背景
        titleSlide.background = { color: theme.background }

        // 添加标题
        titleSlide.addText(reportTitle, {
          x: "10%",
          y: "40%",
          w: "80%",
          h: "15%",
          fontSize: 36,
          color: theme.titleColor,
          bold: true,
          align: "center",
        })

        // 添加副标题
        titleSlide.addText(`生成日期: ${new Date().toLocaleDateString("zh-CN")}`, {
          x: "10%",
          y: "55%",
          w: "80%",
          h: "10%",
          fontSize: 18,
          color: theme.textColor,
          align: "center",
        })

        // 添加页脚
        if (includeFooter) {
          titleSlide.addText("言语「逸品」数字驾驶舱", {
            x: "5%",
            y: "90%",
            w: "90%",
            h: "5%",
            fontSize: 10,
            color: theme.accentColor,
            align: "center",
          })
        }
      }

      // 过滤要导出的内容
      const contentElements = contentRef.current.children
      const elementsToExport: HTMLElement[] = []

      for (let i = 0; i < contentElements.length; i++) {
        const element = contentElements[i] as HTMLElement
        const isChart = element.classList.contains("chart-container")
        const isTable = element.classList.contains("table-container")
        const isInsight = element.classList.contains("insight-container")

        if (
          (isChart && includeCharts) ||
          (isTable && includeTables) ||
          (isInsight && includeInsights) ||
          (!isChart && !isTable && !isInsight)
        ) {
          elementsToExport.push(element)
        }
      }

      // 设置质量
      const settings = qualitySettings[quality]

      // 为每个元素创建幻灯片
      for (let i = 0; i < elementsToExport.length; i++) {
        const element = elementsToExport[i]
        const slide = pptx.addSlide()

        // 设置背景
        slide.background = { color: theme.background }

        // 获取元素标题
        let title = ""
        const titleElement = element.querySelector("h2, h3, .card-title")
        if (titleElement) {
          title = titleElement.textContent || ""
        }

        // 添加标题
        if (title) {
          slide.addText(title, {
            x: "5%",
            y: "5%",
            w: "90%",
            h: "10%",
            fontSize: 24,
            color: theme.titleColor,
            bold: true,
          })
        }

        // 使用html2canvas捕获元素
        const canvas = await html2canvas(element, {
          scale: settings.scale,
          useCORS: true,
          logging: false,
          allowTaint: true,
        })

        // 将canvas转为图片
        const imgData = canvas.toDataURL("image/jpeg", settings.quality)

        // 添加图片到幻灯片
        slide.addImage({
          data: imgData,
          x: "10%",
          y: title ? "20%" : "10%",
          w: "80%",
          h: title ? "65%" : "75%",
        })

        // 添加页脚
        if (includeFooter) {
          slide.addText(`${reportTitle} | 第 ${i + 1} 页`, {
            x: "5%",
            y: "95%",
            w: "90%",
            h: "5%",
            fontSize: 10,
            color: theme.accentColor,
            align: "center",
          })
        }
      }

      // 保存PPT
      pptx.writeFile({ fileName: `${filename}.pptx` })

      onExportComplete?.()
      setIsExporting(false)
    } catch (error) {
      console.error("PPT导出错误:", error)
      onExportError?.(error as Error)
      setIsExporting(false)
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Presentation className="mr-2 h-5 w-5" />
          演示文稿导出
        </CardTitle>
        <CardDescription>将当前财务分析导出为PowerPoint演示文稿</CardDescription>
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
                  <Label htmlFor="ppt-filename">文件名称</Label>
                  <Input
                    id="ppt-filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="演示文稿文件名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slideSize">幻灯片大小</Label>
                  <Select value={slideSize} onValueChange={(value) => setSlideSize(value as any)}>
                    <SelectTrigger id="slideSize">
                      <SelectValue placeholder="选择幻灯片大小" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16x9">宽屏 (16:9)</SelectItem>
                      <SelectItem value="4x3">标准 (4:3)</SelectItem>
                      <SelectItem value="widescreen">宽屏增强</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template">演示模板</Label>
                  <Select value={template} onValueChange={(value) => setTemplate(value as any)}>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="选择演示模板" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">默认</SelectItem>
                      <SelectItem value="corporate">企业风格</SelectItem>
                      <SelectItem value="minimal">简约风格</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ppt-quality">输出质量</Label>
                  <Select value={quality} onValueChange={(value) => setQuality(value as any)}>
                    <SelectTrigger id="ppt-quality">
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
                  <Label htmlFor="includeTitle">包含封面</Label>
                  <p className="text-sm text-muted-foreground">添加带有报表标题的封面幻灯片</p>
                </div>
                <Switch id="includeTitle" checked={includeTitle} onCheckedChange={setIncludeTitle} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="includeFooter">包含页脚</Label>
                  <p className="text-sm text-muted-foreground">在每张幻灯片添加页脚信息</p>
                </div>
                <Switch id="includeFooter" checked={includeFooter} onCheckedChange={setIncludeFooter} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ppt-includeCharts">包含图表</Label>
                  <p className="text-sm text-muted-foreground">在演示文稿中包含所有图表可视化</p>
                </div>
                <Switch id="ppt-includeCharts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ppt-includeTables">包含数据表格</Label>
                  <p className="text-sm text-muted-foreground">在演示文稿中包含详细数据表格</p>
                </div>
                <Switch id="ppt-includeTables" checked={includeTables} onCheckedChange={setIncludeTables} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ppt-includeInsights">包含分析洞察</Label>
                  <p className="text-sm text-muted-foreground">在演示文稿中包含自动生成的分析洞察</p>
                </div>
                <Switch id="ppt-includeInsights" checked={includeInsights} onCheckedChange={setIncludeInsights} />
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
        <Button onClick={exportToPPT} disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              正在生成PPT...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              导出PowerPoint
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
