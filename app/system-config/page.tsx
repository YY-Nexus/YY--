import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Database, Bell, Shield, Palette, Globe, Cpu, HardDrive, Workflow } from "lucide-react"
import { InteractiveCard } from "@/components/interactive-card"

export default function SystemConfigPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">系统配置中心</h2>
            <p className="text-muted-foreground">管理系统设置和配置选项</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InteractiveCard
            title="用户权限管理"
            description="管理用户账号、角色和权限"
            href="/system-config/permissions"
            className="hover:border-blue-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">活跃用户</span>
                  <span className="text-sm text-gray-600">1,248</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard
            title="数据集成配置"
            description="配置外部数据源和同步设置"
            href="/system-config/data-integration"
            className="hover:border-green-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">已连接数据源</span>
                  <span className="text-sm text-gray-600">8/12</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "66%" }}></div>
                </div>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard
            title="通知系统设置"
            description="配置系统通知和提醒规则"
            href="/notifications"
            className="hover:border-yellow-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">通知模板</span>
                  <span className="text-sm text-gray-600">24</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard
            title="安全与合规"
            description="管理安全策略和合规设置"
            href="/system-config/security"
            className="hover:border-red-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">安全评分</span>
                  <span className="text-sm text-gray-600">92/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard
            title="界面与主题"
            description="自定义系统界面和主题设置"
            href="/system-config/appearance"
            className="hover:border-purple-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <Palette className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">可用主题</span>
                  <span className="text-sm text-gray-600">5</span>
                </div>
                <div className="flex gap-1 mt-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                  <div className="w-6 h-6 rounded-full bg-green-500"></div>
                  <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                  <div className="w-6 h-6 rounded-full bg-gray-800"></div>
                  <div className="w-6 h-6 rounded-full bg-orange-500"></div>
                </div>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard
            title="国际化设置"
            description="配置多语言和地区设置"
            href="/system-config/localization"
            className="hover:border-indigo-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-indigo-100">
                <Globe className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">支持语言</span>
                  <span className="text-sm text-gray-600">4</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">中文</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">English</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">日本語</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">한국어</span>
                </div>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard
            title="系统性能监控"
            description="监控系统性能和资源使用情况"
            href="/system-config/performance"
            className="hover:border-cyan-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-cyan-100">
                <Cpu className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">系统负载</span>
                  <span className="text-sm text-gray-600">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-cyan-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard
            title="数据备份与恢复"
            description="配置数据备份策略和恢复选项"
            href="/system-config/backup"
            className="hover:border-orange-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100">
                <HardDrive className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">上次备份</span>
                  <span className="text-sm text-gray-600">12小时前</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">自动备份已启用</span>
                </div>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard
            title="工作流配置"
            description="自定义业务流程和审批流程"
            href="/system-config/workflows"
            className="hover:border-pink-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-pink-100">
                <Workflow className="h-6 w-6 text-pink-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">活跃工作流</span>
                  <span className="text-sm text-gray-600">18</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-pink-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </InteractiveCard>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">系统状态</CardTitle>
            <CardDescription>实时系统运行状态和资源使用情况</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">CPU使用率</span>
                  <span className="text-sm text-gray-600">32%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "32%" }}></div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">内存使用率</span>
                  <span className="text-sm text-gray-600">64%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "64%" }}></div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">存储空间</span>
                  <span className="text-sm text-gray-600">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">网络带宽</span>
                  <span className="text-sm text-gray-600">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">系统运行时间</span>
                <span className="text-sm text-gray-600">32天 14小时 27分钟</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">最后更新时间</span>
                <span className="text-sm text-gray-600">2023-05-10 08:45:32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">系统版本</span>
                <span className="text-sm text-gray-600">v2.5.3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
