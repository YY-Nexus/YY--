"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface MobileInteractiveCardProps {
  title: string
  description?: string
  href: string
  className?: string
  children: ReactNode
  footer?: ReactNode
  onClick?: () => void
}

export function MobileInteractiveCard({
  title,
  description,
  href,
  className,
  children,
  footer,
  onClick,
}: MobileInteractiveCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 active:scale-[0.98]",
        className,
      )}
      onClick={handleClick}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-4 pt-2">{children}</CardContent>
      {footer && <div className="p-4 pt-0 border-t">{footer}</div>}
    </Card>
  )
}
