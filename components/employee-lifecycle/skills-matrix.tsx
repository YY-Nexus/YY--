"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SkillsMatrix() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 600
    const height = 400
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据
    const skills = [
      { name: "JavaScript", proficiency: 4.5, importance: 5.0 },
      { name: "React", proficiency: 4.2, importance: 4.8 },
      { name: "CSS/SCSS", proficiency: 4.0, importance: 4.5 },
      { name: "Node.js", proficiency: 3.5, importance: 4.2 },
      { name: "系统设计", proficiency: 3.2, importance: 4.5 },
      { name: "团队协作", proficiency: 4.3, importance: 4.0 },
      { name: "问题解决", proficiency: 4.1, importance: 4.3 },
      { name: "代码审查", proficiency: 3.8, importance: 3.9 },
      { name: "测试", proficiency: 3.4, importance: 3.7 },
      { name: "文档编写", proficiency: 3.6, importance: 3.5 },
    ]

    const x = d3.scaleLinear().domain([0, 5]).range([0, innerWidth])

    const y = d3.scaleLinear().domain([0, 5]).range([innerHeight, 0])

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // 添加网格线
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(-innerHeight).tickFormat(""))
      .selectAll("line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.5)

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(""))
      .selectAll("line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.5)

    // 添加X轴
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("font-size", "10px")

    // 添加Y轴
    g.append("g").call(d3.axisLeft(y).ticks(5)).attr("font-size", "10px")

    // 添加X轴标签
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("技能熟练度")

    // 添加Y轴标签
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("技能重要性")

    // 添加象限线
    g.append("line")
      .attr("x1", x(2.5))
      .attr("y1", 0)
      .attr("x2", x(2.5))
      .attr("y2", innerHeight)
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "5,5")

    g.append("line")
      .attr("x1", 0)
      .attr("y1", y(2.5))
      .attr("x2", innerWidth)
      .attr("y2", y(2.5))
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "5,5")

    // 添加象限标签
    g.append("text")
      .attr("x", x(1.25))
      .attr("y", y(3.75))
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text("需要培训")

    g.append("text")
      .attr("x", x(3.75))
      .attr("y", y(3.75))
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text("核心优势")

    g.append("text")
      .attr("x", x(1.25))
      .attr("y", y(1.25))
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text("低优先级")

    g.append("text")
      .attr("x", x(3.75))
      .attr("y", y(1.25))
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text("过度投入")

    // 添加散点
    g.selectAll(".dot")
      .data(skills)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.proficiency))
      .attr("cy", (d) => y(d.importance))
      .attr("r", 6)
      .attr("fill", (d) => {
        if (d.proficiency >= 2.5 && d.importance >= 2.5) {
          return "#4f46e5" // 核心优势
        } else if (d.proficiency < 2.5 && d.importance >= 2.5) {
          return "#ef4444" // 需要培训
        } else if (d.proficiency >= 2.5 && d.importance < 2.5) {
          return "#f59e0b" // 过度投入
        } else {
          return "#94a3b8" // 低优先级
        }
      })

    // 添加标签
    g.selectAll(".label")
      .data(skills)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.proficiency))
      .attr("y", (d) => y(d.importance) - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text((d) => d.name)

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
                <CardTitle>能力素质矩阵</CardTitle>
                <CardDescription>员工技能熟练度与重要性分析</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="frontend">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择岗位" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">前端工程师</SelectItem>
                    <SelectItem value="backend">后端工程师</SelectItem>
                    <SelectItem value="fullstack">全栈工程师</SelectItem>
                    <SelectItem value="design">UI设计师</SelectItem>
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
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>技能差距分析</CardTitle>
            <CardDescription>员工技能与岗位要求的差距分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">需要重点提升的技能</h4>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    优先级高
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>系统设计</span>
                      <span className="font-medium">3.2/5 → 4.5/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "64%" }}></div>
                      </div>
                      <span className="text-xs font-medium">差距: 1.3</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Node.js</span>
                      <span className="font-medium">3.5/5 → 4.2/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                      </div>
                      <span className="text-xs font-medium">差距: 0.7</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">需要保持的核心优势</h4>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    持续发展
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>JavaScript</span>
                      <span className="font-medium">4.5/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>React</span>
                      <span className="font-medium">4.2/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "84%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>技能发展建议</CardTitle>
            <CardDescription>基于技能差距的发展建议</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">系统设计能力提升</h4>
                <ul className="space-y-1">
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>参加公司内部的系统设计培训课程</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>阅读《系统设计面试》和《设计数据密集型应用》</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>参与至少2个复杂功能模块的架构设计</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Node.js技能提升</h4>
                <ul className="space-y-1">
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>完成Node.js高级课程学习</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>参与后端API开发项目，提升实战经验</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>学习Express和NestJS框架</span>
                  </li>
                </ul>
              </div>

              <Button variant="outline" size="sm" className="w-full gap-1">
                <Download className="h-4 w-4" />
                <span>导出完整发展建议</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
