import Link from "next/link"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  return (
    <div className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
        言语「逸品」数字驾驶舱
      </Link>
    </div>
  )
}
