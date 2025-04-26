import type React from "react"
import {
  File,
  Home,
  Settings,
  User,
  FileDown,
  Layers,
  Grid,
  Users,
  Share2,
  Bell,
  Database,
  Palette,
  Zap,
  Puzzle,
} from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { MainNav } from "@/components/main-nav"
import { SidebarNavItem } from "@/components/sidebar-nav-item"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const sidebarNavItems = [
  {
    name: "首页",
    href: "/",
    icon: Home,
  },
  {
    name: "用户管理",
    href: "/users",
    icon: User,
  },
  {
    name: "报表",
    href: "/reports",
    icon: File,
  },
  {
    name: "报表导出",
    href: "/report-export",
    icon: FileDown,
  },
  {
    name: "财务健康诊断",
    href: "/financial-health-diagnosis",
    icon: Layers,
  },
  {
    name: "多维度分析",
    href: "/multi-dimension-analysis",
    icon: Grid,
  },
  {
    name: "团队协作",
    href: "/team-collaboration",
    icon: Users,
  },
  {
    name: "共享报表",
    href: "/shared-reports",
    icon: Share2,
  },
  {
    name: "任务管理",
    href: "/task-management",
    icon: Bell,
  },
  {
    name: "数据集成",
    href: "/data-integration",
    icon: Database,
  },
  {
    name: "用户体验",
    href: "/user-experience",
    icon: Palette,
  },
  {
    name: "系统性能",
    href: "/system-performance",
    icon: Zap,
  },
  {
    name: "生态系统",
    href: "/ecosystem",
    icon: Puzzle,
  },
  {
    name: "设置",
    href: "/settings",
    icon: Settings,
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r border-gray-200 py-4 px-3">
        <div className="mb-8">
          <MainNav className="font-bold text-lg">管理后台</MainNav>
        </div>
        <Separator className="mb-4" />
        <nav className="flex flex-col space-y-1">
          {sidebarNavItems.map((item) => (
            <SidebarNavItem key={item.name} href={item.href} icon={item.icon}>
              {item.name}
            </SidebarNavItem>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 overflow-auto">{children}</main>
    </div>
  )
}
