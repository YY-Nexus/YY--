"use client"

import type React from "react"

import { useNavigation } from "@/hooks/use-navigation"
import type { NavItemType } from "@/lib/navigation-data"
import { NavSubmenu } from "./nav-submenu"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { navShortcuts } from "@/hooks/use-nav-shortcuts"
import { useNavPermissions } from "@/hooks/use-nav-permissions"

interface NavItemProps {
  item: NavItemType
}

export function NavItem({ item }: NavItemProps) {
  const { isExpanded, toggleSubmenu, isSubmenuExpanded, activeItemId } = useNavigation()
  const pathname = usePathname()
  const { hasPermission } = useNavPermissions()

  // 检查权限
  if (!hasPermission(item.id)) {
    return null
  }

  const hasChildren = item.children && item.children.length > 0
  const isActive = activeItemId === item.id || pathname === item.path
  const isExpendedSubmenu = isSubmenuExpanded(item.id)

  // 查找快捷键
  const shortcut = navShortcuts.find((s) => s.path === item.path)

  // 处理点击事件
  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault()
      toggleSubmenu(item.id)
    }
  }

  const Icon = item.icon

  return (
    <li className="my-1">
      <div className="relative">
        {/* 主导航项 */}
        <Link
          href={hasChildren ? "#" : item.path || "#"}
          onClick={handleClick}
          className={cn(
            "nav-item flex h-10 items-center rounded-md px-3 py-2 text-sm transition-all",
            isActive
              ? "nav-active bg-primary/10 text-primary font-medium shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            hasChildren && isExpendedSubmenu && "bg-muted/50",
            !isExpanded && "justify-center px-0",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center rounded-md p-1.5",
              isActive && "bg-primary/10 text-primary",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          {isExpanded && (
            <>
              <span className="ml-2 flex-1 truncate">{item.title}</span>
              {shortcut && <kbd className="nav-shortcut-hint ml-auto">Alt+{shortcut.key}</kbd>}
              {hasChildren && (
                <motion.div animate={{ rotate: isExpendedSubmenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              )}
            </>
          )}
        </Link>

        {/* 子菜单 */}
        {hasChildren && <NavSubmenu items={item.children} parentId={item.id} />}
      </div>
    </li>
  )
}
