import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
  children?: React.ReactNode
}

export function MainNav({ className, children }: MainNavProps) {
  return (
    <div className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link href="/" className="text-xl font-medium transition-colors hover:text-primary">
        {children || "言语「逸品」数字驾驶舱"}
      </Link>
    </div>
  )
}
