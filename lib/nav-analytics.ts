export type NavAnalyticsEvent = {
  type: "navigation" | "search" | "favorite" | "ai_recommendation" | "shortcut"
  itemId?: string
  path?: string
  timestamp: number
  metadata?: Record<string, any>
}

export type NavAnalyticsSummary = {
  mostVisitedPages: Array<{ path: string; count: number; title: string }>
  averageSessionDuration: number
  searchUsageRate: number
  aiRecommendationClickRate: number
  shortcutUsageRate: number
  favoriteUsageRate: number
  navigationPatterns: Array<{ from: string; to: string; count: number }>
}

// 模拟分析数据存储
let analyticsEvents: NavAnalyticsEvent[] = []

// 记录导航事件
export function recordNavEvent(event: Omit<NavAnalyticsEvent, "timestamp">) {
  const fullEvent: NavAnalyticsEvent = {
    ...event,
    timestamp: Date.now(),
  }

  analyticsEvents.push(fullEvent)

  // 如果在客户端，可以存储到localStorage
  if (typeof window !== "undefined") {
    const storedEvents = JSON.parse(localStorage.getItem("nav-analytics") || "[]")
    storedEvents.push(fullEvent)

    // 限制存储事件数量，防止localStorage溢出
    if (storedEvents.length > 1000) {
      storedEvents.splice(0, storedEvents.length - 1000)
    }

    localStorage.setItem("nav-analytics", JSON.stringify(storedEvents))
  }

  // 在实际应用中，这里可以发送事件到后端分析系统
  // sendToAnalyticsServer(fullEvent)
}

// 获取分析摘要
export function getAnalyticsSummary(): NavAnalyticsSummary {
  // 在实际应用中，这些数据应该从后端分析系统获取
  // 这里只是模拟一些数据

  // 从localStorage加载事件
  if (typeof window !== "undefined") {
    analyticsEvents = JSON.parse(localStorage.getItem("nav-analytics") || "[]")
  }

  // 计算最常访问的页面
  const pageVisits: Record<string, { count: number; title: string }> = {}
  analyticsEvents
    .filter((e) => e.type === "navigation" && e.path)
    .forEach((e) => {
      if (!e.path) return
      if (!pageVisits[e.path]) {
        pageVisits[e.path] = { count: 0, title: e.metadata?.title || e.path }
      }
      pageVisits[e.path].count++
    })

  const mostVisitedPages = Object.entries(pageVisits)
    .map(([path, { count, title }]) => ({ path, count, title }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // 计算平均会话时长（简化版）
  const sessions: Record<string, { start: number; end: number }> = {}
  analyticsEvents.forEach((e) => {
    const day = new Date(e.timestamp).toDateString()
    if (!sessions[day]) {
      sessions[day] = { start: e.timestamp, end: e.timestamp }
    } else {
      sessions[day].end = e.timestamp
    }
  })

  const sessionDurations = Object.values(sessions).map((s) => s.end - s.start)
  const averageSessionDuration =
    sessionDurations.length > 0
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
      : 0

  // 计算搜索使用率
  const totalUsers = new Set(analyticsEvents.map((e) => e.metadata?.userId || "anonymous")).size
  const searchUsers = new Set(
    analyticsEvents.filter((e) => e.type === "search").map((e) => e.metadata?.userId || "anonymous"),
  ).size

  const searchUsageRate = totalUsers > 0 ? searchUsers / totalUsers : 0

  // 计算AI推荐点击率
  const aiRecommendations = analyticsEvents.filter((e) => e.type === "ai_recommendation")
  const aiClicks = aiRecommendations.filter((e) => e.metadata?.clicked)
  const aiRecommendationClickRate = aiRecommendations.length > 0 ? aiClicks.length / aiRecommendations.length : 0

  // 计算快捷键使用率
  const navigationEvents = analyticsEvents.filter((e) => e.type === "navigation")
  const shortcutEvents = analyticsEvents.filter((e) => e.type === "shortcut")
  const shortcutUsageRate = navigationEvents.length > 0 ? shortcutEvents.length / navigationEvents.length : 0

  // 计算收藏夹使用率
  const favoriteEvents = analyticsEvents.filter((e) => e.type === "favorite")
  const favoriteUsageRate = navigationEvents.length > 0 ? favoriteEvents.length / navigationEvents.length : 0

  // 计算导航模式
  const navigationPatterns: Record<string, { from: string; to: string; count: number }> = {}
  let lastPath: string | null = null

  analyticsEvents
    .filter((e) => e.type === "navigation" && e.path)
    .forEach((e) => {
      if (lastPath && e.path) {
        const key = `${lastPath}->${e.path}`
        if (!navigationPatterns[key]) {
          navigationPatterns[key] = { from: lastPath, to: e.path, count: 0 }
        }
        navigationPatterns[key].count++
      }
      lastPath = e.path || null
    })

  const patterns = Object.values(navigationPatterns)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    mostVisitedPages,
    averageSessionDuration,
    searchUsageRate,
    aiRecommendationClickRate,
    shortcutUsageRate,
    favoriteUsageRate,
    navigationPatterns: patterns,
  }
}

// 清除分析数据
export function clearAnalyticsData() {
  analyticsEvents = []
  if (typeof window !== "undefined") {
    localStorage.removeItem("nav-analytics")
  }
}
