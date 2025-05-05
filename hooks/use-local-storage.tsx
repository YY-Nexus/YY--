"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 状态初始化函数
  const initialize = () => {
    try {
      // 尝试从localStorage获取值
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key)
        // 如果存在则解析并返回，否则返回初始值
        return item ? JSON.parse(item) : initialValue
      }
      return initialValue
    } catch (error) {
      // 如果出错则返回初始值
      console.error("Error reading from localStorage", error)
      return initialValue
    }
  }

  // 创建状态
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // 在客户端初始化 - 只在组件挂载时执行一次
  useEffect(() => {
    setStoredValue(initialize())
  }, [key]) // 只依赖于key，避免无限循环

  // 更新状态和localStorage的函数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 允许传入函数（类似于useState）
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // 保存到状态
      setStoredValue(valueToStore)
      // 保存到localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error writing to localStorage", error)
    }
  }

  return [storedValue, setValue]
}
