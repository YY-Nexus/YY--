// 性能指标类型
export interface PerformanceMetrics {
  // 页面加载指标
  navigationTiming?: {
    fetchStart: number
    domainLookupStart: number
    domainLookupEnd: number
    connectStart: number
    connectEnd: number
    requestStart: number
    responseStart: number
    responseEnd: number
    domInteractive: number
    domContentLoadedEventStart: number
    domContentLoadedEventEnd: number
    domComplete: number
    loadEventStart: number
    loadEventEnd: number
  }

  // 关键渲染指标
  paintTiming?: {
    firstPaint: number
    firstContentfulPaint: number
  }

  // 交互指标
  interactionTiming?: {
    firstInputDelay: number
    longestInteraction: number
  }

  // 布局稳定性
  layoutShift?: {
    cumulativeLayoutShift: number
  }

  // 资源加载
  resourceTiming?: {
    resources: Array<{
      name: string
      initiatorType: string
      duration: number
      transferSize: number
      decodedBodySize: number
    }>
  }

  // 内存使用
  memory?: {
    jsHeapSizeLimit: number
    totalJSHeapSize: number
    usedJSHeapSize: number
  }

  // 自定义指标
  custom?: Record<string, number>
}

// 性能监控配置
interface PerformanceMonitorConfig {
  sampleRate?: number // 采样率 (0-1)
  reportingEndpoint?: string // 上报端点
  reportingInterval?: number // 上报间隔 (ms)
  enableResourceTiming?: boolean // 是否收集资源加载指标
  enableMemoryInfo?: boolean // 是否收集内存使用指标
  maxResourceEntries?: number // 最大资源条目数
}

// 默认配置
const defaultConfig: PerformanceMonitorConfig = {
  sampleRate: 0.1, // 10%的用户会被采样
  reportingEndpoint: "/api/performance",
  reportingInterval: 10000, // 10秒
  enableResourceTiming: true,
  enableMemoryInfo: true,
  maxResourceEntries: 50,
}

// 性能监控类
export class PerformanceMonitor {
  private config: PerformanceMonitorConfig
  private metrics: PerformanceMetrics = {}
  private reportingTimer: number | null = null
  private isInitialized = false
  private customMetrics: Record<string, number> = {}
  private interactionObserver: PerformanceObserver | null = null
  private layoutShiftObserver: PerformanceObserver | null = null
  private paintObserver: PerformanceObserver | null = null
  private resourceObserver: PerformanceObserver | null = null

  constructor(config: Partial<PerformanceMonitorConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  // 初始化监控
  public init(): void {
    // 检查是否支持Performance API
    if (typeof window === "undefined" || !window.performance) {
      console.warn("Performance API不可用，性能监控已禁用")
      return
    }

    // 检查是否应该采样此用户
    if (Math.random() > this.config.sampleRate!) {
      return
    }

    // 收集导航计时指标
    this.collectNavigationTiming()

    // 设置性能观察器
    this.setupPerformanceObservers()

    // 设置定期上报
    this.setupReporting()

    this.isInitialized = true
  }

  // 收集导航计时指标
  private collectNavigationTiming(): void {
    if (typeof window === "undefined" || !window.performance || !performance.timing) return

    const timing = performance.timing

    this.metrics.navigationTiming = {
      fetchStart: timing.fetchStart,
      domainLookupStart: timing.domainLookupStart,
      domainLookupEnd: timing.domainLookupEnd,
      connectStart: timing.connectStart,
      connectEnd: timing.connectEnd,
      requestStart: timing.requestStart,
      responseStart: timing.responseStart,
      responseEnd: timing.responseEnd,
      domInteractive: timing.domInteractive,
      domContentLoadedEventStart: timing.domContentLoadedEventStart,
      domContentLoadedEventEnd: timing.domContentLoadedEventEnd,
      domComplete: timing.domComplete,
      loadEventStart: timing.loadEventStart,
      loadEventEnd: timing.loadEventEnd,
    }
  }

  // 设置性能观察器
  private setupPerformanceObservers(): void {
    if (typeof window === "undefined") return

    // 观察绘制事件
    if (PerformanceObserver && PerformanceObserver.supportedEntryTypes?.includes("paint")) {
      this.paintObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()

        this.metrics.paintTiming = this.metrics.paintTiming || {}

        entries.forEach((entry) => {
          if (entry.name === "first-paint") {
            this.metrics.paintTiming!.firstPaint = entry.startTime
          } else if (entry.name === "first-contentful-paint") {
            this.metrics.paintTiming!.firstContentfulPaint = entry.startTime
          }
        })
      })

      try {
        this.paintObserver.observe({ entryTypes: ["paint"] })
      } catch (e) {
        console.warn("无法观察绘制事件", e)
      }
    }

