"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SelectTenantPage() {
  const [tenantId, setTenantId] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tenantId.trim()) {
      router.push(`/tenant/${tenantId}/dashboard`)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen mx-auto py-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>选择租户</CardTitle>
          <CardDescription>请输入您的租户ID或选择一个已有租户</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tenantId">租户ID</Label>
                <Input
                  id="tenantId"
                  placeholder="请输入租户ID"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit" className="w-full">
                进入租户
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="text-sm text-muted-foreground mb-2">快速访问</div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" onClick={() => router.push("/tenant/demo/dashboard")}>
              演示租户
            </Button>
            <Button variant="outline" onClick={() => router.push("/tenant/test/dashboard")}>
              测试租户
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
