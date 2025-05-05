"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Filter, Plus, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PerformanceGoals() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">目标设定完成率</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">92.3%</div>
              <div className="text-xs text-muted-foreground">144/156人</div>
            </div>
            <Progress value={92.3} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">目标审批完成率</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">85.9%</div>
              <div className="text-xs text-muted-foreground">134/156人</div>
            </div>
            <Progress value={85.9} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">目标平均数量</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">5.2</div>
              <div className="text-xs text-muted-foreground">个/人</div>
            </div>
            <Progress value={52} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">目标更新频率</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">2.4</div>
              <div className="text-xs text-muted-foreground">次/季度</div>
            </div>
            <Progress value={60} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>目标模板库</CardTitle>
              <CardDescription>预设的绩效目标模板</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                <span>新建模板</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>导出</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>模板名称</TableHead>
                  <TableHead>适用部门</TableHead>
                  <TableHead>适用职级</TableHead>
                  <TableHead>目标类型</TableHead>
                  <TableHead>目标数量</TableHead>
                  <TableHead>使用次数</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">研发工程师OKR模板</TableCell>
                  <TableCell>研发部</TableCell>
                  <TableCell>P1-P4</TableCell>
                  <TableCell>
                    <Badge variant="outline">OKR</Badge>
                  </TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>48</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      使用
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">销售业绩目标模板</TableCell>
                  <TableCell>销售部</TableCell>
                  <TableCell>P1-P5</TableCell>
                  <TableCell>
                    <Badge variant="outline">KPI</Badge>
                  </TableCell>
                  <TableCell>6</TableCell>
                  <TableCell>32</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      使用
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">产品经理目标模板</TableCell>
                  <TableCell>产品部</TableCell>
                  <TableCell>P2-P5</TableCell>
                  <TableCell>
                    <Badge variant="outline">OKR</Badge>
                  </TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>24</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      使用
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">管理者领导力模板</TableCell>
                  <TableCell>全部</TableCell>
                  <TableCell>P4-P6</TableCell>
                  <TableCell>
                    <Badge variant="outline">MBO</Badge>
                  </TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>18</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      使用
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">市场营销目标模板</TableCell>
                  <TableCell>市场部</TableCell>
                  <TableCell>P1-P5</TableCell>
                  <TableCell>
                    <Badge variant="outline">KPI</Badge>
                  </TableCell>
                  <TableCell>6</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      使用
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>员工目标管理</CardTitle>
              <CardDescription>员工绩效目标设定与跟踪</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="搜索员工..." className="pl-8 w-[200px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  <SelectItem value="rd">研发部</SelectItem>
                  <SelectItem value="sales">销售部</SelectItem>
                  <SelectItem value="marketing">市场部</SelectItem>
                  <SelectItem value="product">产品部</SelectItem>
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
                  <TableHead>员工姓名</TableHead>
                  <TableHead>部门</TableHead>
                  <TableHead>职位</TableHead>
                  <TableHead>目标数量</TableHead>
                  <TableHead>目标状态</TableHead>
                  <TableHead>完成进度</TableHead>
                  <TableHead>最近更新</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">张明</TableCell>
                  <TableCell>研发部</TableCell>
                  <TableCell>高级工程师</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      已审批
                    </Badge>
                  </TableCell>
                  ell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="h-2 w-[60px]" />
                      <span className="text-sm">75%</span>
                    </div>
                  </TableCell>
                  <TableCell>2023-12-15</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">李娜</TableCell>
                  <TableCell>市场部</TableCell>
                  <TableCell>市场经理</TableCell>
                  <TableCell>6</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      已审批
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="h-2 w-[60px]" />
                      <span className="text-sm">60%</span>
                    </div>
                  </TableCell>
                  <TableCell>2023-12-12</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">王强</TableCell>
                  <TableCell>销售部</TableCell>
                  <TableCell>销售代表</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      待审批
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={0} className="h-2 w-[60px]" />
                      <span className="text-sm">0%</span>
                    </div>
                  </TableCell>
                  <TableCell>2023-12-18</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">赵芳</TableCell>
                  <TableCell>研发部</TableCell>
                  <TableCell>产品经理</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      未设定
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={0} className="h-2 w-[60px]" />
                      <span className="text-sm">0%</span>
                    </div>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      设定
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">刘伟</TableCell>
                  <TableCell>研发部</TableCell>
                  <TableCell>技术专家</TableCell>
                  <TableCell>6</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      已审批
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="h-2 w-[60px]" />
                      <span className="text-sm">85%</span>
                    </div>
                  </TableCell>
                  <TableCell>2023-12-16</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      查看
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
