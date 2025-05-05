"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Save, Download, Upload, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 模拟数据
const workflows = [
  {
    id: 1,
    name: "员工入职流程",
    category: "人力资源",
    status: "active",
    steps: 8,
    lastModified: "2023-05-15",
    createdBy: "张三",
  },
  {
    id: 2,
    name: "费用报销审批",
    category: "财务",
    status: "active",
    steps: 5,
    lastModified: "2023-04-20",
    createdBy: "李四",
  },
  {
    id: 3,
    name: "绩效评估流程",
    category: "人力资源",
    status: "inactive",
    steps: 6,
    lastModified: "2023-03-10",
    createdBy: "王五",
  },
  {
    id: 4,
    name: "采购申请审批",
    category: "采购",
    status: "active",
    steps: 7,
    lastModified: "2023-06-05",
    createdBy: "赵六",
  },
  {
    id: 5,
    name: "IT设备申请",
    category: "IT",
    status: "active",
    steps: 4,
    lastModified: "2023-05-25",
    createdBy: "张三",
  },
  {
    id: 6,
    name: "休假申请流程",
    category: "人力资源",
    status: "active",
    steps: 3,
    lastModified: "2023-04-15",
    createdBy: "李四",
  },
]

export default function WorkflowManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("list")
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const { toast } = useToast()

  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    workflow.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateWorkflow = () => {
    setActiveTab("designer")
    setSelectedWorkflow({
      id: null,
      name: "新工作流",
      category: "",
      status: "draft",
      steps: 0,
      nodes: [],
      connections: []
    })
  }

  const handleEditWorkflow = (workflow: any) => {
    setActiveTab("designer")
    setSelectedWorkflow({
      ...workflow,
      nodes: [
        { id: 'start', type: 'start', position: { x: 100, y: 100 }, data: { label: '开始' } },
        { id: 'form1', type: 'form', position: { x: 100, y: 200 }, data: { label: '表单填写' } },
        { id: 'approval1', type: 'approval', position: { x: 100, y: 300 }, data: { label: '主管审批' } },
        { id: 'approval2', type: 'approval', position: { x: 100, y: 400 }, data: { label: '部门审批' } },
        { id: 'end', type: 'end', position: { x: 100, y: 500 }, data: { label: '结束' } },
      ],
      connections: [
        { id: 'e1-2', source: 'start', target: 'form1' },
        { id: 'e2-3', source: 'form1', target: 'approval1' },
        { id: 'e3-4', source: 'approval1', target: 'approval2' },
        { id: 'e4-5', source: 'approval2', target: 'end' },
      ]
    })
  }

  const handleSaveWorkflow = () => {
    toast({
      title: "工作流保存成功",
      description: "工作流已成功保存",
    })
  }

  const handleDeleteWorkflow = (id: number) => {
    toast({
      title: "工作流删除成功",
      description: "工作流已从系统中移除",
    })
  }

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    toast({
      title: `工作流${newStatus === 'active' ? '启用' : '停用'}成功`,
      description: `工作流状态已更改为${newStatus === 'active' ? '启用' : '停用'}`,
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">工作流引擎</h1>
          <p className="text-muted-foreground mt-2">设计、管理和监控业务流程</p>
        </div>
        {activeTab === "list" ? (
          <Button onClick={handleCreateWorkflow}>
            <PlusCircle className="mr-2 h-4 w-4" />
            创建工作流
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab("list")}>
              返回列表
            </Button>
            <Button onClick={handleSaveWorkflow}>
              <Save className="mr-2 h-4 w-4" />
              保存工作流
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
          <TabsTrigger value="list">工作流列表</TabsTrigger>
          <TabsTrigger value="designer">工作流设计器</TabsTrigger>
          <TabsTrigger value="monitor">运行监控</TabsTrigger>
          <TabsTrigger value="templates">工作流模板</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索工作流名称或分类..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    导出
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    导入
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    设置
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>工作流名称</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>步骤数</TableHead>
                      <TableHead>最后修改</TableHead>
                      <TableHead>创建人</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkflows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          未找到匹配的工作流
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWorkflows.map((workflow) => (
                        <TableRow key={workflow.id}>
                          <TableCell className="font-medium">{workflow.name}</TableCell>
                          <TableCell>{workflow.category}</TableCell>
                          <TableCell>
                            <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                              {workflow.status === 'active' ? '启用' : '停用'}
                            </Badge>
                          </TableCell>
                \
