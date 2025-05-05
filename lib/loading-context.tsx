"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface LoadingState {
  [key: string]: boolean
}

interface LoadingContextType {
  isLoading: (key?: string) => boolean
  startLoading: (key?: string) => void
  stopLoading: (key?: string) => void
  withLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    global: false,
  })

  const isLoading = useCallback(
    (key = "global") => {
      return !!loadingState[key]
    },
    [loadingState],
  )

  const startLoading = useCallback((key = "global") => {
    setLoadingState((prev) => ({ ...prev, [key]: true }))
  }, [])

  const stopLoading = useCallback((key = "global") => {
    setLoadingState((prev) => ({ ...prev, [key]: false }))
  }, [])

  const withLoading = useCallback(
    async <T,>(key: string, fn: () => Promise<T>): Promise<T> => {
      try {
        startLoading(key)
        return await fn()
      } finally {
        stopLoading(key)
      }
    },
    [startLoading, stopLoading],
  )

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        startLoading,
        stopLoading,
        withLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading必须在LoadingProvider内部使用")
  }
  return context
}
