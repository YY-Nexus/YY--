"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ComposedChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { Download, ZoomIn, ZoomOut, RefreshCw } from "lucide-react"
import { useUserSettings } from "@/lib/user-settings"
import { exportToExcel, exportToPDF } from "@/lib/export-utils"

interface DataPoint {
  [key: string]: any
}

interface ChartProps {
  title: string
  description?: string
  data: DataPoint[]
  dimensions: string[]
  measures: string[]
  className?: string
}

export function InteractiveChart({ title, description, data, dimensions, measures, className }: ChartProps) {
  const [chartType, setChartType] = useState("line")
  const [dimension, setDimension] = useState(dimensions[0])
  const [measure, setMeasure] = useState(measures[0])
  const [secondaryMeasure, setSecondaryMeasure] = useState(measures.length > 1 ? measures[1] : "")
  const [showLegend, setShowLegend] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showDataLabels, setShowDataLabels] = useState(false)
  const [stackedView, setStackedView] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [filteredData, setFilteredData] = useState(data)
  const [dataRange, setDataRange] = useState([0, data.length - 1])
  const chartRef = useRef<HTMLDivElement>(null)
  const { settings } = useUserSettings()

  // 根据用户设置获取图表颜色方案
  const getColorScheme = () => {
    switch (settings.chartColorScheme) {
      case "pastel":
        return ["#FFB6C1", "#ADD8E6", "#98FB98", "#FFDAB9", "#DDA0DD"]
      case "vibrant":
        return ["#FF4500", "#00BFFF", "#32CD32", "#FFD700", "#9932CC"]
      case "monochrome":
        return ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"]
      case "corporate":
        return ["#003366", "#336699", "#6699CC", "#99CCFF", "#CCFFFF"]
      default:
        return ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"]
    }
  }

  const colorScheme = getColorScheme()

  // 格式化金额为人民币格式
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // 应用数据范围过滤
  useEffect(() => {
    const filtered = data.slice(dataRange[0], dataRange[1] + 1)
    setFilteredData(filtered)
  }, [data, dataRange])

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded shadow-md p-3">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === "number" ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // 导出数据
  const handleExport = (format: "excel" | "pdf") => {
    if (format === "excel") {
      exportToExcel(filteredData, `${title}-${new Date().toISOString().split("T")[0]}`)
    } else {
      exportToPDF(chartRef.current, title, `${title}-${new Date().toISOString().split("T")[0]}`)
    }
  }

  // 渲染图表
  const renderChart = () => {
    const height = 400 * (zoomLevel / 100)

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={dimension} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={measure}
                stroke={colorScheme[0]}
                activeDot={{ r: 8 }}
                label={showDataLabels ? { position: "top" } : false}
              />
              {secondaryMeasure && (
                <Line
                  type="monotone"
                  dataKey={secondaryMeasure}
                  stroke={colorScheme[1]}
                  activeDot={{ r: 8 }}
                  label={showDataLabels ? { position: "top" } : false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={dimension} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Bar
                dataKey={measure}
                fill={colorScheme[0]}
                stackId={stackedView ? "a" : undefined}
                label={showDataLabels ? { position: "top" } : false}
              />
              {secondaryMeasure && (
                <Bar
                  dataKey={secondaryMeasure}
                  fill={colorScheme[1]}
                  stackId={stackedView ? "a" : undefined}
                  label={showDataLabels ? { position: "top" } : false}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )
      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={dimension} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey={measure}
                stackId={stackedView ? "a" : undefined}
                fill={colorScheme[0]}
                stroke={colorScheme[0]}
                fillOpacity={0.6}
              />
              {secondaryMeasure && (
                <Area
                  type="monotone"
                  dataKey={secondaryMeasure}
                  stackId={stackedView ? "a" : undefined}
                  fill={colorScheme[1]}
                  stroke={colorScheme[1]}
                  fillOpacity={0.6}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={showDataLabels}
                label={showDataLabels ? { fill: "#666", fontSize: 12 } : false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={measure}
                nameKey={dimension}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        )
      case "radar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart cx="50%" cy="50%" outerRadius={80} data={filteredData}>
              <PolarGrid />
              <PolarAngleAxis dataKey={dimension} />
              <PolarRadiusAxis />
              <Radar name={measure} dataKey={measure} stroke={colorScheme[0]} fill={colorScheme[0]} fillOpacity={0.6} />
              {secondaryMeasure && (
                <Radar
                  name={secondaryMeasure}
                  dataKey={secondaryMeasure}
                  stroke={colorScheme[1]}
                  fill={colorScheme[1]}
                  fillOpacity={0.6}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        )
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={dimension} type="number" name={dimension} />
              <YAxis dataKey={measure} type="number" name={measure} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Scatter name={measure} data={filteredData} fill={colorScheme[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        )
      case "composed":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={dimension} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Bar dataKey={measure} barSize={20} fill={colorScheme[0]} />
              {secondaryMeasure && <Line type="monotone" dataKey={secondaryMeasure} stroke={colorScheme[1]} />}
            </ComposedChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <Card className={className} ref={chartRef}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
              <Download className="mr-1 h-4 w-4" />
              导出Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
              <Download className="mr-1 h-4 w-4" />
              导出PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Tabs value={chartType} onValueChange={setChartType} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="line">折线图</TabsTrigger>
                <TabsTrigger value="bar">柱状图</TabsTrigger>
                <TabsTrigger value="area">面积图</TabsTrigger>
                <TabsTrigger value="pie">饼图</TabsTrigger>
                <TabsTrigger value="radar">雷达图</TabsTrigger>
                <TabsTrigger value="scatter">散点图</TabsTrigger>
                <TabsTrigger value="composed">组合图</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>维度</Label>
              <Select value={dimension} onValueChange={setDimension}>
                <SelectTrigger>
                  <SelectValue placeholder="选择维度" />
                </SelectTrigger>
                <SelectContent>
                  {dimensions.map((dim) => (
                    <SelectItem key={dim} value={dim}>
                      {dim}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>主要指标</Label>
              <Select value={measure} onValueChange={setMeasure}>
                <SelectTrigger>
                  <SelectValue placeholder="选择指标" />
                </SelectTrigger>
                <SelectContent>
                  {measures.map((mea) => (
                    <SelectItem key={mea} value={mea}>
                      {mea}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>次要指标</Label>
              <Select value={secondaryMeasure} onValueChange={setSecondaryMeasure}>
                <SelectTrigger>
                  <SelectValue placeholder="选择次要指标（可选）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无</SelectItem>
                  {measures
                    .filter((m) => m !== measure)
                    .map((mea) => (
                      <SelectItem key={mea} value={mea}>
                        {mea}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>数据范围</Label>
              <Slider
                value={dataRange}
                min={0}
                max={data.length - 1}
                step={1}
                onValueChange={setDataRange}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="show-legend" checked={showLegend} onCheckedChange={setShowLegend} />
              <Label htmlFor="show-legend">显示图例</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
              <Label htmlFor="show-grid">显示网格</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-data-labels" checked={showDataLabels} onCheckedChange={setShowDataLabels} />
              <Label htmlFor="show-data-labels">显示数据标签</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="stacked-view" checked={stackedView} onCheckedChange={setStackedView} />
              <Label htmlFor="stacked-view">堆叠视图</Label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Slider
              value={[zoomLevel]}
              min={50}
              max={200}
              step={10}
              onValueChange={(value) => setZoomLevel(value[0])}
              className="w-32"
            />
            <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoomLevel(100)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="border rounded-md p-4">{renderChart()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
