"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Calculator, Download, Search, Filter } from "lucide-react"

export function SalaryAdjustment() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>调薪规划模拟器</CardTitle>
                <CardDescription>调整各因素权重，生成调薪方案</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>导出方案</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">调薪总预算</Label>
                    <div className="flex gap-2">
                      <Input id="budget" type="number" defaultValue="500" />
                      <span className="flex items-center text-sm">万元</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="average-rate">平均调薪幅度</Label>
                    <div className="flex gap-2">
                      <Input id="average-rate" type="number" defaultValue="8" />
                      <span className="flex items-center text-sm">%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>绩效评级权重</Label>
                    <div className="flex items-center gap-2">
                      <Slider defaultValue={[50]} max={100} step={5} className="flex-1" />
                      <div className="w-12 text-center font-medium">50%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>市场竞争力权重</Label>
                    <div className="flex items-center gap-2">
                      <Slider defaultValue={[30]} max={100} step={5} className="flex-1" />
                      <div className="w-12 text-center font-medium">30%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>内部公平性权重</Label>
                    <div className="flex items-center gap-2">
                      <Slider defaultValue={[20]} max={100} step={5} className="flex-1" />
                      <div className="w-12 text-center font-medium">20%</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>绩效评级调薪系数</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-between border rounded-md p-2">
                        <span className="text-sm">卓越 (A)</span>
                        <span className="font-medium">1.5x</span>
                      </div>
                      <div className="flex justify-between border rounded-md p-2">
                        <span className="text-sm">优秀 (B+)</span>
                        <span className="font-medium">1.2x</span>
                      </div>
                      <div className="flex justify-between border rounded-md p-2">
                        <span className="text-sm">良好 (B)</span>
                        <span className="font-medium">1.0x</span>
                      </div>
                      <div className="flex justify-between border rounded-md p-2">
                        <span className="text-sm">待改进 (C)</span>
                        <span className="font-medium">0.5x</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>市场竞争力调薪系数</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-between border rounded-md p-2">
                        <span className="text-sm">低于P25</span>
                        <span className="font-medium">1.3x</span>
                      </div>
                      <div className="flex justify-between border rounded-md p-2">
                        <span className="text-sm">P25-P50</span>
                        <span className="font-medium">1.1x</span>
                      </div>
                      <div className="flex justify-between border rounded-md p-2">
                        <span className="text-sm">P50-P75</span>
                        <span className="font-medium">0.9x</span>
                      </div>
                      <div className="flex justify-between border rounded-md p-2">
                        <span className="text-sm">高于P75</span>
                        <span className="font-medium">0.7x</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full gap-1 mt-4">
                    <Calculator className="h-4 w-4" />
                    <span>生成调薪方案</span>
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">调薪分布预览</h3>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    已生成
                  </Badge>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div className="space-y-1">
                    <div className="text-center text-sm font-medium">0-5%</div>
                    <div className="h-24 bg-muted rounded-md relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: "30%" }}></div>
                    </div>
                    <div className="text-center text-sm">30%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-center text-sm font-medium">5-8%</div>
                    <div className="h-24 bg-muted rounded-md relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: "25%" }}></div>
                    </div>
                    <div className="text-center text-sm">25%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-center text-sm font-medium">8-12%</div>
                    <div className="h-24 bg-muted rounded-md relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: "20%" }}></div>
                    </div>
                    <div className="text-center text-sm">20%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-center text-sm font-medium">12-15%</div>
                    <div className="h-24 bg-muted rounded-md relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: "15%" }}></div>
                    </div>
                    <div className="text-center text-sm">15%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-center text-sm font-medium">15%+</div>
                    <div className="h-24 bg-muted rounded-md relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: "10%" }}></div>
                    </div>
                    <div className="text-center text-sm">10%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>调薪方案概览</CardTitle>
            <CardDescription>2024年调薪计划统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>调薪总人数</span>
                  <span className="font-medium">156人</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>调薪总金额</span>
                  <span className="font-medium">¥498.5万</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>平均调薪幅度</span>
                  <span className="font-medium">8.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>最高调薪幅度</span>
                  <span className="font-medium">18.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>最低调薪幅度</span>
                  <span className="font-medium">3.0%</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">各部门平均调薪幅度</div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>研发部</span>
                      <span className="font-medium">9.5%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>销售部</span>
                      <span className="font-medium">8.0%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>市场部</span>
                      <span className="font-medium">7.5%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>其他部门</span>
                      <span className="font-medium">6.8%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
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
              <CardTitle>员工调薪明细</CardTitle>
              <CardDescription>个人调薪建议与详情</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="搜索员工..." className="pl-8 w-[200px]" />
              </div>
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
                  <TableHead>绩效评级</TableHead>
                  <TableHead>市场竞争力</TableHead>
                  <TableHead>当前薪资</TableHead>
                  <TableHead>调薪建议</TableHead>
                  <TableHead>调薪后薪资</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">张明</TableCell>
                  <TableCell>研发部</TableCell>
                  <TableCell>高级工程师</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      A
                    </Badge>
                  </TableCell>
                  <TableCell>P45</TableCell>
                  <TableCell>¥28,000</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      +15.0%
                    </Badge>
                  </TableCell>
                  <TableCell>¥32,200</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">李娜</TableCell>
                  <TableCell>市场部</TableCell>
                  <TableCell>市场经理</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      B+
                    </Badge>
                  </TableCell>
                  <TableCell>P60</TableCell>
                  <TableCell>¥25,000</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      +8.0%
                    </Badge>
                  </TableCell>
                  <TableCell>¥27,000</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">王强</TableCell>
                  <TableCell>销售部</TableCell>
                  <TableCell>销售代表</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      B
                    </Badge>
                  </TableCell>
                  <TableCell>P55</TableCell>
                  <TableCell>¥18,000</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      +6.0%
                    </Badge>
                  </TableCell>
                  <TableCell>¥19,080</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">赵芳</TableCell>
                  <TableCell>研发部</TableCell>
                  <TableCell>产品经理</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      C
                    </Badge>
                  </TableCell>
                  <TableCell>P65</TableCell>
                  <TableCell>¥22,000</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      +3.0%
                    </Badge>
                  </TableCell>
                  <TableCell>¥22,660</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      详情
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
                  <TableCell>P30</TableCell>
                  <TableCell>¥35,000</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      +18.5%
                    </Badge>
                  </TableCell>
                  <TableCell>¥41,475</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      详情
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
