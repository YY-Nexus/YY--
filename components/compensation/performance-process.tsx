"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Filter, Calendar, Clock, ArrowRight, Edit } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PerformanceProcess() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>绩效周期进度</CardTitle>
                <CardDescription>2023年Q4绩效评估流程进度</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                <span>编辑流程</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-muted">
                <div className="relative">
                  <div className="absolute left-[-25px] top-1 h-5 w-5 rounded-full border-2 border-primary bg-primary"></div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">目标设定</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          已完成
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>2023-10-01 至 2023-10-15</span>
                      </div>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-sm text-muted-foreground">员工设定季度绩效目标，经理审批确认</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[-25px] top-1 h-5 w-5 rounded-full border-2 border-primary bg-primary"></div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">中期检视</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          已完成
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>2023-11-15 至 2023-11-20</span>
                      </div>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-sm text-muted-foreground">经理与员工进行中期目标进度检视与调整</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[-25px] top-1 h-5 w-5 rounded-full border-2 border-primary bg-primary"></div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">自评</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          进行中
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>2023-12-15 至 2023-12-25</span>
                      </div>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-sm text-muted-foreground">员工对自己的目标完成情况进行自评</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[-25px] top-1 h-5 w-5 rounded-full border-2 border-muted bg-background"></div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">经理评估</span>
                        <Badge variant="outline">未开始</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>2023-12-26 至 2024-01-05</span>
                      </div>
                    </div>
                    <Progress value={0} className="h-2" />
                    <p className="text-sm text-muted-foreground">直接经理对员工绩效进行评估</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[-25px] top-1 h-5 w-5 rounded-full border-2 border-muted bg-background"></div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">校准会</span>
                        <Badge variant="outline">未开始</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>2024-01-06 至 2024-01-10</span>
                      </div>
                    </div>
                    <Progress value={0} className="h-2" />
                    <p className="text-sm text-muted-foreground">管理层进行绩效校准，确保评估公平一致</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[-25px] top-1 h-5 w-5 rounded-full border-2 border-muted bg-background"></div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">结果沟通</span>
                        <Badge variant="outline">未开始</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>2024-01-11 至 2024-01-20</span>
                      </div>
                    </div>
                    <Progress value={0} className="h-2" />
                    <p className="text-sm text-muted-foreground">经理与员工沟通绩效结果与发展计划</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>流程统计</CardTitle>
            <CardDescription>当前绩效周期进度统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>自评完成率</span>
                  <span className="font-medium">75.6%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "75.6%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground">118/156人已完成</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>经理评估完成率</span>
                  <span className="font-medium">0%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground">0/25人已完成</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>校准会完成率</span>
                  <span className="font-medium">0%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground">0/5个部门已完成</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>结果沟通完成率</span>
                  <span className="font-medium">0%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground">0/156人已完成</p>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">整体进度</div>
                <div className="flex items-center gap-2">
                  <Progress value={45} className="h-2" />
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>距离周期结束还有26天</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>待办任务</CardTitle>
              <CardDescription>需要您处理的绩效评估任务</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="搜索任务..." className="pl-8 w-[200px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="任务类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部任务</SelectItem>
                  <SelectItem value="self">自评</SelectItem>
                  <SelectItem value="manager">经理评估</SelectItem>
                  <SelectItem value="calibration">校准会</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>任务类型</TableHead>
                  <TableHead>任务描述</TableHead>
                  <TableHead>关联员工</TableHead>
                  <TableHead>截止日期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Badge variant="outline">自评</Badge>
                  </TableCell>
                  <TableCell className="font-medium">完成2023年Q4绩效自评</TableCell>
                  <TableCell>自己</TableCell>
                  <TableCell>2023-12-25</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      进行中
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      高
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <span>继续</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Badge variant="outline">目标审批</Badge>
                  </TableCell>
                  <TableCell className="font-medium">审批王强的绩效目标</TableCell>
                  <TableCell>王强</TableCell>
                  <TableCell>2023-12-20</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      待处理
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      中
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <span>审批</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Badge variant="outline">目标设定</Badge>
                  </TableCell>
                  <TableCell className="font-medium">协助赵芳设定绩效目标</TableCell>
                  <TableCell>赵芳</TableCell>
                  <TableCell>2023-12-22</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      待处理
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      中
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <span>设定</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Badge variant="outline">校准会</Badge>
                  </TableCell>
                  <TableCell className="font-medium">参加研发部绩效校准会</TableCell>
                  <TableCell>研发部</TableCell>
                  <TableCell>2024-01-08</TableCell>
                  <TableCell>
                    <Badge variant="outline">未开始</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      高
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled>
                      未开始
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
