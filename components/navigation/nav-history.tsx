"use client"

import { useNavHistory } from "@/hooks/use-nav-history"
import { useNavigation } from "@/hooks/use-navigation"
import { cn } from "@/lib/utils"
import { History, X, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

export function NavHistory() {
  const { history, clearHistory, removeFromHistory } = useNavHistory()
  const { isExpanded } = useNavigation()

  if (history.length === 0) return null

  return (
    <div className="space-y-2 px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm font-medium text-muted-foreground">
          <History className="mr-1 h-3.5 w-3.5" />
          <span>最近访问</span>
        </div>
        {isExpanded && history.length > 0 && (
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={clearHistory}>
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">清空历史</span>
          </Button>
        )}
      </div>
      <div className="space-y-1">
        {history.slice(0, isExpanded ? 5 : 3).map((item) => {
          const Icon = item.icon
          const timeAgo = formatDistanceToNow(new Date(item.timestamp), {
            addSuffix: true,
            locale: zhCN,
          })

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="group relative"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                        !isExpanded && "justify-center px-0",
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5", isExpanded && "mr-2")} />
                      {isExpanded && (
                        <>
                          <span className="flex-1 truncate">{item.title}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{timeAgo}</span>
                        </>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {isExpanded && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeFromHistory(item.id)
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">移除</span>
                </Button>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
