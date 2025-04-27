"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { useUserSettings } from "@/lib/user-settings"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { settings, updateSettings, loading } = useUserSettings()
  const { toast } = useToast()

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  })

  // 当用户数据加载完成后，更新表单
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        role: user.role || "",
      })
    }
  }, [user])

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 模拟保存个人资料
    toast({
      title: "个人资料已更新",
      description: "您的个人资料信息已成功保存。",
    })
  }

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(settings)
    toast({
      title: "设置已更新",
      description: "您的偏好设置已成功保存。",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">用户设置</h1>
          <p className="text-muted-foreground">管理您的账户设置和偏好</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">个人资料</TabsTrigger>
            <TabsTrigger value="preferences">偏好设置</TabsTrigger>
            <TabsTrigger value="notifications">通知设置</TabsTrigger>
            <TabsTrigger value="appearance">外观设置</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>个人资料</CardTitle>
                <CardDescription>更新您的个人信息和公司资料</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        姓名
                      </Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        邮箱
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="company" className="text-right">
                        公司
                      </Label>
                      <Input
                        id="company"
                        value={profileForm.company}
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        职位
                      </Label>
                      <Input
                        id="role"
                        value={profileForm.role}
                        onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">保存更改</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>偏好设置</CardTitle>
                <CardDescription>自定义您的使用体验和默认选项</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <form onSubmit={handleSettingsSubmit}>
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label>默认时间段</Label>
                        <Select
                          value={settings.defaultPeriod}
                          onValueChange={(value) => updateSettings({ ...settings, defaultPeriod: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择默认时间段" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="day">日</SelectItem>
                            <SelectItem value="week">周</SelectItem>
                            <SelectItem value="month">月</SelectItem>
                            <SelectItem value="quarter">季度</SelectItem>
                            <SelectItem value="year">年</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>默认货币</Label>
                        <Select
                          value={settings.currency}
                          onValueChange={(value) => updateSettings({ ...settings, currency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择默认货币" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CNY">人民币 (¥)</SelectItem>
                            <SelectItem value="USD">美元 ($)</SelectItem>
                            <SelectItem value="EUR">欧元 (€)</SelectItem>
                            <SelectItem value="GBP">英镑 (£)</SelectItem>
                            <SelectItem value="JPY">日元 (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>数据刷新频率</Label>
                        <Select
                          value={settings.refreshInterval.toString()}
                          onValueChange={(value) =>
                            updateSettings({ ...settings, refreshInterval: Number.parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择刷新频率" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">手动刷新</SelectItem>
                            <SelectItem value="30">每30秒</SelectItem>
                            <SelectItem value="60">每分钟</SelectItem>
                            <SelectItem value="300">每5分钟</SelectItem>
                            <SelectItem value="600">每10分钟</SelectItem>
                            <SelectItem value="1800">每30分钟</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-save">自动保存报表</Label>
                        <Switch
                          id="auto-save"
                          checked={settings.autoSaveReports}
                          onCheckedChange={(checked) => updateSettings({ ...settings, autoSaveReports: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-predictions">显示预测数据</Label>
                        <Switch
                          id="show-predictions"
                          checked={settings.showPredictions}
                          onCheckedChange={(checked) => updateSettings({ ...settings, showPredictions: checked })}
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button type="submit">保存设置</Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>通知设置</CardTitle>
                <CardDescription>配置您希望接收的通知类型和方式</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">通知类型</h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="financial-alerts" className="block">
                            财务预警
                          </Label>
                          <p className="text-sm text-muted-foreground">当财务指标超出预设阈值时通知您</p>
                        </div>
                        <Switch
                          id="financial-alerts"
                          checked={settings.notifications.financialAlerts}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                financialAlerts: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="report-ready" className="block">
                            报表就绪
                          </Label>
                          <p className="text-sm text-muted-foreground">当新的报表生成完成时通知您</p>
                        </div>
                        <Switch
                          id="report-ready"
                          checked={settings.notifications.reportReady}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                reportReady: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="system-updates" className="block">
                            系统更新
                          </Label>
                          <p className="text-sm text-muted-foreground">当系统有新功能或更新时通知您</p>
                        </div>
                        <Switch
                          id="system-updates"
                          checked={settings.notifications.systemUpdates}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                systemUpdates: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="team-activities" className="block">
                            团队活动
                          </Label>
                          <p className="text-sm text-muted-foreground">当团队成员进行重要操作时通知您</p>
                        </div>
                        <Switch
                          id="team-activities"
                          checked={settings.notifications.teamActivities}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                teamActivities: checked,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">通知方式</h3>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">电子邮件</Label>
                        <Switch
                          id="email-notifications"
                          checked={settings.notificationChannels.email}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              ...settings,
                              notificationChannels: {
                                ...settings.notificationChannels,
                                email: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="browser-notifications">浏览器通知</Label>
                        <Switch
                          id="browser-notifications"
                          checked={settings.notificationChannels.browser}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              ...settings,
                              notificationChannels: {
                                ...settings.notificationChannels,
                                browser: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-notifications">短信</Label>
                        <Switch
                          id="sms-notifications"
                          checked={settings.notificationChannels.sms}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              ...settings,
                              notificationChannels: {
                                ...settings.notificationChannels,
                                sms: checked,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSettingsSubmit}>保存通知设置</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>外观设置</CardTitle>
                <CardDescription>自定义界面外观和显示选项</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>主题</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={settings.theme === "light" ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => updateSettings({ ...settings, theme: "light" })}
                        >
                          <span className="mr-2 h-4 w-4 rounded-full bg-[#FFFFFF] border"></span>
                          浅色
                        </Button>
                        <Button
                          variant={settings.theme === "dark" ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => updateSettings({ ...settings, theme: "dark" })}
                        >
                          <span className="mr-2 h-4 w-4 rounded-full bg-[#1F2937] border"></span>
                          深色
                        </Button>
                        <Button
                          variant={settings.theme === "system" ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => updateSettings({ ...settings, theme: "system" })}
                        >
                          <span className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-[#FFFFFF] to-[#1F2937] border"></span>
                          跟随系统
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>图表颜色方案</Label>
                      <Select
                        value={settings.chartColorScheme}
                        onValueChange={(value) => updateSettings({ ...settings, chartColorScheme: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择图表颜色方案" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">默认</SelectItem>
                          <SelectItem value="pastel">柔和色调</SelectItem>
                          <SelectItem value="vibrant">鲜明色调</SelectItem>
                          <SelectItem value="monochrome">单色调</SelectItem>
                          <SelectItem value="corporate">企业风格</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>数据表格密度</Label>
                      <Select
                        value={settings.tableDensity}
                        onValueChange={(value) => updateSettings({ ...settings, tableDensity: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择表格密度" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">紧凑</SelectItem>
                          <SelectItem value="normal">标准</SelectItem>
                          <SelectItem value="relaxed">宽松</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="animations">启用动画效果</Label>
                      <Switch
                        id="animations"
                        checked={settings.enableAnimations}
                        onCheckedChange={(checked) => updateSettings({ ...settings, enableAnimations: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="compact-sidebar">紧凑侧边栏</Label>
                      <Switch
                        id="compact-sidebar"
                        checked={settings.compactSidebar}
                        onCheckedChange={(checked) => updateSettings({ ...settings, compactSidebar: checked })}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSettingsSubmit}>保存外观设置</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
