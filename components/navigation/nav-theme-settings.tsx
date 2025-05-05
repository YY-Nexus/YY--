"use client"

import { useState } from "react"
import { Paintbrush, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useNavTheme } from "@/hooks/use-nav-theme"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/hooks/use-navigation"

const colorOptions = [
  { value: "default", label: "默认" },
  { value: "blue", label: "蓝色" },
  { value: "green", label: "绿色" },
  { value: "purple", label: "紫色" },
  { value: "orange", label: "橙色" },
  { value: "red", label: "红色" },
]

export function NavThemeSettings() {
  const { theme, updateTheme, resetTheme } = useNavTheme()
  const { isExpanded } = useNavigation()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={isExpanded ? "default" : "icon"}
          className={cn("flex items-center", isExpanded ? "w-full justify-start" : "h-8 w-8")}
        >
          <Paintbrush className="h-4 w-4" />
          {isExpanded && <span className="ml-2">个性化设置</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">导航栏个性化设置</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                resetTheme()
                setOpen(false)
              }}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">重置</span>
            </Button>
          </div>
          <Tabs defaultValue="appearance">
            <TabsList className="w-full">
              <TabsTrigger value="appearance" className="flex-1">
                外观
              </TabsTrigger>
              <TabsTrigger value="behavior" className="flex-1">
                行为
              </TabsTrigger>
            </TabsList>
            <TabsContent value="appearance" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">主题色</Label>
                <Select value={theme.primaryColor} onValueChange={(value) => updateTheme({ primaryColor: value })}>
                  <SelectTrigger id="primary-color">
                    <SelectValue placeholder="选择主题色" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "mr-2 h-3 w-3 rounded-full",
                              option.value === "default" ? "bg-primary" : `bg-${option.value}-500`,
                            )}
                          />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent-color">强调色</Label>
                <Select value={theme.accentColor} onValueChange={(value) => updateTheme({ accentColor: value })}>
                  <SelectTrigger id="accent-color">
                    <SelectValue placeholder="选择强调色" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "mr-2 h-3 w-3 rounded-full",
                              option.value === "default" ? "bg-accent" : `bg-${option.value}-300`,
                            )}
                          />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">字体大小</Label>
                <Select
                  value={theme.fontSize}
                  onValueChange={(value: "small" | "medium" | "large") => updateTheme({ fontSize: value })}
                >
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="选择字体大小" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">小</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="large">大</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="behavior" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="density">密度</Label>
                <Select
                  value={theme.density}
                  onValueChange={(value: "compact" | "normal" | "comfortable") => updateTheme({ density: value })}
                >
                  <SelectTrigger id="density">
                    <SelectValue placeholder="选择密度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">紧凑</SelectItem>
                    <SelectItem value="normal">标准</SelectItem>
                    <SelectItem value="comfortable">舒适</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="animation">动画效果</Label>
                <Select
                  value={theme.animation}
                  onValueChange={(value: "minimal" | "normal" | "elaborate") => updateTheme({ animation: value })}
                >
                  <SelectTrigger id="animation">
                    <SelectValue placeholder="选择动画效果" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">最小</SelectItem>
                    <SelectItem value="normal">标准</SelectItem>
                    <SelectItem value="elaborate">丰富</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          <Button className="w-full" onClick={() => setOpen(false)}>
            应用设置
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
