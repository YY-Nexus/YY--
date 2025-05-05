"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  Check,
  Clock,
  FileText,
  Link2,
  MoreHorizontal,
  Reply,
  Star,
  Trash2,
} from "lucide-react"
import { mockNotifications } from "@/data/notification-data"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

type NotificationDetailProps = {
  notificationId: string
  onClose: () => void
}

export function NotificationDetail({ notificationId, onClose }: NotificationDetailProps) {
  const [notification, setNotification] = useState(mockNotifications.find((n) => n.id === notificationId) || null)
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState("")

  // 在实际应用中，这里应该调用API标记通知为已读
  useEffect(() => {
    if (notification && !notification.read) {
      console.log("标记通知为已读:", notificationId)
      // 更新本地状态，模拟已读效果
      setNotification({ ...notification, read: true })
    }
  }, [notification, notificationId])

  if (!notification) return null

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

  // 处理回复提交
  const handleSubmitReply = () => {
    if (!replyText.trim()) return

    // 在实际应用中，这里应该调用API提交回复
    console.log("提交回复:", replyText)
    setIsReplying(false)
    setReplyText("")
  }

  // 获取当前通知在列表中的索引
  const currentIndex = mockNotifications.findIndex((n) => n.id === notificationId)
  const prevNotification = currentIndex > 0 ? mockNotifications[currentIndex - 1] : null
  const nextNotification = currentIndex < mockNotifications.length - 1 ? mockNotifications[currentIndex + 1] : null

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getNotificationIcon(notification.type)}
              <DialogTitle>{notification.title}</DialogTitle>
              {notification.important && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!prevNotification}
                onClick={() => {
                  if (prevNotification) {
                    setNotification(prevNotification)
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">上一条</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!nextNotification}
                onClick={() => {
                  if (nextNotification) {
                    setNotification(nextNotification)
                  }
                }}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">下一条</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">更多选项</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      console.log("标记为重要/取消重要")
                    }}
                  >
                    {notification.important ? "取消重要标记" : "标记为重要"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      console.log("复制链接")
                    }}
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    复制链接
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      console.log("归档通知")
                    }}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    归档
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      console.log("删除通知")
                      onClose()
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogDescription className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">
                {notification.type}
              </Badge>
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </div>
            {notification.category && <Badge variant="secondary">{notification.category}</Badge>}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {notification.sender && (
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={notification.sender.avatar || "/placeholder.svg"} alt={notification.sender.name} />
                <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{notification.sender.name}</div>
                <div className="text-xs text-muted-foreground">{notification.sender.title}</div>
              </div>
            </div>
          )}

          <div className="text-sm leading-relaxed whitespace-pre-line">{notification.content}</div>

          {notification.actions && notification.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {notification.actions.map((action, index) => (
                <Button key={index} variant={action.primary ? "default" : "outline"} size="sm">
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {notification.attachments && notification.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">附件</h4>
              <div className="grid grid-cols-2 gap-2">
                {notification.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center p-2 border rounded-md hover:bg-muted cursor-pointer">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div className="overflow-hidden">
                      <div className="text-sm truncate">{attachment.name}</div>
                      <div className="text-xs text-muted-foreground">{attachment.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {notification.type !== "系统" && (
          <>
            <Separator />

            {isReplying ? (
              <div className="space-y-4 mt-4">
                <Textarea
                  placeholder="输入回复内容..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsReplying(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSubmitReply} disabled={!replyText.trim()}>
                    发送回复
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsReplying(true)}>
                  <Reply className="mr-2 h-4 w-4" />
                  回复
                </Button>
              </div>
            )}
          </>
        )}

        <DialogFooter className="sm:justify-start">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("标记为已读")
                onClose()
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              标为已读
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("归档通知")
                onClose()
              }}
            >
              <Archive className="mr-2 h-4 w-4" />
              归档
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("删除通知")
                onClose()
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
