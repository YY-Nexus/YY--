import {
  BarChart2,
  Users,
  DollarSign,
  Database,
  Heart,
  Compass,
  CreditCard,
  Cpu,
  BookOpen,
  Settings,
  Home,
  Shield,
  Activity,
} from "lucide-react"

export type NavItemType = {
  id: string
  title: string
  icon: any
  path?: string
  children?: NavItemType[]
}

export const navigationData: NavItemType[] = [
  {
    id: "organization",
    title: "组织治理中枢",
    icon: BarChart2,
    path: "/organization",
    children: [
      {
        id: "org-structure",
        title: "智能架构设计",
        icon: BarChart2,
        path: "/organization/structure",
      },
      {
        id: "org-3d-map",
        title: "三维组织图谱",
        icon: BarChart2,
        path: "/organization/3d-map",
      },
      {
        id: "org-ai-diagnosis",
        title: "AI架构健康度诊断",
        icon: BarChart2,
        path: "/organization/ai-diagnosis",
      },
      {
        id: "org-dynamic-model",
        title: "动态编制测算模型",
        icon: BarChart2,
        path: "/organization/dynamic-model",
      },
      {
        id: "org-permission-radar",
        title: "权限冲突雷达监测",
        icon: BarChart2,
        path: "/organization/permission-radar",
      },
      {
        id: "org-digital-twin",
        title: "组织效能数字孪生",
        icon: BarChart2,
        path: "/organization/digital-twin",
      },
    ],
  },
  {
    id: "employee-lifecycle",
    title: "员工全周期管理",
    icon: Users,
    path: "/employee-lifecycle",
    children: [
      {
        id: "employee-onboarding",
        title: "数字化入职体验",
        icon: Users,
        path: "/employee-lifecycle/onboarding",
      },
      {
        id: "employee-development",
        title: "在职发展矩阵",
        icon: Users,
        path: "/employee-lifecycle/development",
      },
      {
        id: "employee-offboarding",
        title: "智能离职分析",
        icon: Users,
        path: "/employee-lifecycle/offboarding",
      },
    ],
  },
  {
    id: "compensation",
    title: "薪酬绩效引擎",
    icon: DollarSign,
    path: "/compensation",
    children: [
      {
        id: "compensation-system",
        title: "智能薪酬体系",
        icon: DollarSign,
        path: "/compensation/system",
      },
      {
        id: "performance-cockpit",
        title: "绩效驾驶舱",
        icon: DollarSign,
        path: "/compensation/performance",
      },
      {
        id: "equity-incentive",
        title: "股权激励沙盘",
        icon: DollarSign,
        path: "/compensation/equity",
      },
    ],
  },
  {
    id: "data-decision",
    title: "数据决策中心",
    icon: Database,
    path: "/data-decision",
    children: [
      {
        id: "human-capital",
        title: "人力资本分析",
        icon: Database,
        path: "/data-decision/human-capital",
      },
      {
        id: "intelligent-bi",
        title: "智能BI工坊",
        icon: Database,
        path: "/data-decision/bi",
      },
      {
        id: "data-governance",
        title: "数据治理平台",
        icon: Database,
        path: "/data-decision/governance",
      },
    ],
  },
  {
    id: "employee-experience",
    title: "员工体验工场",
    icon: Heart,
    path: "/employee-experience",
    children: [
      {
        id: "care-center",
        title: "智能关怀中心",
        icon: Heart,
        path: "/employee-experience/care",
      },
      {
        id: "honor-growth",
        title: "荣誉成长体系",
        icon: Heart,
        path: "/employee-experience/honor",
      },
      {
        id: "social-community",
        title: "社交互动社区",
        icon: Heart,
        path: "/employee-experience/social",
      },
    ],
  },
  {
    id: "strategic-planning",
    title: "战略规划实验室",
    icon: Compass,
    path: "/strategic-planning",
    children: [
      {
        id: "talent-strategy",
        title: "人才战略沙盘",
        icon: Compass,
        path: "/strategic-planning/talent",
      },
      {
        id: "org-change",
        title: "组织变革模拟器",
        icon: Compass,
        path: "/strategic-planning/change",
      },
    ],
  },
  {
    id: "financial-control",
    title: "财务管控中枢",
    icon: CreditCard,
    path: "/financial-control",
    children: [
      {
        id: "budget-management",
        title: "智能预算管理",
        icon: CreditCard,
        path: "/financial-control/budget",
      },
      {
        id: "compliance-audit",
        title: "合规审计中心",
        icon: CreditCard,
        path: "/financial-control/audit",
      },
    ],
  },
  {
    id: "intelligent-process",
    title: "智能流程工厂",
    icon: Cpu,
    path: "/intelligent-process",
    children: [
      {
        id: "rpa-automation",
        title: "RPA流程自动化",
        icon: Cpu,
        path: "/intelligent-process/rpa",
      },
      {
        id: "blockchain-center",
        title: "区块链存证中心",
        icon: Cpu,
        path: "/intelligent-process/blockchain",
      },
    ],
  },
  {
    id: "learning-innovation",
    title: "学习创新平台",
    icon: BookOpen,
    path: "/learning-innovation",
    children: [
      {
        id: "knowledge-graph",
        title: "智能知识图谱",
        icon: BookOpen,
        path: "/learning-innovation/knowledge",
      },
      {
        id: "metaverse-training",
        title: "元宇宙培训空间",
        icon: BookOpen,
        path: "/learning-innovation/metaverse",
      },
    ],
  },
  {
    id: "system-config",
    title: "系统配置中心",
    icon: Settings,
    path: "/system-config",
    children: [
      {
        id: "low-code",
        title: "低代码开发平台",
        icon: Settings,
        path: "/system-config/low-code",
      },
      {
        id: "digital-twin",
        title: "数字孪生监控",
        icon: Settings,
        path: "/system-config/digital-twin",
      },
    ],
  },
  {
    id: "life-services",
    title: "生活服务生态",
    icon: Home,
    path: "/life-services",
    children: [
      {
        id: "family-services",
        title: "家庭服务枢纽",
        icon: Home,
        path: "/life-services/family",
      },
      {
        id: "health-management",
        title: "健康管理中心",
        icon: Home,
        path: "/life-services/health",
      },
    ],
  },
  {
    id: "compliance-risk",
    title: "合规风控要塞",
    icon: Shield,
    path: "/compliance-risk",
    children: [
      {
        id: "labor-law",
        title: "劳动法务智库",
        icon: Shield,
        path: "/compliance-risk/labor-law",
      },
      {
        id: "data-security",
        title: "数据安全盾牌",
        icon: Shield,
        path: "/compliance-risk/data-security",
      },
    ],
  },
  {
    id: "approvals",
    title: "审批",
    icon: Shield,
    path: "/approvals",
  },
  {
    id: "scheduling",
    title: "排班",
    icon: Shield,
    path: "/scheduling",
  },
  {
    id: "meetings",
    title: "会议",
    icon: Shield,
    path: "/meetings/new",
  },
  {
    id: "archives",
    title: "档案",
    icon: Shield,
    path: "/archives",
  },
  {
    id: "incentives",
    title: "激励",
    icon: Shield,
    path: "/incentives",
  },
  {
    id: "reports",
    title: "报告",
    icon: Shield,
    path: "/reports",
  },
  {
    id: "system-monitor",
    title: "系统监控中心",
    icon: Activity, // 需要导入Activity图标
    path: "/system-monitor",
  },
]
