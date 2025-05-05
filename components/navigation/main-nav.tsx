"use client"

import { useNavigation } from "@/hooks/use-navigation"
import { useNavPermissions } from "@/hooks/use-nav-permissions"
import { NavItem } from "./nav-item"
import { NavToggle } from "./nav-toggle"
import { NavSearch } from "./nav-search"
import { NavThemeSettings } from "./nav-theme-settings"
import { NavAIRecommendations } from "./nav-ai-recommendations"
import { NavHistory } from "./nav-history"
import { NavFavorites } from "./nav-favorites"
import { NavLanguageSwitcher } from "./nav-language-switcher"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { VirtualScrollList } from "./virtual-scroll-list"
import { useNavTheme } from "@/hooks/use-nav-theme"
import { useNavShortcuts } from "@/hooks/use-nav-shortcuts"
import { useNavAnalytics } from "@/hooks/use-nav-analytics"
import { useI18n } from "@/hooks/use-i18n"

export function MainNav() {
  const { isExpanded } = useNavigation()
  const { filteredNavigation } = useNavPermissions()
  const { getThemeClasses } = useNavTheme()
  const { t } = useI18n()
  const { recordEvent } = useNavAnalytics()

  // 初始化快捷键
  useNavShortcuts()

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 240 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "relative flex h-screen flex-col border-r bg-background shadow-sm",
        isExpanded ? "w-[240px]" : "w-[64px]",
        getThemeClasses(),
      )}
    >
      {/* 导航切换按钮 */}
      <NavToggle />

      {/* 导航头部 */}
      <div className="flex h-16 items-center px-4 border-b">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex-shrink-0 rounded-md bg-primary/10 p-1">
            <img src="/yellow-paint-splatter.png" alt="言语逸品" className="h-8 w-8" />
          </div>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold">言语「逸品」</span>
              <span className="text-xs text-muted-foreground">云枢³管理系统</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* 搜索框 */}
      <div className="px-3 py-2">
        <NavSearch />
      </div>

      {/* AI推荐 */}
      <NavAIRecommendations />

      {/* 收藏夹 */}
      <NavFavorites />

      {/* 历史记录 */}
      <NavHistory />

      {/* 导航内容 - 使用虚拟滚动 */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav>
          <VirtualScrollList
            items={filteredNavigation}
            itemHeight={40} // 每个导航项的高度
            className="h-full"
            renderItem={(item, index) => <NavItem key={item.id} item={item} />}
          />
        </nav>
      </ScrollArea>

      {/* 导航设置 */}
      <div className="border-t p-3 space-y-1">
        <NavThemeSettings />
        <NavLanguageSwitcher />
      </div>

      {/* 导航底部 */}
      <div className="border-t p-3">
        <div
          className={cn(
            "flex items-center rounded-md bg-muted/50 p-2",
            isExpanded ? "justify-start" : "justify-center",
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <img src="/user-avatar.png" alt="用户头像" className="h-6 w-6 rounded-full" />
          </div>
          {isExpanded && (
            <div className="ml-2 overflow-hidden">
              <p className="text-sm font-medium truncate">张三</p>
              <p className="text-xs text-muted-foreground truncate">管理员</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
