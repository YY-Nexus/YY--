import type React from "react"
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
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-gray-900",
        className,
      )}
    >
      <Icon className="w-5 h-5 mr-3 text-gray-500" />
      <span>{children}</span>
    </Link>
  )
}
