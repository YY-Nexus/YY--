"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { getPreloadService } from "@/lib/preload-service"

interface PrefetchLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  prefetch?: boolean
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export function PrefetchLink({ href, children, className, prefetch = true, onClick }: PrefetchLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const preloadService = getPreloadService()

  useEffect(() => {
    if (!prefetch || !linkRef.current) return

    // 观察链接元素
    preloadService.observe(linkRef.current, href)

    return () => {
      if (linkRef.current) {
        preloadService.unobserve(linkRef.current)
      }
    }
  }, [href, prefetch])

  return (
    <Link href={href} className={className} ref={linkRef} onClick={onClick}>
      {children}
    </Link>
  )
}
