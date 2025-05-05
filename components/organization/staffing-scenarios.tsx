"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Download } from "lucide-react"

export function StaffingScenarios() {
  const scenarios = [
    {
      id: "baseline",
      name: "基准方案",
      description: "基于当前业务增长趋势的标准人力配置",
      headcount: 178,
      change: "+22",
      costImpact: "+14.1%",
      riskLevel: "中",
      recommendations: [
        "研发部门增加8名工程师",
        "市场部门增加6名专员",
        "销售部门增加4名销售代表",
        "其他部门增加4名员工",
      ],
    },
    {
      id: "conservative",
      name: "保守方案",
      description: "考虑市场不确定性的谨慎人力配置",
      headcount: 168,
      change: "+12",
      costImpact: "+7.7%",
      riskLevel: "低",
      recommendations: [
        "研发部门增加5名工程师",
        "市场部门增加3名专员",
        "销售部门增加2名销售代表",
        "其他部门增加2名员工",
      ],
    },
    {
      id: "aggressive",
      name: "积极方案",
      description: "为快速业务扩张准备的人力配置",
      headcount: 190,
      change: "+34",
      costImpact: "+21.8%",
      riskLevel: "高",
      recommendations: [
        "研发部门增加12名工程师",
        "市场部门增加10名专员",
        "销售部门增加8名销售代表",
        "其他部门增加4名员工",
      ],
    },
    {
      id: "optimized",
      name: "优化方案",
      description: "结合流程优化和自动化的高效人力配置",
      headcount: 172,
      change: "+16",
      costImpact: "+10.3%",
      riskLevel: "中",
      recommendations: [
        "研发部门增加7名工程师",
        "市场部门增加5名专员",
        "销售部门增加3名销售代表",
        "其他部门增加1名员工",
        "引入2个RPA流程自动化项目",
        "优化3个关键业务流程",
      ],
    },
  ]

  const getRiskBadge = (level) => {
    switch (level) {
      case "高":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            高风险
          </Badge>
        )
      case "中":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            中风险
          </Badge>
        )
      case "低":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            低风险
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Tabs defaultValue="baseline">
      <TabsList className="grid w-full grid-cols-4">
        {scenarios.map((scenario) => (
          <TabsTrigger key={scenario.id} value={scenario.id}>
            {scenario.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {scenarios.map((scenario) => (
        <TabsContent key={scenario.id} value={scenario.id} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3 space-y-4">
              <div>
                <h3 className="text-lg font-medium">{scenario.name}</h3>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">配置建议</h4>
                <ul className="space-y-1">
                  {scenario.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button size="sm">应用此方案</Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  <span>导出详情</span>
                </Button>
              </div>
            </div>

            <div className="md:w-1/3 space-y-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">总人数</span>
                  <span className="font-medium">{scenario.headcount}人</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">净增加</span>
                  <span className="font-medium text-green-500">{scenario.change}人</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">成本影响</span>
                  <span className="font-medium text-green-500">{scenario.costImpact}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">风险等级</span>
                  <span>{getRiskBadge(scenario.riskLevel)}</span>
                </div>
              </div>

              <Button variant="link" size="sm" className="gap-1 w-full justify-center">
                <span>查看详细分析</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
