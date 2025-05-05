"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Eye, Filter, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SyncHistory() {
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const syncHistory = [
    {
      id: 1,
      startTime: "2023-05-04 08:30:15",
      endTime: "2023-05-04 08:35:42",
      status: "success",
      type: "scheduled",
      dataSource: "ERP系统",
      recordsProcessed: 1248,
      recordsCreated: 15,
      recordsUpdated: 124,
      recordsFailed: 0,
      logs: [
        { level: "info", time: "08:30:15", message: "开始同步数据" },
        { level: "info", time: "08:30:16", message: "连接到ERP系统" },
        { level: "info", time: "08:30:18", message: "开始同步员工数据" },
        { level: "info", time: "08:32:05", message: "员工数据同步完成，处理了1024条记录" },
        { level: "info", time: "08:32:06", message: "开始同步部门数据" },
        { level: "info", time: "08:33:12", message: "部门数据同步完成，处理了48条记录" },
        { level: "info", time: "08:33:13", message: "开始同步绩效数据" },
        { level: "info", time: "08:35:40", message: "绩效数据同步完成，处理了176条记录" },
        { level: "info", time: "08:35:42", message: "数据同步完成" },
      ],
    },
    {
      id: 2,
      startTime: "2023-05-03 08:30:10",
      endTime: "2023-05-03 08:36:25",
      status: "warning",
      type: "scheduled",
      dataSource: "ERP系统",
      recordsProcessed: 1245,
      recordsCreated: 12,
      recordsUpdated: 118,
      recordsFailed: 3,
      logs: [
        { level: "info", time: "08:30:10", message: "开始同步数据" },
        { level: "info", time: "08:30:12", message: "连接到ERP系统" },
        { level: "info", time: "08:30:14", message: "开始同步员工数据" },
        { level: "info", time: "08:32:10", message: "员工数据同步完成，处理了1020条记录" },
        { level: "info", time: "08:32:11", message: "开始同步部门数据" },
        { level: "info", time: "08:33:18", message: "部门数据同步完成，处理了48条记录" },
        { level: "info", time: "08:33:19", message: "开始同步绩效数据" },
        { level: "warning", time: "08:35:30", message: "处理绩效记录ID:1052时出现错误：字段格式不匹配" },
        { level: "warning", time: "08:35:45", message: "处理绩效记录ID:1068时出现错误：字段格式不匹配" },
        { level: "warning", time: "08:36:10", message: "处理绩效记录ID:1075时出现错误：字段格式不匹配" },
        { level: "info", time: "08:36:25", message: "数据同步完成，有3条记录失败" },
      ],
    },
    {
      id: 3,
      startTime: "2023-05-02 08:30:05",
      endTime: "2023-05-02 08:31:15",
      status: "error",
      type: "scheduled",
      dataSource: "ERP系统",
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsFailed: 0,
      logs: [
        { level: "info", time: "08:30:05", message: "开始同步数据" },
        { level: "info", time: "08:30:06", message: "尝试连接到ERP系统" },
        { level: "error", time: "08:31:06", message: "连接ERP系统失败：连接超时" },
        { level: "error", time: "08:31:15", message: "数据同步失败：无法连接到数据源" },
      ],
    },
    {
      id: 4,
      startTime: "2023-05-01 14:15:22",
      endTime: "2023-05-01 14:20:48",
      status: "success",
      type: "manual",
      dataSource: "ERP系统",
      recordsProcessed: 1240,
      recordsCreated: 8,
      recordsUpdated: 112,
      recordsFailed: 0,
      logs: [
        { level: "info", time: "14:15:22", message: "开始同步数据" },
        { level: "info", time: "14:15:24", message: "连接到ERP系统" },
        { level: "info", time: "14:15:26", message: "开始同步员工数据" },
        { level: "info", time: "14:17:15", message: "员工数据同步完成，处理了1018条记录" },
        { level: "info", time: "14:17:16", message: "开始同步部门数据" },
        { level: "info", time: "14:18:22", message: "部门数据同步完成，处理了48条记录" },
        { level: "info", time: "14:18:23", message: "开始同步绩效数据" },
        { level: "info", time: "14:20:46", message: "绩效数据同步完成，处理了174条记录" },
        { level: "info", time: "14:20:48", message: "数据同步完成" },
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">成功</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">警告</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">失败</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">未知</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "scheduled":
        return "定时"
      case "manual":
        return "手动"
      case "realtime":
        return "实时"
      default:
        return "未知"
    }
  }

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <div className="h-4 w-4 rounded-full bg-blue-500" />
      case "warning":
        return <div className="h-4 w-4 rounded-full bg-yellow-500" />
      case "error":
        return <div className="h-4 w-4 rounded-full bg-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜索同步记录" className="pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span>日期筛选</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>高级筛选</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>导出日志</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>开始时间</TableHead>
              <TableHead>结束时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>数据源</TableHead>
              <TableHead className="text-right">处理记录</TableHead>
              <TableHead className="text-right">创建记录</TableHead>
              <TableHead className="text-right">更新记录</TableHead>
              <TableHead className="text-right">失败记录</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {syncHistory.map((history) => (
              <TableRow key={history.id}>
                <TableCell>{history.startTime}</TableCell>
                <TableCell>{history.endTime}</TableCell>
                <TableCell>{getStatusBadge(history.status)}</TableCell>
                <TableCell>{getTypeLabel(history.type)}</TableCell>
                <TableCell>{history.dataSource}</TableCell>
                <TableCell className="text-right">{history.recordsProcessed}</TableCell>
                <TableCell className="text-right">{history.recordsCreated}</TableCell>
                <TableCell className="text-right">{history.recordsUpdated}</TableCell>
                <TableCell className="text-right">{history.recordsFailed}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedLog(history)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>同步详情 - {history.startTime}</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="summary">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="summary">摘要</TabsTrigger>
                          <TabsTrigger value="logs">详细日志</TabsTrigger>
                        </TabsList>
                        <TabsContent value="summary" className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">开始时间</h3>
                              <p>{history.startTime}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">结束时间</h3>
                              <p>{history.endTime}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">状态</h3>
                              <p>{getStatusBadge(history.status)}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">类型</h3>
                              <p>{getTypeLabel(history.type)}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">数据源</h3>
                              <p>{history.dataSource}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">耗时</h3>
                              <p>
                                {(() => {
                                  const start = new Date(history.startTime).getTime()
                                  const end = new Date(history.endTime).getTime()
                                  const diff = Math.floor((end - start) / 1000)
                                  const minutes = Math.floor(diff / 60)
                                  const seconds = diff % 60
                                  return `${minutes}分${seconds}秒`
                                })()}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">处理统计</h3>
                            <div className="grid grid-cols-4 gap-4">
                              <div className="rounded-lg border p-3">
                                <div className="text-sm text-muted-foreground">处理记录</div>
                                <div className="text-2xl font-bold">{history.recordsProcessed}</div>
                              </div>
                              <div className="rounded-lg border p-3">
                                <div className="text-sm text-muted-foreground">创建记录</div>
                                <div className="text-2xl font-bold text-green-600">{history.recordsCreated}</div>
                              </div>
                              <div className="rounded-lg border p-3">
                                <div className="text-sm text-muted-foreground">更新记录</div>
                                <div className="text-2xl font-bold text-blue-600">{history.recordsUpdated}</div>
                              </div>
                              <div className="rounded-lg border p-3">
                                <div className="text-sm text-muted-foreground">失败记录</div>
                                <div className="text-2xl font-bold text-red-600">{history.recordsFailed}</div>
                              </div>
                            </div>
                          </div>

                          {history.status === "warning" || history.status === "error" ? (
                            <div className="space-y-2">
                              <h3 className="text-sm font-medium">错误摘要</h3>
                              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                <ul className="space-y-1 text-sm">
                                  {history.logs
                                    .filter((log: any) => log.level === "warning" || log.level === "error")
                                    .map((log: any, index: number) => (
                                      <li key={index} className="flex items-start gap-2">
                                        {log.level === "warning" ? (
                                          <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500" />
                                        ) : (
                                          <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500" />
                                        )}
                                        <span>
                                          {log.time} - {log.message}
                                        </span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          ) : null}
                        </TabsContent>
                        <TabsContent value="logs" className="pt-4">
                          <div className="max-h-96 overflow-auto rounded-lg border p-4">
                            <div className="space-y-2">
                              {history.logs.map((log: any, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                  {getLogLevelIcon(log.level)}
                                  <div className="text-sm text-muted-foreground w-16">{log.time}</div>
                                  <div className="text-sm flex-1">{log.message}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
