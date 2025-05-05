"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EfficiencyTrends() {
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

    const data = [
      { date: "2023-01", value: 68 },
      { date: "2023-02", value: 70 },
      { date: "2023-03", value: 72 },
      { date: "2023-04", value: 75 },
      { date: "2023-05", value: 73 },
      { date: "2023-06", value: 76 },
      { date: "2023-07", value: 78 },
      { date: "2023-08", value: 77 },
      { date: "2023-09", value: 80 },
      { date: "2023-10", value: 82 },
      { date: "2023-11", value: 81 },
      { date: "2023-12", value: 84 },
    ]

    const parseDate = d3.timeParse("%Y-%m")

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => parseDate(d.date)))
      .range([0, innerWidth])

    const y = d3.scaleLinear().domain([60, 100]).range([innerHeight, 0])

    const line = d3
      .line()
      .x((d) => x(parseDate(d.date)))
      .y((d) => y(d.value))
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
    g.append("g")
      .call(d3.axisLeft(y).tickFormat((d) => d + "%"))
      .attr("font-size", "10px")

    // 添加路径
    g.append("path").datum(data).attr("fill", "none").attr("stroke", "#4f46e5").attr("stroke-width", 2).attr("d", line)

    // 添加点
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(parseDate(d.date)))
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", "#4f46e5")

    // 添加最后一个点的标签
    const lastDatum = data[data.length - 1]
    g.append("text")
      .attr("x", x(parseDate(lastDatum.date)) + 10)
      .attr("y", y(lastDatum.value))
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text(lastDatum.value + "%")

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
        <Select defaultValue="overall">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择指标" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overall">整体效能</SelectItem>
            <SelectItem value="decision">决策效率</SelectItem>
            <SelectItem value="communication">沟通效率</SelectItem>
            <SelectItem value="execution">执行效率</SelectItem>
            <SelectItem value="innovation">创新能力</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="year">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择时间范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">过去一年</SelectItem>
            <SelectItem value="half">过去半年</SelectItem>
            <SelectItem value="quarter">过去一季度</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <svg ref={svgRef}></svg>
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <span className="text-muted-foreground">起始值: </span>
          <span className="font-medium">68%</span>
        </div>
        <div>
          <span className="text-muted-foreground">当前值: </span>
          <span className="font-medium">84%</span>
        </div>
        <div>
          <span className="text-muted-foreground">变化率: </span>
          <span className="font-medium text-green-500">+23.5%</span>
        </div>
      </div>
    </div>
  )
}
