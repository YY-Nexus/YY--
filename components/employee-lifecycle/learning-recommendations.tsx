import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Code, Users, Award, ArrowRight, Calendar, Clock } from "lucide-react"

export function LearningRecommendations() {
  const recommendedCourses = [
    {
      id: 1,
      title: "系统设计进阶",
      description: "学习大型前端应用的架构设计原则与实践",
      category: "技术",
      level: "中级",
      duration: "8小时",
      progress: 25,
      icon: Code,
      match: "高匹配度",
    },
    {
      id: 2,
      title: "Node.js全栈开发",
      description: "从零开始学习Node.js后端开发与API设计",
      category: "技术",
      level: "中级",
      duration: "12小时",
      progress: 0,
      icon: Code,
      match: "高匹配度",
    },
    {
      id: 3,
      title: "技术团队管理基础",
      description: "学习技术团队的管理技巧与领导力培养",
      category: "管理",
      level: "入门",
      duration: "6小时",
      progress: 0,
      icon: Users,
      match: "中匹配度",
    },
    {
      id: 4,
      title: "高效代码审查",
      description: "提升代码审查效率与质量的最佳实践",
      category: "技术",
      level: "中级",
      duration: "4小时",
      progress: 0,
      icon: Code,
      match: "中匹配度",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "前端技术分享会",
      date: "2023-12-20",
      time: "14:00-16:00",
      location: "线上",
      category: "分享会",
    },
    {
      id: 2,
      title: "系统设计工作坊",
      date: "2023-12-25",
      time: "10:00-17:00",
      location: "会议室A",
      category: "工作坊",
    },
    {
      id: 3,
      title: "技术导师计划启动会",
      date: "2024-01-05",
      time: "15:00-16:30",
      location: "会议室B",
      category: "培训",
    },
  ]

  const certifications = [
    {
      id: 1,
      title: "前端架构师认证",
      organization: "前端技术学院",
      expiry: "永久有效",
      status: "推荐",
    },
    {
      id: 2,
      title: "Node.js开发者认证",
      organization: "Node.js基金会",
      expiry: "2年有效期",
      status: "推荐",
    },
    {
      id: 3,
      title: "AWS认证解决方案架构师",
      organization: "Amazon",
      expiry: "3年有效期",
      status: "可选",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>推荐学习课程</CardTitle>
            <CardDescription>基于您的职业发展目标和技能差距的学习建议</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedCourses.map((course) => (
                <div key={course.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="rounded-md bg-primary/10 p-2 h-fit">
                    <course.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-medium">{course.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{course.category}</Badge>
                        <Badge variant="outline">{course.level}</Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {course.match}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      {course.progress > 0 ? (
                        <div className="flex items-center gap-2">
                          <Progress value={course.progress} className="h-2 w-[100px]" />
                          <span className="text-sm">{course.progress}%</span>
                        </div>
                      ) : (
                        <Button size="sm">开始学习</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                <span>查看更多课程</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>学习进度</CardTitle>
            <CardDescription>当前学习计划的完成情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border-8 border-primary/20">
                  <span className="text-2xl font-bold">25%</span>
                </div>
                <p className="text-sm text-muted-foreground">总体学习计划完成度</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>已完成课程</span>
                  <span className="font-medium">2/8</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>学习时长</span>
                  <span className="font-medium">6小时/24小时</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>技能提升</span>
                  <span className="font-medium">+0.3分</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                查看学习报告
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>即将开始的学习活动</CardTitle>
            <CardDescription>近期可参加的培训与学习活动</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="rounded-md bg-primary/10 p-2 h-fit">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">{event.location}</span>
                      <Button size="sm">报名参加</Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                <span>查看更多活动</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>推荐认证</CardTitle>
            <CardDescription>适合您职业发展的专业认证</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="rounded-md bg-primary/10 p-2 h-fit">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.organization}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-muted-foreground">有效期: {cert.expiry}</span>
                      <Badge
                        variant="outline"
                        className={cert.status === "推荐" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                      >
                        {cert.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                <span>查看更多认证</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
