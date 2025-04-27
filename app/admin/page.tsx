"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { PermissionGuard } from "@/components/permission-guard"
import { Loader2, UserPlus, Users, Settings, Shield } from "lucide-react"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // 检查用户是否是管理员
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast({
        title: "访问被拒绝",
        description: "您没有权限访问管理员页面",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [user, router, toast])

  // 如果用户不存在或不是管理员，显示加载状态
  if (!user || user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "用户已创建",
      description: "新用户已成功创建并通知",
    })
  }

  const handleSystemSettings = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "系统设置已更新",
      description: "系统设置已成功保存",
    })
  }

  return (
    <DashboardLayout>
      <PermissionGuard permission="admin:access" fallback={<div>您没有权限访问管理员控制台</div>}>
        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">管理员控制台</h1>
            <p className="text-muted-foreground">管理系统设置、用户和权限</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总用户数</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">较上月 +8%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87</div>
                <p className="text-xs text-muted-foreground">较上月 +12%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">系统负载</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42%</div>
                <p className="text-xs text-muted-foreground">正常范围内</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">安全状态</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">良好</div>
                <p className="text-xs text-muted-foreground">无安全警报</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>系统监控</CardTitle>
                <CardDescription>监控系统性能和资源使用情况</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col gap-2">
                  <p>实时监控系统CPU、内存、磁盘和网络使用情况，查看性能趋势和异常。</p>
                  <div className="mt-auto pt-4">
                    <Button onClick={() => router.push("/admin/system-monitor")}>访问系统监控</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>审计日志</CardTitle>
                <CardDescription>查看系统操作记录和安全事件</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col gap-2">
                  <p>查看详细的系统操作记录，包括用户登录、数据修改和系统配置变更等安全事件。</p>
                  <div className="mt-auto pt-4">
                    <Button onClick={() => router.push("/admin/audit-logs")}>查看审计日志</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>用户管理</CardTitle>
                <CardDescription>管理系统用户和权限</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col gap-2">
                  <p>创建和管理系统用户，分配角色和权限，管理用户访问控制。</p>
                  <div className="mt-auto pt-4">
                    <Button onClick={() => router.push("/admin/users")}>管理用户</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>系统设置</CardTitle>
                <CardDescription>配置系统参数和全局设置</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col gap-2">
                  <p>配置系统参数、全局设置和功能开关，管理系统行为和外观。</p>
                  <div className="mt-auto pt-4">
                    <Button onClick={() => router.push("/admin/settings")}>系统设置</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>数据备份</CardTitle>
                <CardDescription>管理系统数据备份和恢复</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col gap-2">
                  <p>创建和管理系统数据备份，配置自动备份计划，执行数据恢复操作。</p>
                  <div className="mt-auto pt-4">
                    <Button onClick={() => router.push("/admin/backup")}>数据备份</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>API管理</CardTitle>
                <CardDescription>管理API访问和集成</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col gap-2">
                  <p>管理API密钥、访问权限和使用限制，监控API调用和性能。</p>
                  <div className="mt-auto pt-4">
                    <Button onClick={() => router.push("/admin/api")}>API管理</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">用户管理</TabsTrigger>
              <TabsTrigger value="system">系统设置</TabsTrigger>
              <TabsTrigger value="logs">系统日志</TabsTrigger>
              <TabsTrigger value="backup">数据备份</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>用户管理</CardTitle>
                  <CardDescription>创建和管理系统用户</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">用户名</Label>
                        <Input id="username" placeholder="输入用户名" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">电子邮箱</Label>
                        <Input id="email" type="email" placeholder="user@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">密码</Label>
                        <Input id="password" type="password" placeholder="设置密码" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">角色</Label>
                        <select
                          id="role"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="user">普通用户</option>
                          <option value="admin">管理员</option>
                          <option value="manager">管理者</option>
                          <option value="analyst">分析师</option>
                          <option value="readonly">只读用户</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="send-welcome" />
                      <Label htmlFor="send-welcome">发送欢迎邮件</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="enable-mfa" />
                      <Label htmlFor="enable-mfa">启用双因素认证</Label>
                    </div>

                    <Button type="submit">创建用户</Button>
                  </form>

                  <div className="mt-6">
                    <h3 className="mb-4 text-lg font-medium">最近用户</h3>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 gap-4 p-4 font-medium">
                        <div>用户名</div>
                        <div>邮箱</div>
                        <div>角色</div>
                        <div>状态</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 border-t p-4">
                        <div>系统管理员</div>
                        <div>yy@0379.email</div>
                        <div>管理员</div>
                        <div className="text-green-500">活跃</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 border-t p-4">
                        <div>测试用户</div>
                        <div>test@example.com</div>
                        <div>普通用户</div>
                        <div className="text-green-500">活跃</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 border-t p-4">
                        <div>财务主管</div>
                        <div>finance@example.com</div>
                        <div>管理者</div>
                        <div className="text-yellow-500">闲置</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle>系统设置</CardTitle>
                  <CardDescription>配置系统参数和全局设置</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSystemSettings} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="system-name">系统名称</Label>
                      <Input id="system-name" defaultValue="言语「逸品」数字驾驶舱" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-url">API 基础 URL</Label>
                      <Input id="api-url" defaultValue="https://api.example.com/v1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">会话超时（分钟）</Label>
                        <Input id="session-timeout" type="number" defaultValue="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-upload">最大上传大小 (MB)</Label>
                        <Input id="max-upload" type="number" defaultValue="10" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">安全设置</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="force-mfa-admin" defaultChecked />
                          <Label htmlFor="force-mfa-admin">管理员强制MFA</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="password-expiry" defaultChecked />
                          <Label htmlFor="password-expiry">密码过期策略</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="login-attempts" defaultChecked />
                          <Label htmlFor="login-attempts">登录尝试限制</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="ip-restriction" />
                          <Label htmlFor="ip-restriction">IP访问限制</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">系统功能</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="enable-registration" defaultChecked />
                          <Label htmlFor="enable-registration">启用用户注册</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="enable-api" defaultChecked />
                          <Label htmlFor="enable-api">启用 API 访问</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="maintenance-mode" />
                          <Label htmlFor="maintenance-mode">维护模式</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="debug-mode" />
                          <Label htmlFor="debug-mode">调试模式</Label>
                        </div>
                      </div>
                    </div>

                    <Button type="submit">保存系统设置</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>系统日志</CardTitle>
                  <CardDescription>查看系统操作日志和错误记录</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input placeholder="搜索日志..." className="max-w-sm" />
                      <Button variant="outline">搜索</Button>
                      <Button variant="outline" className="ml-auto">
                        导出日志
                      </Button>
                    </div>

                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 gap-4 p-4 font-medium">
                        <div>时间</div>
                        <div>类型</div>
                        <div>用户</div>
                        <div>操作</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 border-t p-4">
                        <div>2023-04-27 08:42:15</div>
                        <div className="text-green-500">登录</div>
                        <div>yy@0379.email</div>
                        <div>管理员登录成功</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 border-t p-4">
                        <div>2023-04-27 08:30:22</div>
                        <div className="text-blue-500">系统</div>
                        <div>系统</div>
                        <div>系统启动完成</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 border-t p-4">
                        <div>2023-04-26 18:15:43</div>
                        <div className="text-yellow-500">警告</div>
                        <div>test@example.com</div>
                        <div>多次登录失败</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 border-t p-4">
                        <div>2023-04-26 16:42:11</div>
                        <div className="text-red-500">错误</div>
                        <div>系统</div>
                        <div>数据库连接超时</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        上一页
                      </Button>
                      <Button variant="outline" size="sm">
                        下一页
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup">
              <Card>
                <CardHeader>
                  <CardTitle>数据备份</CardTitle>
                  <CardDescription>管理系统数据备份和恢复</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Button>创建新备份</Button>
                      <Button variant="outline">恢复备份</Button>
                      <Button variant="outline" className="ml-auto">
                        配置自动备份
                      </Button>
                    </div>

                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 gap-4 p-4 font-medium">
                        <div>备份时间</div>
                        <div>大小</div>
                        <div>类型</div>
                        <div>状态</div>
                        <div>操作</div>
                      </div>
                      <div className="grid grid-cols-5 gap-4 border-t p-4">
                        <div>2023-04-27 00:00:00</div>
                        <div>1.2 GB</div>
                        <div>自动</div>
                        <div className="text-green-500">完成</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            下载
                          </Button>
                          <Button variant="outline" size="sm">
                            恢复
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-4 border-t p-4">
                        <div>2023-04-26 00:00:00</div>
                        <div>1.1 GB</div>
                        <div>自动</div>
                        <div className="text-green-500">完成</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            下载
                          </Button>
                          <Button variant="outline" size="sm">
                            恢复
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-4 border-t p-4">
                        <div>2023-04-25 14:30:22</div>
                        <div>1.0 GB</div>
                        <div>手动</div>
                        <div className="text-green-500">完成</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            下载
                          </Button>
                          <Button variant="outline" size="sm">
                            恢复
                          </Button>
                        </div>
                      </div>
                    </div>
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
