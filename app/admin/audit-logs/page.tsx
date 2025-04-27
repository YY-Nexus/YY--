"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { PermissionGuard } from "@/components/permission-guard"
import { Loader2, Download, Search, Filter, RefreshCw } from "lucide-react"

interface AuditLog {
  action: string
  timestamp: string
  userId?: string
  email?: string
  details?: string
  ip?: string
  userAgent?: string
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const { user } = useAuth()
  const router = useRouter()

  // 加载审计日志
  useEffect(() => {
    const loadLogs = () => {
      try {
        const storedLogs = localStorage.getItem("auditLogs")
        if (storedLogs) {
          const parsedLogs = JSON.parse(storedLogs) as AuditLog[]
          setLogs(parsedLogs)
          setFilteredLogs(parsedLogs)
        } else {
          setLogs([])
          setFilteredLogs([])
        }
      } catch (error) {
        console.error("加载审计日志失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [])

  // 过滤日志
  useEffect(() => {
    let filtered = logs

    // 按操作类型过滤
    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter)
    }

    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (log) =>
          log.action?.toLowerCase().includes(term) ||
          log.userId?.toLowerCase().includes(term) ||
          log.email?.toLowerCase().includes(term) ||
          log.details?.toLowerCase().includes(term) ||
          log.ip?.includes(term),
      )
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, actionFilter])

  // 导出日志
  const exportLogs = () => {
    try {
      const dataStr = JSON.stringify(filteredLogs, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `audit-logs-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      console.error("导出日志失败:", error)
    }
  }

  // 刷新日志
  const refreshLogs = () => {
    setLoading(true)
    try {
      const storedLogs = localStorage.getItem("auditLogs")
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs) as AuditLog[]
        setLogs(parsedLogs)
        setFilteredLogs(parsedLogs)
      }
    } catch (error) {
      console.error("刷新日志失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 获取唯一的操作类型列表
  const actionTypes = ["all", ...new Set(logs.map((log) => log.action))]

  return (
    <DashboardLayout>
      <PermissionGuard permission="logs:view" fallback={<div>您没有权限查看审计日志</div>}>
        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">审计日志</h1>
            <p className="text-muted-foreground">查看系统操作记录和安全事件</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>日志记录</CardTitle>
              <CardDescription>系统操作和安全事件的详细记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex items-center gap-2 sm:flex-1">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索日志..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={actionFilter} onValueChange={setActionFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="操作类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type === "all" ? "所有操作" : type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={refreshLogs}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={exportLogs}>
                      <Download className="mr-2 h-4 w-4" />
                      导出
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 gap-4 p-4 font-medium">
                      <div>时间</div>
                      <div>操作</div>
                      <div>用户</div>
                      <div>IP地址</div>
                      <div>详情</div>
                    </div>
                    {filteredLogs.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">没有找到匹配的日志记录</div>
                    ) : (
                      filteredLogs.map((log, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 border-t p-4">
                          <div className="text-sm">{new Date(log.timestamp).toLocaleString()}</div>
                          <div className="text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                log.action.includes("SUCCESS")
                                  ? "bg-green-100 text-green-800"
                                  : log.action.includes("FAILURE") || log.action.includes("ERROR")
                                    ? "bg-red-100 text-red-800"
                                    : log.action.includes("WARNING")
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {log.action}
                            </span>
                          </div>
                          <div className="text-sm">{log.email || log.userId || "系统"}</div>
                          <div className="text-sm">{log.ip || "未知"}</div>
                          <div className="text-sm">{log.details || "无详情"}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  )
}
