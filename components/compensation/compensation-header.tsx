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
import { Bell, ChevronLeft, Download, Search, Share2, DollarSign } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function CompensationHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only md:not-sr-only md:inline">返回驾驶舱</span>
      </Link>

      <div className="flex items-center gap-2">
        <div className="rounded-md bg-primary/10 p-2">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <span className="text-lg font-semibold tracking-tight hidden md:inline-block">薪酬绩效引擎</span>
      </div>

      <div className="relative flex flex-1 items-center gap-4 md:gap-8 lg:gap-12">
        <nav className="hidden md:flex flex-row items-center gap-6">
          <Button variant="link" className="text-foreground">
            概览
          </Button>
          <Button variant="link" className="text-muted-foreground">
            薪酬方案
          </Button>
          <Button variant="link" className="text-muted-foreground">
            绩效周期
          </Button>
          <Button variant="link" className="text-muted-foreground">
            设置
          </Button>
        </nav>

        <div className={`${isSearchOpen ? "flex" : "hidden"} md:flex flex-1 items-center`}>
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="搜索薪酬方案..." className="w-full pl-8 md:w-2/3 lg:w-1/3" />
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <Search className="h-5 w-5" />
          <span className="sr-only">搜索</span>
        </Button>

        <div className="flex items-center gap-2 md:ml-auto">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <Download className="h-4 w-4" />
            <span>导出</span>
          </Button>

          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <Share2 className="h-4 w-4" />
            <span>分享</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">通知</span>
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>

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
