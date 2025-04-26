import { BigDataProcessor } from "@/components/performance/big-data-processor"
import { DataCacheManager } from "@/components/performance/data-cache-manager"
import { RenderOptimizer } from "@/components/performance/render-optimizer"

export default function SystemPerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">系统性能优化</h2>
        <p className="text-muted-foreground mt-2">优化系统性能，提高数据处理效率和用户界面响应速度</p>
      </div>

      <div className="grid gap-6">
        <BigDataProcessor />
        <DataCacheManager />
        <RenderOptimizer />
      </div>
    </div>
  )
}
