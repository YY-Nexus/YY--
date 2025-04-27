"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarNavItemProps {
  href: string
  icon: LucideIcon
  children: React.ReactNode
  className?: string
}

export function SidebarNavItem({ href, icon: Icon, children, className }: SidebarNavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100 hover:text-gray-900 text-gray-700",
        className,
      )}
    >
      <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-primary" : "text-gray-500")} />
      <span>{children}</span>
    </Link>
  )
}
