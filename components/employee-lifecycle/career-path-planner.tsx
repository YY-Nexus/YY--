"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Download } from "lucide-react"

export function CareerPathPlanner() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 800
    const height = 400
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据
    const nodes = [
      { id: "junior", label: "初级工程师", level: 1, x: 100, y: 200, current: false },
      { id: "mid", label: "中级工程师", level: 2, x: 250, y: 200, current: true },
      { id: "senior", label: "高级工程师", level: 3, x: 400, y: 200, current: false },
      { id: "lead", label: "技术负责人", level: 4, x: 550, y: 200, current: false },
      { id: "architect", label: "架构师", level: 5, x: 700, y: 150, current: false },
      { id: "manager", label: "技术经理", level: 5, x: 700, y: 250, current: false },
    ]

    const links = [
      { source: "junior", target: "mid" },
      { source: "mid", target: "senior" },
      { source: "senior", target: "lead" },
      { source: "lead", target: "architect" },
      { source: "lead", target: "manager" },
    ]

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // 添加连接线
    g.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", (d) => {
        const source = nodes.find((n) => n.id === d.source)
        const target = nodes.find((n) => n.id === d.target)
        return `M${source.x},${source.y} L${target.x},${target.y}`
      })
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => {
        const source = nodes.find((n) => n.id === d.source)
        const target = nodes.find((n) => n.id === d.target)
        return source.current || target.current ? "none" : "5,5"
      })

    // 添加节点
    const nodeGroups = g
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)

    // 添加节点圆圈
    nodeGroups
      .append("circle")
      .attr("r", 30)
      .attr("fill", (d) => (d.current ? "#4f46e5" : "white"))
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 2)

    // 添加节点文本
    nodeGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("font-size", "12px")
      .attr("fill", (d) => (d.current ? "white" : "#333"))
      .text((d) => d.label)

    // 设置SVG尺寸
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>职业发展路径</CardTitle>
                <CardDescription>员工职业成长与晋升路径规划</CardDescription>
              </div>
              <Select defaultValue="engineer">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择职业路径" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineer">技术路径</SelectItem>
                  <SelectItem value="management">管理路径</SelectItem>
                  <SelectItem value="product">产品路径</SelectItem>
                  <SelectItem value="design">设计路径</SelectItem>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>当前职位与发展目标</CardTitle>
            <CardDescription>员工当前职位与下一步发展目标</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/avatars/avatar-1.png" alt="张明" />
                    <AvatarFallback>张明</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">张明</h3>
                    <p className="text-sm text-muted-foreground">前端工程师 · 研发部</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        中级工程师
                      </Badge>
                      <Badge variant="outline">2年工龄</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">当前技能评估</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between text-sm">
                      <span>JavaScript</span>
                      <span className="font-medium">4.5/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>React</span>
                      <span className="font-medium">4.2/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CSS/SCSS</span>
                      <span className="font-medium">4.0/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Node.js</span>
                      <span className="font-medium">3.5/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>系统设计</span>
                      <span className="font-medium">3.2/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>团队协作</span>
                      <span className="font-medium">4.3/5</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">发展目标</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      当前
                    </Badge>
                    <span className="text-sm">中级工程师</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      目标
                    </Badge>
                    <span className="text-sm">高级工程师</span>
                  </div>
                  <p className="text-sm text-muted-foreground">预计达成时间: 2024年12月</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">需要提升的能力</h4>
                  <ul className="space-y-1">
                    <li className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>系统设计能力 (3.2 → 4.0)</span>
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Node.js后端开发 (3.5 → 4.2)</span>
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>技术方案评审能力</span>
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>初级工程师指导能力</span>
                    </li>
                  </ul>
                </div>

                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  <span>导出发展计划</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>发展里程碑</CardTitle>
            <CardDescription>职业发展关键节点与时间线</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-muted">
              <div className="relative">
                <div className="absolute left-[-25px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background"></div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">初级工程师</span>
                    <Badge variant="outline" className="text-xs">
                      已完成
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">2021年6月 - 2022年7月</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-[-25px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-primary"></div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">中级工程师</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
                      当前
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">2022年8月 - 至今</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-[-25px] top-1 h-4 w-4 rounded-full border-2 border-muted bg-background"></div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">高级工程师</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                      目标
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">预计 2024年12月</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-[-25px] top-1 h-4 w-4 rounded-full border-2 border-muted bg-background"></div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">技术负责人</span>
                  </div>
                  <p className="text-xs text-muted-foreground">预计 2026年</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
