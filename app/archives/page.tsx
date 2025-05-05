import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, FileText, User, Briefcase, GraduationCap } from "lucide-react"

export default function ArchivesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">档案查询</h2>
            <p className="text-muted-foreground">查询和管理员工电子档案</p>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">高级搜索</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="搜索姓名、工号或部门" className="pl-8" />
              </div>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="档案类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="personal">个人信息</SelectItem>
                  <SelectItem value="contract">合同信息</SelectItem>
                  <SelectItem value="education">教育背景</SelectItem>
                  <SelectItem value="career">职业经历</SelectItem>
                  <SelectItem value="performance">绩效记录</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="部门" />
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

              <div className="flex gap-2">
                <Button className="flex-1 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>搜索</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>筛选</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="employee">
          <TabsList>
            <TabsTrigger value="employee" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>员工档案</span>
            </TabsTrigger>
            <TabsTrigger value="contract" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>合同档案</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              <span>教育档案</span>
            </TabsTrigger>
            <TabsTrigger value="career" className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span>职业档案</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employee" className="mt-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">员工档案列表</CardTitle>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>导出</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2 text-left">工号</th>
                        <th className="border p-2 text-left">姓名</th>
                        <th className="border p-2 text-left">部门</th>
                        <th className="border p-2 text-left">职位</th>
                        <th className="border p-2 text-left">入职日期</th>
                        <th className="border p-2 text-left">档案状态</th>
                        <th className="border p-2 text-left">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "EMP001",
                          name: "张三",
                          dept: "研发部",
                          position: "高级工程师",
                          date: "2020-05-15",
                          status: "完整",
                        },
                        {
                          id: "EMP002",
                          name: "李四",
                          dept: "市场部",
                          position: "市场经理",
                          date: "2019-08-23",
                          status: "完整",
                        },
                        {
                          id: "EMP003",
                          name: "王五",
                          dept: "销售部",
                          position: "销售代表",
                          date: "2021-03-10",
                          status: "缺失",
                        },
                        {
                          id: "EMP004",
                          name: "赵六",
                          dept: "人力资源部",
                          position: "HR专员",
                          date: "2022-01-05",
                          status: "完整",
                        },
                        {
                          id: "EMP005",
                          name: "钱七",
                          dept: "财务部",
                          position: "财务分析师",
                          date: "2020-11-18",
                          status: "完整",
                        },
                      ].map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="border p-2">{employee.id}</td>
                          <td className="border p-2">{employee.name}</td>
                          <td className="border p-2">{employee.dept}</td>
                          <td className="border p-2">{employee.position}</td>
                          <td className="border p-2">{employee.date}</td>
                          <td className="border p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                employee.status === "完整" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {employee.status}
                            </span>
                          </td>
                          <td className="border p-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contract" className="mt-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">合同档案列表</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-muted-foreground">合同档案内容</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">教育档案列表</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-muted-foreground">教育档案内容</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="career" className="mt-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">职业档案列表</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-muted-foreground">职业档案内容</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
