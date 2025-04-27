"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useNotifications, type Notification } from "@/lib/notifications"
import { cn } from "@/lib/utils"

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications()
  const [open, setOpen] = useState(false)

  // 格式化通知时间
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // 小于1分钟
    if (diff < 60 * 1000) {
      return "刚刚"
    }

    // 小于1小时
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes}分钟前`
    }

    // 小于24小时
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000))
      return `${hours}小时前`
    }

    // 小于7天
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000))
      return `${days}天前`
    }

    // 其他情况显示日期
    return date.toLocaleDateString()
  }

  // 获取通知类型对应的样式
  const getNotificationStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 hover:bg-green-100"
      case "warning":
        return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
      case "error":
        return "bg-red-50 border-red-200 hover:bg-red-100"
      default:
        return "bg-blue-50 border-blue-200 hover:bg-blue-100"
    }
  }

  // 获取通知类别对应的文本
  const getCategoryText = (category: Notification["category"]) => {
    switch (category) {
      case "financial":
        return "财务预警"
      case "report":
        return "报表通知"
      case "system":
        return "系统通知"
      case "team":
        return "团队动态"
      default:
        return "通知"
    }
  }

  // 处理点击通知
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }

    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">通知中心</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>通知</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              全部已读
            </Button>
            <Button variant="ghost" size="sm" onClick={clearNotifications} className="h-8 text-xs">
              清空
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">暂无通知</div>
        ) : (
          <ScrollArea className="h-[300px]">
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex flex-col items-start p-3 border-l-2 cursor-pointer",
                    getNotificationStyles(notification.type),
                    !notification.read && "font-medium border-l-blue-500",
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{notification.title}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {getCategoryText(notification.category)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                    {!notification.read && (
                      <Badge variant="secondary" className="text-xs">
                        未读
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
