"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, FileText, Calendar, MessageSquare, FileSearch, Award, BarChart2, Settings } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

export function QuickActionsMobile() {
  const router = useRouter()

  const actions = [
    {
      icon: UserPlus,
      label: "新增员工",
      color: "bg-blue-100 text-blue-700",
      action: () => router.push("/employee-lifecycle?action=add"),
    },
    {
      icon: FileText,
      label: "申请审批",
      color: "bg-green-100 text-green-700",
      action: () => router.push("/approvals"),
    },
    {
      icon: Calendar,
      label: "排班管理",
      color: "bg-purple-100 text-purple-700",
      action: () => router.push("/scheduling"),
    },
    {
      icon: MessageSquare,
      label: "发起会议",
      color: "bg-yellow-100 text-yellow-700",
      action: () => router.push("/meetings/new"),
    },
    {
      icon: FileSearch,
      label: "查询档案",
      color: "bg-pink-100 text-pink-700",
      action: () => router.push("/archives"),
    },
    {
      icon: Award,
      label: "员工激励",
      color: "bg-orange-100 text-orange-700",
      action: () => router.push("/incentives"),
    },
    {
      icon: BarChart2,
      label: "数据报表",
      color: "bg-indigo-100 text-indigo-700",
      action: () => router.push("/reports"),
    },
    {
      icon: Settings,
      label: "系统设置",
      color: "bg-gray-100 text-gray-700",
      action: () => router.push("/system-config"),
    },
  ]

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-3 p-1">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto flex-col gap-2 p-3 justify-start items-center flex-shrink-0 w-[80px] hover:bg-slate-50 hover:scale-105 transition-all duration-200 active:scale-95"
            onClick={action.action}
          >
            <div className={`p-2 rounded-full ${action.color}`}>
              <action.icon className="h-4 w-4" />
            </div>
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
