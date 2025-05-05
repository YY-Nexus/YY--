"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, Edit, Trash2, Users, Copy } from "lucide-react"
import { mockRoles } from "@/data/permissions-data"

export function RoleManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)

  const filteredRoles = mockRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索角色..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              添加角色
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>添加新角色</DialogTitle>
              <DialogDescription>创建新角色并定义权限范围</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role-name" className="text-right">
                  角色名称
                </Label>
                <Input id="role-name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role-description" className="text-right">
                  角色描述
                </Label>
                <Input id="role-description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">权限设置</Label>
                <div className="col-span-3 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">组织治理中枢</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="org-view" />
                        <Label htmlFor="org-view">查看</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="org-edit" />
                        <Label htmlFor="org-edit">编辑</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="org-create" />
                        <Label htmlFor="org-create">创建</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="org-delete" />
                        <Label htmlFor="org-delete">删除</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">员工全周期管理</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="emp-view" />
                        <Label htmlFor="emp-view">查看</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="emp-edit" />
                        <Label htmlFor="emp-edit">编辑</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="emp-create" />
                        <Label htmlFor="emp-create">创建</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="emp-delete" />
                        <Label htmlFor="emp-delete">删除</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">薪酬绩效引擎</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="comp-view" />
                        <Label htmlFor="comp-view">查看</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="comp-edit" />
                        <Label htmlFor="comp-edit">编辑</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="comp-create" />
                        <Label htmlFor="comp-create">创建</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="comp-delete" />
                        <Label htmlFor="comp-delete">删除</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">系统管理</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sys-view" />
                        <Label htmlFor="sys-view">查看</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sys-edit" />
                        <Label htmlFor="sys-edit">编辑</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sys-create" />
                        <Label htmlFor="sys-create">创建</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sys-delete" />
                        <Label htmlFor="sys-delete">删除</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setIsAddRoleOpen(false)}>创建角色</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>角色列表</CardTitle>
          <CardDescription>管理系统角色及其权限</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>角色名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>用户数量</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{role.userCount}</TableCell>
                  <TableCell>{role.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">操作菜单</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>角色操作</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑角色
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          复制角色
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除角色
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            显示 {filteredRoles.length} 个角色中的 {filteredRoles.length} 个
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm">
              下一页
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
