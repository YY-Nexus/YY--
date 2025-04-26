"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  Cpu,
  Layers,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BigDataProcessorProps {
  className?: string
}

export function BigDataProcessor({ className }: BigDataProcessorProps) {
  const [activeTab, setActiveTab] = useState("optimization")
  const [processingMethod, setProcessingMethod] = useState("parallel")
  const [chunkSize, setChunkSize] = useState(1000)
  const [useIndexing, setUseIndexing] = useState(true)
  const [useCompression, setUseCompression] = useState(true)
  const [memoryLimit, setMemoryLimit] = useState(70)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processingTime, setProcessingTime] = useState<number | null>(null)
  const [processingResult, setProcessingResult] = useState<any | null>(null)
  const [optimizationHistory, setOptimizationHistory] = useState<any[]>([])
  const processingTimer = useRef<NodeJS.Timeout | null>(null)

  // 模拟处理历史数据
  useEffect(() => {
    setOptimizationHistory([
      {
        id: "opt-001",
        date: "2024-04-20",
        dataSize: "2.5GB",
        method: "parallel",
        duration: 45.2,
        improvement: 68,
        settings: {
          chunkSize: 1000,
          useIndexing: true,
          useCompression: true,
          memoryLimit: 70,
        },
      },
      {
        id: "opt-002",
        date: "2024-04-18",
        dataSize: "1.8GB",
        method: "streaming",
        duration: 32.7,
        improvement: 55,
        settings: {
          chunkSize: 800,
          useIndexing: true,
          useCompression: false,
          memoryLimit: 60,
        },
      },
      {
        id: "opt-003",
        date: "2024-04-15",
        dataSize: "3.2GB",
        method: "worker",
        duration: 58.3,
        improvement: 72,
        settings: {
          chunkSize: 1200,
          useIndexing: true,
          useCompression: true,
          memoryLimit: 80,
        },
      },
    ])
  }, [])

  // 模拟数据处理过程
  const startProcessing = () => {
    setIsProcessing(true)
    setProgress(0)
    setProcessingTime(null)
    setProcessingResult(null)

    const startTime = Date.now()
    const totalSteps = 100
    let currentStep = 0

    processingTimer.current = setInterval(() => {
      currentStep += 1
      setProgress(currentStep)

      if (currentStep >= totalSteps) {
        if (processingTimer.current) {
          clearInterval(processingTimer.current)
        }

        const endTime = Date.now()
        const duration = (endTime - startTime) / 1000
        setProcessingTime(duration)
        setIsProcessing(false)

        // 模拟处理结果
        const improvement = Math.floor(Math.random() * 30) + 50 // 50-80% 的改进
        setProcessingResult({
          recordsProcessed: Math.floor(Math.random() * 5000000) + 5000000, // 5-10M 记录
          dataSize: (Math.random() * 4 + 1).toFixed(1) + "GB", // 1-5GB
          improvement: improvement,
          memoryUsage: Math.floor(Math.random() * 30) + 50, // 50-80% 内存使用
          cpuUsage: Math.floor(Math.random() * 40) + 40, // 40-80% CPU使用
        })

        // 添加到历史记录
        const newOptimization = {
          id: `opt-${optimizationHistory.length + 4}`,
          date: new Date().toISOString().split("T")[0],
          dataSize: (Math.random() * 4 + 1).toFixed(1) + "GB",
          method: processingMethod,
          duration: duration,
          improvement: improvement,
          settings: {
            chunkSize,
            useIndexing,
            useCompression,
            memoryLimit,
          },
        }
        setOptimizationHistory([newOptimization, ...optimizationHistory])
      }
    }, 100)
  }

  // 取消处理
  const cancelProcessing = () => {
    if (processingTimer.current) {
      clearInterval(processingTimer.current)
    }
    setIsProcessing(false)
    setProgress(0)
  }

  // 获取处理方法描述
  const getMethodDescription = (method: string) => {
    switch (method) {
      case "parallel":
        return "使用并行处理技术同时处理多个数据块，充分利用多核CPU"
      case "streaming":
        return "使用流式处理技术，逐步处理数据而不需要一次性加载全部数据到内存"
      case "worker":
        return "使用Web Worker在后台线程处理数据，避免阻塞主线程"
      case "gpu":
        return "利用GPU加速计算密集型操作，适用于大规模数值计算和矩阵运算"
      default:
        return ""
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>大数据处理优化</CardTitle>
            <CardDescription>优化大规模数据集的处理性能，提高数据分析效率</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={isProcessing}>
              <Settings className="mr-2 h-4 w-4" />
              高级设置
            </Button>
            <Button size="sm" disabled={isProcessing}>
              <RefreshCw className="mr-2 h-4 w-4" />
              刷新数据
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="optimization">优化配置</TabsTrigger>
            <TabsTrigger value="results">处理结果</TabsTrigger>
            <TabsTrigger value="history">优化历史</TabsTrigger>
          </TabsList>

          <TabsContent value="optimization" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">处理方法</h3>
                  <Select value={processingMethod} onValueChange={setProcessingMethod} disabled={isProcessing}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择处理方法" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parallel">并行处理</SelectItem>
                      <SelectItem value="streaming">流式处理</SelectItem>
                      <SelectItem value="worker">Worker线程处理</SelectItem>
                      <SelectItem value="gpu">GPU加速处理</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">{getMethodDescription(processingMethod)}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">数据块大小</h3>
                    <span className="text-sm text-muted-foreground">{chunkSize.toLocaleString()} 条记录/块</span>
                  </div>
                  <Slider
                    value={[chunkSize]}
                    min={100}
                    max={5000}
                    step={100}
                    onValueChange={(value) => setChunkSize(value[0])}
                    disabled={isProcessing}
                  />
                  <p className="text-sm text-muted-foreground mt-1">较大的块大小可以减少处理开销，但可能增加内存使用</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="indexing">使用索引优化</Label>
                      <p className="text-sm text-muted-foreground">为频繁查询的字段创建索引以加速查询</p>
                    </div>
                    <Switch
                      id="indexing"
                      checked={useIndexing}
                      onCheckedChange={setUseIndexing}
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compression">使用数据压缩</Label>
                      <p className="text-sm text-muted-foreground">压缩数据以减少内存使用和传输时间</p>
                    </div>
                    <Switch
                      id="compression"
                      checked={useCompression}
                      onCheckedChange={setUseCompression}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">内存使用限制</h3>
                    <span className="text-sm text-muted-foreground">最大 {memoryLimit}%</span>
                  </div>
                  <Slider
                    value={[memoryLimit]}
                    min={30}
                    max={90}
                    step={5}
                    onValueChange={(value) => setMemoryLimit(value[0])}
                    disabled={isProcessing}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    限制处理过程中的最大内存使用百分比，防止系统内存不足
                  </p>
                </div>

                <div className="border rounded-md p-4 bg-muted/50">
                  <h3 className="text-lg font-medium mb-2">性能预估</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">预计处理时间:</span>
                      <span className="text-sm font-medium">
                        {processingMethod === "parallel"
                          ? "30-60秒"
                          : processingMethod === "streaming"
                            ? "45-90秒"
                            : processingMethod === "worker"
                              ? "40-70秒"
                              : "20-40秒"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">预计内存使用:</span>
                      <span className="text-sm font-medium">
                        {processingMethod === "parallel"
                          ? "中高"
                          : processingMethod === "streaming"
                            ? "低"
                            : processingMethod === "worker"
                              ? "中"
                              : "高"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">预计CPU使用:</span>
                      <span className="text-sm font-medium">
                        {processingMethod === "parallel"
                          ? "高"
                          : processingMethod === "streaming"
                            ? "中"
                            : processingMethod === "worker"
                              ? "中高"
                              : "中"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">适用数据规模:</span>
                      <span className="text-sm font-medium">
                        {processingMethod === "parallel"
                          ? "中大型"
                          : processingMethod === "streaming"
                            ? "超大型"
                            : processingMethod === "worker"
                              ? "大型"
                              : "中型"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  {isProcessing ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>处理进度</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      <Button variant="destructive" onClick={cancelProcessing}>
                        取消处理
                      </Button>
                    </>
                  ) : (
                    <Button onClick={startProcessing}>开始优化处理</Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="pt-4">
            {processingResult ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">处理结果摘要</h3>
                  <Badge className="bg-green-500">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    处理完成
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Layers className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold">{processingResult.recordsProcessed.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">处理记录数</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold">{processingResult.dataSize}</div>
                        <p className="text-sm text-muted-foreground">数据大小</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold">{processingTime?.toFixed(1)}秒</div>
                        <p className="text-sm text-muted-foreground">处理时间</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold">{processingResult.improvement}%</div>
                        <p className="text-sm text-muted-foreground">性能提升</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">资源使用情况</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">内存使用</span>
                          <span className="text-sm">{processingResult.memoryUsage}%</span>
                        </div>
                        <Progress value={processingResult.memoryUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">CPU使用</span>
                          <span className="text-sm">{processingResult.cpuUsage}%</span>
                        </div>
                        <Progress value={processingResult.cpuUsage} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">优化设置摘要</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>处理方法:</span>
                          <Badge variant="outline">
                            {processingMethod === "parallel"
                              ? "并行处理"
                              : processingMethod === "streaming"
                                ? "流式处理"
                                : processingMethod === "worker"
                                  ? "Worker线程处理"
                                  : "GPU加速处理"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>数据块大小:</span>
                          <span>{chunkSize.toLocaleString()} 条记录/块</span>
                        </div>
                        <div className="flex justify-between">
                          <span>索引优化:</span>
                          <span>{useIndexing ? "启用" : "禁用"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>数据压缩:</span>
                          <span>{useCompression ? "启用" : "禁用"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>内存限制:</span>
                          <span>最大 {memoryLimit}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">优化建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">考虑增加数据块大小</p>
                          <p className="text-sm text-muted-foreground">
                            当前数据块大小可能不是最优的。尝试增加到 {(chunkSize * 1.5).toFixed(0)}{" "}
                            条记录/块可能会进一步提高性能。
                          </p>
                        </div>
                      </div>
                      {!useIndexing && (
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="font-medium">启用索引优化</p>
                            <p className="text-sm text-muted-foreground">
                              对于此类数据集，启用索引优化可能会显著提高查询性能。
                            </p>
                          </div>
                        </div>
                      )}
                      {processingMethod === "parallel" && processingResult.cpuUsage > 70 && (
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="font-medium">考虑使用流式处理</p>
                            <p className="text-sm text-muted-foreground">
                              当前CPU使用率较高，流式处理可能更适合此类数据集，可以减轻CPU负担。
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    导出报告
                  </Button>
                  <Button onClick={() => setActiveTab("optimization")}>返回优化配置</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">尚未进行数据处理</h3>
                <p className="text-muted-foreground mb-4">配置优化参数并开始处理以查看结果</p>
                <Button onClick={() => setActiveTab("optimization")}>前往优化配置</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            {optimizationHistory.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">优化历史记录</h3>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    导出历史
                  </Button>
                </div>

                <div className="border rounded-md">
                  <div className="grid grid-cols-7 gap-4 p-3 border-b bg-muted/50 text-sm font-medium">
                    <div>日期</div>
                    <div>数据大小</div>
                    <div>处理方法</div>
                    <div>处理时间</div>
                    <div>性能提升</div>
                    <div>设置</div>
                    <div></div>
                  </div>
                  <div className="divide-y">
                    {optimizationHistory.map((item) => (
                      <div key={item.id} className="grid grid-cols-7 gap-4 p-3 text-sm items-center">
                        <div>{item.date}</div>
                        <div>{item.dataSize}</div>
                        <div>
                          <Badge variant="outline">
                            {item.method === "parallel"
                              ? "并行处理"
                              : item.method === "streaming"
                                ? "流式处理"
                                : item.method === "worker"
                                  ? "Worker线程"
                                  : "GPU加速"}
                          </Badge>
                        </div>
                        <div>{item.duration.toFixed(1)}秒</div>
                        <div className="flex items-center">
                          <span className="font-medium text-green-600">{item.improvement}%</span>
                          <Zap className="h-4 w-4 text-green-600 ml-1" />
                        </div>
                        <div>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            查看详情
                          </Button>
                        </div>
                        <div>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            应用设置
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">暂无优化历史</h3>
                <p className="text-muted-foreground">完成数据处理后将在此处显示历史记录</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          上次优化: {optimizationHistory.length > 0 ? optimizationHistory[0].date : "从未"}
        </div>
        <Button variant="outline" size="sm">
          <Cpu className="mr-2 h-4 w-4" />
          系统资源监控
        </Button>
      </CardFooter>
    </Card>
  )
}
