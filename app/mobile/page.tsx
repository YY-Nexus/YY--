"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type MobileAppConfig, defaultMobileAppConfig } from "@/lib/mobile/mobile-config"
import { MobileHeader } from "@/components/mobile/mobile-header"
import { MobileNavigation } from "@/components/mobile/mobile-navigation"
import { MobileDashboard } from "@/components/mobile/mobile-dashboard"
import { MobileEmployeeList } from "@/components/mobile/mobile-employee-list"
import { MobileApprovalList } from "@/components/mobile/mobile-approval-list"
import { MobileReportList } from "@/components/mobile/mobile-report-list"
import { MobileNotificationList } from "@/components/mobile/mobile-notification-list"
import { MobileOfflineIndicator } from "@/components/mobile/mobile-offline-indicator"
import { MobileSettings } from "@/components/mobile/mobile-settings"
import { useOfflineStatus } from "@/hooks/use-offline-status"
import { Download, QrCode } from "lucide-react"

export default function MobilePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [appConfig, setAppConfig] = useState<MobileAppConfig>(defaultMobileAppConfig)
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false)
  const isOffline = useOfflineStatus()
  const router = useRouter()

  // 加载应用配置
  useEffect(() => {
    // 在实际应用中，这里应该从API加载配置
    setAppConfig(defaultMobileAppConfig)
  }, [])

  // 处理模块点击
  const handleModuleClick = (moduleId: string) => {
    setActiveTab(moduleId)
  }

  // 渲染活动内容
  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <MobileDashboard />
      case "employees":
        return <MobileEmployeeList />
      case "approvals":
        return <MobileApprovalList />
      case "reports":
        return <MobileReportList />
      case "notifications":
        return <MobileNotificationList />
      case "settings":
        return <MobileSettings config={appConfig} onConfigChange={setAppConfig} />
      default:
        return <MobileDashboard />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">移动应用预览</h1>
          <Button onClick={() => setIsDownloadDialogOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            下载应用
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground p-4">
                <CardTitle>移动应用功能</CardTitle>
                <CardDescription className="text-primary-foreground/80">体验移动端的核心功能和用户界面</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {appConfig.modules.map((module) => (
                    <Card
                      key={module.id}
                      className={`cursor-pointer transition-colors ${activeTab === module.id ? "border-primary" : ""}`}
                      onClick={() => handleModuleClick(module.id)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <ul className="list-disc list-inside text-sm">
                          {module.features.map((feature) => (
                            <li key={feature.id}>{feature.name}</li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        {module.offlineSupport && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">支持离线</span>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                  <Card
                    className={`cursor-pointer transition-colors ${activeTab === "settings" ? "border-primary" : ""}`}
                    onClick={() => handleModuleClick("settings")}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">设置</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <ul className="list-disc list-inside text-sm">
                        <li>个人信息</li>
                        <li>通知设置</li>
                        <li>安全设置</li>
                        <li>同步设置</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>移动应用特性</CardTitle>
                <CardDescription>了解移动应用的核心特性和优势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M12 22v-5" />
                        <path d="M9 8V2" />
                        <path d="M15 8V2" />
                        <path d="M18 8v4" />
                        <path d="M6 8v4" />
                        <path d="M12 8v10" />
                        <path d="M2 8h20" />
                        <path d="M2 14h20" />
                        <path d="M6 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                        <path d="M18 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">离线工作</h3>
                      <p className="text-sm text-muted-foreground">
                        支持离线访问关键数据和功能，确保在无网络环境下也能工作
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">个性化设置</h3>
                      <p className="text-sm text-muted-foreground">根据个人偏好自定义应用外观、通知和功能</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">安全保障</h3>
                      <p className="text-sm text-muted-foreground">支持生物识别认证和PIN码保护，确保数据安全</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M5.8 11.3 2 22l10.7-3.79" />
                        <path d="M4 3h.01" />
                        <path d="M22 8h.01" />
                        <path d="M15 2h.01" />
                        <path d="M22 20h.01" />
                        <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
                        <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
                        <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" />
                        <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">手势操作</h3>
                      <p className="text-sm text-muted-foreground">支持直观的手势操作，提高移动端使用效率</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="overflow-hidden border-2 border-primary/20 h-[600px] flex flex-col">
              <div className="bg-black text-white text-center py-2 px-4 rounded-t-lg mx-auto w-32">
                <div className="w-16 h-4 bg-gray-800 rounded-full mx-auto"></div>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col bg-background">
                <MobileHeader title={getActiveTabTitle(activeTab)} />
                <div className="flex-1 overflow-y-auto p-4">{renderActiveContent()}</div>
                {isOffline && <MobileOfflineIndicator />}
                <MobileNavigation
                  modules={appConfig.modules}
                  activeModule={activeTab}
                  onModuleChange={handleModuleClick}
                />
              </div>
              <div className="bg-black text-white text-center py-4 rounded-b-lg">
                <div className="w-16 h-4 bg-gray-800 rounded-full mx-auto"></div>
              </div>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>下载移动应用</CardTitle>
                <CardDescription>扫描二维码或点击下载按钮获取应用</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QrCode size={150} />
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
                      <path d="M12 19v2" />
                      <path d="M12 3V1" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M19 12h2" />
                      <path d="M3 12h2" />
                      <path d="m17.66 6.34 1.41-1.41" />
                      <path d="m4.93 19.07 1.41-1.41" />
                    </svg>
                    iOS版本
                  </Button>
                  <Button className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                      <polygon points="12 15 17 21 7 21 12 15" />
                    </svg>
                    Android版本
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// 获取活动标签标题
function getActiveTabTitle(tabId: string): string {
  const titles: Record<string, string> = {
    dashboard: "仪表盘",
    employees: "员工管理",
    approvals: "审批",
    reports: "报表",
    notifications: "通知",
    settings: "设置",
  }
  return titles[tabId] || "仪表盘"
}
