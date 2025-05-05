/**
 * 智能预加载服务
 * 根据用户行为预测可能需要的资源并预加载
 */

// 资源类型
export enum ResourceType {
  SCRIPT = "script",
  STYLE = "style",
  IMAGE = "image",
  FONT = "font",
  DOCUMENT = "document",
}

// 资源优先级
export enum ResourcePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// 资源信息
interface ResourceInfo {
  url: string
  type: ResourceType
  priority: ResourcePriority
  size?: number
  loadTime?: number
}

// 页面访问记录
interface PageVisit {
  path: string
  timestamp: number
  duration: number
}

// 用户行为模式
interface UserPattern {
  frequentPaths: string[]
  averageSessionDuration: number
  preferredTimes: number[]
}

// 智能预加载服务
export class SmartPreloadService {
  private static instance: SmartPreloadService
  private preloadedResources: Set<string> = new Set()
  private resourceCache: Map<string, ResourceInfo> = new Map()
  private pageVisits: PageVisit[] = []
  private userPattern: UserPattern | null = null
  private isEnabled = true
  private networkType: string | null = null
  private isLowEndDevice = false

  // 获取单例实例
  public static getInstance(): SmartPreloadService {
    if (!SmartPreloadService.instance) {
      SmartPreloadService.instance = new SmartPreloadService()
    }
    return SmartPreloadService.instance
  }

  // 私有构造函数
  private constructor() {
    try {
      this.detectNetworkAndDevice().catch((err) => {
        console.warn("网络检测失败:", err)
        // 设置默认值
        this.networkType = "4g" // 假设较好的网络
        this.isLowEndDevice = false
        this.adjustPreloadStrategy()
      })
    } catch (error) {
      console.warn("预加载服务初始化失败:", error)
      // 设置安全的默认值
      this.networkType = "4g"
      this.isLowEndDevice = false
      this.isEnabled = true
    }
  }

  // 检测网络和设备
  private async detectNetworkAndDevice(): Promise<void> {
    // 检测网络类型
    if (navigator.connection) {
      this.networkType = (navigator.connection as any).effectiveType

      // 监听网络变化
      ;(navigator.connection as any).addEventListener("change", () => {
        this.networkType = (navigator.connection as any).effectiveType
        this.adjustPreloadStrategy()
      })
    }

    // 检测设备性能
    this.isLowEndDevice = this.detectLowEndDevice()

    // 调整预加载策略
    this.adjustPreloadStrategy()
  }

  // 检测低端设备
  private detectLowEndDevice(): boolean {
    // 检查设备内存
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      return true
    }

