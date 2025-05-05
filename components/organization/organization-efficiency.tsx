"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EfficiencyMetrics } from "@/components/organization/efficiency-metrics"
import { EfficiencyComparison } from "@/components/organization/efficiency-comparison"
import { EfficiencyTrends } from "@/components/organization/efficiency-trends"
import { EfficiencyRecommendations } from "@/components/organization/efficiency-recommendations"

export function OrganizationEfficiency() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>组织效能指标</CardTitle>
            <CardDescription>关键效能指标实时监控</CardDescription>
          </CardHeader>
          <CardContent>
            <EfficiencyMetrics />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>行业对标分析</CardTitle>
            <CardDescription>与行业标杆企业的效能对比</CardDescription>
          </CardHeader>
          <CardContent>
            <EfficiencyComparison />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>效能趋势分析</CardTitle>
            <CardDescription>组织效能历史变化趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <EfficiencyTrends />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>AI优化建议</CardTitle>
            <CardDescription>基于数据分析的改进建议</CardDescription>
          </CardHeader>
          <CardContent>
            <EfficiencyRecommendations />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
