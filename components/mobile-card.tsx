"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface MobileCardProps {
  title: string
  description?: string
  className?: string
  children: React.ReactNode
  footer?: React.ReactNode
  href?: string
  onClick?: () => void
  interactive?: boolean
}

export function MobileCard({
  title,
  description,
  className,
  children,
  footer,
  href,
  onClick,
  interactive = false,
}: MobileCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    }
  }

  const cardProps = interactive
    ? {
        className: cn(
          "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 active:scale-[0.98]",
          className,
        ),
        onClick: handleClick,
      }
    : {
        className: cn("overflow-hidden", className),
      }

  return (
    <Card {...cardProps}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-4 pt-2">{children}</CardContent>
      {footer && <div className="p-4 pt-0 border-t">{footer}</div>}
    </Card>
  )
}
