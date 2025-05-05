"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { navigationData } from "@/lib/navigation-data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NotificationBadge } from "@/components/notifications/notification-badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <img src="/yellow-paint-splatter.png" alt="言语逸品" className="h-8 w-8 rounded-md" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">言语「逸品」</span>
              <span className="text-xs text-muted-foreground">云枢³管理系统</span>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 overflow-auto max-h-[calc(100vh-80px)]">
          <nav className="flex flex-col space-y-1 px-2">
            {navigationData.map((item) => {
              const isActive = pathname === item.path || pathname?.startsWith(item.path + "/")
              const hasChildren = item.children && item.children.length > 0

              if (!hasChildren) {
                return (
                  <Link
                    key={item.id}
                    href={item.path || "#"}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                    {item.title === "通知中心" && <NotificationBadge className="ml-auto" />}
                  </Link>
                )
              }

              return (
                <Accordion key={item.id} type="single" collapsible className="border-none">
                  <AccordionItem value={item.id} className="border-none">
                    <AccordionTrigger
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        "hover:no-underline",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-0">
                      <div className="pl-8 space-y-1">
                        {item.children?.map((child) => {
                          const isChildActive = pathname === child.path
                          return (
                            <Link
                              key={child.id}
                              href={child.path || "#"}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm",
                                isChildActive
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              )}
                            >
                              {child.title}
                            </Link>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
