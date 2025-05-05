import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Save, Send } from "lucide-react"

export default function NewMeetingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">发起会议</h2>
            <p className="text-muted-foreground">创建新的会议并邀请参会人员</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">会议信息</CardTitle>
              <CardDescription>填写会议的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">会议主题</Label>
                <Input id="title" placeholder="输入会议主题" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">会议日期</Label>
                  <div className="flex">
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>选择日期</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">会议时间</Label>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="开始时间" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="结束时间" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">会议类型</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择会议类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">常规会议</SelectItem>
                    <SelectItem value="project">项目会议</SelectItem>
                    <SelectItem value="training">培训会议</SelectItem>
                    <SelectItem value="interview">面试</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">会议地点</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="online" />
                    <label
                      htmlFor="online"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      线上会议
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="offline" />
                    <label
                      htmlFor="offline"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      线下会议
                    </label>
                  </div>
                </div>

                <Input id="location" placeholder="输入会议地点或链接" className="mt-2" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">会议内容</Label>
                <Textarea id="description" placeholder="输入会议内容和议程" rows={5} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">会议材料</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <p className="text-muted-foreground">拖拽文件到此处或点击上传</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    选择文件
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">参会人员</CardTitle>
              <CardDescription>选择需要参加会议的人员</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">搜索人员</Label>
                <Input id="search" placeholder="输入姓名或部门" />
              </div>

              <div className="space-y-2">
                <Label>常用群组</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="group1" />
                    <label
                      htmlFor="group1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      研发团队 (12人)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="group2" />
                    <label
                      htmlFor="group2"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      产品团队 (8人)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="group3" />
                    <label
                      htmlFor="group3"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      管理层 (5人)
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>已选人员 (5)</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {["张三", "李四", "王五", "赵六", "钱七"].map((name) => (
                    <div key={name} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <span>{name}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>会议提醒</Label>
                <Select defaultValue="15">
                  <SelectTrigger>
                    <SelectValue placeholder="选择提醒时间" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">不提醒</SelectItem>
                    <SelectItem value="5">5分钟前</SelectItem>
                    <SelectItem value="15">15分钟前</SelectItem>
                    <SelectItem value="30">30分钟前</SelectItem>
                    <SelectItem value="60">1小时前</SelectItem>
                    <SelectItem value="1440">1天前</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            <span>保存草稿</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span>发送邀请</span>
          </Button>
        </div>
      </main>
    </div>
  )
}
