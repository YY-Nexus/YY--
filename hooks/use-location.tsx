"use client"

import { useState, useEffect, useCallback } from "react"

interface LocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  loading: boolean
  error: string | null
}

interface UseLocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  watch?: boolean
}

export function useLocation({
  enableHighAccuracy = true,
  timeout = 10000,
  maximumAge = 0,
  watch = false,
}: UseLocationOptions = {}) {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
  })

  // 成功获取位置的回调
  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      loading: false,
      error: null,
    })
  }, [])

  // 获取位置失败的回调
  const handleError = useCallback((error: GeolocationPositionError) => {
    setLocation((prev) => ({
      ...prev,
      loading: false,
      error: getLocationErrorMessage(error),
    }))
  }, [])

  // 获取位置错误信息
  const getLocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "用户拒绝了位置请求"
      case error.POSITION_UNAVAILABLE:
        return "位置信息不可用"
      case error.TIMEOUT:
        return "获取位置超时"
      default:
        return "获取位置时发生未知错误"
    }
  }

  // 获取当前位置
  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: "您的浏览器不支持地理位置服务",
      }))
      return
    }

    setLocation((prev) => ({ ...prev, loading: true }))

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    })
  }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError])

  useEffect(() => {
    let watchId: number | null = null

    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: "您的浏览器不支持地理位置服务",
      }))
      return
    }

    if (watch) {
      // 持续监听位置变化
      watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy,
        timeout,
        maximumAge,
      })
    } else {
      // 只获取一次位置
      getCurrentPosition()
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watch, enableHighAccuracy, timeout, maximumAge, getCurrentPosition, handleSuccess, handleError])

  return {
    ...location,
    refresh: getCurrentPosition,
  }
}
