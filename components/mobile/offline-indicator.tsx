"use client"

import { useOfflineStatus } from "@/hooks/use-offline-status"
import { WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface OfflineIndicatorProps {
  className?: string
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const isOffline = useOfflineStatus()

  if (!isOffline) return null

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-yellow-500 text-yellow-950 py-1 px-2 text-sm",
        className,
      )}
    >
      <WifiOff className="h-4 w-4 mr-2" />
      <span>您当前处于离线模式，数据将在网络恢复后自动同步</span>
    </div>
  )
}
