import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, DollarSign, Clock, Award } from "lucide-react"
import { getEmployeeStats } from "@/lib/data-service"

export async function DashboardStats() {
  // 获取员工统计数据
  const stats = await getEmployeeStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">员工总数</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEmployees.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <span className="text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3" />+{stats.newHires}
            </span>
            较上月
          </p>
          <div className="mt-3 h-1 w-full bg-muted overflow-hidden rounded-full">
            <div className="bg-primary h-1 w-[65%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">编制使用率: 65%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">人力成本</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥3.2M</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <span className="text-red-500 flex items-center">
              <ArrowUpRight className="h-3 w-3" />
              +4.3%
            </span>
            较上季度
          </p>
          <div className="mt-3 h-1 w-full bg-muted overflow-hidden rounded-full">
            <div className="bg-primary h-1 w-[78%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">预算使用率: 78%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">平均在职时长</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageTenure}年</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <span className="text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3" />
              +0.3年
            </span>
            较去年
          </p>
          <div className="mt-3 h-1 w-full bg-muted overflow-hidden rounded-full">
            <div className="bg-primary h-1 w-[60%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">行业对标: 60%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">人才保留率</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.retentionRate}%</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <span className="text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3" />
              +1.2%
            </span>
            较上季度
          </p>
          <div className="mt-3 h-1 w-full bg-muted overflow-hidden rounded-full">
            <div className="bg-primary h-1 w-[93%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">目标达成率: 93%</p>
        </CardContent>
      </Card>
    </div>
  )
}
