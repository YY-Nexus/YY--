"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Bell, Calendar, Clock, FileText, Mail, MessageSquare, Save, Smartphone, Volume2 } from "lucide-react"

export function NotificationSettings() {
  // 通知设置状态
  const [settings, setSettings] = useState({
    // 通知渠道
    channels: {
      inApp: true,
      email: true,
      sms: false,
      wechat: true,
      dingtalk: false,
    },
    // 通知类型
    types: {
      system: true,
      task: true,
      schedule: true,
      reminder: true,
      warning: true,
    },
    // 通知频率
    frequency: "realtime",
    // 免打扰时间
    doNotDisturb: {
      enabled: false,
      startTime: "22:00",
      endTime: "08:00",
    },
    // 声音和振动
    sound: true,
    vibration: true,
    // 通知分组
    grouping: true,
  })

  // 更新设置
  const updateSettings = (path: string[], value: any) => {
    const newSettings = { ...settings }
    let current = newSettings

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }

    current[path[path.length - 1]] = value
    setSettings(newSettings)
  }

  // 保存设置
  const saveSettings = () => {
    // 在实际应用中，这里应该调用API保存设置
    console.log("保存通知设置:", settings)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="channels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="channels">通知渠道</TabsTrigger>
          <TabsTrigger value="types">通知类型</TabsTrigger>
          <TabsTrigger value="preferences">偏好设置</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>通知渠道设置</CardTitle>
              <CardDescription>配置您希望接收通知的方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="in-app">应用内通知</Label>
                  </div>
                  <Switch
                    id="in-app"
                    checked={settings.channels.inApp}
                    onCheckedChange={(checked) => updateSettings(["channels", "inApp"], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="email">电子邮件</Label>
                  </div>
                  <Switch
                    id="email"
                    checked={settings.channels.email}
                    onCheckedChange={(checked) => updateSettings(["channels", "email"], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="sms">短信通知</Label>
                  </div>
                  <Switch
                    id="sms"
                    checked={settings.channels.sms}
                    onCheckedChange={(checked) => updateSettings(["channels", "sms"], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="wechat">微信通知</Label>
                  </div>
                  <Switch
                    id="wechat"
                    checked={settings.channels.wechat}
                    onCheckedChange={(checked) => updateSettings(["channels", "wechat"], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="dingtalk">钉钉通知</Label>
                  </div>
                  <Switch
                    id="dingtalk"
                    checked={settings.channels.dingtalk}
                    onCheckedChange={(checked) => updateSettings(["channels", "dingtalk"], checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>通知类型设置</CardTitle>
              <CardDescription>选择您希望接收的通知类型</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label htmlFor="system">系统通知</Label>
                      <p className="text-xs text-muted-foreground">系统更新、维护和安全提醒</p>
                    </div>
                  </div>
                  <Switch
                    id="system"
                    checked={settings.types.system}
                    onCheckedChange={(checked) => updateSettings(["types", "system"], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <Label htmlFor="task">任务通知</Label>
                      <p className="text-xs text-muted-foreground">任务分配、截止日期和完成提醒</p>
                    </div>
                  </div>
                  <Switch
                    id="task"
                    checked={settings.types.task}
                    onCheckedChange={(checked) => updateSettings(["types", "task"], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <Label htmlFor="schedule">日程通知</Label>
                      <p className="text-xs text-muted-foreground">会议、活动和日程安排提醒</p>
                    </div>
                  </div>
                  <Switch
                    id="schedule"
                    checked={settings.types.schedule}
                    onCheckedChange={(checked) => updateSettings(["types", "schedule"], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div>
                      <Label htmlFor="reminder">提醒通知</Label>
                      <p className="text-xs text-muted-foreground">个人提醒和待办事项</p>
                    </div>
                  </div>
                  <Switch
                    id="reminder"
                    checked={settings.types.reminder}
                    onCheckedChange={(checked) => updateSettings(["types", "reminder"], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-red-500" />
                    <div>
                      <Label htmlFor="warning">警告通知</Label>
                      <p className="text-xs text-muted-foreground">系统异常和重要警告</p>
                    </div>
                  </div>
                  <Switch
                    id="warning"
                    checked={settings.types.warning}
                    onCheckedChange={(checked) => updateSettings(["types", "warning"], checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>偏好设置</CardTitle>
              <CardDescription>自定义通知的接收方式和时间</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">通知频率</Label>
                  <Select value={settings.frequency} onValueChange={(value) => updateSettings(["frequency"], value)}>
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="选择通知频率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">实时通知</SelectItem>
                      <SelectItem value="hourly">每小时汇总</SelectItem>
                      <SelectItem value="daily">每日汇总</SelectItem>
                      <SelectItem value="weekly">每周汇总</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="do-not-disturb">免打扰模式</Label>
                    <Switch
                      id="do-not-disturb"
                      checked={settings.doNotDisturb.enabled}
                      onCheckedChange={(checked) => updateSettings(["doNotDisturb", "enabled"], checked)}
                    />
                  </div>

                  {settings.doNotDisturb.enabled && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">开始时间</Label>
                        <Select
                          value={settings.doNotDisturb.startTime}
                          onValueChange={(value) => updateSettings(["doNotDisturb", "startTime"], value)}
                        >
                          <SelectTrigger id="start-time">
                            <SelectValue placeholder="选择开始时间" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                                {`${i.toString().padStart(2, "0")}:00`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end-time">结束时间</Label>
                        <Select
                          value={settings.doNotDisturb.endTime}
                          onValueChange={(value) => updateSettings(["doNotDisturb", "endTime"], value)}
                        >
                          <SelectTrigger id="end-time">
                            <SelectValue placeholder="选择结束时间" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                                {`${i.toString().padStart(2, "0")}:00`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="sound">通知声音</Label>
                  </div>
                  <Switch
                    id="sound"
                    checked={settings.sound}
                    onCheckedChange={(checked) => updateSettings(["sound"], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="vibration">振动提醒</Label>
                  </div>
                  <Switch
                    id="vibration"
                    checked={settings.vibration}
                    onCheckedChange={(checked) => updateSettings(["vibration"], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="grouping">通知分组</Label>
                  </div>
                  <Switch
                    id="grouping"
                    checked={settings.grouping}
                    onCheckedChange={(checked) => updateSettings(["grouping"], checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveSettings}>
              <Save className="mr-2 h-4 w-4" />
              保存设置
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
