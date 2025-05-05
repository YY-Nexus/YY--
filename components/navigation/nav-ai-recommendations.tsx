"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigation } from "@/hooks/use-navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Link from "next/link"

// 模拟AI推荐数据
const mockRecommendations = [
  {
    id: "rec1",
    title: "查看员工流失风险报告",
    description: "基于最近的数据分析，有3名员工存在高流失风险",
    path: "/employee-lifecycle",
    priority: "high",
  },
  {
    id: "rec2",
    title: "薪酬结构调整建议",
    description: "市场数据显示部分岗位薪酬竞争力下降",
    path: "/compensation",
    priority: "medium",
  },
  {
    id: "rec3",
    title: "组织结构优化方案",
    description: "AI分析显示当前结构存在效率瓶颈",
    path: "/organization",
    priority: "medium",
  },
]

export function NavAIRecommendations() {
  const { isExpanded } = useNavigation()
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [isOpen, setIsOpen] = useState(false)

  // 使用useRef避免依赖项变化导致的无限循环
  const isExpandedRef = useRef(isExpanded)

  // 只在isExpanded真正变化时更新ref
  useEffect(() => {
    isExpandedRef.current = isExpanded
  }, [isExpanded])

  // 切换推荐面板的开关状态
  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  // 获取优先级对应的样式
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    }
  }

  // 如果没有推荐，不显示组件
  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="px-3 py-2">
      <button
        onClick={toggleOpen}
        className={cn(
          "flex w-full items-center rounded-md p-2 text-sm font-medium transition-colors",
          "hover:bg-muted",
          isOpen ? "bg-muted" : "transparent",
          isExpanded ? "justify-between" : "justify-center",
        )}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {isExpanded && <span>AI推荐</span>}
        </div>
        {isExpanded && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {recommendations.length}
          </span>
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 space-y-1 overflow-hidden"
        >
          {recommendations.map((rec) => (
            <Link
              key={rec.id}
              href={rec.path}
              className={cn(
                "block rounded-md p-2 text-xs transition-colors",
                "hover:bg-muted",
                isExpanded ? "mx-0" : "mx-auto w-8",
              )}
            >
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 flex h-2 w-2 flex-shrink-0 rounded-full",
                    rec.priority === "high" ? "bg-red-500" : "bg-amber-500",
                  )}
                />
                <div className={cn("flex-1", !isExpanded && "sr-only")}>
                  <div className="font-medium">{rec.title}</div>
                  <p className="line-clamp-2 text-muted-foreground">{rec.description}</p>
                  <span
                    className={cn(
                      "mt-1 inline-block rounded-sm px-1.5 py-0.5 text-[10px] font-medium",
                      getPriorityStyles(rec.priority),
                    )}
                  >
                    {rec.priority === "high" ? "高优先级" : "中优先级"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  )
}
