import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, HelpCircle, TrendingDown, TrendingUp } from "lucide-react"

export function OrganizationAIInsights() {
  const insights = [
    {
      type: "strength",
      icon: CheckCircle,
      title: "扁平化管理结构",
      description: "当前组织结构保持在5个层级以内，有利于信息传递和决策效率",
      impact: "高",
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "研发部门管理跨度过大",
      description: "研发部门主管直接管理12名员工，超过了理想的1:8管理跨度比例",
      impact: "中",
    },
    {
      type: "opportunity",
      icon: TrendingUp,
      title: "市场部门结构优化空间",
      description: "市场部门可考虑按产品线或区域进行细分，提升专业化程度",
      impact: "中",
    },
    {
      type: "risk",
      icon: TrendingDown,
      title: "人力资源部门人员配置不足",
      description: "当前人力资源部门配置3人，按照组织规模建议增加至少1名招聘专员",
      impact: "高",
    },
    {
      type: "info",
      icon: HelpCircle,
      title: "财务部门结构合理",
      description: "财务部门的组织结构与当前业务规模匹配，无需调整",
      impact: "低",
    },
  ]

  const typeColors = {
    strength: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    opportunity: "bg-blue-100 text-blue-800",
    risk: "bg-red-100 text-red-800",
    info: "bg-gray-100 text-gray-800",
  }

  const typeLabels = {
    strength: "优势",
    warning: "警告",
    opportunity: "机会",
    risk: "风险",
    info: "信息",
  }

  const impactColors = {
    高: "bg-red-100 text-red-800",
    中: "bg-yellow-100 text-yellow-800",
    低: "bg-green-100 text-green-800",
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4 flex gap-4">
            <div className={`rounded-full p-2 h-fit ${typeColors[insight.type]}`}>
              <insight.icon className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{insight.title}</h4>
                <Badge variant="outline" className={typeColors[insight.type]}>
                  {typeLabels[insight.type]}
                </Badge>
                <Badge variant="outline" className={impactColors[insight.impact]}>
                  影响: {insight.impact}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="text-center text-sm text-muted-foreground mt-2">
        基于组织架构数据和行业最佳实践的AI分析，更新于2023年12月15日
      </div>
    </div>
  )
}
