import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function SystemMonitorPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">系统监控中心</h1>
        <p className="text-muted-foreground">实时监控系统性能、错误和用户活动</p>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">性能监控</TabsTrigger>
          <TabsTrigger value="errors">错误日志</TabsTrigger>
          <TabsTrigger value="users">用户活动</TabsTrigger>
          <TabsTrigger value="resources">资源使用</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">平均页面加载时间</CardTitle>
                <CardDescription>所有用户的平均值</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.24s</div>
                <p className="text-xs text-muted-foreground">较上周 -0.12s</p>
                <div className="mt-4 h-[80px]">
                  <Suspense fallback={<Skeleton className="h-[80px] w-full" />}>
                    {/* 这里放置性能图表组件 */}
                    <div className="h-full bg-slate-100 rounded-md flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">加载时间趋势图</span>
                    </div>
                  </Suspense>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">首次内容绘制</CardTitle>
                <CardDescription>FCP 性能指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.87s</div>
                <p className="text-xs text-muted-foreground">较上周 -0.05s</p>
                <div className="mt-4 h-[80px]">
                  <Suspense fallback={<Skeleton className="h-[80px] w-full" />}>
                    {/* 这里放置FCP图表组件 */}
                    <div className="h-full bg-slate-100 rounded-md flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">FCP趋势图</span>
                    </div>
                  </Suspense>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">累积布局偏移</CardTitle>
                <CardDescription>CLS 性能指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.05</div>
                <p className="text-xs text-green-500">良好</p>
                <div className="mt-4 h-[80px]">
                  <Suspense fallback={<Skeleton className="h-[80px] w-full" />}>
                    {/* 这里放置CLS图表组件 */}
                    <div className="h-full bg-slate-100 rounded-md flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">CLS趋势图</span>
                    </div>
                  </Suspense>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">首次输入延迟</CardTitle>
                <CardDescription>FID 性能指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28ms</div>
                <p className="text-xs text-green-500">良好</p>
                <div className="mt-4 h-[80px]">
                  <Suspense fallback={<Skeleton className="h-[80px] w-full" />}>
                    {/* 这里放置FID图表组件 */}
                    <div className="h-full bg-slate-100 rounded-md flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">FID趋势图</span>
                    </div>
                  </Suspense>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>页面性能详情</CardTitle>
                <CardDescription>按页面查看性能指标</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  {/* 这里放置页面性能详情表格 */}
                  <div className="h-[300px] bg-slate-100 rounded-md flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">页面性能详情表格</span>
                  </div>
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">今日错误总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">较昨日 -3</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">API错误</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">较昨日 -1</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">前端错误</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">较昨日 -2</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">错误率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.08%</div>
                <p className="text-xs text-green-500">良好</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>错误日志</CardTitle>
                <CardDescription>最近的系统错误</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  {/* 这里放置错误日志表格 */}
                  <div className="h-[400px] bg-slate-100 rounded-md flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">错误日志表格</span>
                  </div>
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">当前在线用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">较昨日同时段 +5</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">今日活跃用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">较昨日 +12</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">平均会话时长</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18分钟</div>
                <p className="text-xs text-muted-foreground">较上周 +2分钟</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">跳出率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24%</div>
                <p className="text-xs text-muted-foreground">较上周 -2%</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>用户活动</CardTitle>
                <CardDescription>实时用户活动流</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  {/* 这里放置用户活动流组件 */}
                  <div className="h-[300px] bg-slate-100 rounded-md flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">用户活动流</span>
                  </div>
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>热门页面</CardTitle>
                <CardDescription>访问量最高的页面</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  {/* 这里放置热门页面组件 */}
                  <div className="h-[300px] bg-slate-100 rounded-md flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">热门页面统计</span>
                  </div>
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CPU使用率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32%</div>
                <p className="text-xs text-green-500">正常</p>
                <div className="mt-2 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "32%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">内存使用率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-yellow-500">中等</p>
                <div className="mt-2 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: "68%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">磁盘使用率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45%</div>
                <p className="text-xs text-green-500">正常</p>
                <div className="mt-2 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">网络带宽</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4 MB/s</div>
                <p className="text-xs text-green-500">正常</p>
                <div className="mt-2 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>资源使用趋势</CardTitle>
                <CardDescription>过去24小时的资源使用情况</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  {/* 这里放置资源使用趋势图表 */}
                  <div className="h-[400px] bg-slate-100 rounded-md flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">资源使用趋势图表</span>
                  </div>
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
