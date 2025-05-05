import type { Metadata } from "next"
import { AIInsights } from "@/components/ai-analysis/ai-insights"
import { NLQuery } from "@/components/ai-analysis/nl-query"
import { PredictionChart } from "@/components/ai-analysis/prediction-chart"
import { AnomalyDetection } from "@/components/ai-analysis/anomaly-detection"
import { Recommendations } from "@/components/ai-analysis/recommendations"
import { AnalysisReport } from "@/components/ai-analysis/analysis-report"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, FileText, AlertTriangle, TrendingUp, CheckCircle, Download } from "lucide-react"

export const metadata: Metadata = {
  title: "AI分析中心",
  description: "智能数据分析与决策支持",
}

// 模拟数据
const mockInsights = [
  {
    type: "trend",
    timestamp: "2023-12-15T08:30:00Z",
    data: {},
    insights: [
      "员工流失率在过去3个月呈下降趋势，从8.5%降至6.2%",
      "研发部门的流失率降幅最大，从12.3%降至7.1%",
      "流失率下降与最近实施的弹性工作制和薪酬调整政策相关",
    ],
    confidence: 0.85,
    metadata: {
      dataPoints: 90,
      algorithm: "线性回归",
      executionTime: 120,
      version: "1.0.0",
    },
  },
  {
    type: "anomaly",
    timestamp: "2023-12-14T10:15:00Z",
    data: {},
    insights: [
      "销售部门11月绩效评分异常低，偏离均值2.3个标准差",
      "异常值可能与季节性销售周期和市场波动有关",
      "建议关注销售团队的绩效支持和激励措施",
    ],
    confidence: 0.78,
    metadata: {
      dataPoints: 120,
      algorithm: "Z-score异常检测",
      executionTime: 85,
      version: "1.0.0",
    },
  },
  {
    type: "prediction",
    timestamp: "2023-12-13T14:45:00Z",
    data: {},
    insights: [
      "预测未来6个月招聘需求将增加15%，主要集中在技术和销售岗位",
      "基于业务增长和历史招聘模式的预测准确率为82%",
      "建议提前规划招聘资源和渠道，确保人才供应",
    ],
    confidence: 0.82,
    metadata: {
      dataPoints: 180,
      algorithm: "时间序列预测",
      executionTime: 150,
      version: "1.0.0",
    },
  },
  {
    type: "recommendation",
    timestamp: "2023-12-12T09:20:00Z",
    data: {},
    insights: [
      "基于员工满意度调查和离职面谈数据，建议优化职业发展通道",
      "实施导师计划可能提高员工敬业度和保留率",
      "调整绩效评估频率，从年度改为季度，有助于及时反馈和改进",
    ],
    confidence: 0.88,
    metadata: {
      dataPoints: 250,
      algorithm: "规则引擎+专家系统",
      executionTime: 110,
      version: "1.0.0",
    },
  },
]

// 模拟预测数据
const mockPredictionData = {
  historical: Array.from({ length: 24 }, (_, i) => ({
    x: i,
    y: 100 + Math.sin(i * 0.5) * 20 + i * 2 + Math.random() * 10,
    date: new Date(2022, i, 1).toISOString(),
  })),
  predictions: Array.from({ length: 6 }, (_, i) => ({
    period: i + 1,
    value: 148 + (i + 1) * 3 + Math.sin((i + 24) * 0.5) * 20 + Math.random() * 5,
    date: new Date(2024, i, 1).toISOString(),
  })),
  accuracy: 0.82,
  mape: 0.09,
}

// 模拟异常检测数据
const mockAnomalyData = {
  mean: 100,
  stdDev: 15,
  threshold: 2,
  anomalies: [
    {
      value: 145,
      date: "2023-04-15T00:00:00Z",
      deviation: 3.0,
    },
    {
      value: 60,
      date: "2023-08-10T00:00:00Z",
      deviation: -2.7,
    },
    {
      value: 150,
      date: "2023-11-05T00:00:00Z",
      deviation: 3.3,
    },
  ],
  distribution: {
    mean: 100,
    upperBound: 130,
    lowerBound: 70,
  },
}

