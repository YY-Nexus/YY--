"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useGesture } from "@/hooks/use-gesture"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SwipeToDeleteProps {
  onDelete: () => void
  children: React.ReactNode
  className?: string
  threshold?: number
  deleteWidth?: number
  disabled?: boolean
}

export function SwipeToDelete({
  onDelete,
  children,
  className,
  threshold = 80,
  deleteWidth = 80,
  disabled = false,
}: SwipeToDeleteProps) {
  const [offset, setOffset] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  // 使用手势钩子
  const { handlers, gesture } = useGesture({
    threshold,
    onSwipeMove: (_, __, direction) => {
      if (direction === "left" && !disabled) {
        // 限制最大滑动距离为删除按钮宽度
        const newOffset = Math.min(gesture.distance, deleteWidth)
        setOffset(newOffset)
      } else if (direction === "right" && offset > 0) {
        // 向右滑动时恢复位置
        const newOffset = Math.max(0, offset - gesture.distance)
        setOffset(newOffset)
      }
    },
    onSwipeLeft: (distance) => {
      if (disabled) return

      // 如果滑动距离超过阈值，显示删除按钮
      if (distance >= threshold) {
        setOffset(deleteWidth)
      } else {
        setOffset(0)
      }
    },
    onSwipeRight: () => {
      // 向右滑动时恢复位置
      setOffset(0)
    },
    onSwipeEnd: () => {
      // 如果滑动距离超过阈值的一半，显示删除按钮，否则恢复位置
      if (offset > threshold / 2 && offset < threshold) {
        setOffset(deleteWidth)
      } else if (offset < threshold / 2) {
        setOffset(0)
      }
    },
    disabled,
  })

  // 处理删除操作
  const handleDelete = () => {
    if (disabled) return

    setIsDeleting(true)

    // 添加动画效果
    if (itemRef.current) {
      itemRef.current.style.height = `${itemRef.current.offsetHeight}px`
      itemRef.current.style.transition = "height 0.3s ease, opacity 0.3s ease, transform 0.3s ease"

      // 延迟执行以确保过渡效果生效
      setTimeout(() => {
        if (itemRef.current) {
          itemRef.current.style.height = "0"
          itemRef.current.style.opacity = "0"
          itemRef.current.style.transform = "translateX(-100%)"
        }
      }, 0)

      // 动画结束后执行删除回调
      setTimeout(() => {
        onDelete()
      }, 300)
    } else {
      onDelete()
    }
  }

  // 重置位置
  const resetPosition = () => {
    setOffset(0)
  }

  return (
    <div
      ref={itemRef}
      className={cn("relative overflow-hidden transition-transform", isDeleting && "overflow-hidden", className)}
      style={{
        transform: `translateX(-${offset}px)`,
      }}
      {...handlers}
    >
      <div className="relative w-full">
        {children}

        {/* 删除按钮 */}
        <div
          className="absolute top-0 right-0 bottom-0 flex items-center justify-center bg-red-500 text-white"
          style={{
            width: `${deleteWidth}px`,
            right: `-${deleteWidth}px`,
          }}
          onClick={handleDelete}
        >
          <Trash2 className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
