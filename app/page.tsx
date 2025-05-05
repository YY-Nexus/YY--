import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { KeyMetricsChartWrapper } from "@/components/key-metrics-chart-wrapper"
import { ActivityFeed } from "@/components/activity-feed"
import { QuickActions } from "@/components/quick-actions"

// 不再使用动态导入，直接导入关键组件
export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:gap-6">
          <DashboardStats />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>关键指标</CardTitle>
                <CardDescription>实时监控业务关键指标</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
                  <KeyMetricsChartWrapper />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>最近活动</CardTitle>
                <CardDescription>系统最新动态</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
                  <ActivityFeed />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="quick-actions" className="w-full">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="quick-actions">快捷操作</TabsTrigger>
              <TabsTrigger value="recent">最近访问</TabsTrigger>
              <TabsTrigger value="favorites">收藏</TabsTrigger>
            </TabsList>
            <TabsContent value="quick-actions" className="mt-4">
              <QuickActions />
            </TabsContent>
            <TabsContent value="recent" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">最近访问的页面将显示在这里</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="favorites" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">收藏的页面将显示在这里</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
