"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { EquityStructure } from "./equity-structure"
import { VestingSchedule } from "./vesting-schedule"
import { EquitySimulator } from "./equity-simulator"
import { EquityDistribution } from "./equity-distribution"

// 模拟数据
const equityPoolData = [
  { name: "已授予", value: 15 },
  { name: "已行权", value: 8 },
  { name: "已归属", value: 12 },
  { name: "未分配", value: 65 },
]

const equityByLevelData = [
  { level: "L1", 股票期权: 500, 限制性股票: 0 },
  { level: "L2", 股票期权: 1000, 限制性股票: 0 },
  { level: "L3", 股票期权: 2000, 限制性股票: 500 },
  { level: "L4", 股票期权: 5000, 限制性股票: 1000 },
  { level: "L5", 股票期权: 10000, 限制性股票: 2000 },
  { level: "L6", 股票期权: 20000, 限制性股票: 5000 },
  { level: "L7", 股票期权: 50000, 限制性股票: 10000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function EquityPlan() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>股权激励沙盘</CardTitle>
          <CardDescription>全面管理公司股权激励计划，包括股票期权、限制性股票和股票增值权</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">股权概览</TabsTrigger>
              <TabsTrigger value="structure">激励结构</TabsTrigger>
              <TabsTrigger value="vesting">归属计划</TabsTrigger>
              <TabsTrigger value="simulator">激励模拟器</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">股权池分配</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={equityPoolData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {equityPoolData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">各级别股权分配</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={equityByLevelData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="level" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="股票期权" fill="#8884d8" />
                          <Bar dataKey="限制性股票" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <EquityDistribution />
            </TabsContent>

            <TabsContent value="structure">
              <EquityStructure />
            </TabsContent>

            <TabsContent value="vesting">
              <VestingSchedule />
            </TabsContent>

            <TabsContent value="simulator">
              <EquitySimulator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
