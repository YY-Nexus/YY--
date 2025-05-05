"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/hooks/use-navigation"
import { navigationData, type NavItemType } from "@/lib/navigation-data"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// 扁平化导航数据，包括子菜单
function flattenNavItems(items: NavItemType[]): NavItemType[] {
  return items.reduce<NavItemType[]>((acc, item) => {
    acc.push(item)
    if (item.children && item.children.length > 0) {
      acc.push(...flattenNavItems(item.children))
    }
    return acc
  }, [])
}

export function NavSearch() {
  const { isExpanded } = useNavigation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<NavItemType[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // 扁平化的导航项
  const flatNavItems = flattenNavItems(navigationData)

  // 处理搜索
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = flatNavItems.filter((item) => item.title.toLowerCase().includes(query))
    setSearchResults(results)
  }, [searchQuery])

  // 打开搜索时聚焦输入框
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  // 处理搜索结果点击
  const handleResultClick = (item: NavItemType) => {
    if (item.path) {
      router.push(item.path)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  // 处理搜索快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K 或 Command+K 打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      // Escape 关闭搜索
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false)
        setSearchQuery("")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSearchOpen])

  return (
    <div className={cn("relative", isExpanded ? "w-full" : "w-8")}>
      {isExpanded ? (
        <Button
          variant="outline"
          className="w-full justify-between text-muted-foreground"
          onClick={() => setIsSearchOpen(true)}
        >
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            <span>搜索...</span>
          </div>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      ) : (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSearchOpen(true)}>
          <Search className="h-4 w-4" />
          <span className="sr-only">搜索</span>
        </Button>
      )}

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 pt-20 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsSearchOpen(false)
                setSearchQuery("")
              }
            }}
          >
            <div className="w-full max-w-md rounded-lg border bg-background shadow-lg">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索功能模块..."
                  className="flex h-12 w-full border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery("")
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">关闭</span>
                </Button>
              </div>
              {searchResults.length > 0 && (
                <div className="max-h-80 overflow-y-auto p-2">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => handleResultClick(item)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">未找到匹配的功能模块</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
