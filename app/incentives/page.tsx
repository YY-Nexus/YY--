import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Gift, Trophy, Star, Plus, Users, TrendingUp, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function IncentivesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">员工激励</h2>
            <p className="text-muted-foreground">全方位员工激励与荣誉体系</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>创建激励计划</span>
          </Button>
        </div>

        <Tabs defaultValue="recognition">
          <TabsList>
            <TabsTrigger value="recognition" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>荣誉表彰</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-1">
              <Gift className="h-4 w-4" />
              <span>奖励福利</span>
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>激励计划</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recognition" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">月度之星</CardTitle>
                  <CardDescription>表彰在工作中表现突出的员工</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Award className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">2023年5月之星</h4>
                        <p className="text-sm text-gray-600">提名进行中，还有5天结束</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>提名进度</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>

                    <Button variant="outline" className="w-full">
                      参与提名
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">年度优秀员工</CardTitle>
                  <CardDescription>表彰年度表现卓越的员工</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">2023年度评选</h4>
                        <p className="text-sm text-gray-600">将于12月开始</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>准备进度</span>
                        <span>30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>

                    <Button variant="outline" className="w-full">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">创新奖</CardTitle>
                  <CardDescription>表彰在创新方面有突出贡献的员工</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                        <Star className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">2023年Q2创新奖</h4>
                        <p className="text-sm text-gray-600">评选已结束</p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="font-medium">获奖者：李明</p>
                      <p className="text-sm text-gray-600">研发部 | 产品创新</p>
                    </div>

                    <Button variant="outline" className="w-full">
                      查看历史
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">荣誉墙</CardTitle>
                <CardDescription>展示公司各类荣誉获得者</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2 text-left">荣誉名称</th>
                        <th className="border p-2 text-left">获奖者</th>
                        <th className="border p-2 text-left">部门</th>
                        <th className="border p-2 text-left">颁发日期</th>
                        <th className="border p-2 text-left">奖励内容</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          award: "2023年Q1月度之星",
                          winner: "张三",
                          dept: "研发部",
                          date: "2023-03-31",
                          reward: "奖金¥2000 + 荣誉证书",
                        },
                        {
                          award: "2023年Q1创新奖",
                          winner: "李四",
                          dept: "产品部",
                          date: "2023-03-31",
                          reward: "奖金¥5000 + 创新徽章",
                        },
                        {
                          award: "2022年度优秀员工",
                          winner: "王五",
                          dept: "销售部",
                          date: "2022-12-30",
                          reward: "奖金¥10000 + 额外3天年假",
                        },
                        {
                          award: "2022年Q4月度之星",
                          winner: "赵六",
                          dept: "市场部",
                          date: "2022-12-31",
                          reward: "奖金¥2000 + 荣誉证书",
                        },
                        {
                          award: "2022年最佳团队奖",
                          winner: "研发团队",
                          dept: "研发部",
                          date: "2022-12-30",
                          reward: "团队建设基金¥20000",
                        },
                      ].map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border p-2">{item.award}</td>
                          <td className="border p-2">{item.winner}</td>
                          <td className="border p-2">{item.dept}</td>
                          <td className="border p-2">{item.date}</td>
                          <td className="border p-2">{item.reward}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">积分兑换</CardTitle>
                  <CardDescription>使用积分兑换各类奖励</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                      <span className="font-medium">我的积分</span>
                      <span className="text-xl font-bold">2,450</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                        <span>咖啡券</span>
                        <span className="text-sm text-gray-600">100积分</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                        <span>电影票</span>
                        <span className="text-sm text-gray-600">300积分</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                        <span>半天假期</span>
                        <span className="text-sm text-gray-600">1000积分</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                        <span>健身卡</span>
                        <span className="text-sm text-gray-600">2000积分</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      查看更多奖励
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">即时奖励</CardTitle>
                  <CardDescription>为表现优秀的同事发放即时奖励</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <Gift className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">本月可用奖励额度</h4>
                        <p className="text-xl font-bold">¥1,000</p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="font-medium">已发放奖励</p>
                      <p className="text-sm text-gray-600">本月已发放3次，共¥500</p>
                    </div>

                    <Button className="w-full">发放奖励</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">福利活动</CardTitle>
                  <CardDescription>公司组织的各类福利活动</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">团队建设活动</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">时间：2023-05-20</p>
                      <p className="text-sm text-gray-600">地点：城市公园</p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <h4 className="font-medium">生日会</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">时间：2023-05-25</p>
                      <p className="text-sm text-gray-600">地点：公司休闲区</p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      查看更多活动
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="programs" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">激励计划概览</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-md text-center">
                        <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="font-medium">参与员工</p>
                        <p className="text-2xl font-bold">1,248</p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-md text-center">
                        <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="font-medium">激励计划</p>
                        <p className="text-2xl font-bold">8</p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-md text-center">
                        <Gift className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="font-medium">奖励总额</p>
                        <p className="text-2xl font-bold">¥1.2M</p>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-md text-center">
                        <TrendingUp className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                        <p className="font-medium">参与度</p>
                        <p className="text-2xl font-bold">92%</p>
                      </div>
                    </div>

                    <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">激励计划参与度趋势图</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">活跃激励计划</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {[
                      { name: "销售冠军计划", target: "销售团队", period: "2023年Q2", progress: 45 },
                      { name: "创新孵化器", target: "全体员工", period: "2023年全年", progress: 30 },
                      { name: "客户满意度提升计划", target: "客服团队", period: "2023年Q2-Q3", progress: 60 },
                      { name: "技能提升计划", target: "研发团队", period: "2023年Q2", progress: 75 },
                    ].map((program, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{program.name}</h4>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">进行中</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                          <div>目标群体：{program.target}</div>
                          <div>周期：{program.period}</div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>完成进度</span>
                            <span>{program.progress}%</span>
                          </div>
                          <Progress value={program.progress} className="h-2" />
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full">
                      查看所有计划
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">激励计划效果分析</CardTitle>
                  <Button variant="outline" size="sm">
                    导出报告
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-muted-foreground">员工参与度分析</p>
                  </div>

                  <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-muted-foreground">激励计划ROI分析</p>
                  </div>

                  <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-muted-foreground">员工满意度分析</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
