"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PermissionTrends() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 400
    const height = 250
    const margin = { top: 30, right: 30, bottom: 40, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据
    const data = [
      { date: "2023-07", high: 8, medium: 12, low: 5 },
      { date: "2023-08", high: 10, medium: 14, low: 6 },
      { date: "2023-09", high: 7, medium: 11, low: 8 },
      { date: "2023-10", high: 5, medium: 9, low: 7 },
      { date: "2023-11", high: 6, medium: 10, low: 5 },
      { date: "2023-12", high: 4, medium: 8, low: 4 },
    ]

    const parseDate = d3.timeParse("%Y-%m")

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => parseDate(d.date)))
      .range([0, innerWidth])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.high, d.medium, d.low)) + 5])
      .range([innerHeight, 0])

    const lineHigh = d3
      .line()
      .x((d) => x(parseDate(d.date)))
      .y((d) => y(d.high))
      .curve(d3.curveMonotoneX)

    const lineMedium = d3
      .line()
      .x((d) => x(parseDate(d.date)))
      .y((d) => y(d.medium))
      .curve(d3.curveMonotoneX)

    const lineLow = d3
      .line()
      .x((d) => x(parseDate(d.date)))
      .y((d) => y(d.low))
      .curve(d3.curveMonotoneX)

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
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m")))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .attr("font-size", "10px")

    // 添加Y轴
    g.append("g").call(d3.axisLeft(y)).attr("font-size", "10px")

    // 添加高风险线
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("d", lineHigh)

    // 添加中风险线
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f59e0b")
      .attr("stroke-width", 2)
      .attr("d", lineMedium)

    // 添加低风险线
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#10b981")
      .attr("stroke-width", 2)
      .attr("d", lineLow)

    // 添加图例
    const legend = svg.append("g").attr("transform", `translate(${width - 120}, 10)`)

    const legendData = [
      { label: "高风险", color: "#ef4444" },
      { label: "中风险", color: "#f59e0b" },
      { label: "低风险", color: "#10b981" },
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
        .attr("font-size", "10px")
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
      <div className="flex justify-between items-center">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择部门" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部部门</SelectItem>
            <SelectItem value="finance">财务部</SelectItem>
            <SelectItem value="it">IT部</SelectItem>
            <SelectItem value="hr">人力资源部</SelectItem>
            <SelectItem value="sales">销售部</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <svg ref={svgRef}></svg>
      </div>

      <div className="text-center text-xs text-muted-foreground">近6个月权限冲突风险趋势</div>

      <div className="flex justify-between text-sm">
        <div>
          <span className="text-muted-foreground">高风险变化: </span>
          <span className="font-medium text-green-500">-50%</span>
        </div>
        <div>
          <span className="text-muted-foreground">中风险变化: </span>
          <span className="font-medium text-green-500">-33%</span>
        </div>
        <div>
          <span className="text-muted-foreground">低风险变化: </span>
          <span className="font-medium text-green-500">-20%</span>
        </div>
      </div>
    </div>
  )
}
