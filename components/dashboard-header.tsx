"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { NotificationBadge } from "@/components/notifications/notification-badge"
import { MobileNavigation } from "@/components/mobile-navigation"

export function DashboardHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
      <MobileNavigation />

      <div className="flex items-center gap-2">
        <img src="/yellow-paint-splatter.png" alt="言语逸品" className="h-8 w-8 rounded-md" />
        <span className="text-lg font-semibold tracking-tight hidden md:inline-block">言语「逸品」</span>
      </div>

      <div className="relative flex flex-1 items-center gap-4 md:gap-8 lg:gap-12">
        <nav className="hidden md:flex flex-row items-center gap-6">
          <Button variant="link" className="text-muted-foreground">
            仪表盘
          </Button>
          <Button variant="link" className="text-muted-foreground">
            应用
          </Button>
          <Button variant="link" className="text-muted-foreground">
            报表
          </Button>
          <Button variant="link" className="text-muted-foreground">
            设置
          </Button>
        </nav>

        <div
          className={`${isSearchOpen ? "flex absolute inset-x-0 top-0 bg-background p-2 z-10 h-16 items-center" : "hidden"} md:relative md:flex md:flex-1 md:items-center md:bg-transparent md:p-0 md:h-auto`}
        >
          <Search className="absolute left-4 md:left-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="搜索..." className="w-full pl-8 md:w-2/3 lg:w-1/3" />
          {isSearchOpen && (
            <Button variant="ghost" size="sm" className="ml-2 md:hidden" onClick={() => setIsSearchOpen(false)}>
              取消
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <Search className="h-5 w-5" />
          <span className="sr-only">搜索</span>
        </Button>

        <div className="flex items-center gap-4 md:ml-auto">
          <NotificationBadge />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img src="/user-avatar.png" alt="用户头像" className="rounded-full" width="32" height="32" />
                <span className="sr-only">用户菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>个人资料</DropdownMenuItem>
              <DropdownMenuItem>设置</DropdownMenuItem>
              <DropdownMenuItem>帮助中心</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>退出登录</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
