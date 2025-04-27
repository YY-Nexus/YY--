"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useUserSettings } from "@/lib/user-settings"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  category: "financial" | "report" | "system" | "team"
  actionUrl?: string
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()
  const { settings } = useUserSettings()

  // 从本地存储加载通知
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications")
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications)
        // 将字符串日期转换为Date对象
        const formattedNotifications = parsedNotifications.map((notification: any) => ({
          ...notification,
          timestamp: new Date(notification.timestamp),
        }))
        setNotifications(formattedNotifications)
      } catch (error) {
        console.error("加载通知失败:", error)
      }
    }
  }, [])

  // 保存通知到本地存储
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  }, [notifications])

  // 计算未读通知数量
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // 添加新通知
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // 根据用户设置显示浏览器通知
    if (settings.notificationChannels.browser) {
      // 检查通知类型是否在用户设置中启用
      let shouldNotify = false
      switch (notification.category) {
        case "financial":
          shouldNotify = settings.notifications.financialAlerts
          break
        case "report":
          shouldNotify = settings.notifications.reportReady
          break
        case "system":
          shouldNotify = settings.notifications.systemUpdates
          break
        case "team":
          shouldNotify = settings.notifications.teamActivities
          break
      }

      if (shouldNotify) {
        // 显示toast通知
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === "error" ? "destructive" : "default",
        })

        // 如果浏览器支持通知API，显示浏览器通知
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.ico",
          })
        }
      }
    }
  }

  // 标记通知为已读
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // 标记所有通知为已读
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // 清除所有通知
  const clearNotifications = () => {
    setNotifications([])
    localStorage.removeItem("notifications")
  }

  // 请求通知权限
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
