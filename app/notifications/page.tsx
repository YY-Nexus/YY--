import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationHeader } from "@/components/notifications/notification-header"
import { NotificationList } from "@/components/notifications/notification-list"
import { NotificationSettings } from "@/components/notifications/notification-settings"

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NotificationHeader />

      <main className="flex-1 space-y-6 p-6 pt-4 md:p-8 md:pt-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">通知中心</h1>
          <p className="text-muted-foreground">管理您的系统通知、提醒和消息</p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">全部通知</TabsTrigger>
            <TabsTrigger value="unread">未读通知</TabsTrigger>
            <TabsTrigger value="important">重要通知</TabsTrigger>
            <TabsTrigger value="settings">通知设置</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <NotificationList filter="all" />
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <NotificationList filter="unread" />
          </TabsContent>

          <TabsContent value="important" className="space-y-4">
            <NotificationList filter="important" />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
