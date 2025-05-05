"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockNotifications } from "@/data/notification-data"

// 定义通知类型
export type Notification = {
  id: string
  title: string
  content: string
  type: string
  time: string
  read: boolean
  important: boolean
  category?: string
  sender?: {
    name: string
    title?: string
    avatar?: string
  }
  actions?: Array<{
    label: string
    primary?: boolean
  }>
  attachments?: Array<{
    name: string
    size: string
    url: string
  }>
}

// 定义通知上下文类型
type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
}

// 创建通知上下文
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// 通知提供者组件
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // 初始化通知数据
  useEffect(() => {
    // 在实际应用中，这里应该从API获取通知数据
    setNotifications(mockNotifications)
  }, [])

  // 计算未读通知数量
  const unreadCount = notifications.filter((n) => !n.read).length

  // 添加新通知
  const addNotification = (notification: Omit<Notification, "id" | "time" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toLocaleString(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
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

  // 删除通知
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // 清空所有通知
  const clearAll = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// 自定义钩子，用于在组件中访问通知上下文
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
