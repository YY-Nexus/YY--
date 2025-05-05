"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Search, Filter, Download, Shield, ShieldAlert, ShieldCheck, RefreshCw } from "lucide-react"
import { PermissionConflictTable } from "@/components/organization/permission-conflict-table"
import { PermissionHeatmap } from "@/components/organization/permission-heatmap"
import { PermissionTrends } from "@/components/organization/permission-trends"

export function PermissionRadar() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>权限冲突雷达</CardTitle>
                <CardDescription>实时监测系统中的权限冲突风险</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>刷新</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-between">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Shield className="h-4 w-4" />
                  <span>全部</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  <span>高风险</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>中风险</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span>已解决</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="搜索..." className="pl-8 h-9 w-[200px]" />
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <PermissionConflictTable />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>权限热力图</CardTitle>
            <CardDescription>可视化展示权限分布与冲突热点</CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionHeatmap />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>权限风险趋势</CardTitle>
            <CardDescription>权限冲突风险历史变化趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionTrends />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
