import { Skeleton } from "@/components/ui/skeleton"

export default function EmployeeDetailLoading() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 员工基本信息骨架 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>

          {/* 风险评分和趋势图骨架 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>

          {/* 风险因素分析骨架 */}
          <div className="bg-white rounded-lg shadow p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          {/* 风险历史记录骨架 */}
          <div className="bg-white rounded-lg shadow p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>

        {/* 可执行操作侧边栏骨架 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 h-full min-h-[400px]">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-2 w-full my-6" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-2 w-full my-6" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
