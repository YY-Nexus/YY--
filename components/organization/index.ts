import {
  createDynamicComponent,
  DefaultCardSkeleton,
  DefaultChartSkeleton,
  DefaultTableSkeleton,
} from "@/lib/dynamic-import"

// 动态导入组织结构组件
export const OrganizationStructure = createDynamicComponent(() => import("./organization-structure"), {
  loading: DefaultCardSkeleton,
  suspense: true,
})

// 动态导入组织图表组件
export const OrganizationChart = createDynamicComponent(() => import("./organization-chart"), {
  loading: DefaultChartSkeleton,
  suspense: true,
})

// 动态导入组织表格组件
export const OrganizationTable = createDynamicComponent(() => import("./organization-table"), {
  loading: DefaultTableSkeleton,
  suspense: true,
})

// 动态导入组织统计组件
export const OrganizationStats = createDynamicComponent(() => import("./organization-stats"), {
  loading: DefaultCardSkeleton,
  suspense: true,
})

// 动态导入组织AI洞察组件
export const OrganizationAIInsights = createDynamicComponent(() => import("./organization-ai-insights"), {
  loading: DefaultCardSkeleton,
  suspense: true,
})

// 动态导入组织效率组件
export const OrganizationEfficiency = createDynamicComponent(() => import("./organization-efficiency"), {
  loading: DefaultCardSkeleton,
  suspense: true,
})
