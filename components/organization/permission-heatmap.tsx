"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export function PermissionHeatmap() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 400
    const height = 300
    const margin = { top: 30, right: 30, bottom: 70, left: 100 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据
    const departments = ["财务部", "IT部", "人力资源", "销售部", "采购部"]
    const systems = ["财务系统", "ERP系统", "HR系统", "CRM系统", "采购系统"]

    const data = []
    departments.forEach((dept, i) => {
      systems.forEach((sys, j) => {
        // 生成随机冲突数量，财务部和IT部在某些系统上有更高的冲突概率
        let value = Math.floor(Math.random() * 10)
        if ((dept === "财务部" && sys === "财务系统") || (dept === "IT部" && (sys === "ERP系统" || sys === "HR系统"))) {
          value += Math.floor(Math.random() * 15)
        }

        data.push({
          department: dept,
          system: sys,
          value: value,
        })
      })
    })

    // 创建X和Y比例尺
    const x = d3.scaleBand().domain(systems).range([0, innerWidth]).padding(0.05)

    const y = d3.scaleBand().domain(departments).range([0, innerHeight]).padding(0.05)

    // 创建颜色比例尺
    const color = d3.scaleSequential().interpolator(d3.interpolateReds).domain([0, 25])

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // 添加热力图单元格
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.system))
      .attr("y", (d) => y(d.department))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(d.value))
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)

    // 添加文本
    g.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.system) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.department) + y.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "10px")
      .attr("fill", (d) => (d.value > 12 ? "white" : "black"))
      .text((d) => d.value)

    // 添加X轴
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .attr("font-size", "10px")

    // 添加Y轴
    g.append("g").call(d3.axisLeft(y)).attr("font-size", "10px")

    // 添加标题
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("权限冲突热力图")

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
      <div className="text-center text-xs text-muted-foreground mt-2">颜色越深表示权限冲突风险越高</div>
    </div>
  )
}
