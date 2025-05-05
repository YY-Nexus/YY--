import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight } from "lucide-react"

export function EfficiencyRecommendations() {
  const recommendations = [
    {
      title: "优化内部审批流程",
      description: "当前内部审批流程效率较低，建议简化审批层级，引入并行审批机制",
      impact: "高",
      effort: "中",
    },
    {
      title: "加强跨部门协作",
      description: "研发与市场部门协作效率偏低，建议建立定期协调会议和共享工作空间",
      impact: "中",
      effort: "低",
    },
    {
      title: "提升创新能力",
      description: "组织创新能力低于行业平均，建议设立创新激励机制和专项创新基金",
      impact: "高",
      effort: "高",
    },
    {
      title: "优化人力资源配置",
      description: "人力资源部门效能偏低，建议增加招聘专员并引入智能化招聘工具",
      impact: "中",
      effort: "中",
    },
  ]

  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <div key={index} className="space-y-2 pb-3 border-b last:border-0">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">{rec.title}</h4>
              <p className="text-xs text-muted-foreground">{rec.description}</p>
            </div>
          </div>
          <div className="flex justify-between text-xs pl-7">
            <span>
              影响: <span className="font-medium">{rec.impact}</span>
            </span>
            <span>
              难度: <span className="font-medium">{rec.effort}</span>
            </span>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
        <span>查看更多建议</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