// 模拟时间序列数据
const mockTimeSeriesData = Array.from({ length: 24 }, (_, i) => ({
  date: new Date(2023, i, 1).toISOString(),
  value: 100 + Math.sin(i * 0.5) * 20 + Math.random() * 15,
}))

// 模拟推荐数据
const mockRecommendations = [
  {
    id: "rec_1",
    title: "优化绩效反馈流程",
    description: "将绩效反馈频率从年度调整为季度，增加一对一面谈，提供更及时的反馈和指导",
    impact: "高",
    effort: "中",
    priority: 1,
  },
  {
    id: "rec_2",
    title: "实施弹性工作制",
    description: "允许员工在核心工作时间外灵活安排工作时间，提高工作-生活平衡和满意度",
    impact: "中",
    effort: "低",
    priority: 2,
  },
  {
    id: "rec_3",
    title: "优化内部晋升通道",
    description: "明确各岗位的晋升路径和标准，增加内部晋升比例，提高员工发展机会",
    impact: "高",
    effort: "高",
    priority: 3,
  },
  {
    id: "rec_4",
    title: "技能发展计划",
    description: "基于业务需求和员工发展意愿，制定个性化的技能发展计划和培训项目",
    impact: "中",
    effort: "中",
    priority: 4,
  },
  {
    id: "rec_5",
    title: "优化薪酬结构",
    description: "调整固定薪酬与绩效奖金的比例，增加长期激励计划，提高薪酬竞争力",
    impact: "高",
    effort: "高",
    priority: 5,
  },
]

// 模拟报告数据
const mockReport = {
  title: "人才保留分析报告",
  summary:
    "本报告提供了组织人才保留的全面分析，包括离职率趋势、风险分群、离职原因和满意度相关性，以及相应的保留策略建议。基于过去3个月的数据，我们发现整体离职率呈下降趋势，但技术岗位仍存在较高风险。",
  sections: [
    {
      title: "离职率趋势分析",
      content: "本节分析了2023年9月15日至2023年12月15日期间的离职率变化趋势，包括总体离职率和自愿离职率。",
      visualizationType: "line-multi",
      visualizationData: {},
      insights: [
        "整体离职率从8.5%降至6.2%，降幅27%",
        "自愿离职率从6.8%降至5.1%，降幅25%",
        "非自愿离职率保持相对稳定，约1.1%",
      ],
    },
    {
      title: "离职风险分群",
      content: "本节将员工按离职风险等级分群，分析各风险群体的特征和分布。",
      visualizationType: "bar-and-pie",
      visualizationData: {},
      insights: [
        "高风险员工占比12%，主要集中在研发和销售部门",
        "中风险员工占比23%，分布相对均匀",
        "技术岗位的高风险比例是非技术岗位的2倍",
      ],
    },
    {
      title: "离职原因分析",
      content: "本节基于离职面谈数据，分析员工离职的主要原因及其分布。",
      visualizationType: "pie-with-details",
      visualizationData: {},
      insights: [
        "职业发展机会不足是最主要的离职原因，占比35%",
        "薪酬竞争力不足是第二大离职原因，占比28%",
        "工作-生活平衡问题占比18%，在年轻员工中尤为突出",
      ],
    },
    {
      title: "满意度与离职相关性",
      content: "本节分析了员工满意度与离职风险的相关性，帮助理解影响离职的关键因素。",
      visualizationType: "scatter",
      visualizationData: {},
      insights: [
        "员工满意度与离职风险呈强烈负相关，相关系数-0.78",
        "满意度低于6分(10分制)的员工离职风险显著增加",
        "管理关系满意度是影响总体满意度的最关键因素",
      ],
    },
    {
      title: "保留策略建议",
      content: "基于以上分析，本节提供了提高员工保留率的具体策略建议。",
      visualizationType: "card-list",
      visualizationData: {},
      insights: [],
      recommendations: [
        "优化职业发展通道：明确各岗位的职业发展路径，提供更多晋升和横向发展机会",
        "薪酬竞争力调整：进行市场薪酬调研，确保关键岗位薪酬保持市场竞争力",
        "管理者培训强化：为直线经理提供人才管理、沟通和辅导技能培训",
        "工作-生活平衡项目：实施弹性工作制和远程工作政策，提高员工工作-生活平衡",
        "针对性保留计划：为高���险、高价值员工制定个性化保留计划",
      ],
    },
  ],
  generatedAt: "2023-12-15T15:30:00Z",
  metadata: {
    dataPoints: 750,
    timeRange: {
      start: "2023-09-15T00:00:00Z",
      end: "2023-12-15T00:00:00Z",
    },
    version: "1.0.0",
  },
}

