"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Edit, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BudgetManagement() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 600
    const height = 300
    const margin = { top: 40, right: 30, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据 - 预算使用情况
    const data = [
      { month: "1月", budget: 1200000, actual: 1150000 },
      { month: "2月", budget: 1200000, actual: 1180000 },
      { month: "3月", budget: 1200000, actual: 1220000 },
      { month: "4月", budget: 1250000, actual: 1240000 },
      { month: "5月", budget: 1250000, actual: 1260000 },
      { month: "6月", budget: 1250000, actual: 1270000 },
      { month: "7月", budget: 1300000, actual: 1290000 },
      { month: "8月", budget: 1300000, actual: 1320000 },
      { month: "9月", budget: 1300000, actual: 1310000 },
      { month: "10月", budget: 1350000, actual: 1330000 },
      { month: "11月", budget: 1350000, actual: 0 },
      { month: "12月", budget: 1350000, actual: 0 },
    ]

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3.scaleLinear().domain([0, 1500000]).range([innerHeight, 0])

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // 添加网格线
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(""))
      .selectAll("line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.5)

    // 添加X轴
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("font-size", "12px")

    // 添加Y轴
    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .tickFormat((d) => `¥${d / 10000}万`)
          .ticks(5),
      )
      .attr("font-size", "12px")

    // 添加X轴标签
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("月份")

    // 添加Y轴标签
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("薪酬预算 (元)")

    // 绘制预算柱状图
    g.selectAll(".budget-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "budget-bar")
      .attr("x", (d) => x(d.month))
      .attr("y", (d) => y(d.budget))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.budget))
      .attr("fill", "#e5e7eb")

    // 绘制实际支出柱状图
    g.selectAll(".actual-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "actual-bar")
      .attr("x", (d) => x(d.month))
      .attr("y", (d) => y(d.actual))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.actual))
      .attr("fill", (d) => (d.actual > d.budget ? "#ef4444" : "#4f46e5"))

    // 添加图例
    const legend = svg.append("g").attr("transform", `translate(${width - 120}, 20)`)

    // 预算图例
    legend.append("rect").attr("width", 15).attr("height", 15).attr("fill", "#e5e7eb")

    legend.append("text").attr("x", 20).attr("y", 12).text("预算").attr("font-size", "12px")

    // 实际支出图例
    legend.append("rect").attr("width", 15).attr("height", 15).attr("y", 25).attr("fill", "#4f46e5")

    legend.append("text").attr("x", 20).attr("y", 37).text("实际支出").attr("font-size", "12px")

    // 设置SVG尺寸
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>薪酬预算执行情况</CardTitle>
                <CardDescription>月度薪酬预算与实际支出对比</CardDescription>
              </div>
              <Select defaultValue="2023">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="选择年份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024年</SelectItem>
                  <SelectItem value="2023">2023年</SelectItem>
                  <SelectItem value="2022">2022年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-auto">
              <svg ref={svgRef}></svg>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>预算概览</CardTitle>
            <CardDescription>2023年薪酬预算使用情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>年度总预算</span>
                  <span className="font-medium">¥1,530万</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>已使用预算</span>
                  <span className="font-medium">¥1,157万</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>剩余预算</span>
                  <span className="font-medium">¥373万</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>预算使用率</span>
                  <span className="font-medium">75.6%</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">预算使用进度</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Progress value={75.6} className="h-2" />
                    <span className="text-sm font-medium">75.6%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">预计年度结余: ¥50万 (3.3%)</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <Edit className="h-4 w-4" />
                  <span>调整预算</span>
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
              <CardTitle>部门预算���配</CardTitle>
              <CardDescription>各部门薪酬预算分配与使用情况</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span>新增部门</span>
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
                  <TableHead>部门</TableHead>
                  <TableHead>年度预算</TableHead>
                  <TableHead>已使用</TableHead>
                  <TableHead>剩余预算</TableHead>
                  <TableHead>使用率</TableHead>
                  <TableHead>预算状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">研发部</TableCell>
                  <TableCell>¥650万</TableCell>
                  <TableCell>¥495万</TableCell>
                  <TableCell>¥155万</TableCell>
                  <TableCell>76.2%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      正常
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">销售部</TableCell>
                  <TableCell>¥380万</TableCell>
                  <TableCell>¥310万</TableCell>
                  <TableCell>¥70万</TableCell>
                  <TableCell>81.6%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      注意
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">市场部</TableCell>
                  <TableCell>¥220万</TableCell>
                  <TableCell>¥160万</TableCell>
                  <TableCell>¥60万</TableCell>
                  <TableCell>72.7%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      正常
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">产品部</TableCell>
                  <TableCell>¥180万</TableCell>
                  <TableCell>¥125万</TableCell>
                  <TableCell>¥55万</TableCell>
                  <TableCell>69.4%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      正常
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">人力资源部</TableCell>
                  <TableCell>¥60万</TableCell>
                  <TableCell>¥42万</TableCell>
                  <TableCell>¥18万</TableCell>
                  <TableCell>70.0%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      正常
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">财务部</TableCell>
                  <TableCell>¥40万</TableCell>
                  <TableCell>¥25万</TableCell>
                  <TableCell>¥15万</TableCell>
                  <TableCell>62.5%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      正常
                    </Badge>
                  </TableCell>
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
