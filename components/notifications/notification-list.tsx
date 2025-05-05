"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertCircle,
  Archive,
  Bell,
  Calendar,
  Check,
  Clock,
  FileText,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockNotifications } from "@/data/notification-data"
import { NotificationDetail } from "./notification-detail"

type NotificationListProps = {
  filter: "all" | "unread" | "important"
}

export function NotificationList({ filter }: NotificationListProps) {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null)

  // 根据过滤条件筛选通知
  const filteredNotifications = mockNotifications.filter((notification) => {
    if (filter === "unread") return !notification.read
    if (filter === "important") return notification.important
    return true
  })

  // 处理选择通知
  const handleSelect = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter((item) => item !== id))
    } else {
      setSelectedNotifications([...selectedNotifications, id])
    }
  }

  // 处理全选
  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    }
  }

  // 处理标记为已读
  const handleMarkAsRead = () => {
    // 在实际应用中，这里应该调用API更新通知状态
    console.log("标记为已读:", selectedNotifications)
    setSelectedNotifications([])
  }

  // 处理归档
  const handleArchive = () => {
    // 在实际应用中，这里应该调用API归档通知
    console.log("归档通知:", selectedNotifications)
    setSelectedNotifications([])
  }

  // 处理删除
  const handleDelete = () => {
    // 在实际应用中，这里应该调用API删除通知
    console.log("删除通知:", selectedNotifications)
    setSelectedNotifications([])
  }

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
      case "警告":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <>
      {selectedNotification && (
        <NotificationDetail notificationId={selectedNotification} onClose={() => setSelectedNotification(null)} />
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            全选
          </label>
        </div>

        {selectedNotifications.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleMarkAsRead}>
              <Check className="mr-2 h-4 w-4" />
              标为已读
            </Button>
            <Button variant="outline" size="sm" onClick={handleArchive}>
              <Archive className="mr-2 h-4 w-4" />
              归档
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>
            {filter === "all" && "所有通知"}
            {filter === "unread" && "未读通知"}
            {filter === "important" && "重要通知"}
          </CardTitle>
          <CardDescription>
            {filteredNotifications.length > 0 ? `共 ${filteredNotifications.length} 条通知` : "没有符合条件的通知"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-4 p-3 rounded-md transition-colors ${
                  notification.read ? "bg-background" : "bg-muted/50"
                } hover:bg-muted cursor-pointer`}
                onClick={() => setSelectedNotification(notification.id)}
              >
                <div className="flex items-center h-full pt-1">
                  <Checkbox
                    checked={selectedNotifications.includes(notification.id)}
                    onCheckedChange={() => handleSelect(notification.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="flex-shrink-0 pt-1">{getNotificationIcon(notification.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{notification.title}</span>
                      {notification.important && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          新
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.content}</p>

                  {notification.sender && (
                    <div className="flex items-center mt-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage
                          src={notification.sender.avatar || "/placeholder.svg"}
                          alt={notification.sender.name}
                        />
                        <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{notification.sender.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">更多选项</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("标记为已读/未读")
                        }}
                      >
                        {notification.read ? "标记为未读" : "标记为已读"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("标记为重要/取消重要")
                        }}
                      >
                        {notification.important ? "取消重要标记" : "标记为重要"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("归档通知")
                        }}
                      >
                        归档
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("删除通知")
                        }}
                      >
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">没有符合条件的通知</p>
              </div>
            )}
          </div>
        </CardContent>
        {filteredNotifications.length > 0 && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              显示 {filteredNotifications.length} 条通知中的 {filteredNotifications.length} 条
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                上一页
              </Button>
              <Button variant="outline" size="sm">
                下一页
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  )
}
