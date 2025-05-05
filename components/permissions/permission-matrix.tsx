"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Save, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockPermissionMatrix } from "@/data/permissions-data"

export function PermissionMatrix() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModule, setSelectedModule] = useState("all")

  const filteredPermissions = mockPermissionMatrix.filter(
    (permission) =>
      (selectedModule === "all" || permission.module === selectedModule) &&
      (permission.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索权限..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="选择模块" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有模块</SelectItem>
              <SelectItem value="组织治理中枢">组织治理中枢</SelectItem>
              <SelectItem value="员工全周期管理">员工全周期管理</SelectItem>
              <SelectItem value="薪酬绩效引擎">薪酬绩效引擎</SelectItem>
              <SelectItem value="系统管理">系统管理</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            重置
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            保存更改
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>权限矩阵</CardTitle>
          <CardDescription>详细配置各角色的权限</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">资源/功能</TableHead>
                <TableHead className="w-[300px]">描述</TableHead>
                <TableHead>系统管理员</TableHead>
                <TableHead>HR管理员</TableHead>
                <TableHead>部门主管</TableHead>
                <TableHead>普通员工</TableHead>
                <TableHead>只读用户</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.map((permission, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{permission.resource}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell>
                    <Checkbox checked={permission.roles.admin} />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={permission.roles.hr_manager} />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={permission.roles.department_head} />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={permission.roles.employee} />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={permission.roles.viewer} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
