"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Edit, Calendar, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export function PerformanceCalibration() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>绩效校准会议</CardTitle>
                <CardDescription>部门绩效校准会议安排</CardDescription>
              </div>
              <Button className="gap-1">
                <Edit className="h-4 w-4" />
                <span>编辑会议</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>部门</TableHead>
                    <TableHead>会议时间</TableHead>
                    <TableHead>参与人员</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>校准进度</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">研发部</TableCell>
                    <TableCell>2024-01-08 14:00-16:00</TableCell>
                    <TableCell>张总监, 李经理, 王经理</TableCell>
                    <TableCell>
                      <Badge variant="outline">未开始</Badge>
                    </TableCell>
                    <TableCell>0/48人</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>
                        未开始
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">销售部</TableCell>
                    <TableCell>2024-01-07 10:00-12:00</TableCell>
                    <TableCell>赵总监, 钱经理, 孙经理</TableCell>
                    <TableCell>
                      <Badge variant="outline">未开始</Badge>
                    </TableCell>
                    <TableCell>0/32人</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>
                        未开始
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">市场部</TableCell>
                    <TableCell>2024-01-09 10:00-12:00</TableCell>
                    <TableCell>周总监, 吴经理</TableCell>
                    <TableCell>
                      <Badge variant="outline">未开始</Badge>
                    </TableCell>
                    <TableCell>0/24人</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>
                        未开始
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">产品部</TableCell>
                    <TableCell>2024-01-10 14:00-16:00</TableCell>
                    <TableCell>郑总监, 冯经理</TableCell>
                    <TableCell>
                      <Badge variant="outline">未开始</Badge>
                    </TableCell>
                    <TableCell>0/18人</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>
                        未开始
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">管理层校准</TableCell>
                    <TableCell>2024-01-12 10:00-12:00</TableCell>
                    <TableCell>CEO, CTO, COO, 各部门总监</TableCell>
                    <TableCell>
                      <Badge variant="outline">未开始</Badge>
                    </TableCell>
                    <TableCell>0/25人</TableCell>
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>校准指南</CardTitle>
            <CardDescription>绩效校准会议指导原则</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">绩效分布目标</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>A (卓越)</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>B+ (优秀)</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>B (良好)</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>C (待改进)</span>
                    <span className="font-medium">20%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <h3 className="text-sm font-medium">校准原则</h3>
                <ul className="space-y-1">
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>基于客观事实和数据进行评估</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>避免近期效应和光环效应</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>考虑工作难度和挑战性</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>关注结果与行为的结合</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>确保跨部门评价标准一致</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <Download className="h-4 w-4" />
                  <span>下载完整指南</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>校准工具</CardTitle>
              <CardDescription>绩效校准分析与调整工具</CardDescription>
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
                  <TableHead>自评</TableHead>
                  <TableHead>经理评估</TableHead>
                  <TableHead>校准建议</TableHead>
                  <TableHead>最终评级</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">张明</TableCell>
                  <TableCell>研发部</TableCell>
                  <TableCell>高级工程师</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      B+
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      A
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      A
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">待定</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled>
                      未开始
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">李娜</TableCell>
                  <TableCell>市场部</TableCell>
                  <TableCell>市场经理</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      A
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      B+
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      B+
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">待定</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled>
                      未开始
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">王强</TableCell>
                  <TableCell>销售部</TableCell>
                  <TableCell>销售代表</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      B+
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                      B
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                      B
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">待定</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled>
                      未开始
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">赵芳</TableCell>
                  <TableCell>研发部</TableCell>
                  <TableCell>产品经理</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                      B
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      C
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      C
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">待定</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled>
                      未开始
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">刘伟</TableCell>
                  <TableCell>研发部</TableCell>
                  <TableCell>技术专家</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      A
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      A
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      A
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">待定</Badge>
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>校准分析</CardTitle>
          <CardDescription>绩效评级分布与校准前后对比</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="distribution">
            <TabsList className="mb-4">
              <TabsTrigger value="distribution">评级分布</TabsTrigger>
              <TabsTrigger value="comparison">校准对比</TabsTrigger>
              <TabsTrigger value="department">部门分析</TabsTrigger>
            </TabsList>
            <TabsContent value="distribution" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">当前评级分布</h3>
                    <Badge variant="outline">经理评估</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">A (卓越)</span>
                        </div>
                        <span className="text-sm font-medium">15% (22人)</span>
                      </div>
                      <Progress value={15} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">B+ (优秀)</span>
                        </div>
                        <span className="text-sm font-medium">30% (44人)</span>
                      </div>
                      <Progress value={30} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span className="text-sm">B (良好)</span>
                        </div>
                        <span className="text-sm font-medium">40% (59人)</span>
                      </div>
                      <Progress value={40} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">C (待改进)</span>
                        </div>
                        <span className="text-sm font-medium">15% (22人)</span>
                      </div>
                      <Progress value={15} className="h-2 bg-gray-100" />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">目标评级分布</h3>
                    <Badge variant="outline">公司标准</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">A (卓越)</span>
                        </div>
                        <span className="text-sm font-medium">10% (15人)</span>
                      </div>
                      <Progress value={10} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">B+ (优秀)</span>
                        </div>
                        <span className="text-sm font-medium">25% (37人)</span>
                      </div>
                      <Progress value={25} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span className="text-sm">B (良好)</span>
                        </div>
                        <span className="text-sm font-medium">45% (66人)</span>
                      </div>
                      <Progress value={45} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">C (待改进)</span>
                        </div>
                        <span className="text-sm font-medium">20% (29人)</span>
                      </div>
                      <Progress value={20} className="h-2 bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">校准建议</h3>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">需要调整</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <p>• A级评级需要减少7人，从22人调整至15人</p>
                  <p>• B+级评级需要减少7人，从44人调整至37人</p>
                  <p>• B级评级需要增加7人，从59人调整至66人</p>
                  <p>• C级评级需要增加7人，从22人调整至29人</p>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">注意：</span> 请在校准会议中讨论并确定最终调整方案
                  </div>
                  <Button>开始校准</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">自评分布</h3>
                    <Badge variant="outline">员工自评</Badge>
                  </div>
                  <div className="h-[200px] flex items-end justify-between gap-2">
                    {[18, 35, 38, 9].map((value, index) => (
                      <div key={index} className="relative h-full flex flex-col justify-end items-center gap-2">
                        <div
                          className={`w-12 ${
                            index === 0
                              ? "bg-green-500"
                              : index === 1
                              ? "bg-blue-500"
                              : index === 2
                              ? "bg-indigo-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ height: `${(value * 100) / 45}%` }}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          {["A", "B+", "B", "C"][index]}
                        </span>
                        <span className="absolute top-0 -translate-y-6 text-xs font-medium">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">经理评估</h3>
                    <Badge variant="outline">初始评级</Badge>
                  </div>
                  <div className="h-[200px] flex items-end justify-between gap-2">
                    {[15, 30, 40, 15].map((value, index) => (
                      <div key={index} className="relative h-full flex flex-col justify-end items-center gap-2">
                        <div
                          className={`w-12 ${
                            index === 0
                              ? "bg-green-500"
                              : index === 1
                              ? "bg-blue-500"
                              : index === 2
                              ? "bg-indigo-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ height: `${(value * 100) / 45}%` }}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          {["A", "B+", "B", "C"][index]}
                        </span>
                        <span className="absolute top-0 -translate-y-6 text-xs font-medium">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">目标分布</h3>
                    <Badge variant="outline">公司标准</Badge>
                  </div>
                  <div className="h-[200px] flex items-end justify-between gap-2">
                    {[10, 25, 45, 20].map((value, index) => (
                      <div key={index} className="relative h-full flex flex-col justify-end items-center gap-2">
                        <div
                          className={`w-12 ${
                            index === 0
                              ? "bg-green-500"
                              : index === 1
                              ? "bg-blue-500"
                              : index === 2
                              ? "bg-indigo-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ height: `${(value * 100) / 45}%` }}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          {["A", "B+", "B", "C"][index]}
                        </span>
                        <span className="absolute top-0 -translate-y-6 text-xs font-medium">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">评级偏差分析</h3>
                  <Badge variant="outline">自评 vs 经理评估</Badge>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">自评高于经理评估</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">A → B+</span>
                          <span className="text-sm font-medium">12人</span>
                        </div>
                        <Progress value={12} max={30} className="h-2 bg-gray-100" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm">B+ → B</span>
                          <span className="text-sm font-medium">18人</span>
                        </div>
                        <Progress value={18} max={30} className="h-2 bg-gray-100" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm">B → C</span>
                          <span className="text-sm font-medium">8人</span>
                        </div>
                        <Progress value={8} max={30} className="h-2 bg-gray-100" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">经理评估高于自评</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">B+ → A</span>
                          <span className="text-sm font-medium">5人</span>
                        </div>
                        <Progress value={5} max={20} className="h-2 bg-gray-100" />
                        <div className="flex justify-between items-center">
                  />
                        <div className="flex justify-between items-center">
                          <span className="text-sm">B → B+</span>
                          <span className="text-sm font-medium">10人</span>
                        </div>
                        <Progress value={10} max={20} className="h-2 bg-gray-100" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm">C → B</span>
                          <span className="text-sm font-medium">3人</span>
                        </div>
                        <Progress value={3} max={20} className="h-2 bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="department" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">研发部评级分布</h3>
                    <Badge variant="outline">48人</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">A (卓越)</span>
                        </div>
                        <span className="text-sm font-medium">18% (9人)</span>
                      </div>
                      <Progress value={18} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">B+ (优秀)</span>
                        </div>
                        <span className="text-sm font-medium">33% (16人)</span>
                      </div>
                      <Progress value={33} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span className="text-sm">B (良好)</span>
                        </div>
                        <span className="text-sm font-medium">35% (17人)</span>
                      </div>
                      <Progress value={35} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">C (待改进)</span>
                        </div>
                        <span className="text-sm font-medium">14% (6人)</span>
                      </div>
                      <Progress value={14} className="h-2 bg-gray-100" />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">销售部评级分布</h3>
                    <Badge variant="outline">32人</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">A (卓越)</span>
                        </div>
                        <span className="text-sm font-medium">12% (4人)</span>
                      </div>
                      <Progress value={12} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">B+ (优秀)</span>
                        </div>
                        <span className="text-sm font-medium">28% (9人)</span>
                      </div>
                      <Progress value={28} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span className="text-sm">B (良好)</span>
                        </div>
                        <span className="text-sm font-medium">44% (14人)</span>
                      </div>
                      <Progress value={44} className="h-2 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">C (待改进)</span>
                        </div>
                        <span className="text-sm font-medium">16% (5人)</span>
                      </div>
                      <Progress value={16} className="h-2 bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">部门校准建议</h3>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">需要调整</Badge>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">研发部调整建议</h4>
                      <div className="space-y-2 text-sm">
                        <p>• A级评级需要减少4人，从9人调整至5人</p>
                        <p>• B+级评级需要减少4人，从16人调整至12人</p>
                        <p>• B级评级需要增加5人，从17人调整至22人</p>
                        <p>• C级评级需要增加3人，从6人调整至9人</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">销售部调整建议</h4>
                      <div className="space-y-2 text-sm">
                        <p>• A级评级需要减少1人，从4人调整至3人</p>
                        <p>• B+级评级需要减少1人，从9人调整至8人</p>
                        <p>• B级评级需要增加0人，从14人调整至14人</p>
                        <p>• C级评级需要增加2人，从5人调整至7人</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>即将到来的会议</CardTitle>
            <CardDescription>未来7天的绩效校准会议</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">销售部绩效校准会议</h3>
                  <p className="text-sm text-muted-foreground">2024-01-07 10:00-12:00</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">未开始</Badge>
                    <span className="text-sm text-muted-foreground">参与人员: 3人</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">研发部绩效校准会议</h3>
                  <p className="text-sm text-muted-foreground">2024-01-08 14:00-16:00</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">未开始</Badge>
                    <span className="text-sm text-muted-foreground">参与人员: 3人</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">市场部绩效校准会议</h3>
                  <p className="text-sm text-muted-foreground">2024-01-09 10:00-12:00</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">未开始</Badge>
                    <span className="text-sm text-muted-foreground">参与人员: 2人</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>校准进度</CardTitle>
            <CardDescription>各部门绩效校准完成情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">研发部</span>
                  </div>
                  <span className="text-sm">0/48人</span>
                </div>
                <Progress value={0} className="h-2 bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">销售部</span>
                  </div>
                  <span className="text-sm">0/32人</span>
                </div>
                <Progress value={0} className="h-2 bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">市场部</span>
                  </div>
                  <span className="text-sm">0/24人</span>
                </div>
                <Progress value={0} className="h-2 bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">产品部</span>
                  </div>
                  <span className="text-sm">0/18人</span>
                </div>
                <Progress value={0} className="h-2 bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">管理层</span>
                  </div>
                  <span className="text-sm">0/25人</span>
                </div>
                <Progress value={0} className="h-2 bg-gray-100" />
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">总体进度</span>
                  <span className="text-sm">0/147人 (0%)</span>
                </div>
                <Progress value={0} className="h-2 mt-2 bg-gray-100" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
