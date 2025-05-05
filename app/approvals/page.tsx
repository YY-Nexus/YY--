import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Check, Clock, X, FileText, Filter } from "lucide-react"

export default function ApprovalsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">申请审批</h2>
            <p className="text-muted-foreground">管理和处理各类审批申请</p>
          </div>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>新建申请</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>筛选</span>
          </Button>
          <Button variant="outline" size="sm">
            全部
          </Button>
          <Button variant="outline" size="sm">
            待我审批
          </Button>
          <Button variant="outline" size="sm">
            我发起的
          </Button>
          <Button variant="outline" size="sm">
            已处理
          </Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>待审批</span>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              <span>已批准</span>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-1">
              <X className="h-4 w-4" />
              <span>已拒绝</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">请假申请 #{1000 + i}</CardTitle>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">待审批</span>
                  </div>
                  <CardDescription>申请人: 张三 | 部门: 研发部 | 提交时间: 2023-05-{10 + i}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="mb-4">
                    请假类型: 年假 | 开始日期: 2023-06-{i} | 结束日期: 2023-06-{i + 2} | 共3天
                  </p>
                  <p className="text-gray-600 mb-4">请假原因: 个人事务处理，需要请假三天。</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default">
                      批准
                    </Button>
                    <Button size="sm" variant="destructive">
                      拒绝
                    </Button>
                    <Button size="sm" variant="outline">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4 mt-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">报销申请 #{2000 + i}</CardTitle>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">已批准</span>
                  </div>
                  <CardDescription>申请人: 李四 | 部门: 市场部 | 提交时间: 2023-05-{5 + i}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="mb-4">
                    报销类型: 差旅费 | 金额: ¥{1200 * i}.00 | 审批时间: 2023-05-{6 + i}
                  </p>
                  <p className="text-gray-600 mb-4">报销说明: 出差期间的交通和住宿费用。</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">采购申请 #3001</CardTitle>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">已拒绝</span>
                </div>
                <CardDescription>申请人: 王五 | 部门: 行政部 | 提交时间: 2023-05-03</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="mb-4">采购类型: 办公设备 | 金额: ¥8500.00 | 审批时间: 2023-05-04</p>
                <p className="text-gray-600 mb-4">拒绝原因: 预算超出限额，请调整采购计划后重新提交。</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    查看详情
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
