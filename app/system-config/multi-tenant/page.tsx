"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Edit, Trash2, Search, RefreshCw, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 模拟数据
const tenants = [
  {
    id: 1,
    name: "华为科技",
    domain: "huawei.example.com",
    status: "active",
    plan: "企业版",
    usersCount: 1250,
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "腾讯科技",
    domain: "tencent.example.com",
    status: "active",
    plan: "企业版",
    usersCount: 980,
    createdAt: "2023-02-20",
  },
  {
    id: 3,
    name: "阿里巴巴",
    domain: "alibaba.example.com",
    status: "active",
    plan: "企业版",
    usersCount: 1500,
    createdAt: "2023-01-10",
  },
  {
    id: 4,
    name: "百度在线",
    domain: "baidu.example.com",
    status: "active",
    plan: "企业版",
    usersCount: 850,
    createdAt: "2023-03-05",
  },
  {
    id: 5,
    name: "小米科技",
    domain: "xiaomi.example.com",
    status: "inactive",
    plan: "标准版",
    usersCount: 320,
    createdAt: "2023-04-12",
  },
  {
    id: 6,
    name: "京东集团",
    domain: "jd.example.com",
    status: "active",
    plan: "企业版",
    usersCount: 750,
    createdAt: "2023-02-28",
  },
  {
    id: 7,
    name: "网易科技",
    domain: "netease.example.com",
    status: "active",
    plan: "标准版",
    usersCount: 420,
    createdAt: "2023-03-15",
  },
  {
    id: 8,
    name: "字节跳动",
    domain: "bytedance.example.com",
    status: "active",
    plan: "企业版",
    usersCount: 1100,
    createdAt: "2023-01-25",
  },
]

export default function MultiTenantManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTenant, setCurrentTenant] = useState<any>(null)
  const { toast } = useToast()

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateTenant = () => {
    toast({
      title: "租户创建成功",
      description: "新租户已成功添加到系统中",
    })
    setIsCreating(false)
  }

  const handleEditTenant = () => {
    toast({
      title: "租户更新成功",
      description: "租户信息已成功更新",
    })
    setIsEditing(false)
    setCurrentTenant(null)
  }

  const handleDeleteTenant = (id: number) => {
    toast({
      title: "租户删除成功",
      description: "租户已从系统中移除",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">多租户管理</h1>
          <p className="text-muted-foreground mt-2">管理系统中的所有租户、域名和配置</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          添加租户
        </Button>
      </div>

      <Tabs defaultValue="tenants" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
          <TabsTrigger value="tenants">租户列表</TabsTrigger>
          <TabsTrigger value="settings">全局设置</TabsTrigger>
          <TabsTrigger value="templates">租户模板</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索租户名称或域名..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    刷新
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    导出
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    导入
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>租户名称</TableHead>
                      <TableHead>域名</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>套餐</TableHead>
                      <TableHead>用户数</TableHead>
                      <TableHead>创建日期</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          未找到匹配的租户
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell className="font-medium">{tenant.name}</TableCell>
                          <TableCell>{tenant.domain}</TableCell>
                          <TableCell>
                            <Badge variant={tenant.status === "active" ? "default" : "secondary"}>
                              {tenant.status === "active" ? "活跃" : "停用"}
                            </Badge>
                          </TableCell>
                          <TableCell>{tenant.plan}</TableCell>
                          <TableCell>{tenant.usersCount}</TableCell>
                          <TableCell>{tenant.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentTenant(tenant)
                                  setIsEditing(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteTenant(tenant.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>全局租户设置</CardTitle>
              <CardDescription>配置适用于所有租户的全局设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">允许租户自定义主题</h4>
                    <p className="text-sm text-muted-foreground">允许租户自定义其界面主题和品牌</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">允许租户自定义工作流</h4>
                    <p className="text-sm text-muted-foreground">允许租户创建和修改自定义工作流</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">允许租户自定义报表</h4>
                    <p className="text-sm text-muted-foreground">允许租户创建和修改自定义报表</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">允许租户访问API</h4>
                    <p className="text-sm text-muted-foreground">允许租户通过API访问其数据</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">启用租户隔离</h4>
                    <p className="text-sm text-muted-foreground">确保租户数据完全隔离，提高安全性</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>保存设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>租户模板</CardTitle>
              <CardDescription>管理用于创建新租户的模板</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "标准企业模板", description: "适用于大多数企业客户的标准配置", modules: 12 },
                  { name: "精简版模板", description: "适用于小型企业的精简配置", modules: 6 },
                  { name: "高级分析模板", description: "包含高级分析功能的配置", modules: 15 },
                  { name: "人力资源专用", description: "专为人力资源部门定制的配置", modules: 8 },
                  { name: "财务部门专用", description: "专为财务部门定制的配置", modules: 7 },
                  { name: "IT部门专用", description: "专为IT部门定制的配置", modules: 9 },
                ].map((template, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <p className="text-sm mt-2">包含 {template.modules} 个模块</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        编辑
                      </Button>
                      <Button size="sm">使用模板</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isCreating && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>创建新租户</CardTitle>
            <CardDescription>填写以下信息创建新的租户</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenant-name">租户名称</Label>
                <Input id="tenant-name" placeholder="输入租户名称" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant-domain">租户域名</Label>
                <Input id="tenant-domain" placeholder="example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant-admin-email">管理员邮箱</Label>
                <Input id="tenant-admin-email" type="email" placeholder="admin@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant-plan">套餐类型</Label>
                <select
                  id="tenant-plan"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="standard">标准版</option>
                  <option value="professional">专业版</option>
                  <option value="enterprise">企业版</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              取消
            </Button>
            <Button onClick={handleCreateTenant}>创建租户</Button>
          </CardFooter>
        </Card>
      )}

      {isEditing && currentTenant && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>编辑租户</CardTitle>
            <CardDescription>修改租户信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tenant-name">租户名称</Label>
                <Input id="edit-tenant-name" defaultValue={currentTenant.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tenant-domain">租户域名</Label>
                <Input id="edit-tenant-domain" defaultValue={currentTenant.domain} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tenant-status">状态</Label>
                <select
                  id="edit-tenant-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={currentTenant.status}
                >
                  <option value="active">活跃</option>
                  <option value="inactive">停用</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tenant-plan">套餐类型</Label>
                <select
                  id="edit-tenant-plan"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={currentTenant.plan === "企业版" ? "enterprise" : "standard"}
                >
                  <option value="standard">标准版</option>
                  <option value="professional">专业版</option>
                  <option value="enterprise">企业版</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setCurrentTenant(null)
              }}
            >
              取消
            </Button>
            <Button onClick={handleEditTenant}>保存更改</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
