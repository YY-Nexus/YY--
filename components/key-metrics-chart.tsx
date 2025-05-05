"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// 接收服务器组件传递的数据
export function KeyMetricsChart({ initialData = [] }) {
  const [data, setData] = useState(initialData)

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="组织健康度" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="人才流失率" stroke="#ff7300" />
          <Line type="monotone" dataKey="员工满意度" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
