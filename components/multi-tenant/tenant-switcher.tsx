"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building, ChevronDown, Plus, Check, Star, StarOff } from "lucide-react"
import { getRecoveryService, ErrorType, ErrorSeverity } from "@/lib/error-recovery/recovery-service"
import { getCache, setCache, CachePriority } from "@/lib/cache-service"

// 租户信息
interface Tenant {
  id: string
  name: string
  domain?: string
  logo?: string
  isFavorite?: boolean
  lastAccessed?: number
}

export function TenantSwitcher() {
  const router = useRouter()
  const recoveryService = getRecoveryService()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [newTenantName, setNewTenantName] = useState("")
  const [newTenantDomain, setNewTenantDomain] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // 加载租户列表
  useEffect(() => {
    const loadTenants = async () => {
      setIsLoading(true)

      try {
        // 尝试从缓存获取租户列表
        const cachedTenants = getCache<Tenant[]>("tenants")

        if (cachedTenants && cachedTenants.length > 0) {
          setTenants(cachedTenants)

          // 获取当前租户ID
          const currentTenantId = getCurrentTenantId()
          const current = cachedTenants.find((t) => t.id === currentTenantId) || cachedTenants[0]
          setCurrentTenant(current)
        } else {
          // 如果缓存中没有，则从API获取
          await fetchTenantsFromApi()
        }
      } catch (error) {
        recoveryService.captureError({
          type: ErrorType.API,
          severity: ErrorSeverity.MEDIUM,
          message: "加载租户列表失败",
          context: {
            timestamp: Date.now(),
            additionalData: { error },
          },
          originalError: error instanceof Error ? error : undefined,
        })

        // 使用示例租户作为降级策略
        const fallbackTenants: Tenant[] = [
          { id: "demo", name: "演示租户", isFavorite: true },
          { id: "test", name: "测试租户" },
        ]
        setTenants(fallbackTenants)
        setCurrentTenant(fallbackTenants[0])
      } finally {
        setIsLoading(false)
      }
    }

    loadTenants()
  }, [recoveryService])

  // 从API获取租户列表
  const fetchTenantsFromApi = async () => {
    try {
      // 这里应该是实际的API调用
      // const response = await fetch('/api/tenants')
      // const data = await response.json()

      // 示例数据
      const apiTenants: Tenant[] = [
        { id: "tenant1", name: "企业租户1", domain: "company1", isFavorite: true },
        { id: "tenant2", name: "企业租户2", domain: "company2" },
        { id: "tenant3", name: "企业租户3", domain: "company3" },
      ]

      setTenants(apiTenants)

      // 获取当前租户ID
      const currentTenantId = getCurrentTenantId()
      const current = apiTenants.find((t) => t.id === currentTenantId) || apiTenants[0]
      setCurrentTenant(current)

      // 缓存租户列表
      setCache("tenants", apiTenants, {
        expirationMinutes: 60,
        priority: CachePriority.HIGH,
      })
    } catch (error) {
      throw error
    }
  }

  // 获取当前租户ID
  const getCurrentTenantId = (): string | null => {
    // 从URL中获取
    const path = window.location.pathname
    const matches = path.match(/\/tenant\/([^/]+)/)
    if (matches && matches[1]) {
      return matches[1]
    }

    // 从本地存储中获取
    return localStorage.getItem("currentTenantId")
  }

  // 切换租户
  const switchTenant = (tenant: Tenant) => {
    setCurrentTenant(tenant)

    // 更新最后访问时间
    const updatedTenants = tenants.map((t) => (t.id === tenant.id ? { ...t, lastAccessed: Date.now() } : t))
    setTenants(updatedTenants)

    // 更新缓存
    setCache("tenants", updatedTenants, {
      expirationMinutes: 60,
      priority: CachePriority.HIGH,
    })

    // 保存当前租户ID
    localStorage.setItem("currentTenantId", tenant.id)

    // 导航到租户仪表盘
    router.push(`/tenant/${tenant.id}/dashboard`)

    setIsOpen(false)
  }

  // 切换收藏状态
  const toggleFavorite = (tenant: Tenant, event: React.MouseEvent) => {
    event.stopPropagation()

    const updatedTenants = tenants.map((t) => (t.id === tenant.id ? { ...t, isFavorite: !t.isFavorite } : t))
    setTenants(updatedTenants)

    // 更新缓存
    setCache("tenants", updatedTenants, {
      expirationMinutes: 60,
      priority: CachePriority.HIGH,
    })
  }

  // 创建新租户
  const createTenant = () => {
    if (!newTenantName) return

    const newTenant: Tenant = {
      id: newTenantDomain || `tenant-${Date.now()}`,
      name: newTenantName,
      domain: newTenantDomain || undefined,
      lastAccessed: Date.now(),
    }

    const updatedTenants = [...tenants, newTenant]
    setTenants(updatedTenants)

    // 更新缓存
    setCache("tenants", updatedTenants, {
      expirationMinutes: 60,
      priority: CachePriority.HIGH,
    })

    // 切换到新租户
    switchTenant(newTenant)

    // 重置表单
    setNewTenantName("")
    setNewTenantDomain("")
    setIsCreateDialogOpen(false)
  }

  // 渲染收藏图标
  const renderFavoriteIcon = (tenant: Tenant) => {
    if (tenant.isFavorite) {
      return <Star className="h-4 w-4 text-yellow-400 cursor-pointer" onClick={(e) => toggleFavorite(tenant, e)} />
    }

    return (
      <StarOff
        className="h-4 w-4 text-gray-400 cursor-pointer hover:text-yellow-400"
        onClick={(e) => toggleFavorite(tenant, e)}
      />
    )
  }

  // 获取排序后的租户列表
  const getSortedTenants = () => {
    return [...tenants].sort((a, b) => {
      // 首先按收藏状态排序
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1

      // 然后按最后访问时间排序
      return (b.lastAccessed || 0) - (a.lastAccessed || 0)
    })
  }

  if (isLoading) {
    return (
      <Button variant="outline" className="w-[200px] justify-start" disabled>
        <Building className="mr-2 h-4 w-4" />
        <span className="truncate">加载中...</span>
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            <Building className="mr-2 h-4 w-4" />
            <span className="truncate">{currentTenant?.name || "选择租户"}</span>
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuLabel>切换租户</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {getSortedTenants().map((tenant) => (
            <DropdownMenuItem
              key={tenant.id}
              onClick={() => switchTenant(tenant)}
              className="flex items-center justify-between"
            >
              <span className="truncate">{tenant.name}</span>
              <div className="flex items-center">
                {renderFavoriteIcon(tenant)}
                {currentTenant?.id === tenant.id && <Check className="ml-2 h-4 w-4" />}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span>创建新租户</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建新租户</DialogTitle>
            <DialogDescription>创建一个新的租户空间，您将成为该租户的管理员。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">租户名称</Label>
              <Input
                id="name"
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                placeholder="例如：我的公司"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">租户域名</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="domain"
                  value={newTenantDomain}
                  onChange={(e) => setNewTenantDomain(e.target.value)}
                  placeholder="例如：mycompany"
                />
                <span className="text-sm text-muted-foreground">.app.example.com</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={createTenant} disabled={!newTenantName}>
              创建租户
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
