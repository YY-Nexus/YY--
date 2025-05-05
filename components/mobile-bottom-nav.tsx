"use client"

import { Home, Users, DollarSign, BarChart2, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const pathname = usePathname()

  const routes = [
    {
      name: "驾驶舱",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      name: "组织治理",
      href: "/organization",
      icon: BarChart2,
      active: pathname === "/organization",
    },
    {
      name: "员工全周期",
      href: "/employee-lifecycle",
      icon: Users,
      active: pathname === "/employee-lifecycle",
    },
    {
      name: "薪酬绩效",
      href: "/compensation",
      icon: DollarSign,
      active: pathname === "/compensation",
    },
    {
      name: "更多",
      href: "#",
      icon: Menu,
      active: false,
      isMenu: true,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <nav className="flex justify-around">
        {routes.map((route) => (
          <Link
            key={route.name}
            href={route.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <route.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{route.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
