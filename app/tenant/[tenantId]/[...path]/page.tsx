import { notFound } from "next/navigation"
import { getMicroFrontendByPath } from "@/lib/micro-frontend/config"
import { MicroFrontendLoader } from "@/components/micro-frontend/micro-frontend-loader"
import { Skeleton } from "@/components/ui/skeleton"
import { TenantProvider } from "@/lib/multi-tenant/tenant-context"

interface TenantPageProps {
  params: {
    tenantId: string
    path: string[]
  }
}

export default function TenantPage({ params }: TenantPageProps) {
  const { tenantId, path } = params
  const pathString = path.join("/")

  // 如果是 dashboard 路径，渲染默认仪表盘
  if (pathString === "dashboard") {
    return (
      <TenantProvider tenantId={tenantId}>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">租户 {tenantId} 仪表盘</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">组织概览</h2>
              <p>组织结构和人员配置信息</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">员工管理</h2>
              <p>员工全周期管理和发展</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">薪酬绩效</h2>
              <p>薪酬体系和绩效管理</p>
            </div>
          </div>
        </div>
      </TenantProvider>
    )
  }

  // 否则尝试加载微前端应用
  const microFrontend = getMicroFrontendByPath(pathString)

  if (!microFrontend) {
    return notFound()
  }

  return (
    <TenantProvider tenantId={tenantId}>
      <div className="container mx-auto py-6">
        <MicroFrontendLoader
          config={microFrontend}
          tenantId={tenantId}
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-4 w-[300px]" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <Skeleton className="h-[200px] rounded-lg" />
                <Skeleton className="h-[200px] rounded-lg" />
                <Skeleton className="h-[200px] rounded-lg" />
              </div>
              <Skeleton className="h-[400px] rounded-lg mt-6" />
            </div>
          }
        />
      </div>
    </TenantProvider>
  )
}
