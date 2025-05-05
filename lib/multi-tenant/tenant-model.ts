// 多租户数据模型定义

// 租户信息接口
export interface Tenant {
  id: string
  name: string
  domain: string
  plan: "basic" | "professional" | "enterprise"
  status: "active" | "inactive" | "suspended"
  createdAt: string
  updatedAt: string
  settings: TenantSettings
  customization: TenantCustomization
  features: TenantFeatures
}

// 租户设置接口
export interface TenantSettings {
  maxUsers: number
  maxStorage: number // 以MB为单位
  allowedModules: string[]
  dataRetentionDays: number
  securitySettings: {
    mfaRequired: boolean
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
      expiryDays: number
    }
    sessionTimeout: number // 以分钟为单位
    ipRestrictions: string[]
  }
}

// 租户自定义设置接口
export interface TenantCustomization {
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  favicon?: string
  loginBackgroundImage?: string
  customCss?: string
  customJs?: string
  emailTemplates?: Record<string, string>
}

// 租户功能开关接口
export interface TenantFeatures {
  aiAnalytics: boolean
  advancedReporting: boolean
  workflowEngine: boolean
  apiAccess: boolean
  ssoIntegration: boolean
  customFields: boolean
  dataExport: boolean
  auditLogs: boolean
  mobileAccess: boolean
}

// 租户用户接口
export interface TenantUser {
  id: string
  tenantId: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: "active" | "inactive" | "invited"
  lastLogin?: string
  createdAt: string
  updatedAt: string
  settings: {
    language: string
    timezone: string
    notifications: Record<string, boolean>
    theme: "light" | "dark" | "system"
  }
}
