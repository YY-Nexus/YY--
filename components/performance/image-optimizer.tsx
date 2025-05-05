"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface ImageOptimizerProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  lowResSrc?: string
  placeholderColor?: string
  lazyLoad?: boolean
  threshold?: number
}

export function ImageOptimizer({
  src,
  lowResSrc,
  placeholderColor = "#f3f4f6",
  lazyLoad = true,
  threshold = 0.1,
  alt = "",
  className,
  ...props
}: ImageOptimizerProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(!lazyLoad)
  const imgRef = useRef<HTMLImageElement>(null)

  // 使用IntersectionObserver实现懒加载
  useEffect(() => {
    if (!lazyLoad || !imgRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(imgRef.current)

    return () => {
      observer.disconnect()
    }
  }, [lazyLoad, threshold])

  // 处理图片加载完成
  const handleLoad = () => {
    setLoaded(true)
  }

  // 处理图片加载失败
  const handleError = () => {
    setError(true)
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundColor: placeholderColor,
      }}
      ref={imgRef}
    >
      {/* 低分辨率图片或占位符 */}
      {!loaded && !error && lowResSrc && inView && (
        <img
          src={lowResSrc || "/placeholder.svg"}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 blur-sm"
          {...props}
        />
      )}

      {/* 高分辨率图片 */}
      {inView && (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            !loaded && "opacity-0",
            loaded && "opacity-100",
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {/* 加载失败占位符 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <span>图片加载失败</span>
        </div>
      )}
    </div>
  )
}
