"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ShieldCheck, AlertTriangle, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PermissionConflictTable() {
  const conflicts = [
    {
      id: "CON-001",
      user: "张三",
      position: "财务经理",
      conflictType: "职责分离冲突",
      systems: ["财务系统", "审批系统"],
      riskLevel: "高",
      status: "未解决",
      detectedDate: "2023-12-10",
    },
    {
      id: "CON-002",
      user: "李四",
      position: "IT管理员",
      conflictType: "超级权限风险",
      systems: ["ERP系统", "CRM系统", "HR系统"],
      riskLevel: "高",
      status: "处理中",
      detectedDate: "2023-12-12",
    },
    {
      id: "CON-003",
      user: "王五",
      position: "采购专员",
      conflictType: "审批与执行冲突",
      systems: ["采购系统", "仓储系统"],
      riskLevel: "中",
      status: "未解决",
      detectedDate: "2023-12-15",
    },
    {
      id: "CON-004",
      user: "赵六",
      position: "人力资源专员",
      conflictType: "数据访问越权",
      systems: ["HR系统"],
      riskLevel: "中",
      status: "已解决",
      detectedDate: "2023-12-05",
    },
    {
      id: "CON-005",
      user: "钱七",
      position: "销售经理",
      conflictType: "跨部门权限冲突",
      systems: ["CRM系统", "财务系统"],
      riskLevel: "低",
      status: "已解决",
      detectedDate: "2023-12-08",
    },
  ]

  const getRiskIcon = (level) => {
    switch (level) {
      case "高":
        return <ShieldAlert className="h-4 w-4 text-red-500" />
      case "中":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "低":
        return <ShieldCheck className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "未解决":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            未解决
          </Badge>
        )
      case "处理中":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            处理中
          </Badge>
        )
      case "已解决":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            已解决
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>冲突ID</TableHead>
          <TableHead>用户</TableHead>
          <TableHead>职位</TableHead>
          <TableHead>冲突类型</TableHead>
          <TableHead>涉及系统</TableHead>
          <TableHead>风险等级</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>检测日期</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {conflicts.map((conflict) => (
          <TableRow key={conflict.id}>
            <TableCell className="font-medium">{conflict.id}</TableCell>
            <TableCell>{conflict.user}</TableCell>
            <TableCell>{conflict.position}</TableCell>
            <TableCell>{conflict.conflictType}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {conflict.systems.map((system, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {system}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                {getRiskIcon(conflict.riskLevel)}
                <span>{conflict.riskLevel}</span>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(conflict.status)}</TableCell>
            <TableCell>{conflict.detectedDate}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">操作菜单</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>操作</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>查看详情</DropdownMenuItem>
                  <DropdownMenuItem>分配处理人</DropdownMenuItem>
                  <DropdownMenuItem>标记为已解决</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>忽略此冲突</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
