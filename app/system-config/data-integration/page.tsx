import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataIntegrationHeader } from "@/components/data-integration/data-integration-header"
import { DataSourceConfig } from "@/components/data-integration/data-source-config"
import { SyncSettings } from "@/components/data-integration/sync-settings"
import { DataMappings } from "@/components/data-integration/data-mappings"
import { SyncHistory } from "@/components/data-integration/sync-history"

export default function DataIntegrationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DataIntegrationHeader />

      <main className="flex-1 space-y-6 p-6 pt-4 md:p-8 md:pt-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">数据集成配置</h1>
          <p className="text-muted-foreground">配置外部数据源连接和同步设置</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>数据源配置</CardTitle>
              <CardDescription>配置外部数据源连接信息</CardDescription>
            </CardHeader>
            <CardContent>
              <DataSourceConfig />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>同步设置</CardTitle>
              <CardDescription>配置数据同步频率和范围</CardDescription>
            </CardHeader>
            <CardContent>
              <SyncSettings />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>数据映射</CardTitle>
            <CardDescription>配置外部数据与系统数据的字段映射</CardDescription>
          </CardHeader>
          <CardContent>
            <DataMappings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>同步历史</CardTitle>
            <CardDescription>查看数据同步历史记录和日志</CardDescription>
          </CardHeader>
          <CardContent>
            <SyncHistory />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
