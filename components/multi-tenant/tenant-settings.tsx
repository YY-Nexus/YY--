"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { getRecoveryService, ErrorType, ErrorSeverity } from "@/lib/error-recovery/recovery-service"
import { getCache, setCache, CachePriority } from "@/lib/cache-service"

// 租户设置
interface TenantSettings {
  id: string
  name: string
  domain?: string
  logo?: string
  favicon?: string
  primaryColor: string
  secondaryColor: string
  customCss?: string
  customJs?: string
  features: {
    aiAnalytics: boolean
    advancedReporting: boolean
    multiLanguage: boolean
    dataExport: boolean
  }
  security: {
    mfaRequired: boolean
    passwordPolicy: {
      minLength: number
      requireSpecialChars: boolean
      requireNumbers: boolean
      requireUppercase: boolean
    }
    sessionTimeout: number
  }
  notifications: {
    email: boolean
    inApp: boolean
    slack: boolean
    webhook?: string
  }
}

interface TenantSettingsProps {
  tenantId: string
}

export function TenantSettings({ tenantId }: TenantSettingsProps) {
  const router = useRouter()
  const recoveryService = getRecoveryService()
  const [settings, setSettings] = useState<TenantSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // 加载租户设置
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)

      try {
        // 尝试从缓存获取租户设置
        const cachedSettings = getCache<TenantSettings>(`tenant-settings-${tenantId}`)

        if (cachedSettings) {
          setSettings(cachedSettings)
        } else {
          // 如果缓存中没有，则从API获取
          await fetchSettingsFromApi()
        }
      } catch (error) {
        recoveryService.captureError({
          type: ErrorType.API,
          severity: ErrorSeverity.MEDIUM,
          message: "加载租户设置失败",
          context: {
            timestamp: Date.now(),
            additionalData: { tenantId, error },
          },
          originalError: error instanceof Error ? error : undefined,
        })

        // 使用默认设置作为降级策略
        const defaultSettings: TenantSettings = {
          id: tenantId,
          name: "默认租户",
          primaryColor: "#3b82f6",
          secondaryColor: "#10b981",
          features: {
            aiAnalytics: true,
            advancedReporting: true,
            multiLanguage: true,
            dataExport: true,
          },
          security: {
            mfaRequired: false,
            passwordPolicy: {
              minLength: 8,
              requireSpecialChars: true,
              requireNumbers: true,
              requireUppercase: true,
            },
            sessionTimeout: 30,
          },
          notifications: {
            email: true,
            inApp: true,
            slack: false,
            webhook: "",
          },
        }
        setSettings(defaultSettings)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [tenantId, recoveryService])

  // 从API获取租户设置
  const fetchSettingsFromApi = async () => {
    try {
      // 这里应该是实际的API调用
      // const response = await fetch(`/api/tenants/${tenantId}/settings`)
      // const data = await response.json()

      // 示例数据
      const apiSettings: TenantSettings = {
        id: tenantId,
        name: "企业租户",
        domain: "company",
        logo: "/logo.png",
        favicon: "/favicon.ico",
        primaryColor: "#3b82f6",
        secondaryColor: "#10b981",
        customCss: ":root { --custom-font: 'Inter', sans-serif; }",
        features: {
          aiAnalytics: true,
          advancedReporting: true,
          multiLanguage: true,
          dataExport: true,
        },
        security: {
          mfaRequired: true,
          passwordPolicy: {
            minLength: 10,
            requireSpecialChars: true,
            requireNumbers: true,
            requireUppercase: true,
          },
          sessionTimeout: 60,
        },
        notifications: {
          email: true,
          inApp: true,
          slack: true,
          webhook: "https://example.com/webhook",
        },
      }

      setSettings(apiSettings)

      // 缓存租户设置
      setCache(`tenant-settings-${tenantId}`, apiSettings, {
        expirationMinutes: 60,
        priority: CachePriority.HIGH,
      })
    } catch (error) {
      throw error
    }
  }

  // 保存租户设置
  const saveSettings = async () => {
    if (!settings) return

    setIsSaving(true)

    try {
      // 这里应该是实际的API调用
      // await fetch(`/api/tenants/${tenantId}/settings`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 更新缓存
      setCache(`tenant-settings-${tenantId}`, settings, {
        expirationMinutes: 60,
        priority: CachePriority.HIGH,
      })

      // 应用设置
      applySettings(settings)

      alert("设置已保存")
    } catch (error) {
      recoveryService.captureError({
        type: ErrorType.API,
        severity: ErrorSeverity.MEDIUM,
        message: "保存租户设置失败",
        context: {
          timestamp: Date.now(),
          additionalData: { tenantId, error },
        },
        originalError: error instanceof Error ? error : undefined,
      })

      alert("保存设置失败，请重试")
    } finally {
      setIsSaving(false)
    }
  }

  // 应用设置
  const applySettings = (settings: TenantSettings) => {
    // 应用主题颜色
    document.documentElement.style.setProperty("--primary", settings.primaryColor)
    document.documentElement.style.setProperty("--secondary", settings.secondaryColor)

    // 应用自定义CSS
    if (settings.customCss) {
      let styleElement = document.getElementById("tenant-custom-css")
      if (!styleElement) {
        styleElement = document.createElement("style")
        styleElement.id = "tenant-custom-css"
        document.head.appendChild(styleElement)
      }
      styleElement.textContent = settings.customCss
    }

    // 应用自定义JS
    if (settings.customJs) {
      let scriptElement = document.getElementById("tenant-custom-js")
      if (scriptElement) {
        scriptElement.remove()
      }
      scriptElement = document.createElement("script")
      scriptElement.id = "tenant-custom-js"
      scriptElement.textContent = settings.customJs
      document.body.appendChild(scriptElement)
    }

    // 应用Favicon
    if (settings.favicon) {
      const faviconElement = document.querySelector("link[rel='icon']")
      if (faviconElement) {
        faviconElement.setAttribute("href", settings.favicon)
      }
    }
  }

  // 处理设置变更
  const handleChange = (path: string, value: any) => {
    if (!settings) return

    const newSettings = { ...settings }
    const pathParts = path.split(".")

    let current: any = newSettings
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]]
    }

    current[pathParts[pathParts.length - 1]] = value
    setSettings(newSettings)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">加载租户设置...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-red-500">无法加载租户设置</p>
          <Button className="mt-4" onClick={() => router.refresh()}>
            重试
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">租户设置</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="appearance">外观</TabsTrigger>
          <TabsTrigger value="features">功能</TabsTrigger>
          <TabsTrigger value="security">安全</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>基本设置</CardTitle>
              <CardDescription>管理租户的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">租户名称</Label>
                <Input id="name" value={settings.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="domain">租户域名</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="domain"
                    value={settings.domain || ""}
                    onChange={(e) => handleChange("domain", e.target.value)}
                  />
                  <span className="text-sm text-muted-foreground">.app.example.com</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input id="logo" value={settings.logo || ""} onChange={(e) => handleChange("logo", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>外观设置</CardTitle>
              <CardDescription>自定义租户的外观和主题</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>主题颜色</Label>
                <div className="flex items-center gap-4">
                  <div>
                    <Label htmlFor="primaryColor" className="text-sm">
                      主色调
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: settings.primaryColor }}
                      ></div>
                      <Input
                        id="primaryColor"
                        value={settings.primaryColor}
                        onChange={(e) => handleChange("primaryColor", e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor" className="text-sm">
                      辅助色调
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: settings.secondaryColor }}
                      ></div>
                      <Input
                        id="secondaryColor"
                        value={settings.secondaryColor}
                        onChange={(e) => handleChange("secondaryColor", e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customCss">自定义CSS</Label>
                <textarea
                  id="customCss"
                  value={settings.customCss || ""}
                  onChange={(e) => handleChange("customCss", e.target.value)}
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder=":root { --custom-font: 'Inter', sans-serif; }"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>功能设置</CardTitle>
              <CardDescription>启用或禁用租户功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="aiAnalytics" className="text-base">
                    AI分析
                  </Label>
                  <p className="text-sm text-muted-foreground">启用AI驱动的数据分析和预测</p>
                </div>
                <Switch
                  id="aiAnalytics"
                  checked={settings.features.aiAnalytics}
                  onCheckedChange={(checked) => handleChange("features.aiAnalytics", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="advancedReporting" className="text-base">
                    高级报表
                  </Label>
                  <p className="text-sm text-muted-foreground">启用高级报表和数据可视化</p>
                </div>
                <Switch
                  id="advancedReporting"
                  checked={settings.features.advancedReporting}
                  onCheckedChange={(checked) => handleChange("features.advancedReporting", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="multiLanguage" className="text-base">
                    多语言支持
                  </Label>
                  <p className="text-sm text-muted-foreground">启用多语言界面和内容</p>
                </div>
                <Switch
                  id="multiLanguage"
                  checked={settings.features.multiLanguage}
                  onCheckedChange={(checked) => handleChange("features.multiLanguage", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataExport" className="text-base">
                    数据导出
                  </Label>
                  <p className="text-sm text-muted-foreground">允许导出数据到CSV、Excel等格式</p>
                </div>
                <Switch
                  id="dataExport"
                  checked={settings.features.dataExport}
                  onCheckedChange={(checked) => handleChange("features.dataExport", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
              <CardDescription>管理租户的安全策略</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mfaRequired" className="text-base">
                    多因素认证
                  </Label>
                  <p className="text-sm text-muted-foreground">要求用户启用多因素认证</p>
                </div>
                <Switch
                  id="mfaRequired"
                  checked={settings.security.mfaRequired}
                  onCheckedChange={(checked) => handleChange("security.mfaRequired", checked)}
                />
              </div>
              <div>
                <Label className="text-base mb-2 block">密码策略</Label>
                <div className="space-y-2 ml-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="minLength" className="text-sm">
                      最小长度
                    </Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="minLength"
                        value={[settings.security.passwordPolicy.minLength]}
                        min={6}
                        max={16}
                        step={1}
                        className="w-32"
                        onValueChange={(value) => handleChange("security.passwordPolicy.minLength", value[0])}
                      />
                      <span className="w-8 text-center">{settings.security.passwordPolicy.minLength}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecialChars" className="text-sm">
                      要求特殊字符
                    </Label>
                    <Switch
                      id="requireSpecialChars"
                      checked={settings.security.passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) =>
                        handleChange("security.passwordPolicy.requireSpecialChars", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers" className="text-sm">
                      要求数字
                    </Label>
                    <Switch
                      id="requireNumbers"
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => handleChange("security.passwordPolicy.requireNumbers", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase" className="text-sm">
                      要求大写字母
                    </Label>
                    <Switch
                      id="requireUppercase"
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => handleChange("security.passwordPolicy.requireUppercase", checked)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="sessionTimeout" className="text-base">
                  会话超时（分钟）
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Slider
                    id="sessionTimeout"
                    value={[settings.security.sessionTimeout]}
                    min={5}
                    max={240}
                    step={5}
                    className="flex-1"
                    onValueChange={(value) => handleChange("security.sessionTimeout", value[0])}
                  />
                  <span className="w-12 text-center">{settings.security.sessionTimeout}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>管理租户的通知方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="text-base">
                    电子邮件通知
                  </Label>
                  <p className="text-sm text-muted-foreground">通过电子邮件发送通知</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleChange("notifications.email", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="inAppNotifications" className="text-base">
                    应用内通知
                  </Label>
                  <p className="text-sm text-muted-foreground">在应用内显示通知</p>
                </div>
                <Switch
                  id="inAppNotifications"
                  checked={settings.notifications.inApp}
                  onCheckedChange={(checked) => handleChange("notifications.inApp", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="slackNotifications" className="text-base">
                    Slack通知
                  </Label>
                  <p className="text-sm text-muted-foreground">通过Slack发送通知</p>
                </div>
                <Switch
                  id="slackNotifications"
                  checked={settings.notifications.slack}
                  onCheckedChange={(checked) => handleChange("notifications.slack", checked)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <Input
                  id="webhook"
                  value={settings.notifications.webhook || ""}
                  onChange={(e) => handleChange("notifications.webhook", e.target.value)}
                  placeholder="https://example.com/webhook"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" className="mr-2" onClick={() => router.back()}>
          取消
        </Button>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? "保存中..." : "保存设置"}
        </Button>
      </div>
    </div>
  )
}
