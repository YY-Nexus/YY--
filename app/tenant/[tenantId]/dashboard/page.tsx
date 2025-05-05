import { Suspense } from "react"
import { notFound } from "next/navigation"
import { DashboardStats } from "@/components/dashboard-stats"
import { ActivityFeed } from "@/components/activity-feed"
import { KeyMetricsChartWrapper } from "@/components/key-metrics-chart-wrapper"

// 租户仪表盘页面
export default function TenantDashboardPage({
  params,
}: {
  params: { tenantId: string }
}) {
  // 检查租户ID是否有效
  if (!params.tenantId || params.tenantId.length < 5) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">租户仪表盘 - {params.tenantId}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <DashboardStats />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <KeyMetricsChartWrapper />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <ActivityFeed />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
