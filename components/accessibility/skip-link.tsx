"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SkipLinkProps {
  className?: string
}

export function SkipLink({ className }: SkipLinkProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <a href="#main-content" className={cn("skip-link", className)}>
      跳到主要内容
    </a>
  )
}
