"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Star,
  Download,
  Settings,
  BarChart,
  LineChart,
  FileDown,
  Database,
  Zap,
  AlertCircle,
  Check,
  X,
  ExternalLink,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PluginMarketplaceProps {
  className?: string
}

export function PluginMarketplace({ className }: PluginMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [activeTab, setActiveTab] = useState("discover")
  const [selectedPlugin, setSelectedPlugin] = useState<any | null>(null)
  const [installedPlugins, setInstalledPlugins] = useState<string[]>(["plugin-001", "plugin-003", "plugin-007"])

  // 模拟插件数据
  const plugins = [
    {
      id: "plugin-001",
      name: "高级数据可视化",
      developer: "数据洞察团队",
      category: "visualization",
      description: "提供多种高级图表类型和交互式可视化组件，支持复杂数据的直观展示",
      version: "2.3.0",
      rating: 4.8,
      reviews: 156,
      downloads: 12500,
      lastUpdated: "2024-04-15",
      price: "免费",
      features: ["30+高级图表类型", "交互式数据探索", "自定义主题和样式", "动态数据更新", "导出为多种格式"],
      screenshots: [
        "/placeholder.svg?height=200&width=400",
        "/placeholder.svg?height=200&width=400",
        "/placeholder.svg?height=200&width=400",
      ],
      compatibility: {
        version: "兼容所有版本",
        browsers: ["Chrome", "Firefox", "Safari", "Edge"],
        devices: ["桌面", "平板", "移动"],
      },
      requirements: {
        system: "无特殊要求",
        dependencies: ["无"],
      },
    },
    {
      id: "plugin-002",
      name: "预测分析工具",
      developer: "AI预测实验室",
      category: "analytics",
      description: "使用机器学习算法分析历史数据并生成未来趋势预测，帮助做出数据驱动的决策",
      version: "1.5.2",
      rating: 4.6,
      reviews: 98,
      downloads: 8700,
      lastUpdated: "2024-03-28",
      price: "¥299/月",
      features: ["时间序列预测", "多变量回归分析", "异常检测", "情景模拟", "预测准确度评估"],
      screenshots: ["/placeholder.svg?height=200&width=400", "/placeholder.svg?height=200&width=400"],
      compatibility: {
        version: "v2.0.0及以上",
        browsers: ["Chrome", "Firefox", "Edge"],
        devices: ["桌面"],
      },
      requirements: {
        system: "至少4GB RAM",
        dependencies: ["数据连接器插件"],
      },
    },
    {
      id: "plugin-003",
      name: "数据导出增强",
      developer: "数据工具公司",
      category: "export",
      description: "扩展数据导出功能，支持更多文件格式、自定义模板和自动化导出计划",
      version: "3.1.0",
      rating: 4.9,
      reviews: 210,
      downloads: 18900,
      lastUpdated: "2024-04-02",
      price: "免费",
      features: ["支持PDF、Excel、CSV、JSON等格式", "自定义导出模板", "批量导出", "定时自动导出", "导出历史记录"],
      screenshots: [
        "/placeholder.svg?height=200&width=400",
        "/placeholder.svg?height=200&width=400",
        "/placeholder.svg?height=200&width=400",
      ],
      compatibility: {
        version: "所有版本",
        browsers: ["所有主流浏览器"],
        devices: ["桌面", "平板"],
      },
      requirements: {
        system: "无特殊要求",
        dependencies: ["无"],
      },
    },
    {
      id: "plugin-004",
      name: "数据库连接器",
      developer: "数据桥接技术",
      category: "integration",
      description: "连接各种数据库和数据源，包括MySQL、PostgreSQL、MongoDB、Oracle等",
      version: "2.0.1",
      rating: 4.7,
      reviews: 175,
      downloads: 14200,
      lastUpdated: "2024-03-10",
      price: "¥199/月",
      features: ["支持20+数据库类型", "实时数据同步", "自定义SQL查询", "数据转换和映射", "连接池管理"],
      screenshots: ["/placeholder.svg?height=200&width=400", "/placeholder.svg?height=200&width=400"],
      compatibility: {
        version: "v1.5.0及以上",
        browsers: ["Chrome", "Firefox", "Safari", "Edge"],
        devices: ["桌面"],
      },
      requirements: {
        system: "无特殊要求",
        dependencies: ["无"],
      },
    },
    {
      id: "plugin-005",
      name: "协作注释工具",
      developer: "团队协作解决方案",
      category: "collaboration",
      description: "在仪表盘和报表上添加注释、评论和讨论，促进团队协作和知识共享",
      version: "1.2.3",
      rating: 4.5,
      reviews: 87,
      downloads: 7600,
      lastUpdated: "2024-02-20",
      price: "免费",
      features: ["图表和报表注释", "评论和讨论", "提及团队成员", "通知系统", "版本历史"],
      screenshots: ["/placeholder.svg?height=200&width=400", "/placeholder.svg?height=200&width=400"],
      compatibility: {
        version: "v2.0.0及以上",
        browsers: ["Chrome", "Firefox", "Safari", "Edge"],
        devices: ["桌面", "平板", "移动"],
      },
      requirements: {
        system: "无特殊要求",
        dependencies: ["无"],
      },
    },
    {
      id: "plugin-006",
      name: "自定义主题设计器",
      developer: "UI设计工作室",
      category: "customization",
      description: "创建和应用自定义主题，完全控制仪表盘的外观和感觉",
      version: "2.2.0",
      rating: 4.4,
      reviews: 112,
      downloads: 9300,
      lastUpdated: "2024-03-05",
      price: "免费",
      features: ["可视化主题编辑器", "颜色方案管理", "字体自定义", "组件样式调整", "主题导入导出"],
      screenshots: [
        "/placeholder.svg?height=200&width=400",
        "/placeholder.svg?height=200&width=400",
        "/placeholder.svg?height=200&width=400",
      ],
      compatibility: {
        version: "所有版本",
        browsers: ["所有主流浏览器"],
        devices: ["桌面"],
      },
      requirements: {
        system: "无特殊要求",
        dependencies: ["无"],
      },
    },
    {
      id: "plugin-007",
      name: "报表调度器",
      developer: "自动化工作流",
      category: "automation",
      description: "设置自动生成和分发报表的计划，支持多种分发渠道和格式",
      version: "1.8.5",
      rating: 4.7,
      reviews: 143,
      downloads: 11200,
      lastUpdated: "2024-04-10",
      price: "¥149/月",
      features: ["灵活的调度设置", "多渠道分发(邮件、Slack等)", "条件触发", "失败重试", "执行日志"],
      screenshots: ["/placeholder.svg?height=200&width=400", "/placeholder.svg?height=200&width=400"],
      compatibility: {
        version: "v1.8.0及以上",
        browsers: ["Chrome", "Firefox", "Safari", "Edge"],
        devices: ["桌面"],
      },
      requirements: {
        system: "无特殊要求",
        dependencies: ["数据导出增强插件"],
      },
    },
    {
      id: "plugin-008",
      name: "数据质量监控",
      developer: "数据质量保障",
      category: "data-quality",
      description: "监控数据质量，检测异常和问题，确保分析基于可靠数据",
      version: "1.0.2",
      rating: 4.3,
      reviews: 56,
      downloads: 4800,
      lastUpdated: "2024-02-15",
      price: "¥249/月",
      features: ["数据完整性检查", "异常值检测", "数据一致性验证", "质量指标仪表盘", "警报通知"],
      screenshots: ["/placeholder.svg?height=200&width=400", "/placeholder.svg?height=200&width=400"],
      compatibility: {
        version: "v2.1.0及以上",
        browsers: ["Chrome", "Firefox", "Edge"],
        devices: ["桌面"],
      },
      requirements: {
        system: "至少2GB RAM",
        dependencies: ["数据库连接器插件"],
      },
    },
    {
      id: "plugin-009",
      name: "安全审计工具",
      developer: "安全解决方案",
      category: "security",
      description: "提供全面的安全审计和访问控制功能，保护敏感数据和分析",
      version: "1.3.0",
      rating: 4.6,
      reviews: 78,
      downloads: 6200,
      lastUpdated: "2024-03-18",
      price: "¥399/月",
      features: ["用户活动审计", "细粒度访问控制", "数据脱敏", "合规报告", "安全警报"],
      screenshots: ["/placeholder.svg?height=200&width=400", "/placeholder.svg?height=200&width=400"],
      compatibility: {
        version: "v2.0.0及以上",
        browsers: ["Chrome", "Firefox", "Safari", "Edge"],
        devices: ["桌面"],
      },
      requirements: {
        system: "无特殊要求",
        dependencies: ["无"],
      },
    },
    {
      id: "plugin-010",
      name: "移动应用集成",
      developer: "移动解决方案",
      category: "integration",
      description: "将仪表盘和报表无缝集成到移动应用中，提供原生移动体验",
      version: "2.0.0",
      rating: 4.2,
      reviews: 45,
      downloads: 3800,
      lastUpdated: "2024-01-30",
      price: "¥199/月",
      features: ["iOS和Android支持", "离线访问", "推送通知", "触控优化界面", "移动认证"],
      screenshots: ["/placeholder.svg?height=200&width=400", "/placeholder.svg?height=200&width=400"],
      compatibility: {
        version: "v1.5.0及以上",
        browsers: ["不适用"],
        devices: ["移动"],
      },
      requirements: {
        system: "iOS 12+或Android 8+",
        dependencies: ["无"],
      },
    },
  ]

  // 根据搜索查询和过滤器过滤插件
  const filteredPlugins = plugins.filter((plugin) => {
    // 搜索过滤
    const matchesSearch =
      searchQuery === "" ||
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase())

    // 类别过滤
    const matchesCategory = categoryFilter === "all" || plugin.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // 根据排序选项排序插件
  const sortedPlugins = [...filteredPlugins].sort((a, b) => {
    if (sortBy === "popular") {
      return b.downloads - a.downloads
    } else if (sortBy === "rating") {
      return b.rating - a.rating
    } else if (sortBy === "newest") {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    }
    return 0
  })

  // 获取已安装的插件
  const myInstalledPlugins = plugins.filter((plugin) => installedPlugins.includes(plugin.id))

  // 处理插件安装/卸载
  const togglePluginInstallation = (pluginId: string) => {
    if (installedPlugins.includes(pluginId)) {
      setInstalledPlugins(installedPlugins.filter((id) => id !== pluginId))
    } else {
      setInstalledPlugins([...installedPlugins, pluginId])
    }
  }

  // 获取类别标签和图标
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "visualization":
        return { label: "数据可视化", icon: <BarChart className="h-4 w-4" />, color: "bg-blue-500" }
      case "analytics":
        return { label: "分析工具", icon: <LineChart className="h-4 w-4" />, color: "bg-green-500" }
      case "export":
        return { label: "数据导出", icon: <FileDown className="h-4 w-4" />, color: "bg-purple-500" }
      case "integration":
        return { label: "数据集成", icon: <Database className="h-4 w-4" />, color: "bg-orange-500" }
      case "collaboration":
        return { label: "协作工具", icon: <Users className="h-4 w-4" />, color: "bg-pink-500" }
      case "customization":
        return { label: "自定义工具", icon: <Settings className="h-4 w-4" />, color: "bg-indigo-500" }
      case "automation":
        return { label: "自动化", icon: <Zap className="h-4 w-4" />, color: "bg-yellow-500" }
      case "data-quality":
        return { label: "数据质量", icon: <AlertCircle className="h-4 w-4" />, color: "bg-red-500" }
      case "security":
        return { label: "安全工具", icon: <Lock className="h-4 w-4" />, color: "bg-gray-500" }
      default:
        return { label: "其他", icon: <Info className="h-4 w-4" />, color: "bg-gray-500" }
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>插件市场</CardTitle>
            <CardDescription>发现和安装扩展功能的插件，增强您的数据分析体验</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              插件设置
            </Button>
            <Button size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              开发者中心
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover">发现插件</TabsTrigger>
            <TabsTrigger value="installed">已安装 ({myInstalledPlugins.length})</TabsTrigger>
            <TabsTrigger value="updates">更新</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索插件..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="类别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类别</SelectItem>
                    <SelectItem value="visualization">数据可视化</SelectItem>
                    <SelectItem value="analytics">分析工具</SelectItem>
                    <SelectItem value="export">数据导出</SelectItem>
                    <SelectItem value="integration">数据集成</SelectItem>
                    <SelectItem value="collaboration">协作工具</SelectItem>
                    <SelectItem value="customization">自定义工具</SelectItem>
                    <SelectItem value="automation">自动化</SelectItem>
                    <SelectItem value="data-quality">数据质量</SelectItem>
                    <SelectItem value="security">安全工具</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">最受欢迎</SelectItem>
                    <SelectItem value="rating">最高评分</SelectItem>
                    <SelectItem value="newest">最新更新</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedPlugin ? (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setSelectedPlugin(null)}>
                  ← 返回插件列表
                </Button>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-2/3 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedPlugin.name}</h2>
                        <p className="text-sm text-muted-foreground">由 {selectedPlugin.developer} 开发</p>
                      </div>
                      <Badge className={getCategoryInfo(selectedPlugin.category).color}>
                        {getCategoryInfo(selectedPlugin.category).label}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground">{selectedPlugin.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedPlugin.screenshots.map((screenshot: string, index: number) => (
                        <div key={index} className="border rounded-md overflow-hidden">
                          <img
                            src={screenshot || "/placeholder.svg"}
                            alt={`${selectedPlugin.name} 截图 ${index + 1}`}
                            className="w-full h-auto"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">功能特点</h3>
                      <ul className="space-y-1">
                        {selectedPlugin.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="md:w-1/3">
                    <div className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">价格</span>
                        <span>{selectedPlugin.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">版本</span>
                        <span>{selectedPlugin.version}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">评分</span>
                        <span className="flex items-center">
                          {selectedPlugin.rating}
                          <Star className="h-4 w-4 text-yellow-500 ml-1" />
                          <span className="text-sm text-muted-foreground ml-1">({selectedPlugin.reviews})</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">下载次数</span>
                        <span>{selectedPlugin.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">最后更新</span>
                        <span>{new Date(selectedPlugin.lastUpdated).toLocaleDateString()}</span>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">兼容性</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>系统版本:</span>
                            <span>{selectedPlugin.compatibility.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>浏览器:</span>
                            <span>{selectedPlugin.compatibility.browsers.join(", ")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>设备:</span>
                            <span>{selectedPlugin.compatibility.devices.join(", ")}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">系统要求</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>系统:</span>
                            <span>{selectedPlugin.requirements.system}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>依赖项:</span>
                            <span>
                              {selectedPlugin.requirements.dependencies.length > 0
                                ? selectedPlugin.requirements.dependencies.join(", ")
                                : "无"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        variant={installedPlugins.includes(selectedPlugin.id) ? "outline" : "default"}
                        onClick={() => togglePluginInstallation(selectedPlugin.id)}
                      >
                        {installedPlugins.includes(selectedPlugin.id) ? (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            卸载
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            安装
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sortedPlugins.map((plugin) => (
                  <div key={plugin.id} className="border rounded-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className="font-medium hover:text-primary cursor-pointer"
                            onClick={() => setSelectedPlugin(plugin)}
                          >
                            {plugin.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">由 {plugin.developer} 开发</p>
                        </div>
                        <Badge className={getCategoryInfo(plugin.category).color}>
                          {getCategoryInfo(plugin.category).icon}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{plugin.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{plugin.rating}</span>
                          <Star className="h-3 w-3 text-yellow-500 ml-1" />
                          <span className="text-xs text-muted-foreground ml-1">({plugin.reviews})</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {plugin.downloads.toLocaleString()} 次下载
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted p-3 flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="mr-2">
                          v{plugin.version}
                        </Badge>
                        <Badge variant="outline">{plugin.price}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant={installedPlugins.includes(plugin.id) ? "outline" : "default"}
                        onClick={() => togglePluginInstallation(plugin.id)}
                      >
                        {installedPlugins.includes(plugin.id) ? "已安装" : "安装"}
                      </Button>
                    </div>
                  </div>
                ))}

                {sortedPlugins.length === 0 && (
                  <div className="col-span-3 py-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">未找到插件</h3>
                    <p className="text-sm text-muted-foreground mt-1">尝试使用不同的搜索词或过滤条件</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="installed" className="pt-4">
            {myInstalledPlugins.length > 0 ? (
              <div className="space-y-4">
                {myInstalledPlugins.map((plugin) => (
                  <div key={plugin.id} className="border rounded-md p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{plugin.name}</h3>
                          <Badge className={`ml-2 ${getCategoryInfo(plugin.category).color}`}>
                            {getCategoryInfo(plugin.category).label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{plugin.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-right">
                          <div>版本 {plugin.version}</div>
                          <div className="text-xs text-muted-foreground">安装于 {new Date().toLocaleDateString()}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedPlugin(plugin)}>
                            详情
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => togglePluginInstallation(plugin.id)}>
                            卸载
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Download className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">未安装任何插件</h3>
                <p className="text-muted-foreground mt-1 mb-4">从插件市场发现和安装插件以扩展功能</p>
                <Button onClick={() => setActiveTab("discover")}>浏览插件市场</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="updates" className="pt-4">
            <div className="py-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium">所有插件均为最新版本</h3>
              <p className="text-muted-foreground mt-1">当有新的插件更新可用时，将在此处显示</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">插件使用指南</Button>
        <Button variant="outline">开发自己的插件</Button>
      </CardFooter>
    </Card>
  )
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
