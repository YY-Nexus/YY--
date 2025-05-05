"use client"

import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function EfficiencyMetrics() {
  const metrics = {
    overall: [
      { name: "决策效率", value: 82, target: 90, status: "warning" },
      { name: "沟通效率", value: 76, target: 85, status: "warning" },
      { name: "执行效率", value: 88, target: 85, status: "success" },
      { name: "创新能力", value: 65, target: 80, status: "danger" },
      { name: "资源利用率", value: 79, target: 85, status: "warning" },
    ],
    department: [
      { name: "研发部门", value: 85, target: 90, status: "warning" },
      { name: "市场部门", value: 72, target: 80, status: "warning" },
      { name: "销售部门", value: 91, target: 85, status: "success" },
      { name: "人力资源", value: 68, target: 75, status: "warning" },
      { name: "财务部门", value: 82, target: 80, status: "success" },
    ],
    process: [
      { name: "产品开发流程", value: 77, target: 85, status: "warning" },
      { name: "客户服务流程", value: 89, target: 90, status: "warning" },
      { name: "内部审批流程", value: 62, target: 80, status: "danger" },
      { name: "人才招聘流程", value: 71, target: 75, status: "warning" },
      { name: "财务报表流程", value: 86, target: 85, status: "success" },
    ],
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "danger":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Tabs defaultValue="overall">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overall">整体效能</TabsTrigger>
        <TabsTrigger value="department">部门效能</TabsTrigger>
        <TabsTrigger value="process">流程效能</TabsTrigger>
      </TabsList>

      {Object.keys(metrics).map((key) => (
        <TabsContent key={key} value={key} className="space-y-4">
          {metrics[key].map((metric, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>{metric.name}</span>
                <span className="font-medium">
                  {metric.value}% / 目标 {metric.target}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={metric.value} className="h-2" />
                <span className={`h-2 w-2 rounded-full ${getStatusColor(metric.status)}`}></span>
              </div>
            </div>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}
