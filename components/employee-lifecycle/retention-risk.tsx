"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Search, Filter, AlertTriangle, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RetentionRisk() {
  const highRiskEmployees = [
    {
      id: 1,
      name: "张伟",
      position: "高级前端工程师",
      department: "研发部",
      riskScore: 85,
      riskLevel: "高",
      riskFactors: ["薪酬低于市场", "晋升机会受限", "工作压力大"],
      avatar: "/avatars/avatar-9.png",
    },
    {
      id: 2,
      name: "李娜",
      position: "产品经理",
      department: "产品部",
      riskScore: 78,
      riskLevel: "高",
      riskFactors: ["绩效评分下降", "团队冲突", "工作内容变化"],
      avatar: "/avatars/avatar-10.png",
    },
    {
      id: 3,
      name: "王强",
      position: "销售代表",
      department: "销售部",
      riskScore: 75,
      riskLevel: "高",
      riskFactors: ["业绩压力大", "薪酬低于预期", "通勤时间长"],
      avatar: "/avatars/avatar-11.png",
    },
    {
      id: 4,
      name: "刘芳",
      position: "UI设计师",
      department: "设计部",
      riskScore: 72,
      riskLevel: "高",
      riskFactors: ["工作重复性高", "创意受限", "加班频繁"],
      avatar: "/avatars/avatar-12.png",
    },
  ]

  const mediumRiskEmployees = [
    {
      id: 5,
      name: "赵明",
      position: "后端工程师",
      department: "研发部",
      riskScore: 65,
      riskLevel: "中",
      riskFactors: ["技术栈老旧", "项目挑战性不足"],
      avatar: "/avatars/avatar-13.png",
    },
    {
      id: 6,
      name: "孙丽",
      position: "市场专员",
      department: "市场部",
      riskScore: 62,
      riskLevel: "中",
      riskFactors: ["晋升机会有限", "工作内容单一"],
      avatar: "/avatars/avatar-14.png",
    },
  ]

  const getRiskBadge = (level) => {
    switch (level) {
      case "高":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            高风险
          </Badge>
        )
      case "中":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            中风险
          </Badge>
        )
      case "低":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            低风险
          </Badge>
        )
      default:
        return null
    }
  }

  const getRiskColor = (score) => {
    if (score >= 70) return "bg-red-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">高风险员工</p>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">24</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  +5
                </Badge>
                较上季度
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">中风险员工</p>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">42</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  +8
                </Badge>
                较上季度
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">风险员工占比</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">16.8%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  +2.3%
                </Badge>
                较上季度
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">平均风险分</p>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">42.5</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  +3.2
                </Badge>
                较上季度
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>员工保留风险预警</CardTitle>
              <CardDescription>基于AI模型的员工离职风险预测</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="搜索员工..." className="pl-8 w-[200px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="风险等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="high">高风险</SelectItem>
                  <SelectItem value="medium">中风险</SelectItem>
                  <SelectItem value="low">低风险</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="high">
            <TabsList>
              <TabsTrigger value="high">高风险</TabsTrigger>
              <TabsTrigger value="medium">中风险</TabsTrigger>
              <TabsTrigger value="all">全部</TabsTrigger>
            </TabsList>
            <TabsContent value="high" className="pt-4">
              <div className="space-y-6">
                {highRiskEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex flex-col md:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                      <AvatarFallback>{employee.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{employee.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {employee.position} · {employee.department}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getRiskBadge(employee.riskLevel)}
                          <Badge variant="outline">风险分: {employee.riskScore}</Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>风险评分</span>
                          <span className="font-medium">{employee.riskScore}/100</span>
                        </div>
                        <Progress value={employee.riskScore} className={`h-2 ${getRiskColor(employee.riskScore)}`} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {employee.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-800">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">预测离职概率: {employee.riskScore}%</span>
                        <Button size="sm">制定保留计划</Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                  <span>查看更多高风险员工</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="medium" className="pt-4">
              <div className="space-y-6">
                {mediumRiskEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex flex-col md:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                      <AvatarFallback>{employee.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{employee.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {employee.position} · {employee.department}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getRiskBadge(employee.riskLevel)}
                          <Badge variant="outline">风险分: {employee.riskScore}</Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>风险评分</span>
                          <span className="font-medium">{employee.riskScore}/100</span>
                        </div>
                        <Progress value={employee.riskScore} className={`h-2 ${getRiskColor(employee.riskScore)}`} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {employee.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-800">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">预测离职概率: {employee.riskScore}%</span>
                        <Button size="sm">制定保留计划</Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                  <span>查看更多中风险员工</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="all" className="pt-4">
              <div className="text-center py-8 text-muted-foreground">
                共有66名员工存在离职风险，请使用搜索和筛选功能查看详情
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>风险因素分布</CardTitle>
            <CardDescription>员工离职风险的主要因素分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">薪酬低于市场</span>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <Progress value={32} className="h-2 bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">工作压力大</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <Progress value={28} className="h-2 bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">晋升机会受限</span>
                  <span className="text-sm font-medium">24%</span>
                </div>
                <Progress value={24} className="h-2 bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">团队冲突</span>
                  <span className="text-sm font-medium">18%</span>
                </div>
                <Progress value={18} className="h-2 bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">工作内容单一</span>
                  <span className="text-sm font-medium">14%</span>
                </div>
                <Progress value={14} className="h-2 bg-gray-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>部门风险分布</CardTitle>
            <CardDescription>各部门员工离职风险情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">研发部</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">18人</span>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      高
                    </Badge>
                  </div>
                </div>
                <Progress value={75} className="h-2 bg-red-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">销售部</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">12人</span>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      高
                    </Badge>
                  </div>
                </div>
                <Progress value={68} className="h-2 bg-red-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">市场部</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">8人</span>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      中
                    </Badge>
                  </div>
                </div>
                <Progress value={52} className="h-2 bg-yellow-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">设计部</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">6人</span>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      中
                    </Badge>
                  </div>
                </div>
                <Progress value={45} className="h-2 bg-yellow-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">人力资源部</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">2人</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      低
                    </Badge>
                  </div>
                </div>
                <Progress value={25} className="h-2 bg-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>风险趋势分析</CardTitle>
          <CardDescription>近6个月员工离职风险变化趋势</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-end justify-between gap-2">
            {[35, 42, 38, 45, 58, 66].map((value, index) => (
              <div key={index} className="relative h-full flex flex-col justify-end items-center gap-2">
                <div
                  className={`w-12 ${index === 5 ? "bg-red-500" : index === 4 ? "bg-red-400" : "bg-gray-200"}`}
                  style={{ height: `${(value * 100) / 80}%` }}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {["1月", "2月", "3月", "4月", "5月", "6月"][index]}
                </span>
                <span className="absolute top-0 -translate-y-6 text-xs font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">注意：</span> 近两个月风险员工数量明显上升，需要及时干预
            </div>
            <Button>查看详细报告</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>保留计划建议</CardTitle>
          <CardDescription>基于AI分析的员工保留策略建议</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">研发部保留策略</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 text-green-800 p-1 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>调整薪酬结构，确保核心技术人员薪资在市场75%分位以上</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 text-green-800 p-1 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>实施弹性工作制，减轻工作压力</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 text-green-800 p-1 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>提供技术进阶培训和晋升通道</span>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">销售部保留策略</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 text-green-800 p-1 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>优化销售目标设定，确保挑战性与可达成性平衡</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 text-green-800 p-1 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>调整佣金结构，增加长期客户维护的激励</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 text-green-800 p-1 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>提供销售技能提升培训</span>
                </li>
              </ul>
            </div>

            <Button className="w-full">生成完整保留计划报告</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
