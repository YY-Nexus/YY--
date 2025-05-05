import type { ReactNode } from "react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

interface MobileLayoutProps {
  children: ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileBottomNav />
    </div>
  )
}