export default function AIAnalysisPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI分析中心</h1>
          <p className="text-muted-foreground">智能数据分析与决策支持</p>
        </div>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          生成分析报告
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <NLQuery />
        </div>
        <div>
          <AIInsights title="最新数据洞察" insights={mockInsights} />
        </div>
      </div>

      <Tabs defaultValue="predictions">
        <TabsList className="mb-4">
          <TabsTrigger value="predictions" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            预测分析
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            异常检测
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            智能推荐
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            分析报告
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PredictionChart
              title="员工数量预测"
              description="基于历史数据预测未来6个月的员工数量变化趋势"
              data={mockPredictionData}
              metricName="员工数"
            />
            <Card>
              <CardHeader>
                <CardTitle>预测分析说明</CardTitle>
                <CardDescription>了解AI预测分析的工作原理和应用场景</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  预测分析利用历史数据、统计算法和机器学习技术，预测未来可能发生的趋势和事件。在人力资源管理中，预测分析可以帮助：
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>预测未来的人员需求和招聘计划</li>
                  <li>识别潜在的离职风险，提前采取保留措施</li>
                  <li>预测绩效趋势和人才发展需求</li>
                  <li>优化人力资源预算和资源分配</li>
                </ul>
                <p>
                  系统使用多种预测模型，包括时间序列分析、回归分析和机器学习算法，根据数据特性自动选择最适合的模型。预测结果会显示置信区间和准确度评分，帮助您评估预测的可靠性。
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    导出预测数据
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnomalyDetection
              title="员工流失率异常检测"
              description="自动检测员工流失率数据中的异常值和模式"
              data={mockAnomalyData}
              timeSeriesData={mockTimeSeriesData}
              metricName="流失率"
            />
            <Card>
              <CardHeader>
                <CardTitle>异常检测说明</CardTitle>
                <CardDescription>了解AI异常检测的工作原理和应用场景</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  异常检测利用统计和机器学习技术，自动识别数据中偏离正常模式的异常值和行为。在人力资源管理中，异常检测可以帮助：
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>及时发现异常的离职率或招聘效率变化</li>
                  <li>识别薪酬数据中的异常值和不一致</li>
                  <li>检测绩效评估中的异常模式和偏差</li>
                  <li>监控员工满意度的异常波动</li>
                </ul>
                <p>
                  系统使用多种异常检测算法，包括统计方法（如Z-score、IQR）和机器学习方法（如隔离森林、单类SVM），根据数据特性自动选择最适合的算法。检测结果会显示异常的严重程度和可能的影响，帮助您快速响应潜在问题。
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    导出异常数据
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Recommendations
              title="人才保留策略建议"
              description="基于数据分析的人才保留策略智能推荐"
              recommendations={mockRecommendations}
              scenario="retention"
              onImplement={(id) => console.log("实施建议:", id)}
              onDismiss={(id) => console.log("忽略建议:", id)}
            />
            <Card>
              <CardHeader>
                <CardTitle>智能推荐说明</CardTitle>
                <CardDescription>了解AI推荐系统的工作原理和应用场景</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  智能推荐系统结合数据分析、专家知识和最佳实践，为特定场景提供针对性的建议和解决方案。在人力资源管理中，智能推荐可以帮助：
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>提供提高员工保留率的具体策略建议</li>
                  <li>推荐优化招聘流程和渠道的方法</li>
                  <li>建议改进绩效管理和薪酬体系的措施</li>
                  <li>提供员工发展和培训的个性化建议</li>
                </ul>
                <p>
                  系统基于多种数据源和分析结果，结合行业最佳实践和专家规则，生成针对性的建议。每条建议都包含影响评估和实施难度，帮助您优先考虑最有价值的改进机会。您可以采纳或忽略建议，系统会根据您的反馈不断优化推荐质量。
                </p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    导出建议报告
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <AnalysisReport report={mockReport} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
