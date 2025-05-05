"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export function StaffingChart() {
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
      { month: "1月", current: 156, predicted: 158 },
      { month: "2月", current: 156, predicted: 160 },
      { month: "3月", current: 156, predicted: 162 },
      { month: "4月", current: 156, predicted: 165 },
      { month: "5月", current: 156, predicted: 167 },
      { month: "6月", current: 156, predicted: 169 },
      { month: "7月", current: 156, predicted: 171 },
      { month: "8月", current: 156, predicted: 172 },
      { month: "9月", current: 156, predicted: 174 },
      { month: "10月", current: 156, predicted: 175 },
      { month: "11月", current: 156, predicted: 177 },
      { month: "12月", current: 156, predicted: 178 },
    ]

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3.scaleLinear().domain([150, 185]).range([innerHeight, 0])

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

    // 绘制当前编制线
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.month) + x.bandwidth() / 2)
          .y((d) => y(d.current)),
      )

    // 绘制预测编制线
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
          .y((d) => y(d.predicted)),
      )

    // 添加点
    g.selectAll(".dot-predicted")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-predicted")
      .attr("cx", (d) => x(d.month) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.predicted))
      .attr("r", 4)
      .attr("fill", "#4f46e5")

    // 添加图例
    const legend = svg.append("g").attr("transform", `translate(${width - 150}, 10)`)

    const legendData = [
      { label: "当前编制", color: "#94a3b8", dash: "5,5" },
      { label: "预测需求", color: "#4f46e5", dash: "0" },
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
        .attr("stroke-dasharray", d.dash)

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
    <div className="w-full">
      <svg ref={svgRef}></svg>
      <div className="text-center text-xs text-muted-foreground mt-2">未来12个月编制需求预测</div>
    </div>
  )
}
