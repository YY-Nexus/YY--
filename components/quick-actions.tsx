"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, FileText, Calendar, MessageSquare, FileSearch, Award, BarChart2, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto flex-col gap-2 p-4 justify-start items-center hover:bg-slate-50 hover:scale-105 transition-all duration-200"
          onClick={action.action}
        >
          <div className={`p-2 rounded-full ${action.color}`}>
            <action.icon className="h-5 w-5" />
          </div>
          <span className="text-sm">{action.label}</span>
        </Button>
      ))}
    </div>
  )
}
