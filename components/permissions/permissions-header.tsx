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
import { Bell, Menu, Search, Home, Settings, Shield } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function PermissionsHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Button variant="outline" size="icon" className="shrink-0 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">切换菜单</span>
      </Button>

      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <span className="text-lg font-semibold tracking-tight hidden md:inline-block">系统配置 / 用户权限</span>
      </div>

      <div className="relative flex flex-1 items-center gap-4 md:gap-8 lg:gap-12">
        <nav className="hidden md:flex flex-row items-center gap-6">
          <Link href="/system-config">
            <Button variant="link" className="text-muted-foreground">
              <Settings className="mr-2 h-4 w-4" />
              系统配置
            </Button>
          </Link>
          <Button variant="link" className="text-primary">
            <Shield className="mr-2 h-4 w-4" />
            用户权限
          </Button>
        </nav>

        <div className={`${isSearchOpen ? "flex" : "hidden"} md:flex flex-1 items-center`}>
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="搜索用户或角色..." className="w-full pl-8 md:w-2/3 lg:w-1/3" />
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <Search className="h-5 w-5" />
          <span className="sr-only">搜索</span>
        </Button>

        <div className="flex items-center gap-4 md:ml-auto">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">通知</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img src="/user-avatar.png" alt="用户头像" className="rounded-full" width="32" height="32" />
                <span className="sr-only">用户菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>管理员账户</DropdownMenuLabel>
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
