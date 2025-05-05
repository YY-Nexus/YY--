"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// 模拟数据
const departmentData = [
  { department: "研发", 股票期权: 120000, 限制性股票: 30000 },
  { department: "产品", 股票期权: 80000, 限制性股票: 20000 },
  { department: "销售", 股票期权: 60000, 限制性股票: 10000 },
  { department: "市场", 股票期权: 40000, 限制性股票: 8000 },
  { department: "运营", 股票期权: 30000, 限制性股票: 5000 },
  { department: "财务", 股票期权: 20000, 限制性股票: 4000 },
  { department: "人力资源", 股票期权: 15000, 限制性股票: 3000 },
]

const topRecipients = [
  {
    id: 1,
    name: "张三",
    position: "CEO",
    department: "高管",
    equityType: "股票期权",
    quantity: 50000,
    value: "¥2,000,000",
  },
  {
    id: 2,
    name: "李四",
    position: "CTO",
    department: "研发",
    equityType: "股票期权",
    quantity: 40000,
    value: "¥1,600,000",
  },
  {
    id: 3,
    name: "王五",
    position: "CFO",
    department: "财务",
    equityType: "股票期权",
    quantity: 35000,
    value: "¥1,400,000",
  },
  {
    id: 4,
    name: "赵六",
    position: "COO",
    department: "运营",
    equityType: "股票期权",
    quantity: 30000,
    value: "¥1,200,000",
  },
  {
    id: 5,
    name: "钱七",
    position: "VP of Sales",
    department: "销售",
    equityType: "限制性股票",
    quantity: 10000,
    value: "¥500,000",
  },
  {
    id: 6,
    name: "孙八",
    position: "VP of Product",
    department: "产品",
    equityType: "限制性股票",
    quantity: 8000,
    value: "¥400,000",
  },
  {
    id: 7,
    name: "周九",
    position: "VP of Marketing",
    department: "市场",
    equityType: "限制性股票",
    quantity: 7000,
    value: "¥350,000",
  },
]

export function EquityDistribution() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">部门股权分布</CardTitle>
          <CardDescription>各部门股权激励分配情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">股权激励前七名</CardTitle>
          <CardDescription>获得最多股权激励的员工</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>职位</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>激励类型</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>估计价值</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topRecipients.map((recipient) => (
                <TableRow key={recipient.id}>
                  <TableCell className="font-medium">{recipient.name}</TableCell>
                  <TableCell>{recipient.position}</TableCell>
                  <TableCell>{recipient.department}</TableCell>
                  <TableCell>{recipient.equityType}</TableCell>
                  <TableCell>{recipient.quantity.toLocaleString()}</TableCell>
                  <TableCell>{recipient.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
