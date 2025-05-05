import { Suspense } from "react"
import { OrganizationHeader } from "@/components/organization/organization-header"
import {
  OrganizationStructure,
  OrganizationChart,
  OrganizationTable,
  OrganizationStats,
  OrganizationAIInsights,
  OrganizationEfficiency,
} from "@/components/organization"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrganizationPage() {
  return (
    <div className="container mx-auto py-6">
      <OrganizationHeader />

      <Tabs defaultValue="structure" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="structure">组织架构</TabsTrigger>
          <TabsTrigger value="efficiency">效能分析</TabsTrigger>
          <TabsTrigger value="insights">AI洞察</TabsTrigger>
        </TabsList>

        <TabsContent value="structure">
          <div className="grid gap-4 md:grid-cols-2">
            <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}>
              <OrganizationStructure />
            </Suspense>

            <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}>
              <OrganizationChart />
            </Suspense>
          </div>

          <div className="mt-4">
            <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-lg" />}>
              <OrganizationTable />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="efficiency">
          <Suspense fallback={<Skeleton className="w-full h-[600px] rounded-lg" />}>
            <OrganizationEfficiency />
          </Suspense>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid gap-4 md:grid-cols-2">
            <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}>
              <OrganizationStats />
            </Suspense>

            <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}>
              <OrganizationAIInsights />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
