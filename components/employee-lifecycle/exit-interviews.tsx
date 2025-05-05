import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Download, Search, ThumbsUp, ThumbsDown } from "lucide-react"
import { Input } from "@/components/ui/input"

export function ExitInterviews() {
  const recentInterviews = [
    {
      id: 1,
      name: "李明",
      position: "高级前端工程师",
      department: "研发部",
      exitDate: "2023-12-05",
      tenure: "2年3个月",
      reason: "职业发展",
      feedback: "公司技术栈较为固定，个人成长空间有限。希望尝试更多新技术和挑战。",
      avatar: "/avatars/avatar-6.png",
    },
    {
      id: 2,
      name: "王芳",
      position: "市场专员",
      department: "市场部",
      exitDate: "2023-11-28",
      tenure: "1年8个月",
      reason: "薪酬福利",
      feedback: "薪资水平低于市场平均水平，加班较多但缺乏相应补偿。",
      avatar: "/avatars/avatar-7.png",
    },
    {
      id: 3,
      name: "张伟",
      position: "销售经理",
      department: "销售部",
      exitDate: "2023-11-15",
      tenure: "3年1个月",
      reason: "管理问题",
      feedback: "部门管理风格过于强势，缺乏有效沟通，团队氛围紧张。",
      avatar: "/avatars/avatar-8.png",
    },
  ]

  const feedbackCategories = [
    {
      category: "工作环境",
      positive: 75,
      negative: 25,
      comments: [
        {
          type: "positive",
          content: "办公环境舒适，设备齐全，同事关系融洽。",
        },
        {
          type: "negative",
          content: "开放式办公室噪音较大，影响专注度。",
        },
      ],
    },
    {
      category: "薪酬福利",
      positive: 45,
      negative: 55,
      comments: [
        {
          type: "positive",
          content: "福利项目多样，包括健身补贴和团建活动。",
        },
        {
          type: "negative",
          content: "薪资水平低于行业平均，缺乏有竞争力的薪酬增长机制。",
        },
      ],
    },
    {
      category: "职业发展",
      positive: 40,
      negative: 60,
      comments: [
        {
          type: "positive",
          content: "有内部培训机会，技术分享氛围良好。",
        },
        {
          type: "negative",
          content: "晋升通道不明确，高级职位空缺少，发展受限。",
        },
      ],
    },
    {
      category: "管理风格",
      positive: 60,
      negative: 40,
      comments: [
        {
          type: "positive",
          content: "大部分管理者愿意倾听员工意见，支持团队成员。",
        },
        {
          type: "negative",
          content: "部分部门管理风格过于强势，决策缺乏透明度。",
        },
      ],
    },
    {
      category: "工作内容",
      positive: 70,
      negative: 30,
      comments: [
        {
          type: "positive",
          content: "项目有挑战性，能够接触到多样化的业务场景。",
        },
        {
          type: "negative",
          content: "部分工作重复性高，创新空间有限。",
        },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>最近离职面谈</CardTitle>
                <CardDescription>员工离职面谈记录与反馈</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="搜索..." className="pl-8 w-[200px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex flex-col md:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={interview.avatar || "/placeholder.svg"} alt={interview.name} />
                    <AvatarFallback>{interview.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-medium">{interview.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {interview.position} · {interview.department}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{interview.reason}</Badge>
                        <Badge variant="outline">在职{interview.tenure}</Badge>
                      </div>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">离职反馈：</span>
                      {interview.feedback}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">离职日期: {interview.exitDate}</span>
                      <Button size="sm" variant="outline">
                        查看详情
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                <span>查看更多面谈记录</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>离职原因分析</CardTitle>
            <CardDescription>基于离职面谈的原因分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>职业发展</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>薪酬福利</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>工作环境</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>管理问题</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "12%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>工作内容</span>
                    <span className="font-medium">8%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "8%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>其他原因</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "5%" }}></div>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full gap-1">
                <Download className="h-4 w-4" />
                <span>导出分析报告</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>离职反馈分析</CardTitle>
          <CardDescription>离职员工对公司各方面的评价分析</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">总体评价</TabsTrigger>
              <TabsTrigger value="details">详细反馈</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="pt-4">
              <div className="space-y-6">
                {feedbackCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">{category.positive}%</span>
                        <span>/</span>
                        <span className="text-red-500">{category.negative}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                      <div className="bg-green-500 h-2 rounded-l-full" style={{ width: `${category.positive}%` }}></div>
                      <div className="bg-red-500 h-2 rounded-r-full" style={{ width: `${category.negative}%` }}></div>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center space-y-2">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-8 border-green-500/20">
                      <span className="text-xl font-bold text-green-500">58%</span>
                    </div>
                    <p className="text-sm">正面评价</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-8 border-red-500/20">
                      <span className="text-xl font-bold text-red-500">42%</span>
                    </div>
                    <p className="text-sm">负面评价</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <div className="space-y-6">
                {feedbackCategories.map((category, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="font-medium">{category.category}</h3>
                    <div className="space-y-3">
                      {category.comments.map((comment, commentIndex) => (
                        <div key={commentIndex} className="flex gap-2">
                          {comment.type === "positive" ? (
                            <ThumbsUp className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <ThumbsDown className="h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                    {index < feedbackCategories.length - 1 && <div className="border-b pt-2"></div>}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
