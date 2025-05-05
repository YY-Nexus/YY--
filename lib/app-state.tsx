"use client"

import type React from "react"

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react"

// 应用状态类型
interface AppState {
  theme: "light" | "dark" | "system"
  sidebarCollapsed: boolean
  userPreferences: {
    fontSize: "small" | "medium" | "large"
    highContrast: boolean
    reducedMotion: boolean
    language: string
  }
  notifications: {
    unreadCount: number
    showBadge: boolean
    soundEnabled: boolean
  }
  lastViewedPages: string[]
  recentSearches: string[]
}

// 初始状态
const initialState: AppState = {
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
}

// 动作类型
type Action =
  | { type: "SET_THEME"; payload: "light" | "dark" | "system" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR_COLLAPSED"; payload: boolean }
  | { type: "SET_FONT_SIZE"; payload: "small" | "medium" | "large" }
  | { type: "TOGGLE_HIGH_CONTRAST" }
  | { type: "TOGGLE_REDUCED_MOTION" }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "SET_UNREAD_COUNT"; payload: number }
  | { type: "TOGGLE_NOTIFICATION_BADGE" }
  | { type: "TOGGLE_NOTIFICATION_SOUND" }
  | { type: "ADD_VIEWED_PAGE"; payload: string }
  | { type: "CLEAR_VIEWED_PAGES" }
  | { type: "ADD_RECENT_SEARCH"; payload: string }
  | { type: "CLEAR_RECENT_SEARCHES" }

// 状态reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload }
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    case "SET_SIDEBAR_COLLAPSED":
      return { ...state, sidebarCollapsed: action.payload }
    case "SET_FONT_SIZE":
      return { ...state, userPreferences: { ...state.userPreferences, fontSize: action.payload } }
    case "TOGGLE_HIGH_CONTRAST":
      return {
        ...state,
        userPreferences: { ...state.userPreferences, highContrast: !state.userPreferences.highContrast },
      }
    case "TOGGLE_REDUCED_MOTION":
      return {
        ...state,
        userPreferences: { ...state.userPreferences, reducedMotion: !state.userPreferences.reducedMotion },
      }
    case "SET_LANGUAGE":
      return { ...state, userPreferences: { ...state.userPreferences, language: action.payload } }
    case "SET_UNREAD_COUNT":
      return { ...state, notifications: { ...state.notifications, unreadCount: action.payload } }
    case "TOGGLE_NOTIFICATION_BADGE":
      return {
        ...state,
        notifications: { ...state.notifications, showBadge: !state.notifications.showBadge },
      }
    case "TOGGLE_NOTIFICATION_SOUND":
      return {
        ...state,
        notifications: { ...state.notifications, soundEnabled: !state.notifications.soundEnabled },
      }
    case "ADD_VIEWED_PAGE":
      // 避免重复添加
      if (state.lastViewedPages.includes(action.payload)) {
        return {
          ...state,
          lastViewedPages: [action.payload, ...state.lastViewedPages.filter((page) => page !== action.payload)].slice(
            0,
            10,
          ), // 只保留最近10个
        }
      }
      return {
        ...state,
        lastViewedPages: [action.payload, ...state.lastViewedPages].slice(0, 10), // 只保留最近10个
      }
    case "CLEAR_VIEWED_PAGES":
      return { ...state, lastViewedPages: [] }
    case "ADD_RECENT_SEARCH":
      // 避免重复添加
      if (state.recentSearches.includes(action.payload)) {
        return {
          ...state,
          recentSearches: [action.payload, ...state.recentSearches.filter((search) => search !== action.payload)].slice(
            0,
            10,
          ), // 只保留最近10个
        }
      }
      return {
        ...state,
        recentSearches: [action.payload, ...state.recentSearches].slice(0, 10), // 只保留最近10个
      }
    case "CLEAR_RECENT_SEARCHES":
      return { ...state, recentSearches: [] }
    default:
      return state
  }
}

// 上下文类型
interface AppStateContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
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
}

// 创建上下文
const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

// 提供者组件
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // 辅助函数
  const setTheme = useCallback((theme: "light" | "dark" | "system") => {
    dispatch({ type: "SET_THEME", payload: theme })
  }, [])

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" })
  }, [])

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    dispatch({ type: "SET_SIDEBAR_COLLAPSED", payload: collapsed })
  }, [])

  const setFontSize = useCallback((size: "small" | "medium" | "large") => {
    dispatch({ type: "SET_FONT_SIZE", payload: size })
  }, [])

  const toggleHighContrast = useCallback(() => {
    dispatch({ type: "TOGGLE_HIGH_CONTRAST" })
  }, [])

  const toggleReducedMotion = useCallback(() => {
    dispatch({ type: "TOGGLE_REDUCED_MOTION" })
  }, [])

  const setLanguage = useCallback((language: string) => {
    dispatch({ type: "SET_LANGUAGE", payload: language })
  }, [])

  const setUnreadCount = useCallback((count: number) => {
    dispatch({ type: "SET_UNREAD_COUNT", payload: count })
  }, [])

  const toggleNotificationBadge = useCallback(() => {
    dispatch({ type: "TOGGLE_NOTIFICATION_BADGE" })
  }, [])

  const toggleNotificationSound = useCallback(() => {
    dispatch({ type: "TOGGLE_NOTIFICATION_SOUND" })
  }, [])

  const addViewedPage = useCallback((page: string) => {
    dispatch({ type: "ADD_VIEWED_PAGE", payload: page })
  }, [])

  const clearViewedPages = useCallback(() => {
    dispatch({ type: "CLEAR_VIEWED_PAGES" })
  }, [])

  const addRecentSearch = useCallback((search: string) => {
    dispatch({ type: "ADD_RECENT_SEARCH", payload: search })
  }, [])

  const clearRecentSearches = useCallback(() => {
    dispatch({ type: "CLEAR_RECENT_SEARCHES" })
  }, [])

  return (
    <AppStateContext.Provider
      value={{
        state,
        dispatch,
        setTheme,
        toggleSidebar,
        setSidebarCollapsed,
        setFontSize,
        toggleHighContrast,
        toggleReducedMotion,
        setLanguage,
        setUnreadCount,
        toggleNotificationBadge,
        toggleNotificationSound,
        addViewedPage,
        clearViewedPages,
        addRecentSearch,
        clearRecentSearches,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

// 使用钩子
export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error("useAppState必须在AppStateProvider内部使用")
  }
  return context
}
