"use client"

import type React from "react"

import { useState } from "react"
import { Search, Star, StarOff, Filter, Download, Clock, ThumbsUp, BookmarkPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface IndustryTemplateSelectorProps {
  className?: string
  onSelectTemplate?: (template: any) => void
}

export function IndustryTemplateSelector({ className, onSelectTemplate }: IndustryTemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)
  const [activeTab, setActiveTab] = useState("templates")

  // 模拟行业列表
  const industries = [
    { id: "manufacturing", name: "制造业", templates: 12 },
    { id: "retail", name: "零售业", templates: 8 },
    { id: "technology", name: "科技行业", templates: 10 },
    { id: "finance", name: "金融服务", templates: 15 },
    { id: "healthcare", name: "医疗健康", templates: 9 },
    { id: "realestate", name: "房地产", templates: 7 },
    { id: "energy", name: "能源行业", templates: 6 },
    { id: "education", name: "教育行业", templates: 5 },
    { id: "hospitality", name: "酒店餐饮", templates: 4 },
    { id: "logistics", name: "物流运输", templates: 8 },
    { id: "agriculture", name: "农业", templates: 6 },
    { id: "construction", name: "建筑业", templates: 7 },
  ]

  // 模拟模板数据
  const templates = [
    {
      id: "mfg-001",
      name: "制造业综合分析模板",
      industry: "manufacturing",
      description: "适用于制造企业的综合财务分析模板，包含生产成本分析、库存周转分析等",
      metrics: ["毛利率", "库存周转率", "生产效率", "设备利用率", "质量成本率"],
      popularity: 4.8,
      downloads: 1250,
      isFavorite: true,
      lastUpdated: "2024-04-15",
    },
    {
      id: "mfg-002",
      name: "制造业成本控制模板",
      industry: "manufacturing",
      description: "专注于制造业成本控制的分析模板，包含详细的成本分解和优化建议",
      metrics: ["直接材料成本率", "直接人工成本率", "制造费用率", "单位产品成本", "成本节约率"],
      popularity: 4.6,
      downloads: 980,
      isFavorite: false,
      lastUpdated: "2024-03-22",
    },
    {
      id: "mfg-003",
      name: "制造业供应链分析模板",
      industry: "manufacturing",
      description: "分析制造业供应链效率和成本的专用模板，包含供应商评估和物流分析",
      metrics: ["供应商交付及时率", "采购成本节约", "物流成本率", "供应链周期时间", "库存水平"],
      popularity: 4.5,
      downloads: 850,
      isFavorite: true,
      lastUpdated: "2024-02-18",
    },
    {
      id: "ret-001",
      name: "零售业销售分析模板",
      industry: "retail",
      description: "适用于零售企业的销售分析模板，包含销售趋势、客户分析和库存管理",
      metrics: ["同店销售增长率", "客单价", "库存周转率", "毛利率", "促销效果"],
      popularity: 4.7,
      downloads: 1120,
      isFavorite: false,
      lastUpdated: "2024-04-05",
    },
    {
      id: "ret-002",
      name: "零售业客户忠诚度分析",
      industry: "retail",
      description: "分析零售客户忠诚度和购买行为的专用模板，包含会员分析和复购率",
      metrics: ["客户留存率", "复购率", "会员贡献率", "客户终身价值", "推荐率"],
      popularity: 4.4,
      downloads: 780,
      isFavorite: true,
      lastUpdated: "2024-03-12",
    },
    {
      id: "tech-001",
      name: "科技公司SaaS指标模板",
      industry: "technology",
      description: "适用于SaaS科技公司的关键指标分析模板，包含订阅收入和客户获取成本分析",
      metrics: ["月度经常性收入(MRR)", "客户获取成本(CAC)", "终身价值(LTV)", "流失率", "扩张收入率"],
      popularity: 4.9,
      downloads: 1580,
      isFavorite: true,
      lastUpdated: "2024-04-20",
    },
    {
      id: "tech-002",
      name: "科技公司研发效率分析",
      industry: "technology",
      description: "分析科技公司研发投入和效率的专用模板，包含项目进度和资源分配",
      metrics: ["研发投入比例", "新产品收入贡献", "专利申请数", "研发周期时间", "研发投资回报率"],
      popularity: 4.5,
      downloads: 920,
      isFavorite: false,
      lastUpdated: "2024-03-08",
    },
    {
      id: "fin-001",
      name: "银行业绩效分析模板",
      industry: "finance",
      description: "适用于银行的综合绩效分析模板，包含资产质量、盈利能力和风险管理",
      metrics: ["净息差", "不良贷款率", "资本充足率", "成本收入比", "流动性覆盖率"],
      popularity: 4.8,
      downloads: 1350,
      isFavorite: false,
      lastUpdated: "2024-04-10",
    },
    {
      id: "fin-002",
      name: "保险公司分析模板",
      industry: "finance",
      description: "适用于保险公司的专用分析模板，包含承保利润、理赔率和投资收益",
      metrics: ["综合成本率", "理赔率", "保费增长率", "投资收益率", "偿付能力充足率"],
      popularity: 4.6,
      downloads: 980,
      isFavorite: true,
      lastUpdated: "2024-03-25",
    },
    {
      id: "health-001",
      name: "医院运营分析模板",
      industry: "healthcare",
      description: "适用于医院的运营和财务分析模板，包含床位利用率、平均住院日和收入分析",
      metrics: ["床位利用率", "平均住院日", "病人满意度", "医疗收入结构", "成本控制效率"],
      popularity: 4.7,
      downloads: 1050,
      isFavorite: false,
      lastUpdated: "2024-04-08",
    },
  ]

  // 过滤模板
  const filteredTemplates = templates.filter((template) => {
    // 行业过滤
    if (selectedIndustry && template.industry !== selectedIndustry) {
      return false
    }

    // 收藏过滤
    if (showFavorites && !template.isFavorite) {
      return false
    }

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.metrics.some((metric) => metric.toLowerCase().includes(query))
      )
    }

    return true
  })

  // 处理模板选择
  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template)
    if (onSelectTemplate) {
      onSelectTemplate(template)
    }
  }

  // 切换收藏状态
  const toggleFavorite = (templateId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const updatedTemplates = templates.map((template) => {
      if (template.id === templateId) {
        return { ...template, isFavorite: !template.isFavorite }
      }
      return template
    })
    // 在实际应用中，这里应该调用API来更新收藏状态
    console.log(
      "收藏状态已更新",
      updatedTemplates.find((t) => t.id === templateId),
    )
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索行业模板..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFavorites(!showFavorites)}
          className={showFavorites ? "bg-primary/10" : ""}
        >
          {showFavorites ? <Star className="h-4 w-4 text-primary" /> : <StarOff className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="templates" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">模板库</TabsTrigger>
          <TabsTrigger value="industries">行业分类</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                    selectedTemplate?.id === template.id ? "border-primary/70 shadow-md" : "",
                  )}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mt-1 -mr-2"
                        onClick={(e) => toggleFavorite(template.id, e)}
                      >
                        {template.isFavorite ? (
                          <Star className="h-4 w-4 text-primary fill-primary" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CardDescription className="line-clamp-2 h-10">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {template.metrics.slice(0, 3).map((metric, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                      {template.metrics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.metrics.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between">
                    <div className="flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      {template.downloads}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {template.popularity}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {template.lastUpdated}
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {filteredTemplates.length === 0 && (
                <div className="col-span-2 py-8 text-center text-muted-foreground">
                  未找到匹配的模板。请尝试调整搜索条件。
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="industries" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-1">
              {industries.map((industry) => (
                <Card
                  key={industry.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                    selectedIndustry === industry.id ? "border-primary/70 shadow-md" : "",
                  )}
                  onClick={() => {
                    setSelectedIndustry(industry.id === selectedIndustry ? null : industry.id)
                    setActiveTab("templates")
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-base flex justify-between">
                      {industry.name}
                      <Badge variant="outline">{industry.templates}</Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {selectedTemplate && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">已选模板</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <BookmarkPlus className="h-4 w-4 mr-1" />
                保存
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-1" />
                应用模板
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
        </div>
      )}
    </div>
  )
}
