"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 模拟数据
const equityTypes = [
  {
    id: 1,
    name: "股票期权",
    description: "授予员工在未来以预定价格购买公司股票的权利",
    taxTreatment: "行权时缴纳个人所得税，出售时缴纳资本利得税",
    vestingPeriod: "4年，1年悬崖期",
    exercisePrice: "授予时公允市场价值",
    eligibility: "L2及以上级别员工",
  },
  {
    id: 2,
    name: "限制性股票",
    description: "授予员工在满足特定条件后获得的公司股票",
    taxTreatment: "归属时缴纳个人所得税，出售时缴纳资本利得税",
    vestingPeriod: "3年，1年悬崖期",
    exercisePrice: "无需支付行权价",
    eligibility: "L3及以上级别员工",
  },
  {
    id: 3,
    name: "股票增值权",
    description: "授予员工获得股票价值增长部分的现金收益的权利",
    taxTreatment: "行权时全额缴纳个人所得税",
    vestingPeriod: "3年，无悬崖期",
    exercisePrice: "授予时公允市场价值",
    eligibility: "所有正式员工",
  },
]

const equityPolicies = [
  {
    id: 1,
    category: "授予政策",
    policy: "新员工入职授予",
    description: "新员工入职时根据职级授予一定数量的股权激励",
    details: "入职后第一个月内授予，数量根据职级矩阵确定",
  },
  {
    id: 2,
    category: "授予政策",
    policy: "年度绩效授予",
    description: "根据年度绩效评估结果授予额外的股权激励",
    details: "每年4月根据上一年度绩效评估结果授予，A级绩效可获得基准的1.5倍",
  },
  {
    id: 3,
    category: "授予政策",
    policy: "晋升授予",
    description: "员工晋升时授予额外的股权激励",
    details: "晋升生效后下一个月授予，数量为新职级与原职级差额的1.2倍",
  },
  {
    id: 4,
    category: "行权政策",
    policy: "行权窗口期",
    description: "员工可以行权的时间窗口",
    details: "每季度最后一个月的1-15日为行权窗口期",
  },
  {
    id: 5,
    category: "行权政策",
    policy: "离职行权",
    description: "员工离职时对已归属股权的行权规定",
    details: "离职后90天内必须行权，否则作废",
  },
]

export function EquityStructure() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="types" className="space-y-4">
        <TabsList>
          <TabsTrigger value="types">股权类型</TabsTrigger>
          <TabsTrigger value="policies">授予与行权政策</TabsTrigger>
        </TabsList>

        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>股权激励类型</CardTitle>
              <CardDescription>公司提供的各类股权激励工具及其特点</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>类型</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>税务处理</TableHead>
                    <TableHead>归属期</TableHead>
                    <TableHead>行权价</TableHead>
                    <TableHead>适用对象</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equityTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{type.description}</TableCell>
                      <TableCell>{type.taxTreatment}</TableCell>
                      <TableCell>{type.vestingPeriod}</TableCell>
                      <TableCell>{type.exercisePrice}</TableCell>
                      <TableCell>{type.eligibility}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>授予与行权政策</CardTitle>
              <CardDescription>股权激励的授予条件、行权规则和相关政策</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>类别</TableHead>
                    <TableHead>政策</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>详细规定</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equityPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">{policy.category}</TableCell>
                      <TableCell>{policy.policy}</TableCell>
                      <TableCell>{policy.description}</TableCell>
                      <TableCell>{policy.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
