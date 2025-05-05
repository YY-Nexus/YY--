"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Report, ReportType, ReportStatus, ReportComponent, ReportFilter } from "@/lib/report/report-model"
import { ReportCanvas } from "./report-canvas"
import { ComponentPalette } from "./component-palette"
import { DataSourceSelector } from "./data-source-selector"
import { FilterBuilder } from "./filter-builder"
import { ParameterBuilder } from "./parameter-builder"
import { ReportPreview } from "./report-preview"
import { Save, Play, Settings, Share, Download, Copy } from "lucide-react"

// 报表生成器属性
interface ReportBuilderProps {
  initialReport?: Report
  onSave?: (report: Report) => void
  readOnly?: boolean
}

// 报表生成器组件
export function ReportBuilder({ initialReport, onSave, readOnly = false }: ReportBuilderProps) {
  const [activeTab, setActiveTab] = useState("design")
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportType, setReportType] = useState<ReportType>("dashboard")
  const [reportStatus, setReportStatus] = useState<ReportStatus>("draft")
  const [components, setComponents] = useState<ReportComponent[]>([])
  const [filters, setFilters] = useState<ReportFilter[]>([])
  const [dataSource, setDataSource] = useState<any>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  // 初始化报表
  useEffect(() => {
    if (initialReport) {
      setReportName(initialReport.name)
      setReportDescription(initialReport.description || "")
      setReportType(initialReport.type)
      setReportStatus(initialReport.status)
      setComponents(initialReport.config.components || [])
      setFilters(initialReport.config.filters || [])
      setDataSource(initialReport.dataSource)
    }
  }, [initialReport])

  // 添加组件
  const handleAddComponent = (component: ReportComponent) => {
    setComponents((prev) => [...prev, component])
  }

  // 更新组件
  const handleUpdateComponent = (id: string, updates: Partial<ReportComponent>) => {
    setComponents((prev) =>
      prev.map((comp) => {
        if (comp.id === id) {
          return { ...comp, ...updates }
        }
        return comp
      }),
    )
  }

  // 删除组件
  const handleDeleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== id))
  }

  // 添加过滤器
  const handleAddFilter = (filter: ReportFilter) => {
    setFilters((prev) => [...prev, filter])
  }

  // 更新过滤器
  const handleUpdateFilter = (id: string, updates: Partial<ReportFilter>) => {
    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.id === id) {
          return { ...filter, ...updates }
        }
        return filter
      }),
    )
  }

  // 删除过滤器
  const handleDeleteFilter = (id: string) => {
    setFilters((prev) => prev.filter((filter) => filter.id !== id))
  }

  // 保存报表
  const handleSave = () => {
    if (!reportName) {
      alert("请输入报表名称")
      return
    }

    if (!dataSource) {
      alert("请选择数据源")
      return
    }

    // 构建报表对象
    const report: Partial<Report> = {
      name: reportName,
      description: reportDescription,
      type: reportType,
      status: reportStatus,
      config: {
        layout: {
          type: "grid",
          config: {
            cols: 12,
            rowHeight: 50,
            gap: 10,
          },
        },
        components,
        filters,
        parameters: [],
      },
      dataSource,
    }

    if (onSave) {
      onSave(report as Report)
    }
  }

  // 导出报表
  const handleExport = (format: "pdf" | "excel" | "csv" | "html") => {
    // 实际应用中，这里应该调用API导出报表
    console.log(`导出报表为 ${format} 格式`)
  }

  // 分享报表
  const handleShare = (emails: string[], permissions: string) => {
    // 实际应用中，这里应该调用API分享报表
    console.log(`分享报表给 ${emails.join(", ")}，权限: ${permissions}`)
    setIsShareDialogOpen(false)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <div>
              <Label htmlFor="report-name">报表名称</Label>
              <Input
                id="report-name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="输入报表名称"
                className="w-64"
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="report-type">报表类型</Label>
              <Select
                value={reportType}
                onValueChange={(value) => setReportType(value as ReportType)}
                disabled={readOnly}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="选择报表类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">仪表盘</SelectItem>
                  <SelectItem value="table">表格</SelectItem>
                  <SelectItem value="chart">图表</SelectItem>
                  <SelectItem value="card">卡片</SelectItem>
                  <SelectItem value="list">列表</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            {!readOnly && (
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
            )}
            <Button variant={isPreviewMode ? "default" : "outline"} onClick={() => setIsPreviewMode(!isPreviewMode)}>
              <Play className="mr-2 h-4 w-4" />
              {isPreviewMode ? "返回编辑" : "预览"}
            </Button>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              设置
            </Button>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(true)}>
              <Share className="mr-2 h-4 w-4" />
              分享
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  导出
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>导出报表</DialogTitle>
                  <DialogDescription>选择导出格式</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <Button onClick={() => handleExport("pdf")} className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button onClick={() => handleExport("excel")} className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Excel
                  </Button>
                  <Button onClick={() => handleExport("csv")} className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    CSV
                  </Button>
                  <Button onClick={() => handleExport("html")} className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    HTML
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isPreviewMode ? (
          <ReportPreview
            report={
              {
                name: reportName,
                description: reportDescription,
                type: reportType,
                status: reportStatus,
                config: {
                  layout: {
                    type: "grid",
                    config: {
                      cols: 12,
                      rowHeight: 50,
                      gap: 10,
                    },
                  },
                  components,
                  filters,
                  parameters: [],
                },
                dataSource,
              } as Report
            }
          />
        ) : (
          <div className="flex flex-1">
            <div className="w-64 border-r p-4 bg-muted/20">
              <ComponentPalette onAddComponent={handleAddComponent} />
            </div>
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                <div className="border-b px-4">
                  <TabsList>
                    <TabsTrigger value="design">设计</TabsTrigger>
                    <TabsTrigger value="data">数据</TabsTrigger>
                    <TabsTrigger value="filters">过滤器</TabsTrigger>
                    <TabsTrigger value="parameters">参数</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="design" className="flex-1 p-4">
                  <ReportCanvas
                    components={components}
                    onUpdateComponent={handleUpdateComponent}
                    onDeleteComponent={handleDeleteComponent}
                    readOnly={readOnly}
                  />
                </TabsContent>
                <TabsContent value="data" className="flex-1 p-4">
                  <DataSourceSelector value={dataSource} onChange={setDataSource} readOnly={readOnly} />
                </TabsContent>
                <TabsContent value="filters" className="flex-1 p-4">
                  <FilterBuilder
                    filters={filters}
                    onAddFilter={handleAddFilter}
                    onUpdateFilter={handleUpdateFilter}
                    onDeleteFilter={handleDeleteFilter}
                    readOnly={readOnly}
                  />
                </TabsContent>
                <TabsContent value="parameters" className="flex-1 p-4">
                  <ParameterBuilder readOnly={readOnly} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* 设置对话框 */}
        <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>报表设置</DialogTitle>
              <DialogDescription>配置报表属性和行为</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="settings-name" className="text-right">
                  报表名称
                </Label>
                <Input
                  id="settings-name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="settings-description" className="text-right pt-2">
                  描述
                </Label>
                <Textarea
                  id="settings-description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="settings-type" className="text-right">
                  报表类型
                </Label>
                <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                  <SelectTrigger id="settings-type" className="col-span-3">
                    <SelectValue placeholder="选择报表类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">仪表盘</SelectItem>
                    <SelectItem value="table">表格</SelectItem>
                    <SelectItem value="chart">图表</SelectItem>
                    <SelectItem value="card">卡片</SelectItem>
                    <SelectItem value="list">列表</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="settings-status" className="text-right">
                  状态
                </Label>
                <Select value={reportStatus} onValueChange={(value) => setReportStatus(value as ReportStatus)}>
                  <SelectTrigger id="settings-status" className="col-span-3">
                    <SelectValue placeholder="选择报表状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="archived">已归档</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setIsSettingsDialogOpen(false)}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 分享对话框 */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>分享报表</DialogTitle>
              <DialogDescription>邀请其他人查看或编辑此报表</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="share-emails" className="text-right">
                  邮箱地址
                </Label>
                <Input id="share-emails" placeholder="输入邮箱地址，多个邮箱用逗号分隔" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="share-permission" className="text-right">
                  权限
                </Label>
                <Select defaultValue="view">
                  <SelectTrigger id="share-permission" className="col-span-3">
                    <SelectValue placeholder="选择权限" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">查看</SelectItem>
                    <SelectItem value="edit">编辑</SelectItem>
                    <SelectItem value="admin">管理</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="share-link" className="text-right">
                  分享链接
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input id="share-link" value="https://example.com/reports/share/abc123" readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigator.clipboard.writeText("https://example.com/reports/share/abc123")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={() => handleShare(["example@example.com"], "view")}>分享</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  )
}
