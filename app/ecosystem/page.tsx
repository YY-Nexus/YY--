import { ApiDocumentation } from "@/components/ecosystem/api-documentation"
import { PluginMarketplace } from "@/components/ecosystem/plugin-marketplace"
import { DeveloperCommunity } from "@/components/ecosystem/developer-community"

export default function EcosystemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">生态系统扩展</h2>
        <p className="text-muted-foreground mt-2">探索API和插件系统，连接开发者社区，扩展平台功能</p>
      </div>

      <div className="grid gap-6">
        <ApiDocumentation />
        <PluginMarketplace />
        <DeveloperCommunity />
      </div>
    </div>
  )
}
