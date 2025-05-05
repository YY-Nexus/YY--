"use client"

import { useState, useEffect } from "react"

export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState<boolean>(false)

  useEffect(() => {
    // 初始化离线状态
    setIsOffline(!navigator.onLine)

    // 监听网络状态变化
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOffline
}
