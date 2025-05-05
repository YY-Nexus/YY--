"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// 定义快捷键配置
export const navShortcuts = [
  { key: "1", path: "/organization", name: "组织治理中枢" },
  { key: "2", path: "/employee-lifecycle", name: "员工全周期管理" },
  { key: "3", path: "/compensation", name: "薪酬绩效引擎" },
  { key: "4", path: "/data-decision", name: "数据决策中心" },
  { key: "5", path: "/employee-experience", name: "员工体验工场" },
  { key: "6", path: "/strategic-planning", name: "战略规划实验室" },
  { key: "7", path: "/financial-control", name: "财务管控中枢" },
  { key: "8", path: "/intelligent-process", name: "智能流程工厂" },
  { key: "9", path: "/learning-innovation", name: "学习创新平台" },
  { key: "0", path: "/system-config", name: "系统配置中心" },
]

export function useNavShortcuts() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果用户正在输入，不触发快捷键
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Alt + 数字键快捷导航
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const shortcut = navShortcuts.find((s) => s.key === e.key)
        if (shortcut) {
          e.preventDefault()
          router.push(shortcut.path)
          toast({
            title: "快捷导航",
            description: `已跳转到${shortcut.name}`,
            duration: 2000,
          })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, toast])

  return { navShortcuts }
}
