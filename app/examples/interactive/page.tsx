"use client"

import { InteractiveCard } from "@/components/interactive-card"
import { MobileInteractiveCard } from "@/components/mobile-interactive-card"
import { InteractiveButton } from "@/components/interactive-button"
import { InteractiveListItem } from "@/components/interactive-list-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MobileCard } from "@/components/mobile-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bell, Calendar, FileText, Home, Settings, User } from "lucide-react"

export default function InteractiveExamplesPage() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">交互组件示例</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">可交互卡片</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InteractiveCard title="组织治理中枢" description="查看组织结构和治理情况" href="/organization">
            <div className="h-32 bg-blue-50 rounded-md flex items-center justify-center">
              <p className="text-blue-500">组织结构图</p>
            </div>
          </InteractiveCard>

          <InteractiveCard title="员工全周期管理" description="管理员工从入职到离职的全过程" href="/employee-lifecycle">
            <div className="h-32 bg-green-50 rounded-md flex items-center justify-center">
              <p className="text-green-500">员工生命周期</p>
            </div>
          </InteractiveCard>

          <InteractiveCard title="薪酬绩效中心" description="管理薪酬体系和绩效评估" href="/compensation">
            <div className="h-32 bg-purple-50 rounded-md flex items-center justify-center">
              <p className="text-purple-500">薪酬绩效图表</p>
            </div>
          </InteractiveCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">移动端可交互卡片</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MobileCard title="通知中心" description="查看最新通知和消息" href="/notifications" interactive={true}>
            <div className="h-20 bg-yellow-50 rounded-md flex items-center justify-center">
              <p className="text-yellow-500">5条未读通知</p>
            </div>
          </MobileCard>

          <MobileInteractiveCard title="系统设置" description="配置系统参数和选项" href="/system-config">
            <div className="h-20 bg-gray-50 rounded-md flex items-center justify-center">
              <p className="text-gray-500">系统设置选项</p>
            </div>
          </MobileInteractiveCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">交互式按钮</h2>
        <div className="flex flex-wrap gap-4">
          <InteractiveButton href="/organization">组织治理中枢</InteractiveButton>

          <InteractiveButton href="/employee-lifecycle" variant="outline">
            员工全周期管理
          </InteractiveButton>

          <InteractiveButton href="/compensation" variant="secondary">
            薪酬绩效中心
          </InteractiveButton>

          <InteractiveButton onAction={() => alert("触发了自定义操作！")} variant="destructive">
            触发操作
          </InteractiveButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">交互式列表</h2>
        <Card>
          <CardHeader>
            <CardTitle>快速导航</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              <InteractiveListItem href="/">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-gray-500" />
                  <span>首页</span>
                </div>
              </InteractiveListItem>

              <InteractiveListItem href="/organization">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-500" />
                  <span>组织治理中枢</span>
                </div>
              </InteractiveListItem>

              <InteractiveListItem href="/employee-lifecycle">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span>员工全周期管理</span>
                </div>
              </InteractiveListItem>

              <InteractiveListItem href="/compensation">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <span>薪酬绩效中心</span>
                </div>
              </InteractiveListItem>

              <InteractiveListItem href="/notifications">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-yellow-500" />
                  <span>通知中心</span>
                </div>
              </InteractiveListItem>

              <InteractiveListItem href="/system-config">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-500" />
                  <span>系统设置</span>
                </div>
              </InteractiveListItem>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">CSS类应用示例</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>使用card-hover类</CardTitle>
            </CardHeader>
            <CardContent>
              <p>这个卡片使用了card-hover类来添加悬停效果</p>
            </CardContent>
          </Card>

          <div className="p-4 border rounded-lg interactive-hover">
            <h3 className="font-medium">使用interactive-hover类</h3>
            <p>这个div使用了interactive-hover类来添加悬停效果</p>
          </div>

          <div>
            <Button className="button-hover">使用button-hover类</Button>
            <div className="mt-4">
              <ul className="border rounded-lg overflow-hidden">
                <li className="p-3 border-b list-item-hover">列表项 1</li>
                <li className="p-3 border-b list-item-hover">列表项 2</li>
                <li className="p-3 list-item-hover">列表项 3</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">波纹效果示例</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-8 border rounded-lg ripple bg-white flex items-center justify-center">
            <p>点击此区域查看波纹效果</p>
          </div>

          <Button className="ripple h-16">带波纹效果的按钮</Button>
        </div>
      </section>

      <div className="flex justify-end">
        <Button className="focus-indicator" href="/">
          <span>返回首页</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
