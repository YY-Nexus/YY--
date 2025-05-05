import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, Clock, UserCheck, UserPlus, Users } from "lucide-react"
import { getOnboardingStats } from "@/lib/data-service"

export async function OnboardingStats() {
  const stats = await getOnboardingStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">本月入职</p>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{stats.monthlyHires}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                +33%
              </span>
              较上月
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">入职中</p>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{stats.onboardingCount}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                +2
              </span>
              较上周
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">入职完成率</p>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                +2.1%
              </span>
              较上季度
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">平均入职时长</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{stats.averageOnboardingDays}天</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                -0.8天
              </span>
              较上季度
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
