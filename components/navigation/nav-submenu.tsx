"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useNavigation } from "@/hooks/use-navigation"
import type { NavItemType } from "@/lib/navigation-data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavSubmenuProps {
  items: NavItemType[]
  parentId: string
}

export function NavSubmenu({ items, parentId }: NavSubmenuProps) {
  const { isExpanded, isSubmenuExpanded } = useNavigation()
  const pathname = usePathname()

  // 如果父菜单未展开，则不显示子菜单
  if (!isSubmenuExpanded(parentId)) {
    return null
  }

  return (
    <AnimatePresence initial={false}>
      <motion.ul
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden pl-4"
      >
        {items.map((item) => {
          const isActive = pathname === item.path

          return (
            <motion.li
              key={item.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="my-1"
            >
              <Link
                href={item.path || "#"}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  !isExpanded && "justify-center px-0",
                )}
              >
                {isExpanded ? (
                  <span className="ml-6">{item.title}</span>
                ) : (
                  <span className="sr-only">{item.title}</span>
                )}
              </Link>
            </motion.li>
          )
        })}
      </motion.ul>
    </AnimatePresence>
  )
}
