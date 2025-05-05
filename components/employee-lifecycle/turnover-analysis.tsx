"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TurnoverAnalysis() {
  const svgRef = useRef(null)
  const pieRef = useRef(null)

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
      { month: "1月", value: 3.2 },
      { month: "2月", value: 3.5 },
      { month: "3月", value: 3.8 },
      { month: "4月", value: 4.1 },
      { month: "5月", value: 3.9 },
      { month: "6月", value: 3.6 },
      { month: "7月", value: 3.4 },
      { month: "8月", value: 3.2 },
      { month: "9月", value: 2.9 },
      { month: "10月", value: 2.7 },
      { month: "11月", value: 2.5 },
      { month: "12月", value: 2.3 },
    ]

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3.scaleLinear().domain([0, 5]).range([innerHeight, 0])

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
    g.append("g")
      .call(d3.axisLeft(y).tickFormat((d) => d + "%"))
      .attr("font-size", "10px")

    // 绘制线条
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.month) + x.bandwidth() / 2)
          .y((d) => y(d.value)),
      )

    // 添加点
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.month) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", "#4f46e5")

    // 添加数值标签
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.month) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .text((d) => d.value + "%")

    // 设置SVG尺寸
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
  }, [])

  useEffect(() => {
    if (!pieRef.current) return

    const svg = d3.select(pieRef.current)
    svg.selectAll("*").remove()

    const width = 300
    const height = 300
    const margin = 40
    const radius = Math.min(width, height) / 2 - margin

    // 模拟数据
    const data = [
      { reason: "职业发展", value: 35 },
      { reason: "薪酬福利", value: 25 },
      { reason: "工作环境", value: 15 },
      { reason: "管理问题", value: 12 },
      { reason: "工作内容", value: 8 },
      { reason: "其他原因", value: 5 },
    ]

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.reason))
      .range(["#4f46e5", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#94a3b8"])

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value)

    const arc = d3.arc().innerRadius(0).outerRadius(radius)

    const labelArc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6)

    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`)

    const arcs = g.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc")

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.reason))
      .attr("stroke", "white")
      .style("stroke-width", "2px")

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .text((d) => (d.data.value >= 10 ? d.data.value + "%" : ""))

    // 添加图例
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height - 20})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")

    legend.append("text").attr("font-weight", "bold").text("主要离职原因")

    // 设置SVG尺寸
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">年度离职率</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">7.3%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  -1.2%
                </Badge>
                较去年
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">自愿离职率</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">5.8%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  -0.9%
                </Badge>
                较去年
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">90天内离职率</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">2.1%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  -0.5%
                </Badge>
                较去年
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">关键人才流失率</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">3.2%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  -1.5%
                </Badge>
                较去年
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>月度离职率趋势</CardTitle>
                <CardDescription>过去12个月的离职率变化趋势</CardDescription>
              </div>
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
            <CardTitle>离职原因分布</CardTitle>
            <CardDescription>员工离职的主要原因分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <svg ref={pieRef}></svg>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>部门离职率对比</CardTitle>
            <CardDescription>各部门离职率与公司平均水平对比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>研发部</span>
                  <span className="font-medium">6.2%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "62%" }}></div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    -1.1%
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>市场部</span>
                  <span className="font-medium">8.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    +1.2%
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>销售部</span>
                  <span className="font-medium">9.8%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "98%" }}></div>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    +2.5%
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>人力资源部</span>
                  <span className="font-medium">5.1%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "51%" }}></div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    -2.2%
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>财务部</span>
                  <span className="font-medium">4.3%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "43%" }}></div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    -3.0%
                  </Badge>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm font-medium">
                  <span>公司平均</span>
                  <span>7.3%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "73%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>离职人员分析</CardTitle>
            <CardDescription>离职员工的特征与趋势分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">按工龄分布</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>0-1年</span>
                      <span>35%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>1-3年</span>
                      <span>42%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>3-5年</span>
                      <span>15%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>5年以上</span>
                      <span>8%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "8%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">按绩效分布</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>优秀</span>
                      <span>12%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "12%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>良好</span>
                      <span>25%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>达标</span>
                      <span>38%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "38%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>待改进</span>
                      <span>25%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">关键发现</h4>
                <ul className="space-y-1">
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>1-3年工龄员工是离职的主要群体，占比42%</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>销售部离职率最高，达9.8%，高于公司平均水平</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>绩效良好和达标的员工占离职人员的63%，需关注人才保留</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>职业发展和薪酬福利是主要离职原因，占比60%</span>
                  </li>
                </ul>
              </div>

              <Button variant="outline" size="sm" className="w-full gap-1">
                <Download className="h-4 w-4" />
                <span>导出详细分析报告</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
