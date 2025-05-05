"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 模拟数据
const vestingData = [
  { month: 0, 已归属: 0, 未归属: 100 },
  { month: 12, 已归属: 25, 未归属: 75 },
  { month: 24, 已归属: 50, 未归属: 50 },
  { month: 36, 已归属: 75, 未归属: 25 },
  { month: 48, 已归属: 100, 未归属: 0 },
]

const grantData = [
  {
    id: 1,
    grantDate: "2023-01-15",
    equityType: "股票期权",
    quantity: 10000,
    exercisePrice: "¥15.00",
    vestingStart: "2023-01-15",
    vestingEnd: "2027-01-14",
    vestedQuantity: 2500,
    unvestedQuantity: 7500,
    status: "正常归属中",
  },
  {
    id: 2,
    grantDate: "2022-04-10",
    equityType: "限制性股票",
    quantity: 2000,
    exercisePrice: "N/A",
    vestingStart: "2022-04-10",
    vestingEnd: "2025-04-09",
    vestedQuantity: 1333,
    unvestedQuantity: 667,
    status: "正常归属中",
  },
  {
    id: 3,
    grantDate: "2021-07-20",
    equityType: "股票期权",
    quantity: 5000,
    exercisePrice: "¥8.50",
    vestingStart: "2021-07-20",
    vestingEnd: "2025-07-19",
    vestedQuantity: 3750,
    unvestedQuantity: 1250,
    status: "正常归属中",
  },
]

export function VestingSchedule() {
  const [selectedGrant, setSelectedGrant] = useState("all")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>归属时间表</CardTitle>
          <CardDescription>查看股权激励的归属进度和预期时间表</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedGrant} onValueChange={setSelectedGrant}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="选择授予批次" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有授予</SelectItem>
                <SelectItem value="1">2023-01-15 股票期权</SelectItem>
                <SelectItem value="2">2022-04-10 限制性股票</SelectItem>
                <SelectItem value="3">2021-07-20 股票期权</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={vestingData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: "月份", position: "insideBottomRight", offset: -10 }} />
                <YAxis label={{ value: "百分比 (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
                <Legend />
                <Line type="monotone" dataKey="已归属" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="未归属" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>授予日期</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>行权价</TableHead>
                <TableHead>归属开始</TableHead>
                <TableHead>归属结束</TableHead>
                <TableHead>已归属</TableHead>
                <TableHead>未归属</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grantData.map((grant) => (
                <TableRow key={grant.id}>
                  <TableCell>{grant.grantDate}</TableCell>
                  <TableCell>{grant.equityType}</TableCell>
                  <TableCell>{grant.quantity.toLocaleString()}</TableCell>
                  <TableCell>{grant.exercisePrice}</TableCell>
                  <TableCell>{grant.vestingStart}</TableCell>
                  <TableCell>{grant.vestingEnd}</TableCell>
                  <TableCell>{grant.vestedQuantity.toLocaleString()}</TableCell>
                  <TableCell>{grant.unvestedQuantity.toLocaleString()}</TableCell>
                  <TableCell>{grant.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
