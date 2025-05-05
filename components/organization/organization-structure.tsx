"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, User, Search, ZoomIn, ZoomOut, RotateCw, Filter, Download, Layers } from "lucide-react"
import { OrganizationChart } from "@/components/organization/organization-chart"
import { OrganizationTable } from "@/components/organization/organization-table"
import { OrganizationStats } from "@/components/organization/organization-stats"
import { OrganizationAIInsights } from "@/components/organization/organization-ai-insights"

export function OrganizationStructure() {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle>三维组织图谱</CardTitle>
            <CardDescription>可视化展示部门、岗位与人员的层级关系</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-between">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>部门视图</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Users className="h-4 w-4" />
                  <span>岗位视图</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <span>人员视图</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Layers className="h-4 w-4" />
                  <span>三维视图</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant={viewMode === "chart" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("chart")}
              >
                图表视图
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                表格视图
              </Button>
            </div>

            <div className="min-h-[500px] border rounded-md p-4 bg-muted/20">
              {viewMode === "chart" ? <OrganizationChart /> : <OrganizationTable />}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>组织架构健康度</CardTitle>
            <CardDescription>AI驱动的组织架构健康度诊断</CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationAIInsights />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>组织架构统计</CardTitle>
            <CardDescription>关键指标与统计数据</CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationStats />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
