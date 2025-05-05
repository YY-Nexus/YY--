"use client"

import { useCachedData } from "@/hooks/use-cached-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

// 员工统计数据类型
interface EmployeeStats {
  totalEmployees: number
  newHires: number
  retentionRate: string
  averageTenure: string
}

// 获取员工统计数据
async function fetchEmployeeStats(): Promise<EmployeeStats> {
  const response = await fetch("/api/employees/stats")
  if (!response.ok) {
    throw new Error("获取员工统计数据失败")
  }
  return response.json()
}

export function EmployeeStatsCached() {
  const { data, error, isLoading, refresh } = useCachedData<EmployeeStats>({
    key: "employee-stats",
    fetcher: fetchEmployeeStats,
    ttl: 5 * 60 * 1000, // 5分钟缓存
    namespace: "employee",
  })

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-red-700 text-lg flex items-center justify-between">
            <span>获取数据失败</span>
            <Button variant="ghost" size="sm" onClick={refresh} className="h-8 px-2">
              <RefreshCw className="h-4 w-4 mr-1" /> 重试
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">员工总数</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{data?.totalEmployees || 0}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">本月新入职</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{data?.newHires || 0}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">人才保留率</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{data?.retentionRate || "0.0"}%</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">平均在职时长</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{data?.averageTenure || "0.0"}年</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
