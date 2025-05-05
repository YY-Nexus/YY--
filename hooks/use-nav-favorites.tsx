"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { useLocalStorage } from "./use-local-storage"
import type { NavItemType } from "@/lib/navigation-data"

type FavoriteItem = {
  id: string
  path: string
  title: string
  icon: any
  parentTitle?: string
}

type NavFavoritesContextType = {
  favorites: FavoriteItem[]
  addToFavorites: (item: NavItemType, parentTitle?: string) => void
  removeFromFavorites: (id: string) => void
  isFavorite: (id: string) => boolean
  reorderFavorites: (startIndex: number, endIndex: number) => void
}

const NavFavoritesContext = createContext<NavFavoritesContextType | undefined>(undefined)

export function NavFavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<FavoriteItem[]>("nav-favorites", [])

  // 添加到收藏
  const addToFavorites = (item: NavItemType, parentTitle?: string) => {
    if (isFavorite(item.id)) return

    const newFavorite: FavoriteItem = {
      id: item.id,
      path: item.path || "#",
      title: item.title,
      icon: item.icon,
      parentTitle,
    }

    setFavorites((prev) => [...prev, newFavorite])
  }

  // 从收藏中移除
  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
  }

  // 检查是否已收藏
  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id)
  }

  // 重新排序收藏
  const reorderFavorites = (startIndex: number, endIndex: number) => {
    setFavorites((prev) => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }

  return (
    <NavFavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, reorderFavorites }}
    >
      {children}
    </NavFavoritesContext.Provider>
  )
}

export function useNavFavorites() {
  const context = useContext(NavFavoritesContext)
  if (context === undefined) {
    throw new Error("useNavFavorites must be used within a NavFavoritesProvider")
  }
  return context
}
