"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, Edit, Copy, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReportTemplate {
  id: string
  name: string
  description: string
  sections: string[]
  createdAt: string
  updatedAt: string
}

interface ReportTemplateManagerProps {
  className?: string
  onSelectTemplate?: (template: ReportTemplate) => void
}

export function ReportTemplateManager({ className, onSelectTemplate }: ReportTemplateManagerProps) {
  // 示例模板
  const defaultTemplates: ReportTemplate[] = [
    {
      id: "financial-summary",
      name: "财务摘要报告",
      description: "包含关键财务指标、趋势图表和简要分析的简洁报告",
      sections: ["财务摘要", "关键指标", "趋势分析", "建议"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "comprehensive-financial-report",
      name: "综合财务报告",
      description: "详细的财务分析报告，包含全面的财务数据、多维度分析和详细解释",
      sections: ["执行摘要", "财务状况", "利润分析", "现金流分析", "预测", "风险评估", "建议"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "executive-briefing",
      name: "管理层简报",
      description: "为高管设计的简明财务报告，聚焦关键决策点和战略建议",
      sections: ["业绩概览", "关键发现", "战略建议", "行动计划"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  const [templates, setTemplates] = useState<ReportTemplate[]>(defaultTemplates)
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<ReportTemplate>>({
    name: "",
    description: "",
    sections: [],
  })
  const [newSectionInput, setNewSectionInput] = useState("")

  const handleCreateTemplate = () => {
    setIsCreating(true)
    setNewTemplate({
      name: "",
      description: "",
      sections: [],
    })
    setNewSectionInput("")
  }

  const handleSaveNewTemplate = () => {
    if (!newTemplate.name) return

    const template: ReportTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description || "",
      sections: newTemplate.sections || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTemplates([...templates, template])
    setIsCreating(false)
    setNewTemplate({
      name: "",
      description: "",
      sections: [],
    })
  }

  const handleCancelCreate = () => {
    setIsCreating(false)
    setNewTemplate({
      name: "",
      description: "",
      sections: [],
    })
  }

  const handleEditTemplate = (template: ReportTemplate) => {
    setEditingTemplate({ ...template })
    setNewSectionInput("")
  }

  const handleSaveEdit = () => {
    if (!editingTemplate) return

    const updatedTemplates = templates.map((t) =>
      t.id === editingTemplate.id ? { ...editingTemplate, updatedAt: new Date().toISOString() } : t,
    )

    setTemplates(updatedTemplates)
    setEditingTemplate(null)
  }

  const handleCancelEdit = () => {
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
    if (editingTemplate?.id === id) {
      setEditingTemplate(null)
    }
  }

  const handleDuplicateTemplate = (template: ReportTemplate) => {
    const newTemplate: ReportTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (副本)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTemplates([...templates, newTemplate])
  }

  const handleAddSection = () => {
    if (!newSectionInput.trim()) return

    if (isCreating) {
      setNewTemplate({
        ...newTemplate,
        sections: [...(newTemplate.sections || []), newSectionInput.trim()],
      })
    } else if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        sections: [...editingTemplate.sections, newSectionInput.trim()],
      })
    }

    setNewSectionInput("")
  }

  const handleRemoveSection = (index: number) => {
    if (isCreating) {
      const sections = [...(newTemplate.sections || [])]
      sections.splice(index, 1)
      setNewTemplate({ ...newTemplate, sections })
    } else if (editingTemplate) {
      const sections = [...editingTemplate.sections]
      sections.splice(index, 1)
      setEditingTemplate({ ...editingTemplate, sections })
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>报表模板管理</CardTitle>
        <CardDescription>创建和管理自定义报表模板，以便快速生成标准化报告</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 border rounded-md">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-sm font-medium">可用模板</h3>
              <Button variant="ghost" size="sm" onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-4 space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={cn(
                      "p-3 rounded-md cursor-pointer hover:bg-muted flex justify-between items-start",
                      editingTemplate?.id === template.id && "bg-muted",
                    )}
                  >
                    <div className="space-y-1" onClick={() => onSelectTemplate?.(template)}>
                      <h4 className="text-sm font-medium">{template.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicateTemplate(template)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="md:col-span-2 border rounded-md">
            {isCreating ? (
              <div className="p-4 space-y-4">
                <h3 className="text-sm font-medium">创建新模板</h3>
                <div className="space-y-2">
                  <Label htmlFor="template-name">模板名称</Label>
                  <Input
                    id="template-name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="输入模板名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">模板描述</Label>
                  <Textarea
                    id="template-description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="输入模板描述"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>报表章节</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newSectionInput}
                      onChange={(e) => setNewSectionInput(e.target.value)}
                      placeholder="添加新章节"
                      onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
                    />
                    <Button variant="outline" onClick={handleAddSection}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {newTemplate.sections?.map((section, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <span className="text-sm">{section}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSection(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" onClick={handleCancelCreate}>
                    取消
                  </Button>
                  <Button onClick={handleSaveNewTemplate} disabled={!newTemplate.name}>
                    保存模板
                  </Button>
                </div>
              </div>
            ) : editingTemplate ? (
              <div className="p-4 space-y-4">
                <h3 className="text-sm font-medium">编辑模板</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-template-name">模板名称</Label>
                  <Input
                    id="edit-template-name"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-template-description">模板描述</Label>
                  <Textarea
                    id="edit-template-description"
                    value={editingTemplate.description}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>报表章节</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newSectionInput}
                      onChange={(e) => setNewSectionInput(e.target.value)}
                      placeholder="添加新章节"
                      onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
                    />
                    <Button variant="outline" onClick={handleAddSection}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {editingTemplate.sections.map((section, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <span className="text-sm">{section}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSection(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    取消
                  </Button>
                  <Button onClick={handleSaveEdit}>保存更改</Button>
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground">选择一个模板进行编辑或创建新模板</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
