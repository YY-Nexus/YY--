"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, TrendingUp, TrendingDown } from "lucide-react"

export function OnboardingFeedback() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 600
    const height = 250
    const margin = { top: 30, right: 50, bottom: 40, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据
    const data = [
      { month: "7月", score: 4.1 },
      { month: "8月", score: 4.0 },
      { month: "9月", score: 4.2 },
      { month: "10月", score: 4.3 },
      { month: "11月", score: 4.5 },
      { month: "12月", score: 4.7 },
    ]

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3.scaleLinear().domain([3.5, 5]).range([innerHeight, 0])

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
      .attr("x", (d) => x(d.month))
      .attr("y", (d) => y(d.score))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.score))
      .attr("fill", "#4f46e5")

    // 添加数值标签
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.month) + x.bandwidth() / 2)
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

  const feedbackItems = [
    {
      category: "入职流程",
      score: 4.7,
      change: "+0.3",
      trend: "up",
    },
    {
      category: "培训内容",
      score: 4.5,
      change: "+0.2",
      trend: "up",
    },
    {
      category: "导师辅导",
      score: 4.8,
      change: "+0.4",
      trend: "up",
    },
    {
      category: "团队融入",
      score: 4.6,
      change: "+0.1",
      trend: "up",
    },
    {
      category: "工作环境",
      score: 4.9,
      change: "0",
      trend: "neutral",
    },
    {
      category: "IT设备支持",
      score: 4.3,
      change: "-0.1",
      trend: "down",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="w-full">
        <svg ref={svgRef}></svg>
        <div className="text-center text-xs text-muted-foreground mt-2">入职满意度评分趋势 (5分制)</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {feedbackItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{item.category}</span>
                {item.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : item.trend === "down" ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : null}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{item.score}</div>
                <Badge
                  variant="outline"
                  className={`${
                    item.trend === "up"
                      ? "bg-green-100 text-green-800"
                      : item.trend === "down"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <ThumbsUp className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">最受好评</h4>
                <p className="text-xs text-muted-foreground">
                  "导师制度非常有帮助，我的导师王工程师耐心解答了我所有的问题，帮助我快速融入团队。"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <ThumbsDown className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">需要改进</h4>
                <p className="text-xs text-muted-foreground">
                  "IT设备准备不够及时，入职第一天没有电脑，影响了工作效率。"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
