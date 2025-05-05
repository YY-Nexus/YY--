"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Filter } from "lucide-react"

export function PerformanceTracker() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 600
    const height = 300
    const margin = { top: 30, right: 50, bottom: 40, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据
    const data = [
      { quarter: "2022 Q1", score: 3.6 },
      { quarter: "2022 Q2", score: 3.8 },
      { quarter: "2022 Q3", score: 4.0 },
      { quarter: "2022 Q4", score: 4.1 },
      { quarter: "2023 Q1", score: 4.3 },
      { quarter: "2023 Q2", score: 4.2 },
      { quarter: "2023 Q3", score: 4.5 },
      { quarter: "2023 Q4", score: 4.6 },
    ]

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.quarter))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3.scaleLinear().domain([3, 5]).range([innerHeight, 0])

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
      .attr("font-size", "10px")

    // 添加Y轴
    g.append("g").call(d3.axisLeft(y)).attr("font-size", "10px")

    // 绘制柱状图
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.quarter))
      .attr("y", (d) => y(d.score))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.score))
      .attr("fill", (d, i) => (i < 4 ? "#94a3b8" : "#4f46e5"))

    // 添加数值标签
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.quarter) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.score) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .text((d) => d.score)

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
                <CardTitle>绩效历史追踪</CardTitle>
                <CardDescription>员工历史绩效评估结果</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="2023">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="选择年份" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023年</SelectItem>
                    <SelectItem value="2022">2022年</SelectItem>
                    <SelectItem value="2021">2021年</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-auto">
              <svg ref={svgRef}></svg>
              <div className="text-center text-xs text-muted-foreground mt-2">绩效评分趋势 (5分制)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>最近绩效评估</CardTitle>
            <CardDescription>2023年第四季度绩效评估结果</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/avatars/avatar-1.png" alt="张明" />
                    <AvatarFallback>张明</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">张明</h3>
                    <p className="text-sm text-muted-foreground">前端工程师 · 研发部</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        优秀
                      </Badge>
                      <Badge variant="outline">4.6/5.0</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">工作质量</div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                      </div>
                      <span className="text-sm font-medium">4.5</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">工作效率</div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "96%" }}></div>
                      </div>
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">团队协作</div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                      <span className="text-sm font-medium">4.7</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">创新能力</div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                      </div>
                      <span className="text-sm font-medium">4.0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">评估反馈</h4>
                <div className="text-sm text-muted-foreground">
                  张明在本季度表现优秀，特别是在项目交付质量和团队协作方面。他成功完成了电商平台改版项目的前端开发工作，代码质量高，按时交付。在团队中积极分享知识，帮助新成员快速融入。建议在系统设计能力方面继续提升，为未来晋升高级工程师做准备。
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">发展建议</h4>
                <ul className="space-y-1">
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>参与更多系统架构设计工作，提升整体设计能力</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>加强Node.js后端开发技能，向全栈工程师方向发展</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>尝试带领小型项目团队，培养技术领导力</span>
                  </li>
                </ul>
              </div>

              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>导出完整评估报告</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>绩效对比</CardTitle>
            <CardDescription>与团队和部门的绩效对比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>个人评分</span>
                  <span className="font-medium">4.6</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>团队平均</span>
                  <span className="font-medium">4.2</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "84%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>部门平均</span>
                  <span className="font-medium">4.0</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>公司平均</span>
                  <span className="font-medium">3.8</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "76%" }}></div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">绩效排名</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    前10%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">在部门内排名第3位，全公司排名前10%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
