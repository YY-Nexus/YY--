import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function OnboardingTasks() {
  const tasks = [
    {
      id: 1,
      title: "审核张明的入职资料",
      dueDate: "今天",
      priority: "高",
      completed: false,
    },
    {
      id: 2,
      title: "为李华准备工作电脑",
      dueDate: "明天",
      priority: "中",
      completed: false,
    },
    {
      id: 3,
      title: "安排王芳的入职培训",
      dueDate: "后天",
      priority: "中",
      completed: false,
    },
    {
      id: 4,
      title: "分配赵强的工作账号",
      dueDate: "12月19日",
      priority: "低",
      completed: false,
    },
    {
      id: 5,
      title: "准备刘洋的入职礼包",
      dueDate: "12月19日",
      priority: "低",
      completed: true,
    },
  ]

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "高":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            高
          </Badge>
        )
      case "中":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            中
          </Badge>
        )
      case "低":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            低
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start gap-2 pb-3 border-b last:border-0 last:pb-0">
          <Checkbox id={`task-${task.id}`} checked={task.completed} />
          <div className="flex-1 min-w-0">
            <label
              htmlFor={`task-${task.id}`}
              className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {task.title}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">截止: {task.dueDate}</span>
              {getPriorityBadge(task.priority)}
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
        <span>查看全部任务</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
