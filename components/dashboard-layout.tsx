"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  FileText,
  Layers,
  Zap,
  Menu,
  User,
  LogOut,
  Settings,
  Shield,
} from "lucide-react"

import { MainNav } from "@/components/main-nav"
import { SidebarNavItem } from "@/components/sidebar-nav-item"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"
import { NotificationCenter } from "@/components/notifications/notification-center"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navItems = [
  {
    name: "仪表盘",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "财务健康诊断",
    href: "/financial-health-diagnosis",
    icon: Activity,
  },
  {
    name: "高级分析",
    href: "/advanced-analysis",
    icon: BarChart3,
  },
  {
    name: "报表导出",
    href: "/report-export",
    icon: FileText,
  },
  {
    name: "生态系统",
    href: "/ecosystem",
    icon: Layers,
  },
  {
    name: "系统性能",
    href: "/system-performance",
    icon: Zap,
  },
  {
    name: "设置",
    href: "/settings",
    icon: Settings,
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  // 关闭移动端菜单当路由变化时
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // 响应式调整
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        setOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [open])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4 md:gap-8">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">切换菜单</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="py-4">
                  <MainNav />
                </div>
                <nav className="grid gap-2 text-lg font-medium">
                  {navItems.map((item) => (
                    <SidebarNavItem key={item.href} href={item.href} icon={item.icon} active={pathname === item.href}>
                      {item.name}
                    </SidebarNavItem>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <MainNav />
          </div>
          <nav className="flex items-center gap-2">
            <NotificationCenter />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.name || "用户头像"} />
                    <AvatarFallback>{user?.name?.charAt(0) || "用"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => (window.location.href = "/settings")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>个人设置</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            {navItems.map((item) => (
              <SidebarNavItem key={item.href} href={item.href} icon={item.icon} active={pathname === item.href}>
                {item.name}
              </SidebarNavItem>
            ))}
            {user && user.role === "admin" && (
              <SidebarNavItem
                href="/admin"
                icon={<Shield className="h-5 w-5" />}
                label="管理员控制台"
                isActive={pathname === "/admin"}
              />
            )}
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  )
}
