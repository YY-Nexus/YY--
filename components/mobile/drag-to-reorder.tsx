"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface DragToReorderProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  onReorder: (items: T[]) => void
  keyExtractor: (item: T) => string | number
  className?: string
  itemClassName?: string
  dragHandleClassName?: string
  disabled?: boolean
}

export function DragToReorder<T>({
  items,
  renderItem,
  onReorder,
  keyExtractor,
  className,
  itemClassName,
  dragHandleClassName,
  disabled = false,
}: DragToReorderProps<T>) {
  const [draggedItem, setDraggedItem] = useState<T | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [itemRects, setItemRects] = useState<DOMRect[]>([])

  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const dragTimerRef = useRef<number | null>(null)
  const isMounted = useRef(false)

  // 初始化项目引用数组
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length)
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [items])

  // 计算所有项目的位置矩形
  useEffect(() => {
    if (listRef.current) {
      const rects = itemRefs.current.filter(Boolean).map((itemRef) => itemRef!.getBoundingClientRect())

      setItemRects(rects)
    }
  }, [items])

  // 处理拖拽开始
  const handleDragStart = (item: T, index: number, e: React.TouchEvent | React.MouseEvent) => {
    if (disabled) return

    e.preventDefault()

    // 获取触摸或鼠标位置
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    // 获取项目元素
    const itemEl = itemRefs.current[index]
    if (!itemEl) return

    // 计算拖拽偏移量
    const rect = itemEl.getBoundingClientRect()
    const offsetX = clientX - rect.left
    const offsetY = clientY - rect.top

    setDraggedItem(item)
    setDraggedIndex(index)
    setDragPosition({ x: clientX - offsetX, y: clientY - offsetY })
    setDragOffset({ x: offsetX, y: offsetY })

    // 添加全局事件监听器
    window.addEventListener("mousemove", handleDragMove)
    window.addEventListener("touchmove", handleDragMove)
    window.addEventListener("mouseup", handleDragEnd)
    window.addEventListener("touchend", handleDragEnd)
  }

  // 处理拖拽移动
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (draggedIndex === null) return

    // 获取触摸或鼠标位置
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    // 更新拖拽位置
    setDragPosition({
      x: clientX - dragOffset.x,
      y: clientY - dragOffset.y,
    })

    // 查找目标索引
    const targetIdx = itemRects.findIndex((rect, idx) => {
      if (idx === draggedIndex) return false

      return clientY >= rect.top && clientY <= rect.bottom
    })

    if (targetIdx !== -1 && targetIdx !== targetIndex) {
      setTargetIndex(targetIdx)
    }
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    if (draggedIndex !== null && targetIndex !== null && draggedItem !== null) {
      // 创建新的项目数组
      const newItems = [...items]

      // 从原位置移除项目
      newItems.splice(draggedIndex, 1)

      // 计算新的插入位置
      let insertIndex = targetIndex
      if (targetIndex > draggedIndex) {
        insertIndex--
      }

      // 在新位置插入项目
      newItems.splice(insertIndex, 0, draggedItem)

      // 调用重新排序回调
      onReorder(newItems)
    }

    // 重置状态
    setDraggedItem(null)
    setDraggedIndex(null)
    setTargetIndex(null)

    // 移除全局事件监听器
    window.removeEventListener("mousemove", handleDragMove)
    window.removeEventListener("touchmove", handleDragMove)
    window.removeEventListener("mouseup", handleDragEnd)
    window.removeEventListener("touchend", handleDragEnd)
  }

  // 渲染拖拽中的项目
  const renderDraggedItem = () => {
    if (draggedItem === null || draggedIndex === null) return null

    // 使用Portal渲染拖拽中的项目
    return createPortal(
      <div
        className={cn("fixed pointer-events-none z-50 opacity-90 shadow-lg", itemClassName)}
        style={{
          width: itemRects[draggedIndex]?.width,
          height: itemRects[draggedIndex]?.height,
          left: dragPosition.x,
          top: dragPosition.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {renderItem(draggedItem, draggedIndex)}
      </div>,
      document.body,
    )
  }

  return (
    <div ref={listRef} className={cn("relative", className)}>
      {items.map((item, index) => {
        const key = keyExtractor(item)
        const isDragged = draggedIndex === index

        return (
          <div
            key={key}
            ref={(el) => (itemRefs.current[index] = el)}
            className={cn("transition-transform duration-200", isDragged && "opacity-30", itemClassName)}
            style={{
              transform:
                targetIndex === index ? `translateY(${draggedIndex! < targetIndex ? "-100%" : "100%"})` : undefined,
            }}
          >
            <div className="flex items-center">
              <div
                className={cn("touch-none cursor-grab active:cursor-grabbing", dragHandleClassName)}
                onTouchStart={(e) => handleDragStart(item, index, e)}
                onMouseDown={(e) => handleDragStart(item, index, e)}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">{renderItem(item, index)}</div>
            </div>
          </div>
        )
      })}

      {renderDraggedItem()}
    </div>
  )
}
