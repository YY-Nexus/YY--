"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Zap, Settings, RefreshCw, CheckCircle, AlertCircle, Clock, Cpu, Eye, Gauge } from "lucide-react"
import { cn } from "@/lib/utils"

interface RenderOptimizerProps {
  className?: string
}

export function RenderOptimizer({ className }: RenderOptimizerProps) {
  const [activeTab, setActiveTab] = useState("settings")
  const [renderMode, setRenderMode] = useState("auto")
  const [useVirtualization, setUseVirtualization] = useState(true)
  const [useMemoization, setUseMemoization] = useState(true)
  const [useCodeSplitting, setUseCodeSplitting] = useState(true)
  const [useWebWorkers, setUseWebWorkers] = useState(false)
  const [useSSR, setUseSSR] = useState(true)
  const [animationLevel, setAnimationLevel] = useState(2)
  const [qualityLevel, setQualityLevel] = useState(80)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)

  // 模拟性能指标数据
  const performanceMetrics = {
    fps: 58,
    loadTime: 1.2,
    renderTime: 0.35,
    interactionTime: 0.08,
    memoryUsage: 65,
    cpuUsage: 42,
    layoutShifts: 3,
    reflows: 5,
    lastAnalyzed: "2024-05-01 14:30:22",
  }

  // 模拟组件性能数据
  const componentPerformance = [
    {
      id: "comp-001",
      name: "数据表格组件",
      renderTime: 120,
      rerenders: 8,
      memoryUsage: 28,
      optimizationLevel: "中",
      issues: ["频繁重渲染", "大量DOM节点"],
    },
    {
      id: "comp-002",
      name: "图表仪表盘",
      renderTime: 85,
      rerenders: 4,
      memoryUsage: 35,
      optimizationLevel: "高",
      issues: [],
    },
    {
      id: "comp-003",
      name: "筛选器面板",
      renderTime: 45,
      rerenders: 12,
      memoryUsage: 15,
      optimizationLevel: "低",
      issues: ["状态管理效率低", "未使用记忆化"],
    },
    {
      id: "comp-004",
      name: "导航菜单",
      renderTime: 30,
      rerenders: 2,
      memoryUsage: 10,
      optimizationLevel: "高",
      issues: [],
    },
    {
      id: "comp-005",
      name: "详情面板",
      renderTime: 65,
      rerenders: 6,
      memoryUsage: 22,
      optimizationLevel: "中",
      issues: ["未使用虚拟化"],
    },
  ]

  // 获取渲染模式描述
  const getRenderModeDescription = (mode: string) => {
    switch (mode) {
      case "auto":
        return "自动模式 - 根据设备性能和数据复杂度自动调整渲染策略"
      case "performance":
        return "性能优先 - 优化渲染速度和响应性，可能会降低视觉质量"
      case "quality":
        return "质量优先 - 提供最佳视觉效果，可能会影响性能"
      case "balanced":
        return "平衡模式 - 在性能和视觉质量之间取得平衡"
      default:
        return ""
    }
  }

  // 模拟分析性能
  const analyzePerformance = () => {
    setIsAnalyzing(true)
    setAnalyzeProgress(0)

    const interval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return newProgress
      })
    }, 100)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>渲染性能优化</CardTitle>
            <CardDescription>优化复杂计算和渲染的速度，提升用户界面响应性</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={isAnalyzing} onClick={analyzePerformance}>
              <RefreshCw className="mr-2 h-4 w-4" />
              分析性能
            </Button>
            <Button size="sm" disabled={isAnalyzing}>
              <Zap className="mr-2 h-4 w-4" />
              应用优化
            </Button>
          </div>
        </div>
        {isAnalyzing && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>正在分析性能...</span>
              <span>{analyzeProgress}%</span>
            </div>
            <Progress value={analyzeProgress} className="h-2" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">优化设置</TabsTrigger>
            <TabsTrigger value="metrics">性能指标</TabsTrigger>
            <TabsTrigger value="components">组件性能</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">渲染模式</h3>
                  <Select value={renderMode} onValueChange={setRenderMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择渲染模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">自动模式</SelectItem>
                      <SelectItem value="performance">性能优先</SelectItem>
                      <SelectItem value="quality">质量优先</SelectItem>
                      <SelectItem value="balanced">平衡模式</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">{getRenderModeDescription(renderMode)}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">动画效果级别</h3>
                    <span className="text-sm text-muted-foreground">
                      {animationLevel === 0
                        ? "禁用"
                        : animationLevel === 1
                          ? "最小"
                          : animationLevel === 2
                            ? "中等"
                            : "完整"}
                    </span>
                  </div>
                  <Slider
                    value={[animationLevel]}
                    min={0}
                    max={3}
                    step={1}
                    onValueChange={(value) => setAnimationLevel(value[0])}
                  />
                  <p className="text-sm text-muted-foreground mt-1">控制界面动画效果的复杂度，较低的级别可提高性能</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">渲染质量</h3>
                    <span className="text-sm text-muted-foreground">{qualityLevel}%</span>
                  </div>
                  <Slider
                    value={[qualityLevel]}
                    min={50}
                    max={100}
                    step={5}
                    onValueChange={(value) => setQualityLevel(value[0])}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    控制图表和可视化元素的渲染质量，较低的质量可提高性能
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="virtualization">使用虚拟化</Label>
                      <p className="text-sm text-muted-foreground">
                        对长列表和表格使用虚拟化技术，只渲染可见区域的内容
                      </p>
                    </div>
                    <Switch id="virtualization" checked={useVirtualization} onCheckedChange={setUseVirtualization} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="memoization">使用记忆化</Label>
                      <p className="text-sm text-muted-foreground">缓存组件渲染结果，避免不必要的重新计算和渲染</p>
                    </div>
                    <Switch id="memoization" checked={useMemoization} onCheckedChange={setUseMemoization} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="code-splitting">使用代码分割</Label>
                      <p className="text-sm text-muted-foreground">
                        将应用拆分为更小的代码块，按需加载以减少初始加载时间
                      </p>
                    </div>
                    <Switch id="code-splitting" checked={useCodeSplitting} onCheckedChange={setUseCodeSplitting} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="web-workers">使用Web Workers</Label>
                      <p className="text-sm text-muted-foreground">将复杂计算移至后台线程，避免阻塞主线程和UI渲染</p>
                    </div>
                    <Switch id="web-workers" checked={useWebWorkers} onCheckedChange={setUseWebWorkers} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ssr">使用服务器端渲染</Label>
                      <p className="text-sm text-muted-foreground">在服务器上预渲染页面，提高首次加载性能和SEO</p>
                    </div>
                    <Switch id="ssr" checked={useSSR} onCheckedChange={setUseSSR} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">恢复默认设置</Button>
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                保存设置
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Gauge className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{performanceMetrics.fps} FPS</div>
                      <p className="text-sm text-muted-foreground">帧率</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{performanceMetrics.loadTime}s</div>
                      <p className="text-sm text-muted-foreground">加载时间</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{performanceMetrics.renderTime}s</div>
                      <p className="text-sm text-muted-foreground">渲染时间</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{performanceMetrics.interactionTime}s</div>
                      <p className="text-sm text-muted-foreground">交互响应时间</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">资源使用情况</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">内存使用</span>
                        <span className="text-sm">{performanceMetrics.memoryUsage}%</span>
                      </div>
                      <Progress value={performanceMetrics.memoryUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">CPU使用</span>
                        <span className="text-sm">{performanceMetrics.cpuUsage}%</span>
                      </div>
                      <Progress value={performanceMetrics.cpuUsage} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">布局偏移:</span>
                        <span className="ml-2 font-medium">{performanceMetrics.layoutShifts}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">重排次数:</span>
                        <span className="ml-2 font-medium">{performanceMetrics.reflows}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">最后分析时间:</span>
                        <span className="ml-2">{performanceMetrics.lastAnalyzed}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">性能评估</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">帧率表现良好</p>
                          <p className="text-sm text-muted-foreground">
                            当前帧率为 {performanceMetrics.fps} FPS，超过了60 FPS的目标。
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">加载时间优秀</p>
                          <p className="text-sm text-muted-foreground">
                            页面加载时间为 {performanceMetrics.loadTime}s，低于行业平均水平。
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">布局偏移需要注意</p>
                          <p className="text-sm text-muted-foreground">
                            检测到 {performanceMetrics.layoutShifts} 次布局偏移，可能影响用户体验。
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">优化建议</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {!useVirtualization && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">启用虚拟化</p>
                          <p className="text-sm text-muted-foreground">
                            对于大型列表和表格，启用虚拟化可以显著提高渲染性能。
                          </p>
                        </div>
                      </div>
                    )}
                    {performanceMetrics.reflows > 3 && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">减少布局重排</p>
                          <p className="text-sm text-muted-foreground">
                            检测到较多的布局重排，考虑批量更新DOM或使用CSS transform代替改变位置。
                          </p>
                        </div>
                      </div>
                    )}
                    {!useWebWorkers && performanceMetrics.cpuUsage > 40 && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">使用Web Workers</p>
                          <p className="text-sm text-muted-foreground">
                            CPU使用率较高，考虑启用Web Workers将复杂计算移至后台线程。
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="components" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">组件性能分析</h3>
                <Select defaultValue="render-time">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="render-time">按渲染时间</SelectItem>
                    <SelectItem value="rerenders">按重渲染次数</SelectItem>
                    <SelectItem value="memory">按内存使用</SelectItem>
                    <SelectItem value="issues">按问题数量</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-6 gap-4 p-3 border-b bg-muted/50 text-sm font-medium">
                  <div className="col-span-2">组件名称</div>
                  <div>渲染时间</div>
                  <div>重渲染次数</div>
                  <div>内存使用</div>
                  <div>优化级别</div>
                </div>
                <div className="divide-y">
                  {componentPerformance.map((component) => (
                    <div key={component.id} className="grid grid-cols-6 gap-4 p-3 text-sm items-center">
                      <div className="col-span-2 font-medium">{component.name}</div>
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            component.renderTime > 100
                              ? "bg-red-50 text-red-700 border-red-200"
                              : component.renderTime > 50
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {component.renderTime} ms
                        </Badge>
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            component.rerenders > 10
                              ? "bg-red-50 text-red-700 border-red-200"
                              : component.rerenders > 5
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {component.rerenders}
                        </Badge>
                      </div>
                      <div>{component.memoryUsage} MB</div>
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            component.optimizationLevel === "低"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : component.optimizationLevel === "中"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {component.optimizationLevel}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">组件优化建议</h3>
                {componentPerformance
                  .filter((component) => component.issues.length > 0)
                  .map((component) => (
                    <Card key={component.id}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">{component.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="space-y-2">
                          {component.issues.map((issue, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                              <div>
                                <p className="font-medium">{issue}</p>
                                <p className="text-sm text-muted-foreground">
                                  {issue === "频繁重渲染" && "考虑使用React.memo或useMemo减少不必要的重渲染。"}
                                  {issue === "大量DOM节点" && "考虑使用虚拟化技术或分页减少同时渲染的节点数量。"}
                                  {issue === "状态管理效率低" && "考虑优化状态结构或使用更高效的状态管理方案。"}
                                  {issue === "未使用记忆化" &&
                                    "对计算密集型操作使用useMemo，对回调函数使用useCallback。"}
                                  {issue === "未使用虚拟化" && "对长列表使用虚拟化技术，只渲染可见区域的内容。"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="py-3">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          性能状态: <span className="text-green-600 font-medium">良好</span>
        </div>
        <Button variant="outline" size="sm">
          <Cpu className="mr-2 h-4 w-4" />
          查看完整性能报告
        </Button>
      </CardFooter>
    </Card>
  )
}
