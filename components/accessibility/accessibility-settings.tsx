"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Type, MousePointer, Volume2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccessibilitySettingsProps {
  className?: string
}

export function AccessibilitySettings({ className }: AccessibilitySettingsProps) {
  // 字体大小设置
  const [fontSize, setFontSize] = useState(100)

  // 行高设置
  const [lineHeight, setLineHeight] = useState(150)

  // 字母间距设置
  const [letterSpacing, setLetterSpacing] = useState(0)

  // 减少动画设置
  const [reduceMotion, setReduceMotion] = useState(false)

  // 高对比度设置
  const [highContrast, setHighContrast] = useState(false)

  // 放大鼠标指针设置
  const [largePointer, setLargePointer] = useState(false)

  // 屏幕阅读器优化设置
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(false)

  // 键盘导航增强设置
  const [enhancedKeyboardNav, setEnhancedKeyboardNav] = useState(false)

  // 在客户端渲染后加载设置
  useEffect(() => {
    // 从localStorage加载设置
    const savedFontSize = localStorage.getItem("a11y-fontSize")
    if (savedFontSize) setFontSize(Number.parseInt(savedFontSize))

    const savedLineHeight = localStorage.getItem("a11y-lineHeight")
    if (savedLineHeight) setLineHeight(Number.parseInt(savedLineHeight))

    const savedLetterSpacing = localStorage.getItem("a11y-letterSpacing")
    if (savedLetterSpacing) setLetterSpacing(Number.parseInt(savedLetterSpacing))

    const savedReduceMotion = localStorage.getItem("a11y-reduceMotion")
    if (savedReduceMotion) setReduceMotion(savedReduceMotion === "true")

    const savedHighContrast = localStorage.getItem("a11y-highContrast")
    if (savedHighContrast) setHighContrast(savedHighContrast === "true")

    const savedLargePointer = localStorage.getItem("a11y-largePointer")
    if (savedLargePointer) setLargePointer(savedLargePointer === "true")

    const savedScreenReaderOptimized = localStorage.getItem("a11y-screenReaderOptimized")
    if (savedScreenReaderOptimized) setScreenReaderOptimized(savedScreenReaderOptimized === "true")

    const savedEnhancedKeyboardNav = localStorage.getItem("a11y-enhancedKeyboardNav")
    if (savedEnhancedKeyboardNav) setEnhancedKeyboardNav(savedEnhancedKeyboardNav === "true")
  }, [])

  // 应用字体大小设置
  useEffect(() => {
    document.documentElement.style.setProperty("--a11y-font-size", `${fontSize}%`)
    localStorage.setItem("a11y-fontSize", fontSize.toString())
  }, [fontSize])

  // 应用行高设置
  useEffect(() => {
    document.documentElement.style.setProperty("--a11y-line-height", `${lineHeight}%`)
    localStorage.setItem("a11y-lineHeight", lineHeight.toString())
  }, [lineHeight])

  // 应用字母间距设置
  useEffect(() => {
    document.documentElement.style.setProperty("--a11y-letter-spacing", `${letterSpacing / 100}em`)
    localStorage.setItem("a11y-letterSpacing", letterSpacing.toString())
  }, [letterSpacing])

  // 应用减少动画设置
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion)
    localStorage.setItem("a11y-reduceMotion", reduceMotion.toString())
  }, [reduceMotion])

  // 应用高对比度设置
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast)
    localStorage.setItem("a11y-highContrast", highContrast.toString())
  }, [highContrast])

  // 应用放大鼠标指针设置
  useEffect(() => {
    document.documentElement.classList.toggle("large-pointer", largePointer)
    localStorage.setItem("a11y-largePointer", largePointer.toString())
  }, [largePointer])

  // 应用屏幕阅读器优化设置
  useEffect(() => {
    document.documentElement.classList.toggle("screen-reader-optimized", screenReaderOptimized)
    localStorage.setItem("a11y-screenReaderOptimized", screenReaderOptimized.toString())
  }, [screenReaderOptimized])

  // 应用键盘导航增强设置
  useEffect(() => {
    document.documentElement.classList.toggle("enhanced-keyboard-nav", enhancedKeyboardNav)
    localStorage.setItem("a11y-enhancedKeyboardNav", enhancedKeyboardNav.toString())
  }, [enhancedKeyboardNav])

  // 重置所有设置
  const resetSettings = () => {
    setFontSize(100)
    setLineHeight(150)
    setLetterSpacing(0)
    setReduceMotion(false)
    setHighContrast(false)
    setLargePointer(false)
    setScreenReaderOptimized(false)
    setEnhancedKeyboardNav(false)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>辅助功能设置</CardTitle>
        <CardDescription>自定义显示和交互选项，提高可访问性</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">文本</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">显示</span>
            </TabsTrigger>
            <TabsTrigger value="interaction" className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              <span className="hidden sm:inline">交互</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">媒体</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="font-size">字体大小: {fontSize}%</Label>
              </div>
              <Slider
                id="font-size"
                min={80}
                max={200}
                step={10}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="line-height">行高: {lineHeight}%</Label>
              </div>
              <Slider
                id="line-height"
                min={100}
                max={200}
                step={10}
                value={[lineHeight]}
                onValueChange={(value) => setLineHeight(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="letter-spacing">字母间距: {letterSpacing}</Label>
              </div>
              <Slider
                id="letter-spacing"
                min={0}
                max={50}
                step={5}
                value={[letterSpacing]}
                onValueChange={(value) => setLetterSpacing(value[0])}
              />
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">高对比度模式</Label>
                <p className="text-sm text-muted-foreground">增强文本与背景的对比度</p>
              </div>
              <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduce-motion">减少动画</Label>
                <p className="text-sm text-muted-foreground">减少或移除界面动画效果</p>
              </div>
              <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
            </div>
          </TabsContent>

          <TabsContent value="interaction" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="large-pointer">放大鼠标指针</Label>
                <p className="text-sm text-muted-foreground">使鼠标指针更大，更容易看见</p>
              </div>
              <Switch id="large-pointer" checked={largePointer} onCheckedChange={setLargePointer} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enhanced-keyboard-nav">增强键盘导航</Label>
                <p className="text-sm text-muted-foreground">改进焦点指示器和键盘快捷键</p>
              </div>
              <Switch
                id="enhanced-keyboard-nav"
                checked={enhancedKeyboardNav}
                onCheckedChange={setEnhancedKeyboardNav}
              />
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="screen-reader">屏幕阅读器优化</Label>
                <p className="text-sm text-muted-foreground">增强屏幕阅读器兼容性</p>
              </div>
              <Switch id="screen-reader" checked={screenReaderOptimized} onCheckedChange={setScreenReaderOptimized} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={resetSettings}>
            重置所有设置
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
