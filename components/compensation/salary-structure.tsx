"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Edit, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SalaryStructure() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 600
    const height = 400
    const margin = { top: 40, right: 30, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据 - 薪酬等级和范围
    const data = [
      { grade: "P1", min: 10000, mid: 12500, max: 15000 },
      { grade: "P2", min: 15000, mid: 18750, max: 22500 },
      { grade: "P3", min: 22500, mid: 28125, max: 33750 },
      { grade: "P4", min: 33750, mid: 42188, max: 50625 },
      { grade: "P5", min: 50625, mid: 63281, max: 75938 },
      { grade: "P6", min: 75938, mid: 94922, max: 113906 },
    ]

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.grade))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3.scaleLinear().domain([0, 120000]).range([innerHeight, 0])

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
          .tickFormat((d) => `¥${d / 1000}k`)
          .ticks(5),
      )
      .attr("font-size", "12px")

    // 添加X轴标签
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("薪酬等级")

    // 添加Y轴标签
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("月薪范围 (元)")

    // 绘制薪酬范围条形图
    g.selectAll(".range-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "range-bar")
      .attr("x", (d) => x(d.grade))
      .attr("y", (d) => y(d.max))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(d.min) - y(d.max))
      .attr("fill", "#e5e7eb")

    // 绘制中位线
    g.selectAll(".mid-line")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "mid-line")
      .attr("x1", (d) => x(d.grade))
      .attr("x2", (d) => x(d.grade) + x.bandwidth())
      .attr("y1", (d) => y(d.mid))
      .attr("y2", (d) => y(d.mid))
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 2)

    // 添加最大值标签
    g.selectAll(".max-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "max-label")
      .attr("x", (d) => x(d.grade) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.max) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text((d) => `¥${d.max / 1000}k`)

    // 添加最小值标签
    g.selectAll(".min-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "min-label")
      .attr("x", (d) => x(d.grade) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.min) + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text((d) => `¥${d.min / 1000}k`)

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
                <CardTitle>薪酬等级与范围</CardTitle>
                <CardDescription>各职级薪酬范围与中位线</CardDescription>
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
                  <SelectItem value="finance">财务部</SelectItem>
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
            <CardTitle>薪酬结构概览</CardTitle>
            <CardDescription>当前薪酬结构统计数据</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>薪酬等级数量</span>
                  <span className="font-medium">6个</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>薪酬范围重叠度</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>最高/最低薪酬比</span>
                  <span className="font-medium">11.4:1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>等级间薪酬增幅</span>
                  <span className="font-medium">约50%</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">薪酬结构健康度</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">基于市场竞争力和内部公平性评估</p>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <Edit className="h-4 w-4" />
                  <span>编辑薪酬结构</span>
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
              <CardTitle>薪酬组成详情</CardTitle>
              <CardDescription>各职级薪酬组成与比例</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span>添加组成项</span>
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
                  <TableHead>薪酬等级</TableHead>
                  <TableHead>基本工资</TableHead>
                  <TableHead>绩效奖金</TableHead>
                  <TableHead>长期激励</TableHead>
                  <TableHead>福利</TableHead>
                  <TableHead>总薪酬范围</TableHead>
                  <TableHead>适用岗位</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">P1</TableCell>
                  <TableCell>70%</TableCell>
                  <TableCell>20%</TableCell>
                  <TableCell>0%</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell>¥10k-15k</TableCell>
                  <TableCell>
                    <Badge variant="outline">初级专员</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">P2</TableCell>
                  <TableCell>65%</TableCell>
                  <TableCell>25%</TableCell>
                  <TableCell>0%</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell>¥15k-22.5k</TableCell>
                  <TableCell>
                    <Badge variant="outline">专员</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">P3</TableCell>
                  <TableCell>60%</TableCell>
                  <TableCell>25%</TableCell>
                  <TableCell>5%</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell>¥22.5k-33.8k</TableCell>
                  <TableCell>
                    <Badge variant="outline">高级专员</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">P4</TableCell>
                  <TableCell>55%</TableCell>
                  <TableCell>25%</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell>¥33.8k-50.6k</TableCell>
                  <TableCell>
                    <Badge variant="outline">经理</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">P5</TableCell>
                  <TableCell>50%</TableCell>
                  <TableCell>25%</TableCell>
                  <TableCell>15%</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell>¥50.6k-75.9k</TableCell>
                  <TableCell>
                    <Badge variant="outline">高级经理</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">P6</TableCell>
                  <TableCell>45%</TableCell>
                  <TableCell>25%</TableCell>
                  <TableCell>20%</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell>¥75.9k-113.9k</TableCell>
                  <TableCell>
                    <Badge variant="outline">总监</Badge>
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
