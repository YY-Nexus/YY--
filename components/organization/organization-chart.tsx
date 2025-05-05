"use client"

import { useEffect, useRef } from "react"
import { organizationData } from "@/data/organization-data"
import * as d3 from "d3"

export function OrganizationChart() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 800
    const height = 500
    const margin = { top: 20, right: 120, bottom: 20, left: 120 }

    // 创建层级布局
    const root = d3.hierarchy(organizationData)

    const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right])

    treeLayout(root)

    // 创建连接线
    const linkGenerator = d3
      .linkHorizontal()
      .x((d) => d.y)
      .y((d) => d.x)

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // 添加连接线
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", linkGenerator)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5)

    // 添加节点
    const nodes = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`)

    // 添加节点圆圈
    nodes
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => (d.depth === 0 ? "#ff7d00" : d.depth === 1 ? "#36a2eb" : "#4bc0c0"))

    // 添加节点文本
    nodes
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.children ? -8 : 8))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name)
      .attr("font-size", "12px")
      .attr("fill", "#333")

    // 添加职位信息
    nodes
      .append("text")
      .attr("dy", "1.31em")
      .attr("x", (d) => (d.children ? -8 : 8))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.title || "")
      .attr("font-size", "10px")
      .attr("fill", "#666")

    // 设置SVG尺寸
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
  }, [])

  return (
    <div className="w-full overflow-auto">
      <svg ref={svgRef} className="org-chart"></svg>
      <div className="text-center text-sm text-muted-foreground mt-4">提示：可使用鼠标滚轮缩放，拖拽移动视图</div>
    </div>
  )
}
