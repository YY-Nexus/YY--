import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Clock, Download, Upload, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SchedulingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">排班管理</h2>
            <p className="text-muted-foreground">智能排班系统，高效管理员工工作时间</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>导出</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>导入</span>
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>新建排班</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-1">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">筛选条件</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">部门</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    <SelectItem value="dev">研发部</SelectItem>
                    <SelectItem value="marketing">市场部</SelectItem>
                    <SelectItem value="sales">销售部</SelectItem>
                    <SelectItem value="hr">人力资源部</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">班次</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="选择班次" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部班次</SelectItem>
                    <SelectItem value="morning">早班 (8:00-16:00)</SelectItem>
                    <SelectItem value="middle">中班 (12:00-20:00)</SelectItem>
                    <SelectItem value="night">晚班 (20:00-4:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">日期</label>
                <Calendar className="rounded-md border" />
              </div>

              <Button className="w-full">应用筛选</Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">排班表</CardTitle>
              <CardDescription>2023年5月</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-50">员工/日期</th>
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <th key={day} className="border p-2 bg-gray-50">
                          5月{day}日
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {["张三", "李四", "王五", "赵六", "钱七"].map((name, idx) => (
                      <tr key={name}>
                        <td className="border p-2 font-medium">{name}</td>
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                          // 简单的排班逻辑，实际应用中应该从数据源获取
                          let shift = ""
                          if ((idx + day) % 3 === 0) shift = "早班"
                          else if ((idx + day) % 3 === 1) shift = "中班"
                          else if ((idx + day) % 3 === 2) shift = "晚班"

                          let bgColor = ""
                          if (shift === "早班") bgColor = "bg-blue-50"
                          else if (shift === "中班") bgColor = "bg-green-50"
                          else if (shift === "晚班") bgColor = "bg-purple-50"

                          return (
                            <td key={day} className={`border p-2 text-center ${bgColor}`}>
                              {shift}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-50 border border-blue-200"></div>
                    <span className="text-xs">早班</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-50 border border-green-200"></div>
                    <span className="text-xs">中班</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-50 border border-purple-200"></div>
                    <span className="text-xs">晚班</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    上一周
                  </Button>
                  <Button variant="outline" size="sm">
                    下一周
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">人员配置分析</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-muted-foreground">人员配置分析图表</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">排班冲突检测</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
                  <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">李四 - 连续工作超过6天</p>
                    <p className="text-sm text-gray-600">5月1日至5月7日连续排班，请注意休息安排。</p>
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                  <Users className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium">销售部 - 5月3日人员不足</p>
                    <p className="text-sm text-gray-600">当日仅安排2人值班，低于最低要求(3人)。</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
