"use client"

import { useState } from "react"
import { useTenant } from "@/lib/multi-tenant/tenant-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building, ChevronDown, Check, Plus } from "lucide-react"
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

export function TenantSelector() {
  const { currentTenant, availableTenants, switchTenant, isLoading } = useTenant()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTenantName, setNewTenantName] = useState("")
  const [newTenantDomain, setNewTenantDomain] = useState("")

  // 处理创建新租户
  const handleCreateTenant = async () => {
    // 这里应该调用API创建新租户
    // 然后刷新租户列表并切换到新租户
    setIsCreateDialogOpen(false)
    setNewTenantName("")
    setNewTenantDomain("")
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            <Building className="mr-2 h-4 w-4" />
            <span className="truncate">{currentTenant?.name || "选择组织"}</span>
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuLabel>切换组织</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableTenants.map((tenant) => (
            <DropdownMenuItem
              key={tenant.id}
              onClick={() => switchTenant(tenant.id)}
              className="flex items-center justify-between"
            >
              <span className="truncate">{tenant.name}</span>
              {currentTenant?.id === tenant.id && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span>创建新组织</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建新组织</DialogTitle>
            <DialogDescription>创建一个新的组织空间，您将成为该组织的管理员。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">组织名称</Label>
              <Input
                id="name"
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                placeholder="例如：我的公司"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">组织域名</Label>
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
            <Button onClick={handleCreateTenant} disabled={!newTenantName || !newTenantDomain}>
              创建组织
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
