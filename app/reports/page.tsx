import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart2, PieChart, LineChart, Download, Share2, Plus, Clock, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">数据报表</h2>
            <p className="text-muted-foreground">全面的数据分析与可视化报表</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>导出</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>分享</span>
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>新建报表</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Card className="md:w-64 flex-shrink-0">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">报表筛选</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">时间范围</label>
                <Select defaultValue="month">
                  <SelectTrigger>
                    <SelectValue placeholder="选择时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">本周</SelectItem>
                    <SelectItem value="month">本月</SelectItem>
                    <SelectItem value="quarter">本季度</SelectItem>
                    <SelectItem value="year">本年度</SelectItem>
                    <SelectItem value="custom">自定义</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">部门</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    <SelectItem value="rd">研发部</SelectItem>
                    <SelectItem value="marketing">市场部</SelectItem>
                    <SelectItem value="sales">销售部</SelectItem>
                    <SelectItem value="hr">人力资源部</SelectItem>
                    <SelectItem value="finance">财务部</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">报表类型</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="选择报表类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="hr">人力资源</SelectItem>
                    <SelectItem value="finance">财务报表</SelectItem>
                    <SelectItem value="performance">绩效报表</SelectItem>
                    <SelectItem value="operations">运营报表</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">应用筛选</Button>
            </CardContent>
          </Card>

          <div className="flex-1 space-y-4">
            <Tabs defaultValue="dashboard">
              <TabsList>
                <TabsTrigger value="dashboard" className="flex items-center gap-1">
                  <BarChart2 className="h-4 w-4" />
                  <span>仪表盘</span>
                </TabsTrigger>
                <TabsTrigger value="hr" className="flex items-center gap-1">
                  <PieChart className="h-4 w-4" />
                  <span>人力资源</span>
                </TabsTrigger>
                <TabsTrigger value="finance" className="flex items-center gap-1">
                  <LineChart className="h-4 w-4" />
                  <span>财务分析</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">员工数据概览</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                        <p className="text-muted-foreground">员工数据图表</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">部门人员分布</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                        <p className="text-muted-foreground">部门分布图表</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">人力成本趋势</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                        <p className="text-muted-foreground">成本趋势图表</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">员工绩效分布</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                        <p className="text-muted-foreground">绩效分布图表</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="hr" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">人力资源报表</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">人力资源报表内容</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="finance" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">财务分析报表</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">财务分析报表内容</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">常用报表</CardTitle>
                  <Button variant="outline" size="sm">
                    查看全部
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {[
                    { name: "月度人员流动报表", type: "人力资源", date: "2023-05-01", star: true },
                    { name: "部门预算执行情况", type: "财务", date: "2023-05-05", star: false },
                    { name: "员工绩效评估汇总", type: "绩效", date: "2023-04-30", star: true },
                    { name: "招聘渠道效果分析", type: "人力资源", date: "2023-04-28", star: false },
                  ].map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-blue-50">
                          <BarChart2 className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-gray-600">
                            {report.type} | 更新于 {report.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.star && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">最近查看</CardTitle>
                  <Button variant="outline" size="sm">
                    清除历史
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {[
                    { name: "员工离职原因分析", type: "人力资源", time: "10分钟前" },
                    { name: "部门人均产值报表", type: "运营", time: "2小时前" },
                    { name: "招聘成本分析", type: "人力资源", time: "昨天" },
                  ].map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-gray-100">
                          <Clock className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-gray-600">
                            {report.type} | {report.time}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
