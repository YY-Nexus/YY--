"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MarketBenchmark() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 600
    const height = 400
    const margin = { top: 40, right: 120, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // 模拟数据 - 市场对标
    const positions = ["初级工程师", "中级工程师", "高级工程师", "技术专家", "架构师", "技术经理", "技术总监"]

    const data = positions.map((position) => {
      return {
        position,
        company: Math.floor(Math.random() * 30000) + 15000,
        market25: Math.floor(Math.random() * 20000) + 10000,
        market50: Math.floor(Math.random() * 30000) + 15000,
        market75: Math.floor(Math.random() * 40000) + 20000,
      }
    })

    // 按市场中位数排序
    data.sort((a, b) => a.market50 - b.market50)

    const x = d3.scaleLinear().domain([0, 70000]).range([0, innerWidth])

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.position))
      .range([0, innerHeight])
      .padding(0.2)

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // 添加网格线
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisBottom(x).tickSize(innerHeight).tickFormat(""))
      .attr("transform", `translate(0,0)`)
      .selectAll("line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.5)

    // 添加X轴
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat((d) => `¥${d / 1000}k`))
      .selectAll("text")
      .attr("font-size", "12px")

    // 添加Y轴
    g.append("g").call(d3.axisLeft(y)).attr("font-size", "12px")

    // 添加X轴标签
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("月薪 (元)")

    // 绘制��场范围条形图
    g.selectAll(".market-range")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "market-range")
      .attr("x", (d) => x(d.market25))
      .attr("y", (d) => y(d.position))
      .attr("width", (d) => x(d.market75) - x(d.market25))
      .attr("height", y.bandwidth())
      .attr("fill", "#e5e7eb")

    // 绘制市场中位线
    g.selectAll(".market-median")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "market-median")
      .attr("x1", (d) => x(d.market50))
      .attr("x2", (d) => x(d.market50))
      .attr("y1", (d) => y(d.position))
      .attr("y2", (d) => y(d.position) + y.bandwidth())
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)

    // 绘制公司薪酬点
    g.selectAll(".company-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "company-point")
      .attr("cx", (d) => x(d.company))
      .attr("cy", (d) => y(d.position) + y.bandwidth() / 2)
      .attr("r", 6)
      .attr("fill", (d) => (d.company > d.market50 ? "#4f46e5" : "#ef4444"))

    // 添加图例
    const legend = svg.append("g").attr("transform", `translate(${width - 100}, 20)`)

    // 市场范围图例
    legend.append("rect").attr("width", 15).attr("height", 15).attr("fill", "#e5e7eb")

    legend.append("text").attr("x", 20).attr("y", 12).text("市场25%-75%").attr("font-size", "12px")

    // 市场中位线图例
    legend
      .append("line")
      .attr("x1", 0)
      .attr("x2", 15)
      .attr("y1", 30)
      .attr("y2", 30)
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)

    legend.append("text").attr("x", 20).attr("y", 34).text("市场中位数").attr("font-size", "12px")

    // 公司薪酬点图例
    legend.append("circle").attr("cx", 7).attr("cy", 50).attr("r", 6).attr("fill", "#4f46e5")

    legend.append("text").attr("x", 20).attr("y", 54).text("公司薪酬").attr("font-size", "12px")

    // 设置SVG尺寸
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>市场薪酬对标分析</CardTitle>
                <CardDescription>公司薪酬与市场水平对比</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="tech">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="选择职系" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">技术职系</SelectItem>
                    <SelectItem value="product">产品职系</SelectItem>
                    <SelectItem value="design">设计职系</SelectItem>
                    <SelectItem value="operation">运营职系</SelectItem>
                    <SelectItem value="sales">销售职系</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>市场竞争力分析</CardTitle>
            <CardDescription>薪酬市场竞争力评估</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>整体市场竞争力</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">P65</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      良好
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground">相对于市场中位数(P50)的百分位</p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="text-sm font-medium">各职系市场竞争力</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>技术职系</span>
                      <span className="font-medium">P70</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>产品职系</span>
                      <span className="font-medium">P65</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>销售职系</span>
                      <span className="font-medium">P60</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>运营职系</span>
                      <span className="font-medium">P55</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "55%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <Plus className="h-4 w-4" />
                  <span>添加对标数据源</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>薪酬市场调研报告</CardTitle>
              <CardDescription>行业薪酬趋势与预测</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>导出报告</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-2">行业薪酬增长率</h3>
                  <div className="text-2xl font-bold mb-1">5.8%</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      +0.3%
                    </Badge>
                    <span className="text-muted-foreground">较去年</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-2">热门职位薪酬涨幅</h3>
                  <div className="text-2xl font-bold mb-1">8.2%</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      +1.5%
                    </Badge>
                    <span className="text-muted-foreground">较去年</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-2">薪酬满意度</h3>
                  <div className="text-2xl font-bold mb-1">72%</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      -3%
                    </Badge>
                    <span className="text-muted-foreground">较去年</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">主要发现</h3>
              <ul className="space-y-1">
                <li className="text-sm flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>技术岗位市场竞争加剧，特别是AI和数据科学相关职位薪酬涨幅达12%</span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>初创企业提供的股权激励比例增加，成为吸引高端人才的重要手段</span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>灵活工作制度成为员工关注的重要福利，影响薪酬满意度</span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>公司整体薪酬竞争力处于行业65分位，技术岗位竞争力最强</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
