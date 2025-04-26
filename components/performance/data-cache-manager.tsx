"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  RefreshCw,
  Clock,
  Trash2,
  BarChart,
  Save,
  Zap,
  AlertCircle,
  CheckCircle,
  Settings,
  FileDown,
  FileUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DataCacheManagerProps {
  className?: string
}

export function DataCacheManager({ className }: DataCacheManagerProps) {
  const [activeTab, setActiveTab] = useState("settings")
  const [cacheStrategy, setCacheStrategy] = useState("tiered")
  const [maxCacheSize, setMaxCacheSize] = useState(500)
  const [cacheTTL, setCacheTTL] = useState(30)
  const [preloadFrequentData, setPreloadFrequentData] = useState(true)
  const [compressCache, setCompressCache] = useState(true)
  const [persistCache, setPersistCache] = useState(true)
  const [autoInvalidation, setAutoInvalidation] = useState(true)
  const [isClearing, setIsClearing] = useState(false)
  const [clearProgress, setClearProgress] = useState(0)

  // 模拟缓存统计数据
  const cacheStats = {
    totalSize: 342,
    itemCount: 1248,
    hitRate: 87.5,
    missRate: 12.5,
    avgAccessTime: 12,
    oldestItem: "2024-04-01 09:15:32",
    newestItem: "2024-05-01 14:23:45",
    memoryUsage: 68,
  }

  // 模拟缓存项数据
  const cacheItems = [
    {
      id: "cache-001",
      key: "dashboard:sales:monthly:2024-04",
      size: 45.2,
      type: "json",
      hits: 128,
      lastAccessed: "2024-05-01 10:23:15",
      created: "2024-04-30 08:15:22",
      ttl: "2024-05-30 08:15:22",
    },
    {
      id: "cache-002",
      key: "dashboard:customers:quarterly:2024-Q1",
      size: 32.8,
      type: "json",
      hits: 87,
      lastAccessed: "2024-05-01 09:45:30",
      created: "2024-04-15 14:30:45",
      ttl: "2024-05-15 14:30:45",
    },
    {
      id: "cache-003",
      key: "report:financial:annual:2023",
      size: 128.5,
      type: "binary",
      hits: 56,
      lastAccessed: "2024-04-28 16:10:05",
      created: "2024-04-10 11:20:30",
      ttl: "2024-05-10 11:20:30",
    },
    {
      id: "cache-004",
      key: "dashboard:inventory:daily:2024-04-30",
      size: 18.7,
      type: "json",
      hits: 215,
      lastAccessed: "2024-05-01 14:05:22",
      created: "2024-04-30 00:05:10",
      ttl: "2024-05-07 00:05:10",
    },
    {
      id: "cache-005",
      key: "chart:sales:comparison:2023-2024",
      size: 76.3,
      type: "json",
      hits: 145,
      lastAccessed: "2024-05-01 11:30:45",
      created: "2024-04-20 09:15:30",
      ttl: "2024-05-20 09:15:30",
    },
  ]

  // 模拟缓存策略描述
  const getStrategyDescription = (strategy: string) => {
    switch (strategy) {
      case "lru":
        return "最近最少使用策略 (LRU) - 当缓存满时，优先移除最长时间未访问的项"
      case "lfu":
        return "最不经常使用策略 (LFU) - 当缓存满时，优先移除访问次数最少的项"
      case "tiered":
        return "分层缓存策略 - 结合内存和持久化存储，根据访问频率在不同层级间移动数据"
      case "adaptive":
        return "自适应缓存策略 - 根据访问模式和系统负载动态调整缓存行为"
      default:
        return ""
    }
  }

  // 模拟清除缓存
  const clearCache = () => {
    setIsClearing(true)
    setClearProgress(0)

    const interval = setInterval(() => {
      setClearProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsClearing(false)
          return 100
        }
        return newProgress
      })
    }, 200)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>数据缓存管理</CardTitle>
            <CardDescription>配置和优化数据缓存策略，提高数据访问速度</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={isClearing}>
              <RefreshCw className="mr-2 h-4 w-4" />
              刷新缓存
            </Button>
            <Button variant="destructive" size="sm" disabled={isClearing} onClick={clearCache}>
              <Trash2 className="mr-2 h-4 w-4" />
              清除缓存
            </Button>
          </div>
        </div>
        {isClearing && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>正在清除缓存...</span>
              <span>{clearProgress}%</span>
            </div>
            <Progress value={clearProgress} className="h-2" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">缓存设置</TabsTrigger>
            <TabsTrigger value="stats">缓存统计</TabsTrigger>
            <TabsTrigger value="items">缓存内容</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">缓存策略</h3>
                  <Select value={cacheStrategy} onValueChange={setCacheStrategy}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择缓存策略" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lru">最近最少使用 (LRU)</SelectItem>
                      <SelectItem value="lfu">最不经常使用 (LFU)</SelectItem>
                      <SelectItem value="tiered">分层缓存</SelectItem>
                      <SelectItem value="adaptive">自适应缓存</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">{getStrategyDescription(cacheStrategy)}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">最大缓存大小</h3>
                    <span className="text-sm text-muted-foreground">{maxCacheSize} MB</span>
                  </div>
                  <Slider
                    value={[maxCacheSize]}
                    min={100}
                    max={2000}
                    step={50}
                    onValueChange={(value) => setMaxCacheSize(value[0])}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    设置缓存可使用的最大内存空间，超过此限制将触发缓存淘汰
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">缓存过期时间</h3>
                    <span className="text-sm text-muted-foreground">{cacheTTL} 分钟</span>
                  </div>
                  <Slider
                    value={[cacheTTL]}
                    min={5}
                    max={120}
                    step={5}
                    onValueChange={(value) => setCacheTTL(value[0])}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    设置缓存项的默认生存时间，超过此时间的缓存项将被自动移除
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="preload">预加载频繁访问数据</Label>
                      <p className="text-sm text-muted-foreground">在应用启动时预加载常用数据，减少首次访问延迟</p>
                    </div>
                    <Switch id="preload" checked={preloadFrequentData} onCheckedChange={setPreloadFrequentData} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compress">压缩缓存数据</Label>
                      <p className="text-sm text-muted-foreground">
                        使用压缩算法减少缓存占用的内存空间，但可能略微增加CPU使用
                      </p>
                    </div>
                    <Switch id="compress" checked={compressCache} onCheckedChange={setCompressCache} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="persist">持久化缓存</Label>
                      <p className="text-sm text-muted-foreground">
                        将缓存数据保存到本地存储，应用重启后可恢复缓存状态
                      </p>
                    </div>
                    <Switch id="persist" checked={persistCache} onCheckedChange={setPersistCache} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="invalidation">自动失效检测</Label>
                      <p className="text-sm text-muted-foreground">
                        监控数据源变化，自动使相关缓存失效以保持数据一致性
                      </p>
                    </div>
                    <Switch id="invalidation" checked={autoInvalidation} onCheckedChange={setAutoInvalidation} />
                  </div>
                </div>

                <div className="border rounded-md p-4 bg-muted/50">
                  <h3 className="text-base font-medium mb-2">高级设置</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="memory-threshold" className="text-sm">
                        内存阈值 (%)
                      </Label>
                      <Input id="memory-threshold" type="number" defaultValue="80" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="prefetch-depth" className="text-sm">
                        预取深度
                      </Label>
                      <Input id="prefetch-depth" type="number" defaultValue="2" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">恢复默认设置</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{cacheStats.totalSize} MB</div>
                      <p className="text-sm text-muted-foreground">缓存总大小</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <BarChart className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{cacheStats.itemCount}</div>
                      <p className="text-sm text-muted-foreground">缓存项数量</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{cacheStats.hitRate}%</div>
                      <p className="text-sm text-muted-foreground">缓存命中率</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{cacheStats.avgAccessTime} ms</div>
                      <p className="text-sm text-muted-foreground">平均访问时间</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">缓存使用情况</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">内存使用</span>
                        <span className="text-sm">{cacheStats.memoryUsage}%</span>
                      </div>
                      <Progress value={cacheStats.memoryUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">缓存容量</span>
                        <span className="text-sm">
                          {cacheStats.totalSize} MB / {maxCacheSize} MB
                        </span>
                      </div>
                      <Progress value={(cacheStats.totalSize / maxCacheSize) * 100} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">命中率:</span>
                        <span className="ml-2 font-medium text-green-600">{cacheStats.hitRate}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">未命中率:</span>
                        <span className="ml-2 font-medium text-amber-600">{cacheStats.missRate}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">最早缓存项:</span>
                        <span className="ml-2">{cacheStats.oldestItem}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">最新缓存项:</span>
                        <span className="ml-2">{cacheStats.newestItem}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">缓存性能分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">缓存命中率良好</p>
                          <p className="text-sm text-muted-foreground">
                            当前命中率为 {cacheStats.hitRate}%，表明缓存策略有效。
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">缓存空间使用率较高</p>
                          <p className="text-sm text-muted-foreground">
                            当前使用了 {((cacheStats.totalSize / maxCacheSize) * 100).toFixed(1)}%
                            的配置空间，考虑增加缓存大小或优化缓存策略。
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">访问速度优秀</p>
                          <p className="text-sm text-muted-foreground">
                            平均访问时间为 {cacheStats.avgAccessTime} ms，表现良好。
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
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium">考虑增加缓存大小</p>
                        <p className="text-sm text-muted-foreground">
                          当前缓存使用率较高，增加缓存大小可能会进一步提高性能。建议增加到 {maxCacheSize * 1.5} MB。
                        </p>
                      </div>
                    </div>
                    {cacheStrategy !== "tiered" && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">尝试分层缓存策略</p>
                          <p className="text-sm text-muted-foreground">
                            对于当前的数据访问模式，分层缓存策略可能会提供更好的性能。
                          </p>
                        </div>
                      </div>
                    )}
                    {!compressCache && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">启用缓存压缩</p>
                          <p className="text-sm text-muted-foreground">
                            启用缓存压缩可以在不增加缓存大小的情况下存储更多数据。
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Input placeholder="搜索缓存项..." className="w-64" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有类型</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="binary">二进制</SelectItem>
                      <SelectItem value="text">文本</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <FileDown className="mr-2 h-4 w-4" />
                    导出
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileUp className="mr-2 h-4 w-4" />
                    导入
                  </Button>
                </div>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-7 gap-4 p-3 border-b bg-muted/50 text-sm font-medium">
                  <div>缓存键</div>
                  <div>大小</div>
                  <div>类型</div>
                  <div>访问次数</div>
                  <div>最后访问</div>
                  <div>过期时间</div>
                  <div></div>
                </div>
                <div className="divide-y">
                  {cacheItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-7 gap-4 p-3 text-sm items-center">
                      <div className="truncate" title={item.key}>
                        {item.key}
                      </div>
                      <div>{item.size} MB</div>
                      <div>
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                      <div>{item.hits}</div>
                      <div>{item.lastAccessed}</div>
                      <div>{item.ttl}</div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          查看
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive">
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  显示 {cacheItems.length} 个缓存项中的 {cacheItems.length} 个
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    上一页
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    下一页
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          缓存状态: <span className="text-green-600 font-medium">正常运行</span>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          高级配置
        </Button>
      </CardFooter>
    </Card>
  )
}
