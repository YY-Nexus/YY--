"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export function EfficiencyComparison() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 400
    const height = 300
    const margin = { top: 30, right: 30, bottom: 70, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const data = [
      { category: "决策效率", company: 82, industry: 75, benchmark: 90 },
      { category: "沟通效率", company: 76, industry: 72, benchmark: 85 },
      { category: "执行效率", company: 88, industry: 80, benchmark: 92 },
      { category: "创新能力", company: 65, industry: 68, benchmark: 88 },
      { category: "资源利用", company: 79, industry: 74, benchmark: 85 },
    ]

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0])

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // 添加X轴
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .attr("font-size", "10px")

    // 添加Y轴
    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => d + "%"),
      )
      .attr("font-size", "10px")

    // 添加标题
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("效能对标分析")

    // 添加图例
    const legend = svg.append("g").attr("transform", `translate(${width - 120}, 10)`)

    const legendData = [
      { label: "本公司", color: "#4f46e5" },
      { label: "行业平均", color: "#94a3b8" },
      { label: "标杆企业", color: "#f59e0b" },
    ]

    legendData.forEach((d, i) => {
      const lg = legend.append("g").attr("transform", `translate(0, ${i * 20})`)

      lg.append("rect").attr("width", 12).attr("height", 12).attr("fill", d.color)

      lg.append("text").attr("x", 20).attr("y", 10).attr("font-size", "10px").text(d.label)
    })

    // 绘制柱状图 - 本公司
    g.selectAll(".bar-company")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar-company")
      .attr("x", (d) => x(d.category))
      .attr("y", (d) => y(d.company))
      .attr("width", x.bandwidth() / 3)
      .attr("height", (d) => innerHeight - y(d.company))
      .attr("fill", "#4f46e5")

    // 绘制柱状图 - 行业平均
    g.selectAll(".bar-industry")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar-industry")
      .attr("x", (d) => x(d.category) + x.bandwidth() / 3)
      .attr("y", (d) => y(d.industry))
      .attr("width", x.bandwidth() / 3)
      .attr("height", (d) => innerHeight - y(d.industry))
      .attr("fill", "#94a3b8")

    // 绘制柱状图 - 标杆企业
    g.selectAll(".bar-benchmark")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar-benchmark")
      .attr("x", (d) => x(d.category) + (2 * x.bandwidth()) / 3)
      .attr("y", (d) => y(d.benchmark))
      .attr("width", x.bandwidth() / 3)
      .attr("height", (d) => innerHeight - y(d.benchmark))
      .attr("fill", "#f59e0b")

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
      <div className="text-center text-xs text-muted-foreground mt-2">数据来源：行业协会2023年第四季度报告</div>
    </div>
  )
}
