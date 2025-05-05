// 预加载服务
class PreloadService {
  private preloadedRoutes: Set<string> = new Set()
  private preloadedAssets: Set<string> = new Set()

  // 预加载路由
  public prefetchRoute(route: string): void {
    if (this.preloadedRoutes.has(route)) return

    try {
      if (typeof window !== "undefined") {
        const link = document.createElement("link")
        link.rel = "prefetch"
        link.href = route
        link.as = "document"
        document.head.appendChild(link)
        this.preloadedRoutes.add(route)
      }
    } catch (error) {
      console.warn(`预加载路由失败: ${route}`, error)
    }
  }

  // 预加载资源
  public preloadAsset(url: string, as: "script" | "style" | "image" | "font" = "script"): void {
    if (this.preloadedAssets.has(url)) return

    try {
      if (typeof window !== "undefined") {
        const link = document.createElement("link")
        link.rel = "preload"
        link.href = url
        link.as = as
        document.head.appendChild(link)
        this.preloadedAssets.add(url)
      }
    } catch (error) {
      console.warn(`预加载资源失败: ${url}`, error)
    }
  }

  // 预加载关键资源
  public preloadCriticalAssets(): void {
    // 预加载关键脚本
    this.preloadAsset("/_next/static/chunks/main.js", "script")

    // 预加载关键样式
    this.preloadAsset("/_next/static/css/app.css", "style")

    // 预加载字体
    this.preloadAsset("/fonts/inter.woff2", "font")

    // 预加载关键图片
    this.preloadAsset("/logo.png", "image")
  }
}

// 单例实例
let instance: PreloadService | null = null

// 获取预加载服务实例
export function getPreloadService(): PreloadService {
  if (!instance) {
    instance = new PreloadService()
  }
  return instance
}

// 初始化预加载服务
export function initPreloadService(): void {
  const service = getPreloadService()
  service.preloadCriticalAssets()
}
