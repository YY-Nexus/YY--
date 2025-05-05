import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { shallow } from "zustand/shallow"

// 用户偏好设置
interface UserPreferences {
  fontSize: "small" | "medium" | "large"
  highContrast: boolean
  reducedMotion: boolean
  language: string
}

// 通知设置
interface NotificationSettings {
  unreadCount: number
  showBadge: boolean
  soundEnabled: boolean
}

// 应用状态
interface AppState {
  // 主题
  theme: "light" | "dark" | "system"
  sidebarCollapsed: boolean

  // 用户偏好
  userPreferences: UserPreferences

  // 通知
  notifications: NotificationSettings

  // 历史记录
  lastViewedPages: string[]
  recentSearches: string[]

  // 加载状态
  loadingStates: Record<string, boolean>

  // 动作
  setTheme: (theme: "light" | "dark" | "system") => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setFontSize: (size: "small" | "medium" | "large") => void
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  setLanguage: (language: string) => void
  setUnreadCount: (count: number) => void
  toggleNotificationBadge: () => void
  toggleNotificationSound: () => void
  addViewedPage: (page: string) => void
  clearViewedPages: () => void
  addRecentSearch: (search: string) => void
  clearRecentSearches: () => void
  setLoading: (key: string, isLoading: boolean) => void
}

// 创建应用状态存储
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 初始状态
      theme: "system",
      sidebarCollapsed: false,
      userPreferences: {
        fontSize: "medium",
        highContrast: false,
        reducedMotion: false,
        language: "zh-CN",
      },
      notifications: {
        unreadCount: 0,
        showBadge: true,
        soundEnabled: true,
      },
      lastViewedPages: [],
      recentSearches: [],
      loadingStates: {},

      // 动作
      setTheme: (theme) => set({ theme }),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setFontSize: (fontSize) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, fontSize },
        })),

      toggleHighContrast: () =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, highContrast: !state.userPreferences.highContrast },
        })),

      toggleReducedMotion: () =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, reducedMotion: !state.userPreferences.reducedMotion },
        })),

      setLanguage: (language) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, language },
        })),

      setUnreadCount: (unreadCount) =>
        set((state) => ({
          notifications: { ...state.notifications, unreadCount },
        })),

      toggleNotificationBadge: () =>
        set((state) => ({
          notifications: { ...state.notifications, showBadge: !state.notifications.showBadge },
        })),

      toggleNotificationSound: () =>
        set((state) => ({
          notifications: { ...state.notifications, soundEnabled: !state.notifications.soundEnabled },
        })),

      addViewedPage: (page) =>
        set((state) => {
          // 避免重复添加
          if (state.lastViewedPages.includes(page)) {
            return {
              lastViewedPages: [page, ...state.lastViewedPages.filter((p) => p !== page)].slice(0, 10), // 只保留最近10个
            }
          }
          return {
            lastViewedPages: [page, ...state.lastViewedPages].slice(0, 10), // 只保留最近10个
          }
        }),

      clearViewedPages: () => set({ lastViewedPages: [] }),

      addRecentSearch: (search) =>
        set((state) => {
          // 避免重复添加
          if (state.recentSearches.includes(search)) {
            return {
              recentSearches: [search, ...state.recentSearches.filter((s) => s !== search)].slice(0, 10), // 只保留最近10个
            }
          }
          return {
            recentSearches: [search, ...state.recentSearches].slice(0, 10), // 只保留最近10个
          }
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),

      setLoading: (key, isLoading) =>
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: isLoading,
          },
        })),
    }),
    {
      name: "app-storage", // 本地存储的键名
      storage: createJSONStorage(() => localStorage), // 使用localStorage
      partialize: (state) => ({
        // 只持久化这些字段
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        userPreferences: state.userPreferences,
        notifications: {
          showBadge: state.notifications.showBadge,
          soundEnabled: state.notifications.soundEnabled,
        },
        lastViewedPages: state.lastViewedPages,
        recentSearches: state.recentSearches,
      }),
    },
  ),
)

// 创建选择器钩子
export const useTheme = () => useAppStore((state) => state.theme)
export const useSidebar = () =>
  useAppStore(
    (state) => ({
      collapsed: state.sidebarCollapsed,
      toggle: state.toggleSidebar,
      setCollapsed: state.setSidebarCollapsed,
    }),
    shallow,
  )

export const useUserPreferences = () =>
  useAppStore(
    (state) => ({
      ...state.userPreferences,
      setFontSize: state.setFontSize,
      toggleHighContrast: state.toggleHighContrast,
      toggleReducedMotion: state.toggleReducedMotion,
      setLanguage: state.setLanguage,
    }),
    shallow,
  )

export const useNotifications = () =>
  useAppStore(
    (state) => ({
      ...state.notifications,
      setUnreadCount: state.setUnreadCount,
      toggleBadge: state.toggleNotificationBadge,
      toggleSound: state.toggleNotificationSound,
    }),
    shallow,
  )

export const useHistory = () =>
  useAppStore(
    (state) => ({
      viewedPages: state.lastViewedPages,
      addViewedPage: state.addViewedPage,
      clearViewedPages: state.clearViewedPages,
    }),
    shallow,
  )

export const useSearch = () =>
  useAppStore(
    (state) => ({
      recentSearches: state.recentSearches,
      addRecentSearch: state.addRecentSearch,
      clearRecentSearches: state.clearRecentSearches,
    }),
    shallow,
  )

export const useLoading = () => {
  const setLoading = useAppStore((state) => state.setLoading)
  const loadingStates = useAppStore((state) => state.loadingStates)

  return {
    isLoading: (key = "global") => !!loadingStates[key],
    startLoading: (key = "global") => setLoading(key, true),
    stopLoading: (key = "global") => setLoading(key, false),
    withLoading: async <T,>(key: string, fn: () => Promise<T>): Promise<T> => {
      try {
        setLoading(key, true)
        return await fn()
      } finally {
        setLoading(key, false)
      }
    },
  }
}
