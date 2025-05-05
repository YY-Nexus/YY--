"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StaffingTable() {
  const departments = [
    {
      name: "研发部门",
      current: 55,
      predicted: 63,
      change: 8,
      changePercent: 14.5,
    },
    {
      name: "市场部门",
      current: 38,
      predicted: 44,
      change: 6,
      changePercent: 15.8,
    },
    {
      name: "销售部门",
      current: 32,
      predicted: 36,
      change: 4,
      changePercent: 12.5,
    },
    {
      name: "人力资源部",
      current: 12,
      predicted: 14,
      change: 2,
      changePercent: 16.7,
    },
    {
      name: "财务部门",
      current: 10,
      predicted: 11,
      change: 1,
      changePercent: 10.0,
    },
    {
      name: "行政部门",
      current: 9,
      predicted: 10,
      change: 1,
      changePercent: 11.1,
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>部门</TableHead>
            <TableHead className="text-right">当前编制</TableHead>
            <TableHead className="text-right">预测需求</TableHead>
            <TableHead className="text-right">净增加</TableHead>
            <TableHead className="text-right">增长率</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{dept.name}</TableCell>
              <TableCell className="text-right">{dept.current}</TableCell>
              <TableCell className="text-right">{dept.predicted}</TableCell>
              <TableCell className="text-right text-green-500">+{dept.change}</TableCell>
              <TableCell className="text-right text-green-500">+{dept.changePercent}%</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-medium">
            <TableCell>总计</TableCell>
            <TableCell className="text-right">156</TableCell>
            <TableCell className="text-right">178</TableCell>
            <TableCell className="text-right text-green-500">+22</TableCell>
            <TableCell className="text-right text-green-500">+14.1%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
