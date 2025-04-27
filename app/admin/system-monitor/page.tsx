"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PermissionGuard } from "@/components/permission-guard"
import { useAuth } from "@/lib/auth"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Cpu, Database, HardDrive, RefreshCw, Users, Clock, Activity, AlertTriangle, CheckCircle } from "lucide-react"

// 模拟系统性能数据
const generatePerformanceData = () => {
  return {
    cpu: Math.floor(Math.random() * 40) + 10,
    memory: Math.floor(Math.random() * 30) + 20,
    disk: Math.floor(Math.random() * 20) + 30,
    network: Math.floor(Math.random() * 50) + 10,
    activeUsers: Math.floor(Math.random() * 50) + 30,
    responseTime: Math.floor(Math.random() * 200) + 50,
    errorRate: Math.floor(Math.random() * 5),
    uptime: 99.9 + Math.random() * 0.1,
  }
}

// 模拟历史性能数据
const generateHistoricalData = () => {
  const data = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now)
    time.setHours(now.getHours() - i)

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cpu: Math.floor(Math.random() * 40) + 10,
      memory: Math.floor(Math.random() * 30) + 20,
      network: Math.floor(Math.random() * 50) + 10,
      users: Math.floor(Math.random() * 50) + 30,
    })
  }

  return data
}

// 模拟错误分布数据
const generateErrorDistribution = () => {
  return [
    { name: "数据库", value: 35, color: "#ff6b6b" },
    { name: "网络", value: 25, color: "#feca57" },
    { name: "应用", value: 30, color: "#48dbfb" },
    { name: "其他", value: 10, color: "#1dd1a1" },
  ]
}

export default function SystemMonitorPage() {
  const [performanceData, setPerformanceData] = useState(generatePerformanceData())
  const [historicalData, setHistoricalData] = useState(generateHistoricalData())
  const [errorDistribution, setErrorDistribution] = useState(generateErrorDistribution())
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null)
  const { user } = useAuth()

  // 刷新数据
  const refreshData = () => {
    setPerformanceData(generatePerformanceData())
    setHistoricalData(generateHistoricalData())
    setErrorDistribution(generateErrorDistribution())
  }

  // 自动刷新
  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(refreshData, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [refreshInterval])

  // 设置刷新间隔
  const setAutoRefresh = (seconds: number | null) => {
    setRefreshInterval(seconds)
  }

  return (
    <DashboardLayout>
      <PermissionGuard permission="system:view" fallback={<div>您没有权限查看系统监控</div>}>
        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">系统监控</h1>
            <p className="text-muted-foreground">实时监控系统性能和资源使用情况</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant={refreshInterval === null ? "default" : "outline"} onClick={() => setAutoRefresh(null)}>
                手动刷新
              </Button>
              <Button variant={refreshInterval === 5 ? "default" : "outline"} onClick={() => setAutoRefresh(5)}>
                5秒
              </Button>
              <Button variant={refreshInterval === 30 ? "default" : "outline"} onClick={() => setAutoRefresh(30)}>
                30秒
              </Button>
              <Button variant={refreshInterval === 60 ? "default" : "outline"} onClick={() => setAutoRefresh(60)}>
                1分钟
              </Button>
            </div>
            <Button onClick={refreshData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              刷新数据
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU 使用率</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.cpu}%</div>
                <Progress value={performanceData.cpu} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">内存使用率</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.memory}%</div>
                <Progress value={performanceData.memory} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">磁盘使用率</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.disk}%</div>
                <Progress value={performanceData.disk} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.activeUsers}</div>
                <Progress value={performanceData.activeUsers} max={100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均响应时间</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.responseTime} ms</div>
                <p className="text-xs text-muted-foreground">正常范围内</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">错误率</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.errorRate}%</div>
                <p className="text-xs text-muted-foreground">低于警戒阈值</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">系统负载</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.network}%</div>
                <p className="text-xs text-muted-foreground">正常范围内</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">系统可用性</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.uptime.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">过去30天</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="performance" className="space-y-4">
            <TabsList>
              <TabsTrigger value="performance">性能趋势</TabsTrigger>
              <TabsTrigger value="errors">错误分析</TabsTrigger>
              <TabsTrigger value="users">用户活动</TabsTrigger>
            </TabsList>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>系统性能趋势</CardTitle>
                  <CardDescription>过去24小时的系统资源使用情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="cpu" stroke="#ff6b6b" name="CPU使用率" />
                        <Line type="monotone" dataKey="memory" stroke="#48dbfb" name="内存使用率" />
                        <Line type="monotone" dataKey="network" stroke="#1dd1a1" name="网络负载" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="errors">
              <Card>
                <CardHeader>
                  <CardTitle>错误分布</CardTitle>
                  <CardDescription>系统错误类型分布情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={errorDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {errorDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>用户活动</CardTitle>
                  <CardDescription>过去24小时的用户活动情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="#feca57" name="活跃用户数" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  )
}
