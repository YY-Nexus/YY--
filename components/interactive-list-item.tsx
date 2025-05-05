"use client"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface InteractiveListItemProps {
  href: string
  className?: string
  children: ReactNode
  onClick?: () => void
}

export function InteractiveListItem({ href, className, children, onClick }: InteractiveListItemProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    }
  }

  return (
    <li
      className={cn(
        "p-3 border-b last:border-b-0 cursor-pointer transition-all duration-200 hover:bg-slate-50 active:bg-slate-100",
        className,
      )}
      onClick={handleClick}
    >
      {children}
    </li>
  )
}
