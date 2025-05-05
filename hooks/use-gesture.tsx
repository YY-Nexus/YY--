"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

// 手势方向类型
export type GestureDirection = "left" | "right" | "up" | "down" | null

// 手势状态接口
interface GestureState {
  startX: number
  startY: number
  moveX: number
  moveY: number
  direction: GestureDirection
  distance: number
  isActive: boolean
}

// 手势配置接口
interface GestureOptions {
  threshold?: number // 触发手势的最小距离
  onSwipe?: (direction: GestureDirection, distance: number) => void
  onSwipeLeft?: (distance: number) => void
  onSwipeRight?: (distance: number) => void
  onSwipeUp?: (distance: number) => void
  onSwipeDown?: (distance: number) => void
  onSwipeStart?: (x: number, y: number) => void
  onSwipeEnd?: () => void
  onSwipeMove?: (x: number, y: number, direction: GestureDirection) => void
  disabled?: boolean
}

// 手势钩子
export function useGesture(options: GestureOptions = {}) {
  const {
    threshold = 50,
    onSwipe,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipeStart,
    onSwipeEnd,
    onSwipeMove,
    disabled = false,
  } = options

  // 初始化手势状态
  const [gesture, setGesture] = useState<GestureState>({
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    direction: null,
    distance: 0,
    isActive: false,
  })

  // 使用ref存储回调函数，避免依赖项变化
  const callbackRef = useRef({
    onSwipe,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipeStart,
    onSwipeEnd,
    onSwipeMove,
  })

  // 更新回调函数
  useEffect(() => {
    callbackRef.current = {
      onSwipe,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onSwipeStart,
      onSwipeEnd,
      onSwipeMove,
    }
  }, [onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onSwipeStart, onSwipeEnd, onSwipeMove])

  // 处理触摸开始事件
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return

    const touch = e.touches[0]
    const startX = touch.clientX
    const startY = touch.clientY

    setGesture({
      startX,
      startY,
      moveX: startX,
      moveY: startY,
      direction: null,
      distance: 0,
      isActive: true,
    })

    callbackRef.current.onSwipeStart?.(startX, startY)
  }

  // 处理触摸移动事件
  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !gesture.isActive) return

    const touch = e.touches[0]
    const moveX = touch.clientX
    const moveY = touch.clientY
    const deltaX = moveX - gesture.startX
    const deltaY = moveY - gesture.startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    let direction: GestureDirection = null
    let distance = 0

    // 确定手势方向和距离
    if (absDeltaX > absDeltaY) {
      direction = deltaX > 0 ? "right" : "left"
      distance = absDeltaX
    } else {
      direction = deltaY > 0 ? "down" : "up"
      distance = absDeltaY
    }

    setGesture({
      ...gesture,
      moveX,
      moveY,
      direction,
      distance,
    })

    callbackRef.current.onSwipeMove?.(moveX, moveY, direction)
  }

  // 处理触摸结束事件
  const handleTouchEnd = () => {
    if (disabled || !gesture.isActive) return

    // 如果手势距离超过阈值，触发相应的回调
    if (gesture.distance >= threshold && gesture.direction) {
      callbackRef.current.onSwipe?.(gesture.direction, gesture.distance)

      switch (gesture.direction) {
        case "left":
          callbackRef.current.onSwipeLeft?.(gesture.distance)
          break
        case "right":
          callbackRef.current.onSwipeRight?.(gesture.distance)
          break
        case "up":
          callbackRef.current.onSwipeUp?.(gesture.distance)
          break
        case "down":
          callbackRef.current.onSwipeDown?.(gesture.distance)
          break
      }
    }

    callbackRef.current.onSwipeEnd?.()

    // 重置手势状态
    setGesture({
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0,
      direction: null,
      distance: 0,
      isActive: false,
    })
  }

  // 返回手势处理器和状态
  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    gesture,
  }
}
