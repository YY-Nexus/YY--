"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Laptop, Check } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface ThemeToggleAdvancedProps {
  className?: string
}

export function ThemeToggleAdvanced({ className }: ThemeToggleAdvancedProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [oledMode, setOledMode] = useState(false)
  const [contrastLevel, setContrastLevel] = useState(100)

  // 在客户端渲染后再显示组件
  useEffect(() => {
    setMounted(true)

    // 从localStorage加载设置
    const savedOledMode = localStorage.getItem("oledMode")
    if (savedOledMode) {
      setOledMode(savedOledMode === "true")
    }

    const savedContrastLevel = localStorage.getItem("contrastLevel")
    if (savedContrastLevel) {
      setContrastLevel(Number.parseInt(savedContrastLevel))
    }
  }, [])

  // 应用OLED模式
  useEffect(() => {
    if (!mounted) return

    // 保存设置到localStorage
    localStorage.setItem("oledMode", String(oledMode))

    // 应用OLED模式
    if (theme === "dark") {
      document.documentElement.classList.toggle("oled-mode", oledMode)
    } else {
      document.documentElement.classList.remove("oled-mode")
    }
  }, [oledMode, theme, mounted])

  // 应用对比度设置
  useEffect(() => {
    if (!mounted) return

    // 保存设置到localStorage
    localStorage.setItem("contrastLevel", String(contrastLevel))

    // 应用对比度设置
    document.documentElement.style.setProperty("--contrast-level", `${contrastLevel}%`)
  }, [contrastLevel, mounted])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="p-2 space-y-4 min-w-[240px]">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">选择主题</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("light")}
                className={cn("justify-start", theme === "light" && "border-primary")}
              >
                <Sun className="h-4 w-4 mr-2" />
                浅色
                {theme === "light" && <Check className="h-4 w-4 ml-auto" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("dark")}
                className={cn("justify-start", theme === "dark" && "border-primary")}
              >
                <Moon className="h-4 w-4 mr-2" />
                深色
                {theme === "dark" && <Check className="h-4 w-4 ml-auto" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("system")}
                className={cn("justify-start", theme === "system" && "border-primary")}
              >
                <Laptop className="h-4 w-4 mr-2" />
                系统
                {theme === "system" && <Check className="h-4 w-4 ml-auto" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="oled-mode" className="text-sm font-medium">
                OLED模式
              </Label>
              <Switch id="oled-mode" checked={oledMode} onCheckedChange={setOledMode} disabled={theme !== "dark"} />
            </div>
            <p className="text-xs text-muted-foreground">为OLED屏幕优化的纯黑背景，可节省电池电量</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contrast-level" className="text-sm font-medium">
              对比度: {contrastLevel}%
            </Label>
            <Slider
              id="contrast-level"
              min={80}
              max={120}
              step={5}
              value={[contrastLevel]}
              onValueChange={(value) => setContrastLevel(value[0])}
            />
            <p className="text-xs text-muted-foreground">调整文本与背景的对比度，提高可读性</p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
