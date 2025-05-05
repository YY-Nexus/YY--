/**
 * 租户数据隔离服务
 * 确保不同租户的数据完全隔离
 */
import { getEncryptionService } from "@/lib/security/encryption-service"

// 租户上下文
interface TenantContext {
  tenantId: string
  userId: string
  roles: string[]
}

// 数据访问策略
export enum DataAccessPolicy {
  STRICT_ISOLATION = "strict-isolation", // 严格隔离，只能访问自己租户的数据
  SHARED_READ = "shared-read", // 共享读取，可以读取其他租户的数据，但不能修改
  FULL_ACCESS = "full-access", // 完全访问，可以访问所有租户的数据
}

// 租户数据隔离服务
export class TenantIsolationService {
  private static instance: TenantIsolationService
  private currentContext: TenantContext | null = null
  private dataAccessPolicy: DataAccessPolicy = DataAccessPolicy.STRICT_ISOLATION

  // 获取单例实例
  public static getInstance(): TenantIsolationService {
    if (!TenantIsolationService.instance) {
      TenantIsolationService.instance = new TenantIsolationService()
    }
    return TenantIsolationService.instance
  }

  // 私有构造函数
  private constructor() {}

  // 设置当前租户上下文
  public setCurrentContext(context: TenantContext): void {
    this.currentContext = context
  }

  // 获取当前租户上下文
  public getCurrentContext(): TenantContext | null {
    return this.currentContext
  }

  // 设置数据访问策略
  public setDataAccessPolicy(policy: DataAccessPolicy): void {
    this.dataAccessPolicy = policy
  }

  // 获取数据访问策略
  public getDataAccessPolicy(): DataAccessPolicy {
    return this.dataAccessPolicy
  }

  // 检查是否有权限访问数据
  public hasAccessToData(tenantId: string, operation: "read" | "write" | "delete"): boolean {
    if (!this.currentContext) {
      return false
    }

    // 如果是当前租户的数据，始终允许访问
    if (this.currentContext.tenantId === tenantId) {
      return true
    }

    // 根据数据访问策略检查权限
    switch (this.dataAccessPolicy) {
      case DataAccessPolicy.STRICT_ISOLATION:
        return false
      case DataAccessPolicy.SHARED_READ:
        return operation === "read"
      case DataAccessPolicy.FULL_ACCESS:
        return true
      default:
        return false
    }
  }

  // 添加租户ID前缀到键
  public addTenantPrefix(key: string): string {
    if (!this.currentContext) {
      throw new Error("未设置租户上下文")
    }
    return `tenant:${this.currentContext.tenantId}:${key}`
  }

  // 检查键是否属于当前租户
  public isKeyForCurrentTenant(key: string): boolean {
    if (!this.currentContext) {
      return false
    }
    return key.startsWith(`tenant:${this.currentContext.tenantId}:`)
  }

  // 从键中提取租户ID
  public extractTenantIdFromKey(key: string): string | null {
    const match = key.match(/^tenant:([^:]+):/)
    return match ? match[1] : null
  }

  // 加密敏感数据
  public async encryptSensitiveData<T>(data: T): Promise<string> {
    const encryptionService = getEncryptionService()
    return encryptionService.encryptObject(data)
  }

  // 解密敏感数据
  public async decryptSensitiveData<T>(encryptedData: string): Promise<T> {
    const encryptionService = getEncryptionService()
    return encryptionService.decryptObject<T>(encryptedData)
  }

  // 获取带租户隔离的存储
  public getTenantStorage(): Storage {
    return {
      getItem: (key: string): string | null => {
        const prefixedKey = this.addTenantPrefix(key)
        return localStorage.getItem(prefixedKey)
      },
      setItem: (key: string, value: string): void => {
        const prefixedKey = this.addTenantPrefix(key)
        localStorage.setItem(prefixedKey, value)
      },
      removeItem: (key: string): void => {
        const prefixedKey = this.addTenantPrefix(key)
        localStorage.removeItem(prefixedKey)
      },
      clear: (): void => {
        // 只清除当前租户的数据
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && this.isKeyForCurrentTenant(key)) {
            localStorage.removeItem(key)
          }
        }
      },
      key: (index: number): string | null => {
        // 获取当前租户的第index个键
        const keys = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && this.isKeyForCurrentTenant(key)) {
            keys.push(key)
          }
        }
        return keys[index] || null
      },
      get length(): number {
        // 获取当前租户的键数量
        let count = 0
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && this.isKeyForCurrentTenant(key)) {
            count++
          }
        }
        return count
      },
    }
  }
}

// 获取租户数据隔离服务实例
export function getTenantIsolationService(): TenantIsolationService {
  return TenantIsolationService.getInstance()
}

// 初始化租户数据隔离服务
export function initTenantIsolationService(
  context: TenantContext,
  policy: DataAccessPolicy = DataAccessPolicy.STRICT_ISOLATION,
): void {
  const service = getTenantIsolationService()
  service.setCurrentContext(context)
  service.setDataAccessPolicy(policy)
}
