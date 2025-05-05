"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { Tenant } from "./tenant-model"
import { getSupabaseApiClient } from "@/lib/api/api-client"

// 多租户上下文接口
interface TenantContextType {
  currentTenant: Tenant | null
  isLoading: boolean
  error: Error | null
  switchTenant: (tenantId: string) => Promise<void>
  availableTenants: Tenant[]
  refreshTenant: () => Promise<void>
}

// 创建多租户上下文
const TenantContext = createContext<TenantContextType | undefined>(undefined)

// 多租户提供者组件属性
interface TenantProviderProps {
  children: ReactNode
}

interface TenantCustomization {
  primaryColor?: string
  secondaryColor?: string
  customCss?: string
  customJs?: string
  logo?: string
  favicon?: string
}

// 多租户提供者组件
export function TenantProvider({ children }: TenantProviderProps) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // 从URL或本地存储中获取租户ID
  const getTenantIdFromUrl = (): string | null => {
    if (typeof window === "undefined") return null

    // 从URL路径中提取租户ID
    const pathParts = pathname?.split("/") || []
    if (pathParts.length > 1 && pathParts[1] === "tenant" && pathParts[2]) {
      return pathParts[2]
    }

    // 从子域名中提取租户ID
    const hostname = window.location.hostname
    if (hostname.includes(".")) {
      const subdomain = hostname.split(".")[0]
      if (subdomain !== "www" && subdomain !== "app") {
        return subdomain
      }
    }

    // 从本地存储中获取最后使用的租户ID
    return localStorage.getItem("lastTenantId")
  }

  // 加载用户可访问的所有租户
  const loadAvailableTenants = async () => {
    try {
      const supabaseApi = getSupabaseApiClient()
      const tenants = await supabaseApi.getTable<Tenant>("tenants", {
        select: "*",
        filter: { status: "active" },
      })

      setAvailableTenants(tenants)
      return tenants
    } catch (err) {
      console.error("加载可用租户失败:", err)
      setError(err instanceof Error ? err : new Error("加载可用租户失败"))
      return []
    }
  }

  // 加载特定租户的详细信息
  const loadTenant = async (tenantId: string) => {
    try {
      setIsLoading(true)
      const supabaseApi = getSupabaseApiClient()
      const tenant = await supabaseApi.getRecord<Tenant>("tenants", tenantId)

      if (!tenant) {
        throw new Error(`租户 ${tenantId} 不存在或您没有访问权限`)
      }

      if (tenant.status !== "active") {
        throw new Error(`租户 ${tenantId} 当前不可用`)
      }

      setCurrentTenant(tenant)
      localStorage.setItem("lastTenantId", tenantId)

      // 应用租户自定义设置
      applyTenantCustomization(tenant.customization)

      return tenant
    } catch (err) {
      console.error(`加载租户 ${tenantId} 失败:`, err)
      setError(err instanceof Error ? err : new Error(`加载租户 ${tenantId} 失败`))
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // 应用租户自定义设置
  const applyTenantCustomization = (customization: TenantCustomization) => {
    if (!customization) return

    // 应用主题颜色
    if (customization.primaryColor) {
      document.documentElement.style.setProperty("--primary", customization.primaryColor)
    }

    if (customization.secondaryColor) {
      document.documentElement.style.setProperty("--secondary", customization.secondaryColor)
    }

    // 应用自定义CSS
    if (customization.customCss) {
      const styleElement = document.createElement("style")
      styleElement.id = "tenant-custom-css"
      styleElement.textContent = customization.customCss
      document.head.appendChild(styleElement)
    }

    // 应用自定义JS
    if (customization.customJs) {
      const scriptElement = document.createElement("script")
      scriptElement.id = "tenant-custom-js"
      scriptElement.textContent = customization.customJs
      document.body.appendChild(scriptElement)
    }

    // 应用自定义Logo
    if (customization.logo) {
      const logoElements = document.querySelectorAll(".tenant-logo")
      logoElements.forEach((element) => {
        if (element instanceof HTMLImageElement) {
          element.src = customization.logo || ""
        }
      })
    }

    // 应用自定义Favicon
    if (customization.favicon) {
      const faviconElement = document.querySelector("link[rel='icon']")
      if (faviconElement) {
        faviconElement.setAttribute("href", customization.favicon)
      }
    }
  }

  // 切换租户
  const switchTenant = async (tenantId: string) => {
    const tenant = await loadTenant(tenantId)
    if (tenant) {
      // 重定向到租户特定的URL
      router.push(`/tenant/${tenantId}/dashboard`)
    }
  }

  // 刷新当前租户信息
  const refreshTenant = async () => {
    if (currentTenant) {
      await loadTenant(currentTenant.id)
    }
  }

  // 初始化加载
  useEffect(() => {
    const initializeTenant = async () => {
      try {
        setIsLoading(true)
        const tenants = await loadAvailableTenants()

        if (tenants.length === 0) {
          setError(new Error("没有可用的租户"))
          setIsLoading(false)
          return
        }

        const tenantId = getTenantIdFromUrl()
        if (tenantId) {
          // 尝试加载指定的租户
          const tenant = await loadTenant(tenantId)
          if (!tenant) {
            // 如果指定的租户不可用，加载第一个可用的租户
            await loadTenant(tenants[0].id)
          }
        } else {
          // 如果没有指定租户，加载第一个可用的租户
          await loadTenant(tenants[0].id)
        }
      } catch (err) {
        console.error("初始化租户失败:", err)
        setError(err instanceof Error ? err : new Error("初始化租户失败"))
      } finally {
        setIsLoading(false)
      }
    }

    initializeTenant()

    // 清理函数
    return () => {
      // 移除自定义样式和脚本
      const customCssElement = document.getElementById("tenant-custom-css")
      if (customCssElement) {
        customCssElement.remove()
      }

      const customJsElement = document.getElementById("tenant-custom-js")
      if (customJsElement) {
        customJsElement.remove()
      }
    }
  }, [])

  // 提供上下文值
  const contextValue: TenantContextType = {
    currentTenant,
    isLoading,
    error,
    switchTenant,
    availableTenants,
    refreshTenant,
  }

  return <TenantContext.Provider value={contextValue}>{children}</TenantContext.Provider>
}

// 使用多租户上下文的钩子
export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant必须在TenantProvider内部使用")
  }
  return context
}
