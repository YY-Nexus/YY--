"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PerformanceAnalytics() {
  const distributionRef = useRef(null)
  const trendRef = useRef(null)

  useEffect(() => {
    if (!distributionRef.current) return

    const svg = d3.select(distributionRef.current)
    svg.selectAll("*").remove()

    const width = 600
    const height = 300
    const margin = { top: 40, right: 30, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据 - 绩效分布
    const data = [
      { rating: "A", count: 16, percentage: 10.3 },
      { rating: "B+", count: 42, percentage: 26.9 },
      { rating: "B", count: 68, percentage: 43.6 },
      { rating: "C", count: 30, percentage: 19.2 },
    ]

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.rating))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3.scaleLinear().domain([0, 50]).range([innerHeight, 0])

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
          .tickFormat((d) => d + "%")
          .ticks(5),
      )
      .attr("font-size", "12px")

    // 添加X轴标签
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("绩效评级")

    // 添加Y轴标签
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("人员占比")

    // 绘制柱状图
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.rating))
      .attr("y", (d) => y(d.percentage))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.percentage))
      .attr("fill", (d) => {
        if (d.rating === "A") return "#10b981"
        if (d.rating === "B+") return "#3b82f6"
        if (d.rating === "B") return "#6366f1"
        return "#f59e0b"
      })

    // 添加数值标签
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.rating) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.percentage) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text((d) => d.percentage + "%")

    // 设置SVG尺寸
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
  }, [])

  useEffect(() => {
    if (!trendRef.current) return

    const svg = d3.select(trendRef.current)
    svg.selectAll("*").remove()

    const width = 600
    const height = 300
    const margin = { top: 40, right: 120, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据 - 绩效趋势
    const data = [
      { quarter: "2022 Q1", a: 9.5, bPlus: 25.0, b: 45.5, c: 20.0 },
      { quarter: "2022 Q2", a: 10.0, bPlus: 26.0, b: 44.0, c: 20.0 },
      { quarter: "2022 Q3", a: 9.0, bPlus: 27.0, b: 44.0, c: 20.0 },
      { quarter: "2022 Q4", a: 10.0, bPlus: 25.0, b: 45.0, c: 20.0 },
      { quarter: "2023 Q1", a: 9.8, bPlus: 26.5, b: 44.7, c: 19.0 },
      { quarter: "2023 Q2", a: 10.0, bPlus: 26.0, b: 44.0, c: 20.0 },
      { quarter: "2023 Q3", a: 10.2, bPlus: 26.5, b: 43.8, c: 19.5 },
      { quarter: "2023 Q4", a: 10.3, bPlus: 26.9, b: 43.6, c: 19.2 },
    ]

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.quarter))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3.scaleLinear().domain([0, 50]).range([innerHeight, 0])

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
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")

    // 添加Y轴
    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .tickFormat((d) => d + "%")
          .ticks(5),
      )
      .attr("font-size", "12px")

    // 添加X轴标签
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 50)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("季度")

    // 添加Y轴标签
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("人员占比")

    // 绘制A评级线
    const lineA = d3
      .line()
      .x((d) => x(d.quarter) + x.bandwidth() / 2)
      .y((d) => y(d.a))
      .curve(d3.curveMonotoneX)

    g.append("path").datum(data) / 2
    )
      .y((d) => y(d.a))
      .curve(d3.curveMonotoneX)

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#10b981")
      .attr(\"stroke-width", 2)
      .attr("d", lineA)

    // 绘制B+评级线
    const lineBPlus = d3
      .line()
      .x((d) => x(d.quarter) + x.bandwidth() / 2)
      .y((d) => y(d.bPlus))
      .curve(d3.curveMonotoneX)

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", lineBPlus)

    // 绘制B评级线
    const lineB = d3
      .line()
      .x((d) => x(d.quarter) + x.bandwidth() / 2)
      .y((d) => y(d.b))
      .curve(d3.curveMonotoneX)

    g.append("path").datum(data).attr("fill", "none").attr("stroke", "#6366f1").attr("stroke-width", 2).attr("d", lineB)

    // 绘制C评级线
    const lineC = d3
      .line()
      .x((d) => x(d.quarter) + x.bandwidth() / 2)
      .y((d) => y(d.c))
      .curve(d3.curveMonotoneX)

    g.append("path").datum(data).attr("fill", "none").attr("stroke", "#f59e0b").attr("stroke-width", 2).attr("d", lineC)

    // 添加图例
    const legend = svg.append("g").attr("transform", `translate(${width - 100}, 20)`)

    const legendData = [
      { label: "A", color: "#10b981" },
      { label: "B+", color: "#3b82f6" },
      { label: "B", color: "#6366f1" },
      { label: "C", color: "#f59e0b" },
    ]

    legendData.forEach((d, i) => {
      const lg = legend.append("g").attr("transform", `translate(0, ${i * 20})`)

      lg.append("line")
        .attr("x1", 0)
        .attr("y1", 10)
        .attr("x2", 20)
        .attr("y2", 10)
        .attr("stroke", d.color)
        .attr("stroke-width", 2)

      lg.append("text")
        .attr("x", 25)
        .attr("y", 10)
        .attr("dominant-baseline", "middle")
        .attr("font-size", "12px")
        .text(d.label)
    })

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
              <p className="text-sm font-medium">平均绩效分</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">3.28</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  +0.05
                </Badge>
                较上期
              </div>
            </div>
            <Progress value={82} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">A评级比例</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">10.3%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  +0.1%
                </Badge>
                较上期
              </div>
            </div>
            <Progress value={10.3} className="h-2 mt-2 bg-muted">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "10.3%" }} />
            </Progress>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">B+评级比例</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">26.9%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  +0.4%
                </Badge>
                较上期
              </div>
            </div>
            <Progress value={26.9} className="h-2 mt-2 bg-muted">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "26.9%" }} />
            </Progress>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">绩效达标率</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">80.8%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  +0.5%
                </Badge>
                较上期
              </div>
            </div>
            <Progress value={80.8} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>绩效分布</CardTitle>
                <CardDescription>2023年Q4绩效评级分布</CardDescription>
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-auto">
              <svg ref={distributionRef}></svg>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>绩效趋势</CardTitle>
                <CardDescription>各评级占比历史趋势</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>导出</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-auto">
              <svg ref={trendRef}></svg>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>部门绩效对比</CardTitle>
              <CardDescription>各部门绩效评级分布对比</CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">研发部</h3>
                <span className="text-sm text-muted-foreground">平均分: 3.35</span>
              </div>
              <div className="flex h-4 items-center space-x-1 text-xs">
                <div className="bg-green-500 h-full rounded-l-full text-center" style={{ width: "12%" }}>
                  12%
                </div>
                <div className="bg-blue-500 h-full text-center" style={{ width: "28%" }}>
                  28%
                </div>
                <div className="bg-indigo-500 h-full text-center text-white" style={{ width: "45%" }}>
                  45%
                </div>
                <div className="bg-amber-500 h-full rounded-r-full text-center" style={{ width: "15%" }}>
                  15%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">销售部</h3>
                <span className="text-sm text-muted-foreground">平均分: 3.22</span>
              </div>
              <div className="flex h-4 items-center space-x-1 text-xs">
                <div className="bg-green-500 h-full rounded-l-full text-center" style={{ width: "10%" }}>
                  10%
                </div>
                <div className="bg-blue-500 h-full text-center" style={{ width: "25%" }}>
                  25%
                </div>
                <div className="bg-indigo-500 h-full text-center text-white" style={{ width: "42%" }}>
                  42%
                </div>
                <div className="bg-amber-500 h-full rounded-r-full text-center" style={{ width: "23%" }}>
                  23%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">市场部</h3>
                <span className="text-sm text-muted-foreground">平均分: 3.25</span>
              </div>
              <div className="flex h-4 items-center space-x-1 text-xs">
                <div className="bg-green-500 h-full rounded-l-full text-center" style={{ width: "8%" }}>
                  8%
                </div>
                <div className="bg-blue-500 h-full text-center" style={{ width: "30%" }}>
                  30%
                </div>
                <div className="bg-indigo-500 h-full text-center text-white" style={{ width: "41%" }}>
                  41%
                </div>
                <div className="bg-amber-500 h-full rounded-r-full text-center" style={{ width: "21%" }}>
                  21%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">产品部</h3>
                <span className="text-sm text-muted-foreground">平均分: 3.30</span>
              </div>
              <div className="flex h-4 items-center space-x-1 text-xs">
                <div className="bg-green-500 h-full rounded-l-full text-center" style={{ width: "11%" }}>
                  11%
                </div>
                <div className="bg-blue-500 h-full text-center" style={{ width: "27%" }}>
                  27%
                </div>
                <div className="bg-indigo-500 h-full text-center text-white" style={{ width: "43%" }}>
                  43%
                </div>
                <div className="bg-amber-500 h-full rounded-r-full text-center" style={{ width: "19%" }}>
                  19%
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">全公司</h3>
                <span className="text-sm text-muted-foreground">平均分: 3.28</span>
              </div>
              <div className="flex h-4 items-center space-x-1 text-xs mt-2">
                <div className="bg-green-500 h-full rounded-l-full text-center" style={{ width: "10.3%" }}>
                  10.3%
                </div>
                <div className="bg-blue-500 h-full text-center" style={{ width: "26.9%" }}>
                  26.9%
                </div>
                <div className="bg-indigo-500 h-full text-center text-white" style={{ width: "43.6%" }}>
                  43.6%
                </div>
                <div className="bg-amber-500 h-full rounded-r-full text-center" style={{ width: "19.2%" }}>
                  19.2%
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                <span>A</span>
                <span>B+</span>
                <span>B</span>
                <span>C</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