    // 观察布局偏移
    if (PerformanceObserver && PerformanceObserver.supportedEntryTypes?.includes("layout-shift")) {
      let cumulativeLayoutShift = 0

      this.layoutShiftObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // 只有不涉及用户输入的布局偏移才计入CLS
          if (!(entry as any).hadRecentInput) {
            cumulativeLayoutShift += (entry as any).value
          }
        }

        this.metrics.layoutShift = {
          cumulativeLayoutShift,
        }
      })

      try {
        this.layoutShiftObserver.observe({ type: "layout-shift", buffered: true })
      } catch (e) {
        console.warn("无法观察布局偏移", e)
      }
    }

    // 观察首次输入延迟
    if (PerformanceObserver && PerformanceObserver.supportedEntryTypes?.includes("first-input")) {
      this.interactionObserver = new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0]

        if (firstInput) {
          this.metrics.interactionTiming = this.metrics.interactionTiming || {}
          this.metrics.interactionTiming.firstInputDelay = firstInput.processingStart! - firstInput.startTime
        }
      })

      try {
        this.interactionObserver.observe({ type: "first-input", buffered: true })
      } catch (e) {
        console.warn("无法观察首次输入延迟", e)
      }
    }

    // 观察资源加载
    if (
      this.config.enableResourceTiming &&
      PerformanceObserver &&
      PerformanceObserver.supportedEntryTypes?.includes("resource")
    ) {
      this.resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()

        this.metrics.resourceTiming = this.metrics.resourceTiming || { resources: [] }

        entries.forEach((entry) => {
          if (this.metrics.resourceTiming!.resources.length < this.config.maxResourceEntries!) {
            this.metrics.resourceTiming!.resources.push({
              name: entry.name,
              initiatorType: entry.initiatorType,
              duration: entry.duration,
              transferSize: (entry as any).transferSize || 0,
              decodedBodySize: (entry as any).decodedBodySize || 0,
            })
          }
        })
      })

      try {
        this.resourceObserver.observe({ entryTypes: ["resource"] })
      } catch (e) {
        console.warn("无法观察资源加载", e)
      }
    }
  }

  // 收集内存使用指标
  private collectMemoryInfo(): void {
    if (typeof window === "undefined") return

    if (this.config.enableMemoryInfo && (performance as any).memory) {
      const memory = (performance as any).memory

      this.metrics.memory = {
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        totalJSHeapSize: memory.totalJSHeapSize,
        usedJSHeapSize: memory.usedJSHeapSize,
      }
    }
  }

  // 添加自定义指标
  public addCustomMetric(name: string, value: number): void {
    if (!this.isInitialized) return

    this.customMetrics[name] = value
    this.metrics.custom = { ...this.customMetrics }
  }

  // 记录组件渲染时间
  public recordComponentRender(componentName: string, startTime: number): void {
    const endTime = typeof performance !== "undefined" ? performance.now() : 0
    this.addCustomMetric(`render_${componentName}`, endTime - startTime)
  }

  // 设置定期上报
  private setupReporting(): void {
    if (typeof window === "undefined") return

    // 页面卸载前上报
    window.addEventListener("beforeunload", () => {
      this.reportMetrics()
    })

    // 定期上报
    this.reportingTimer = window.setInterval(() => {
      this.reportMetrics()
    }, this.config.reportingInterval)
  }

  // 上报指标
  private reportMetrics(): void {
    if (!this.isInitialized || typeof window === "undefined") return

    // 收集最新的内存信息
    this.collectMemoryInfo()

    // 发送指标到服务器
    if (this.config.reportingEndpoint) {
      // 使用sendBeacon API，即使页面正在卸载也能发送数据
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          this.config.reportingEndpoint,
          JSON.stringify({
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.metrics,
          }),
        )
      } else {
        // 回退到fetch API
        fetch(this.config.reportingEndpoint, {
          method: "POST",
          body: JSON.stringify({
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.metrics,
          }),
          keepalive: true,
        }).catch((err) => console.error("上报性能指标失败:", err))
      }
    }
  }

  // 停止监控
  public stop(): void {
    if (!this.isInitialized || typeof window === "undefined") return

    // 清除定时器
    if (this.reportingTimer !== null) {
      clearInterval(this.reportingTimer)
      this.reportingTimer = null
    }

    // 断开所有观察器
    if (this.paintObserver) {
      this.paintObserver.disconnect()
    }

    if (this.layoutShiftObserver) {
      this.layoutShiftObserver.disconnect()
    }

    if (this.interactionObserver) {
      this.interactionObserver.disconnect()
    }

    if (this.resourceObserver) {
      this.resourceObserver.disconnect()
    }

    // 最后一次上报
    this.reportMetrics()

    this.isInitialized = false
  }

  // 获取当前指标
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }
}

// 创建单例实例
let instance: PerformanceMonitor | null = null

export function getPerformanceMonitor(config?: Partial<PerformanceMonitorConfig>): PerformanceMonitor {
  if (!instance) {
    instance = new PerformanceMonitor(config)
  }

  return instance
}
