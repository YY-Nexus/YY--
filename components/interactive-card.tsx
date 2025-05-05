"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface InteractiveCardProps {
  title: string
  description?: string
  href: string
  className?: string
  children: ReactNode
  footer?: ReactNode
  onClick?: () => void
}

export function InteractiveCard({
  title,
  description,
  href,
  className,
  children,
  footer,
  onClick,
}: InteractiveCardProps) {
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
        "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 hover:scale-[1.01] active:scale-[0.99]",
        className,
      )}
      onClick={handleClick}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-4 pt-2">{children}</CardContent>
      {footer && <CardFooter className="p-4 pt-0 border-t">{footer}</CardFooter>}
    </Card>
  )
}
