// 移动应用配置

// 移动应用模块配置
export interface MobileModuleConfig {
  id: string
  name: string
  icon: string
  route: string
  enabled: boolean
  permissions: string[]
  features: MobileFeatureConfig[]
  offlineSupport: boolean
  syncPriority: number
}

// 移动应用功能配置
export interface MobileFeatureConfig {
  id: string
  name: string
  route: string
  enabled: boolean
  permissions: string[]
}

// 移动应用通知配置
export interface MobileNotificationConfig {
  enabled: boolean
  categories: {
    id: string
    name: string
    enabled: boolean
  }[]
  quietHours: {
    enabled: boolean
    start: string
    end: string
    days: number[]
  }
}

// 移动应用同步配置
export interface MobileSyncConfig {
  autoSync: boolean
  syncInterval: number // 分钟
  syncOnWifiOnly: boolean
  maxOfflineDays: number
  dataTypes: {
    id: string
    name: string
    enabled: boolean
    priority: number
  }[]
}

// 移动应用安全配置
export interface MobileSecurityConfig {
  biometricAuth: boolean
  pinCodeRequired: boolean
  pinCodeLength: number
  autoLockTimeout: number // 分钟
  maxFailedAttempts: number
  encryptedStorage: boolean
  secureDataTransfer: boolean
}

// 移动应用配置
export interface MobileAppConfig {
  modules: MobileModuleConfig[]
  notifications: MobileNotificationConfig
  sync: MobileSyncConfig
  security: MobileSecurityConfig
  appearance: {
    theme: "light" | "dark" | "system"
    primaryColor: string
    accentColor: string
    fontScale: number
  }
  performance: {
    imageQuality: "low" | "medium" | "high"
    animationsEnabled: boolean
    prefetchData: boolean
  }
}

// 默认移动应用配置
export const defaultMobileAppConfig: MobileAppConfig = {
  modules: [
    {
      id: "dashboard",
      name: "仪表盘",
      icon: "dashboard",
      route: "/dashboard",
      enabled: true,
      permissions: ["dashboard:view"],
      features: [
        {
          id: "key-metrics",
          name: "关键指标",
          route: "/dashboard/key-metrics",
          enabled: true,
          permissions: ["dashboard:view"],
        },
        {
          id: "recent-activities",
          name: "最近活动",
          route: "/dashboard/activities",
          enabled: true,
          permissions: ["dashboard:view"],
        },
      ],
      offlineSupport: true,
      syncPriority: 1,
    },
    {
      id: "employees",
      name: "员工管理",
      icon: "users",
      route: "/employees",
      enabled: true,
      permissions: ["employees:view"],
      features: [
        {
          id: "employee-directory",
          name: "员工目录",
          route: "/employees/directory",
          enabled: true,
          permissions: ["employees:view"],
        },
        {
          id: "employee-details",
          name: "员工详情",
          route: "/employees/[id]",
          enabled: true,
          permissions: ["employees:view"],
        },
        {
          id: "employee-onboarding",
          name: "入职管理",
          route: "/employees/onboarding",
          enabled: true,
          permissions: ["employees:manage"],
        },
      ],
      offlineSupport: true,
      syncPriority: 2,
    },
    {
      id: "approvals",
      name: "审批",
      icon: "check-square",
      route: "/approvals",
      enabled: true,
      permissions: ["approvals:view"],
      features: [
        {
          id: "my-approvals",
          name: "我的审批",
          route: "/approvals/my",
          enabled: true,
          permissions: ["approvals:view"],
        },
        {
          id: "pending-approvals",
          name: "待我审批",
          route: "/approvals/pending",
          enabled: true,
          permissions: ["approvals:approve"],
        },
        {
          id: "approval-history",
          name: "审批历史",
          route: "/approvals/history",
          enabled: true,
          permissions: ["approvals:view"],
        },
      ],
      offlineSupport: false,
      syncPriority: 3,
    },
    {
      id: "reports",
      name: "报表",
      icon: "bar-chart",
      route: "/reports",
      enabled: true,
      permissions: ["reports:view"],
      features: [
        {
          id: "my-reports",
          name: "我的报表",
          route: "/reports/my",
          enabled: true,
          permissions: ["reports:view"],
        },
        {
          id: "shared-reports",
          name: "共享报表",
          route: "/reports/shared",
          enabled: true,
          permissions: ["reports:view"],
        },
      ],
      offlineSupport: true,
      syncPriority: 4,
    },
    {
      id: "notifications",
      name: "通知",
      icon: "bell",
      route: "/notifications",
      enabled: true,
      permissions: ["notifications:view"],
      features: [
        {
          id: "all-notifications",
          name: "所有通知",
          route: "/notifications/all",
          enabled: true,
          permissions: ["notifications:view"],
        },
        {
          id: "notification-settings",
          name: "通知设置",
          route: "/notifications/settings",
          enabled: true,
          permissions: ["notifications:manage"],
        },
      ],
      offlineSupport: true,
      syncPriority: 5,
    },
  ],
  notifications: {
    enabled: true,
    categories: [
      { id: "approvals", name: "审批通知", enabled: true },
      { id: "tasks", name: "任务通知", enabled: true },
      { id: "system", name: "系统通知", enabled: true },
      { id: "reports", name: "报表通知", enabled: true },
    ],
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
      days: [0, 6], // 周日和周六
    },
  },
  sync: {
    autoSync: true,
    syncInterval: 15, // 15分钟
    syncOnWifiOnly: false,
    maxOfflineDays: 7,
    dataTypes: [
      { id: "employees", name: "员工数据", enabled: true, priority: 1 },
      { id: "approvals", name: "审批数据", enabled: true, priority: 2 },
      { id: "reports", name: "报表数据", enabled: true, priority: 3 },
      { id: "notifications", name: "通知数据", enabled: true, priority: 4 },
    ],
  },
  security: {
    biometricAuth: true,
    pinCodeRequired: true,
    pinCodeLength: 6,
    autoLockTimeout: 5, // 5分钟
    maxFailedAttempts: 5,
    encryptedStorage: true,
    secureDataTransfer: true,
  },
  appearance: {
    theme: "system",
    primaryColor: "#3b82f6",
    accentColor: "#10b981",
    fontScale: 1.0,
  },
  performance: {
    imageQuality: "medium",
    animationsEnabled: true,
    prefetchData: true,
  },
}
