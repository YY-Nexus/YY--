import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function OnboardingProgress() {
  const onboardingEmployees = [
    {
      id: 1,
      name: "张明",
      position: "前端工程师",
      department: "研发部",
      startDate: "2023-12-10",
      progress: 75,
      status: "进行中",
      tasks: {
        completed: 9,
        total: 12,
      },
      avatar: "/avatars/avatar-1.png",
    },
    {
      id: 2,
      name: "李华",
      position: "产品经理",
      department: "产品部",
      startDate: "2023-12-12",
      progress: 50,
      status: "进行中",
      tasks: {
        completed: 6,
        total: 12,
      },
      avatar: "/avatars/avatar-2.png",
    },
    {
      id: 3,
      name: "王芳",
      position: "UI设计师",
      department: "设计部",
      startDate: "2023-12-15",
      progress: 25,
      status: "进行中",
      tasks: {
        completed: 3,
        total: 12,
      },
      avatar: "/avatars/avatar-3.png",
    },
    {
      id: 4,
      name: "赵强",
      position: "销售代表",
      department: "销售部",
      startDate: "2023-12-18",
      progress: 8,
      status: "进行中",
      tasks: {
        completed: 1,
        total: 12,
      },
      avatar: "/avatars/avatar-4.png",
    },
    {
      id: 5,
      name: "刘洋",
      position: "财务分析师",
      department: "财务部",
      startDate: "2023-12-20",
      progress: 0,
      status: "未开始",
      tasks: {
        completed: 0,
        total: 12,
      },
      avatar: "/avatars/avatar-5.png",
    },
  ]

  const getProgressColor = (progress) => {
    if (progress < 30) return "bg-red-500"
    if (progress < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "进行中":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            进行中
          </Badge>
        )
      case "未开始":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            未开始
          </Badge>
        )
      case "已完成":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            已完成
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {onboardingEmployees.map((employee) => (
        <div key={employee.id} className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
            <AvatarFallback>{employee.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{employee.name}</span>
                {getStatusBadge(employee.status)}
              </div>
              <span className="text-sm text-muted-foreground">入职日期: {employee.startDate}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <span className="text-sm">
                {employee.position} · {employee.department}
              </span>
              <span className="text-sm">
                完成任务: {employee.tasks.completed}/{employee.tasks.total}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={employee.progress} className={`h-2 flex-1 ${getProgressColor(employee.progress)}`} />
              <span className="text-sm font-medium">{employee.progress}%</span>
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">操作菜单</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>操作</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>查看详情</DropdownMenuItem>
                <DropdownMenuItem>发送提醒</DropdownMenuItem>
                <DropdownMenuItem>分配导师</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>标记为完成</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
