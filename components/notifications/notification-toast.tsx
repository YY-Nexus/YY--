"use client"

import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useNotifications } from "@/lib/notification-context"
import { Bell, Calendar, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificationToast() {
  const { notifications, markAsRead } = useNotifications()
  const { toast } = useToast()

  // 监听新通知并显示toast
  useEffect(() => {
    const unreadNotifications = notifications.filter((n) => !n.read)

    if (unreadNotifications.length > 0) {
      // 获取最新的未读通知
      const latestNotification = unreadNotifications[0]

      // 获取通知图标
      const getNotificationIcon = (type: string) => {
        switch (type) {
          case "系统":
            return <Bell className="h-5 w-5 text-blue-500" />
          case "任务":
            return <FileText className="h-5 w-5 text-green-500" />
          case "日程":
            return <Calendar className="h-5 w-5 text-purple-500" />
          case "提醒":
            return <Clock className="h-5 w-5 text-orange-500" />
          default:
            return <Bell className="h-5 w-5" />
        }
      }

      // 显示toast
      toast({
        title: latestNotification.title,
        description:
          latestNotification.content.length > 100
            ? latestNotification.content.substring(0, 100) + "..."
            : latestNotification.content,
        action: (
          <Button variant="outline" size="sm" onClick={() => markAsRead(latestNotification.id)}>
            标为已读
          </Button>
        ),
        icon: getNotificationIcon(latestNotification.type),
      })
    }
  }, [notifications, markAsRead, toast])

  return null
}
