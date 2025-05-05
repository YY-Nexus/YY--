"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator, Save, Share2, Download, BarChart4, PieChart, LineChart, RefreshCw } from "lucide-react"
import { StaffingChart } from "@/components/organization/staffing-chart"
import { StaffingTable } from "@/components/organization/staffing-table"
import { StaffingScenarios } from "@/components/organization/staffing-scenarios"

export function StaffingCalculator() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>动态编制测算模型</CardTitle>
                <CardDescription>基于业务量和效能指标的人力需求预测</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1">
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">保存</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">分享</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-volume">业务量预测 (同比增长)</Label>
                  <div className="flex items-center gap-2">
                    <Slider defaultValue={[15]} max={50} step={1} className="flex-1" />
                    <div className="w-12 text-center font-medium">15%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="efficiency-improvement">效能提升预期</Label>
                  <div className="flex items-center gap-2">
                    <Slider defaultValue={[10]} max={30} step={1} className="flex-1" />
                    <div className="w-12 text-center font-medium">10%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="automation-level">流程自动化水平</Label>
                  <div className="flex items-center gap-2">
                    <Slider defaultValue={[25]} max={80} step={1} className="flex-1" />
                    <div className="w-12 text-center font-medium">25%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turnover-rate">预期人员流动率</Label>
                  <div className="flex items-center gap-2">
                    <Slider defaultValue={[12]} max={30} step={1} className="flex-1" />
                    <div className="w-12 text-center font-medium">12%</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-headcount">当前编制</Label>
                    <Input id="current-headcount" type="number" defaultValue="156" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calculation-period">预测周期 (月)</Label>
                    <Input id="calculation-period" type="number" defaultValue="12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>部门权重调整</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between border rounded-md p-2">
                      <span className="text-sm">研发部门</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="flex items-center justify-between border rounded-md p-2">
                      <span className="text-sm">市场部门</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex items-center justify-between border rounded-md p-2">
                      <span className="text-sm">销售部门</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex items-center justify-between border rounded-md p-2">
                      <span className="text-sm">其他部门</span>
                      <span className="font-medium">20%</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full gap-2">
                  <Calculator className="h-4 w-4" />
                  <span>计算编制需求</span>
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <Tabs defaultValue="chart">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="chart" className="gap-1">
                      <BarChart4 className="h-4 w-4" />
                      <span>图表视图</span>
                    </TabsTrigger>
                    <TabsTrigger value="table" className="gap-1">
                      <PieChart className="h-4 w-4" />
                      <span>表格视图</span>
                    </TabsTrigger>
                  </TabsList>

                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    <span>导出</span>
                  </Button>
                </div>

                <TabsContent value="chart">
                  <StaffingChart />
                </TabsContent>

                <TabsContent value="table">
                  <StaffingTable />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>编制测算结果</CardTitle>
            <CardDescription>基于当前参数的预测结果</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">当前编制</span>
                <span className="font-medium">156人</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">预测需求</span>
                <span className="font-medium">178人</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">净增加</span>
                <span className="font-medium text-green-500">+22人</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">增长率</span>
                <span className="font-medium text-green-500">+14.1%</span>
              </div>

              <div className="pt-2 border-t">
                <div className="text-sm font-medium mb-2">部门分布</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>研发部门</span>
                    <span>+8人</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "35%" }}></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span>市场部门</span>
                    <span>+6人</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span>销售部门</span>
                    <span>+4人</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span>其他部门</span>
                    <span>+4人</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-1">
              <LineChart className="h-4 w-4" />
              <span>查看历史对比</span>
            </Button>

            <Button variant="outline" className="w-full gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>重置参数</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>编制优化方案</CardTitle>
          <CardDescription>基于不同业务场景的编制优化建议</CardDescription>
        </CardHeader>
        <CardContent>
          <StaffingScenarios />
        </CardContent>
      </Card>
    </div>
  )
}
