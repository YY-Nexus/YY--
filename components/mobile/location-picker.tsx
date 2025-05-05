"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2 } from "lucide-react"
import { useLocation } from "@/hooks/use-location"
import { cn } from "@/lib/utils"

interface LocationPickerProps {
  onSelectLocation: (location: {
    latitude: number
    longitude: number
    address: string
  }) => void
  initialLocation?: {
    latitude: number
    longitude: number
    address: string
  }
  className?: string
}

export function LocationPicker({ onSelectLocation, initialLocation, className }: LocationPickerProps) {
  const [address, setAddress] = useState(initialLocation?.address || "")
  const [isSearching, setIsSearching] = useState(false)

  // 使用位置钩子
  const {
    latitude,
    longitude,
    loading: locationLoading,
    error: locationError,
    refresh: refreshLocation,
  } = useLocation({
    enableHighAccuracy: true,
  })

  // 根据坐标获取地址
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      setIsSearching(true)

      // 这里使用第三方地理编码API，如高德地图、百度地图等
      // 以下为示例代码，实际使用时需要替换为真实的API调用
      const response = await fetch(`https://api.example.com/geocode/reverse?lat=${lat}&lng=${lng}`)

      if (!response.ok) {
        throw new Error("获取地址信息失败")
      }

      const data = await response.json()

      // 假设API返回的数据格式包含formatted_address字段
      return data.formatted_address || "未知地址"
    } catch (error) {
      console.error("获取地址信息失败:", error)
      return "获取地址失败，请手动输入"
    } finally {
      setIsSearching(false)
    }
  }

  // 使用当前位置
  const useCurrentLocation = async () => {
    if (latitude && longitude) {
      try {
        const address = await getAddressFromCoordinates(latitude, longitude)
        setAddress(address)

        onSelectLocation({
          latitude,
          longitude,
          address,
        })
      } catch (error) {
        console.error("使用当前位置失败:", error)
      }
    } else {
      refreshLocation()
    }
  }

  // 提交位置
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (latitude && longitude) {
      onSelectLocation({
        latitude,
        longitude,
        address,
      })
    }
  }

  // 初始化位置
  useEffect(() => {
    if (initialLocation) {
      setAddress(initialLocation.address)
    }
  }, [initialLocation])

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">选择位置</h3>

        <Button type="button" variant="outline" size="sm" onClick={useCurrentLocation} disabled={locationLoading}>
          {locationLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MapPin className="h-4 w-4 mr-2" />}
          使用当前位置
        </Button>
      </div>

      {locationError && <p className="text-sm text-red-500">{locationError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">地址</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="输入地址"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {latitude && longitude ? (
              <span>
                坐标: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </span>
            ) : (
              <span>未获取坐标信息</span>
            )}
          </div>

          <Button type="submit" disabled={!latitude || !longitude || !address}>
            确认位置
          </Button>
        </div>
      </form>
    </div>
  )
}