    // 检查硬件并发
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      return true
    }

    return false
  }

  // 调整预加载策略
  private adjustPreloadStrategy(): void {
    // 根据网络类型和设备性能调整预加载策略
    if (this.networkType === "slow-2g" || this.networkType === "2g") {
      // 慢速网络，禁用预加载
      this.isEnabled = false
    } else if (this.networkType === "3g" && this.isLowEndDevice) {
      // 3G网络 + 低端设备，只预加载关键资源
      this.isEnabled = true
    } else {
      // 其他情况，启用预加载
      this.isEnabled = true
    }
  }

  // 预加载资源
  public preloadResource(resource: ResourceInfo): void {
    if (!this.isEnabled) return
    if (this.preloadedResources.has(resource.url)) return

    // 根据资源优先级和网络状况决定是否预加载
    if (this.shouldPreload(resource)) {
      this.createPreloadLink(resource)
      this.preloadedResources.add(resource.url)
      this.resourceCache.set(resource.url, resource)
    }
  }

  // 判断是否应该预加载资源
  private shouldPreload(resource: ResourceInfo): boolean {
    // 如果是关键资源，始终预加载
    if (resource.priority === ResourcePriority.CRITICAL) {
      return true
    }

    // 根据网络类型和资源优先级决定
    if (this.networkType === "4g" || this.networkType === "5g") {
      // 快速网络，预加载高优先级和中优先级资源
      return resource.priority === ResourcePriority.HIGH || resource.priority === ResourcePriority.MEDIUM
    } else if (this.networkType === "3g") {
      // 3G网络，只预加载高优先级资源
      return resource.priority === ResourcePriority.HIGH
    } else {
      // 慢速网络，不预加载
      return false
    }
  }

  // 创建预加载链接
  private createPreloadLink(resource: ResourceInfo): void {
    if (typeof document === "undefined") return

    const link = document.createElement("link")
    link.rel = "preload"
    link.href = resource.url

    switch (resource.type) {
      case ResourceType.SCRIPT:
        link.as = "script"
        break
      case ResourceType.STYLE:
        link.as = "style"
        break
      case ResourceType.IMAGE:
        link.as = "image"
        break
      case ResourceType.FONT:
        link.as = "font"
        link.crossOrigin = "anonymous"
        break
      case ResourceType.DOCUMENT:
        link.as = "document"
        break
    }

    // 设置优先级
    switch (resource.priority) {
      case ResourcePriority.CRITICAL:
        link.setAttribute("importance", "high")
        break
      case ResourcePriority.HIGH:
        link.setAttribute("importance", "high")
        break
      case ResourcePriority.MEDIUM:
        link.setAttribute("importance", "auto")
        break
      case ResourcePriority.LOW:
        link.setAttribute("importance", "low")
        break
    }

    document.head.appendChild(link)
  }

  // 预加载路由
  public preloadRoute(path: string, priority: ResourcePriority = ResourcePriority.MEDIUM): void {
    if (!this.isEnabled) return

    this.preloadResource({
      url: path,
      type: ResourceType.DOCUMENT,
      priority,
    })
  }

  // 记录页面访问
  public recordPageVisit(path: string): void {
    const now = Date.now()
    const lastVisit = this.pageVisits[this.pageVisits.length - 1]

    // 计算上一页的访问时长
    if (lastVisit && !lastVisit.duration) {
      lastVisit.duration = now - lastVisit.timestamp
    }

    // 记录当前页面访问
    this.pageVisits.push({
      path,
      timestamp: now,
      duration: 0,
    })

    // 只保留最近50次访问记录
    if (this.pageVisits.length > 50) {
      this.pageVisits.shift()
    }

    // 分析用户行为模式
    this.analyzeUserPattern()

    // 预测并预加载可能的下一页
    this.predictAndPreloadNextPages(path)
  }

  // 分析用户行为模式
  private analyzeUserPattern(): void {
    if (this.pageVisits.length < 5) return

    // 计算频繁访问的路径
    const pathCounts: Record<string, number> = {}
    this.pageVisits.forEach((visit) => {
      pathCounts[visit.path] = (pathCounts[visit.path] || 0) + 1
    })

    const frequentPaths = Object.entries(pathCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path]) => path)

    // 计算平均会话时长
    const totalDuration = this.pageVisits.reduce((sum, visit) => sum + (visit.duration || 0), 0)
    const averageSessionDuration = totalDuration / this.pageVisits.length

    // 计算偏好时间
    const hours = this.pageVisits.map((visit) => new Date(visit.timestamp).getHours())
    const hourCounts: Record<number, number> = {}
    hours.forEach((hour) => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    const preferredTimes = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => Number.parseInt(hour))

    // 更新用户模式
    this.userPattern = {
      frequentPaths,
      averageSessionDuration,
      preferredTimes,
    }
  }

  // 预测并预加载可能的下一页
  private predictAndPreloadNextPages(currentPath: string): void {
    if (!this.isEnabled || !this.userPattern) return

    // 分析页面转换模式
    const transitions: Record<string, Record<string, number>> = {}

    for (let i = 0; i < this.pageVisits.length - 1; i++) {
      const from = this.pageVisits[i].path
      const to = this.pageVisits[i + 1].path

      if (!transitions[from]) {
        transitions[from] = {}
      }

      transitions[from][to] = (transitions[from][to] || 0) + 1
    }

    // 找出当前页面可能的下一页
    const nextPages: [string, number][] = []

    if (transitions[currentPath]) {
      Object.entries(transitions[currentPath]).forEach(([path, count]) => {
        nextPages.push([path, count])
      })
    }

    // 按转换次数排序
    nextPages.sort((a, b) => b[1] - a[1])

    // 预加载可能性最高的3个页面
    nextPages.slice(0, 3).forEach(([path, count]) => {
      const probability =
        count / (transitions[currentPath] ? Object.values(transitions[currentPath]).reduce((a, b) => a + b, 0) : 1)

      // 根据概率设置优先级
      let priority = ResourcePriority.LOW
      if (probability > 0.7) {
        priority = ResourcePriority.HIGH
      } else if (probability > 0.4) {
        priority = ResourcePriority.MEDIUM
      }

      this.preloadRoute(path, priority)
    })
  }

  // 预加载关键资源
  public preloadCriticalResources(): void {
    if (!this.isEnabled) return

    // 预加载关键脚本
    this.preloadResource({
      url: "/_next/static/chunks/main.js",
      type: ResourceType.SCRIPT,
      priority: ResourcePriority.CRITICAL,
    })

    // 预加载关键样式
    this.preloadResource({
      url: "/_next/static/css/app.css",
      type: ResourceType.STYLE,
      priority: ResourcePriority.CRITICAL,
    })

    // 预加载字体
    this.preloadResource({
      url: "/fonts/inter.woff2",
      type: ResourceType.FONT,
      priority: ResourcePriority.HIGH,
    })

    // 预加载Logo
    this.preloadResource({
      url: "/logo.png",
      type: ResourceType.IMAGE,
      priority: ResourcePriority.HIGH,
    })
  }

  // 获取资源缓存
  public getResourceCache(): Map<string, ResourceInfo> {
    return this.resourceCache
  }

  // 获取用户行为模式
  public getUserPattern(): UserPattern | null {
    return this.userPattern
  }

  // 启用预加载
  public enable(): void {
    this.isEnabled = true
  }

  // 禁用预加载
  public disable(): void {
    this.isEnabled = false
  }

  // 清除预加载记录
  public clearPreloadedResources(): void {
    this.preloadedResources.clear()
  }
}

// 获取智能预加载服务实例
export function getSmartPreloadService(): SmartPreloadService {
  try {
    return SmartPreloadService.getInstance()
  } catch (error) {
    console.error("获取智能预加载服务失败:", error)
    return null as any // 返回 null 但类型兼容
  }
}

// 初始化智能预加载服务
export function initSmartPreloadService(): void {
  try {
    const service = getSmartPreloadService()
    if (service) {
      service.preloadCriticalResources()
    }
  } catch (error) {
    console.error("初始化智能预加载服务失败:", error)
    // 失败不应阻止应用继续运行
  }
}
