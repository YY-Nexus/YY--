"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EquitySimulator() {
  const [grantType, setGrantType] = useState("options")
  const [grantSize, setGrantSize] = useState(10000)
  const [exercisePrice, setExercisePrice] = useState(10)
  const [currentPrice, setCurrentPrice] = useState(15)
  const [growthRate, setGrowthRate] = useState(20)
  const [years, setYears] = useState(4)

  // 生成模拟数据
  const generateSimulationData = () => {
    const data = []
    const price = currentPrice

    for (let year = 0; year <= years; year++) {
      const yearData = { year }

      // 计算不同增长率下的价值
      yearData.conservative = calculateValue(
        grantSize,
        exercisePrice,
        price * Math.pow(1 + (growthRate - 10) / 100, year),
      )
      yearData.expected = calculateValue(grantSize, exercisePrice, price * Math.pow(1 + growthRate / 100, year))
      yearData.optimistic = calculateValue(
        grantSize,
        exercisePrice,
        price * Math.pow(1 + (growthRate + 10) / 100, year),
      )

      data.push(yearData)
    }

    return data
  }

  // 计算股权价值
  const calculateValue = (size, exercise, current) => {
    if (grantType === "options") {
      return Math.max(0, (current - exercise) * size)
    } else {
      return current * size
    }
  }

  const simulationData = generateSimulationData()

  // 计算当前价值
  const currentValue = calculateValue(grantSize, exercisePrice, currentPrice)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>股权激励模拟器</CardTitle>
          <CardDescription>模拟不同情景下股权激励的潜在价值</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="simulator" className="space-y-4">
            <TabsList>
              <TabsTrigger value="simulator">模拟器</TabsTrigger>
              <TabsTrigger value="results">模拟结果</TabsTrigger>
            </TabsList>

            <TabsContent value="simulator">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="grant-type">激励类型</Label>
                    <Select value={grantType} onValueChange={setGrantType}>
                      <SelectTrigger id="grant-type">
                        <SelectValue placeholder="选择激励类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="options">股票期权</SelectItem>
                        <SelectItem value="rsu">限制性股票</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grant-size">授予数量</Label>
                    <Input
                      id="grant-size"
                      type="number"
                      value={grantSize}
                      onChange={(e) => setGrantSize(Number(e.target.value))}
                    />
                  </div>

                  {grantType === "options" && (
                    <div className="space-y-2">
                      <Label htmlFor="exercise-price">行权价格 (¥)</Label>
                      <Input
                        id="exercise-price"
                        type="number"
                        value={exercisePrice}
                        onChange={(e) => setExercisePrice(Number(e.target.value))}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="current-price">当前股价 (¥)</Label>
                    <Input
                      id="current-price"
                      type="number"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>年增长率预期: {growthRate}%</Label>
                    <Slider
                      value={[growthRate]}
                      min={0}
                      max={50}
                      step={1}
                      onValueChange={(value) => setGrowthRate(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>模拟年数: {years}年</Label>
                    <Slider value={[years]} min={1} max={10} step={1} onValueChange={(value) => setYears(value[0])} />
                  </div>

                  <div className="pt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">当前估计价值</div>
                          <div className="text-3xl font-bold mt-1">¥{currentValue.toLocaleString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results">
              <div className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={simulationData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: "年", position: "insideBottomRight", offset: -10 }} />
                      <YAxis label={{ value: "价值 (¥)", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, ""]} />
                      <Legend />
                      <Line type="monotone" dataKey="conservative" name="保守估计" stroke="#8884d8" />
                      <Line type="monotone" dataKey="expected" name="预期估计" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="optimistic" name="乐观估计" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">模拟结果说明</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      此模拟基于您输入的参数，展示了未来{years}年内股权激励的潜在价值变化。 保守估计使用了
                      {growthRate - 10}%的年增长率，预期估计使用了{growthRate}%的年增长率， 乐观估计使用了
                      {growthRate + 10}%的年增长率。实际结果可能因市场条件、公司表现和其他因素而有所不同。
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
