import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RiskHistoryProps {
  history: Array<{
    date: string
    score: number
    factors: Record<string, number>
  }>
}

export function RiskHistory({ history }: RiskHistoryProps) {
  // 获取风险等级和颜色
  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: "低", color: "bg-green-500 text-white" }
    if (score < 50) return { level: "中", color: "bg-yellow-500 text-white" }
    if (score < 70) return { level: "高", color: "bg-orange-500 text-white" }
    return { level: "极高", color: "bg-red-500 text-white" }
  }

  // 获取趋势
  const getTrend = (current: number, previous: number) => {
    const diff = current - previous
    if (diff > 5) return { trend: "上升", color: "text-red-600" }
    if (diff < -5) return { trend: "下降", color: "text-green-600" }
    return { trend: "持平", color: "text-gray-600" }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  // 反转历史记录，最新的在前面
  const sortedHistory = [...history].reverse()

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-medium">风险评分历史记录</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日期</TableHead>
              <TableHead>风险评分</TableHead>
              <TableHead>风险等级</TableHead>
              <TableHead>工作投入度</TableHead>
              <TableHead>工作表现</TableHead>
              <TableHead>工作满意度</TableHead>
              <TableHead>变化趋势</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHistory.map((record, index) => {
              const { level, color } = getRiskLevel(record.score)
              const previousRecord = sortedHistory[index + 1]
              const trend = previousRecord
                ? getTrend(record.score, previousRecord.score)
                : { trend: "-", color: "text-gray-600" }

              return (
                <TableRow key={record.date}>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell className="font-medium">{record.score}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("font-normal", color)}>
                      {level}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.factors.engagement}</TableCell>
                  <TableCell>{record.factors.performance}</TableCell>
                  <TableCell>{record.factors.satisfaction}</TableCell>
                  <TableCell className={trend.color}>{trend.trend}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
