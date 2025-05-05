"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, RotateCcw, Check, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onCancel: () => void
  className?: string
  aspectRatio?: "square" | "portrait" | "landscape"
  quality?: number
  facingMode?: "user" | "environment"
}

export function CameraCapture({
  onCapture,
  onCancel,
  className,
  aspectRatio = "square",
  quality = 0.8,
  facingMode = "environment",
}: CameraCaptureProps) {
  const [isActive, setIsActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [currentFacingMode, setCurrentFacingMode] = useState(facingMode)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // 设置视频流
  const setupCamera = async () => {
    try {
      // 检查是否支持摄像头
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("您的浏览器不支持摄像头功能")
      }

      // 停止之前的视频流
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      // 获取新的视频流
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentFacingMode,
        },
        audio: false,
      })

      // 检查是否有多个摄像头
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")
      setHasMultipleCameras(videoDevices.length > 1)

      // 设置视频流
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }

      setIsActive(true)
    } catch (error) {
      console.error("摄像头初始化失败:", error)
      alert(`摄像头初始化失败: ${(error as Error).message}`)
    }
  }

  // 切换摄像头
  const switchCamera = () => {
    setCurrentFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  // 拍照
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    // 设置画布尺寸
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // 绘制视频帧到画布
    const context = canvas.getContext("2d")
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 获取图像数据
      const imageData = canvas.toDataURL("image/jpeg", quality)
      setCapturedImage(imageData)
    }
  }

  // 重新拍照
  const retakeImage = () => {
    setCapturedImage(null)
  }

  // 确认照片
  const confirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage)
    }
  }

  // 取消拍照
  const handleCancel = () => {
    // 停止视频流
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    setIsActive(false)
    setCapturedImage(null)
    onCancel()
  }

  // 从相册选择
  const selectFromGallery = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const imageData = event.target?.result as string
          onCapture(imageData)
        }
        reader.readAsDataURL(file)
      }
    }

    input.click()
  }

  // 初始化摄像头
  useEffect(() => {
    setupCamera()

    return () => {
      // 组件卸载时停止视频流
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [currentFacingMode])

  // 根据宽高比设置样式
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square"
      case "portrait":
        return "aspect-[3/4]"
      case "landscape":
        return "aspect-[4/3]"
      default:
        return "aspect-square"
    }
  }

  return (
    <div className={cn("relative bg-black rounded-lg overflow-hidden", className)}>
      {/* 摄像头预览 */}
      {!capturedImage && (
        <div className={cn("relative", getAspectRatioClass())}>
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}

      {/* 拍摄的照片 */}
      {capturedImage && (
        <div className={cn("relative", getAspectRatioClass())}>
          <img
            src={capturedImage || "/placeholder.svg"}
            alt="拍摄的照片"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      {/* 隐藏的画布用于捕获图像 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 控制按钮 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-black/50">
        {!capturedImage ? (
          <>
            <Button variant="ghost" size="icon" className="text-white" onClick={handleCancel}>
              <X className="h-6 w-6" />
            </Button>

            <Button variant="outline" size="icon" className="rounded-full h-14 w-14 bg-white" onClick={captureImage}>
              <Camera className="h-6 w-6 text-black" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={hasMultipleCameras ? switchCamera : selectFromGallery}
            >
              {hasMultipleCameras ? <RotateCcw className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon" className="text-white" onClick={retakeImage}>
              <RotateCcw className="h-6 w-6" />
            </Button>

            <Button variant="outline" size="icon" className="rounded-full h-14 w-14 bg-white" onClick={confirmImage}>
              <Check className="h-6 w-6 text-green-600" />
            </Button>

            <Button variant="ghost" size="icon" className="text-white" onClick={handleCancel}>
              <X className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
