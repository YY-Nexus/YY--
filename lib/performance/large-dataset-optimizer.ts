/**
 * 大型数据集优化服务
 * 优化大型数据集的缓存和处理方式
 */
import { getRecoveryService, ErrorType, ErrorSeverity } from "@/lib/error-recovery/recovery-service"

// 分片配置
interface ShardingConfig {
  enabled: boolean
  maxItemsPerShard: number
  compressionEnabled: boolean
}

// 默认分片配置
const DEFAULT_SHARDING_CONFIG: ShardingConfig = {
  enabled: true,
  maxItemsPerShard: 1000,
  compressionEnabled: true,
}

// 数据集元数据
interface DatasetMetadata {
  id: string
  totalItems: number
  totalShards: number
  lastUpdated: number
  shardIds: string[]
  version: number
}

// 数据分片
interface DataShard<T> {
  id: string
  datasetId: string
  items: T[]
  startIndex: number
  endIndex: number
  compressed: boolean
}

// 大型数据集优化服务
export class LargeDatasetOptimizer<T> {
  private static instances: Map<string, LargeDatasetOptimizer<any>> = new Map()
  private config: ShardingConfig
  private metadata: DatasetMetadata | null = null
  private loadedShards: Map<string, DataShard<T>> = new Map()
  private pendingOperations: Map<string, Promise<any>> = new Map()

  // 获取实例
  public static getInstance<T>(datasetId: string): LargeDatasetOptimizer<T> {
    if (!this.instances.has(datasetId)) {
      this.instances.set(datasetId, new LargeDatasetOptimizer<T>(datasetId))
    }
    return this.instances.get(datasetId) as LargeDatasetOptimizer<T>
  }

  // 私有构造函数
  private constructor(
    private datasetId: string,
    config: Partial<ShardingConfig> = {},
  ) {
    this.config = { ...DEFAULT_SHARDING_CONFIG, ...config }
  }

  // 初始化数据集
  public async initialize(): Promise<void> {
    const recoveryService = getRecoveryService()

    try {
      // 尝试加载元数据
      const storedMetadata = localStorage.getItem(`dataset:${this.datasetId}:metadata`)

      if (storedMetadata) {
        this.metadata = JSON.parse(storedMetadata)
      } else {
        // 创建新的元数据
        this.metadata = {
          id: this.datasetId,
          totalItems: 0,
          totalShards: 0,
          lastUpdated: Date.now(),
          shardIds: [],
          version: 1,
        }

        // 保存元数据
        this.saveMetadata()
      }
    } catch (error) {
      recoveryService.captureError({
        type: ErrorType.STORAGE,
        severity: ErrorSeverity.MEDIUM,
        message: "初始化数据集失败",
        context: {
          timestamp: Date.now(),
          additionalData: { datasetId: this.datasetId, error },
        },
        originalError: error instanceof Error ? error : undefined,
      })

      // 创建新的元数据作为恢复策略
      this.metadata = {
        id: this.datasetId,
        totalItems: 0,
        totalShards: 0,
        lastUpdated: Date.now(),
        shardIds: [],
        version: 1,
      }

      // 保存元数据
      this.saveMetadata()
    }
  }

  // 保存元数据
  private saveMetadata(): void {
    if (!this.metadata) return

    try {
      localStorage.setItem(`dataset:${this.datasetId}:metadata`, JSON.stringify(this.metadata))
    } catch (error) {
      console.error("保存数据集元数据失败:", error)
    }
  }

  // 加载分片
  private async loadShard(shardId: string): Promise<DataShard<T> | null> {
    // 检查是否已加载
    if (this.loadedShards.has(shardId)) {
      return this.loadedShards.get(shardId) || null
    }

    // 检查是否有待处理的操作
    if (this.pendingOperations.has(`load:${shardId}`)) {
      return this.pendingOperations.get(`load:${shardId}`) as Promise<DataShard<T> | null>
    }

    const operation = (async () => {
      try {
        const storedShard = localStorage.getItem(`dataset:${this.datasetId}:shard:${shardId}`)

        if (!storedShard) {
          return null
        }

        let shard: DataShard<T>

        if (this.config.compressionEnabled) {
          // 解压缩数据
          shard = JSON.parse(await this.decompressData(storedShard))
        } else {
          shard = JSON.parse(storedShard)
        }

        // 缓存分片
        this.loadedShards.set(shardId, shard)

        return shard
      } catch (error) {
        console.error(`加载分片 ${shardId} 失败:`, error)
        return null
      } finally {
        // 移除待处理操作
        this.pendingOperations.delete(`load:${shardId}`)
      }
    })()

    // 记录待处理操作
    this.pendingOperations.set(`load:${shardId}`, operation)

    return operation
  }

  // 保存分片
  private async saveShard(shard: DataShard<T>): Promise<void> {
    try {
      let data: string

      if (this.config.compressionEnabled) {
        // 压缩数据
        data = await this.compressData(JSON.stringify(shard))
      } else {
        data = JSON.stringify(shard)
      }

      localStorage.setItem(`dataset:${this.datasetId}:shard:${shard.id}`, data)

      // 更新缓存
      this.loadedShards.set(shard.id, shard)
    } catch (error) {
      console.error(`保存分片 ${shard.id} 失败:`, error)
      throw error
    }
  }

  // 压缩数据
  private async compressData(data: string): Promise<string> {
    // 简单的压缩示例，实际应用中应使用更高效的压缩算法
    // 如LZ-string或pako
    return btoa(data)
  }

  // 解压缩数据
  private async decompressData(data: string): Promise<string> {
    // 简单的解压缩示例
    return atob(data)
  }

  // 创建新分片
  private createNewShard(startIndex: number): DataShard<T> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    const shardId = `${this.datasetId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const shard: DataShard<T> = {
      id: shardId,
      datasetId: this.datasetId,
      items: [],
      startIndex,
      endIndex: startIndex - 1, // 初始为空
      compressed: this.config.compressionEnabled,
    }

    // 更新元数据
    this.metadata.shardIds.push(shardId)
    this.metadata.totalShards++
    this.metadata.lastUpdated = Date.now()
    this.saveMetadata()

    return shard
  }

  // 获取或创建分片
  private async getOrCreateShardForIndex(index: number): Promise<DataShard<T>> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    // 查找包含索引的分片
    for (const shardId of this.metadata.shardIds) {
      const shard = await this.loadShard(shardId)

      if (shard && index >= shard.startIndex && index <= shard.endIndex) {
        return shard
      }
    }

    // 如果没有找到，创建新分片
    return this.createNewShard(index)
  }

  // 获取项目
  public async getItem(index: number): Promise<T | null> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    if (index < 0 || index >= this.metadata.totalItems) {
      return null
    }

    try {
      const shard = await this.getOrCreateShardForIndex(index)
      return shard.items[index - shard.startIndex] || null
    } catch (error) {
      console.error(`获取项目 ${index} 失败:`, error)
      return null
    }
  }

  // 设置项目
  public async setItem(index: number, item: T): Promise<void> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    try {
      let shard: DataShard<T>

      if (index < 0) {
        throw new Error("索引不能为负数")
      }

      if (index >= this.metadata.totalItems) {
        // 扩展数据集
        const newItemsCount = index - this.metadata.totalItems + 1

        // 获取最后一个分片
        let lastShard: DataShard<T> | null = null

        if (this.metadata.shardIds.length > 0) {
          lastShard = await this.loadShard(this.metadata.shardIds[this.metadata.shardIds.length - 1])
        }

        if (lastShard && lastShard.items.length < this.config.maxItemsPerShard) {
          // 使用最后一个分片
          shard = lastShard
        } else {
          // 创建新分片
          shard = this.createNewShard(this.metadata.totalItems)
        }

        // 更新元数据
        this.metadata.totalItems = index + 1
        this.saveMetadata()
      } else {
        // 获取包含索引的分片
        shard = await this.getOrCreateShardForIndex(index)
      }

      // 更新项目
      shard.items[index - shard.startIndex] = item

      // 更新分片范围
      shard.endIndex = Math.max(shard.endIndex, index)

      // 保存分片
      await this.saveShard(shard)

      // 更新元数据
      this.metadata.lastUpdated = Date.now()
      this.saveMetadata()
    } catch (error) {
      console.error(`设置项目 ${index} 失败:`, error)
      throw error
    }
  }

  // 添加项目
  public async addItem(item: T): Promise<number> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    const index = this.metadata.totalItems
    await this.setItem(index, item)
    return index
  }

  // 添加多个项目
  public async addItems(items: T[]): Promise<number[]> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    const indices: number[] = []

    for (const item of items) {
      indices.push(await this.addItem(item))
    }

    return indices
  }

  // 删除项目
  public async removeItem(index: number): Promise<boolean> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    if (index < 0 || index >= this.metadata.totalItems) {
      return false
    }

    try {
      const shard = await this.getOrCreateShardForIndex(index)

      // 移除项目
      shard.items.splice(index - shard.startIndex, 1)

      // 更新后续项目的索引
      for (let i = index + 1; i < this.metadata.totalItems; i++) {
        const nextShard = await this.getOrCreateShardForIndex(i)
        const nextItem = await this.getItem(i)

        if (nextItem) {
          // 将项目移到前一个位置
          await this.setItem(i - 1, nextItem)
        }
      }

      // 更新元数据
      this.metadata.totalItems--
      this.metadata.lastUpdated = Date.now()
      this.saveMetadata()

      return true
    } catch (error) {
      console.error(`删除项目 ${index} 失败:`, error)
      return false
    }
  }

  // 获取所有项目
  public async getAllItems(): Promise<T[]> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    const items: T[] = []

    for (let i = 0; i < this.metadata.totalItems; i++) {
      const item = await this.getItem(i)
      if (item !== null) {
        items.push(item)
      }
    }

    return items
  }

  // 获取分页项目
  public async getPagedItems(page: number, pageSize: number): Promise<T[]> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    const startIndex = page * pageSize
    const endIndex = Math.min(startIndex + pageSize, this.metadata.totalItems)

    if (startIndex >= this.metadata.totalItems) {
      return []
    }

    const items: T[] = []

    for (let i = startIndex; i < endIndex; i++) {
      const item = await this.getItem(i)
      if (item !== null) {
        items.push(item)
      }
    }

    return items
  }

  // 清空数据集
  public async clear(): Promise<void> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    try {
      // 删除所有分片
      for (const shardId of this.metadata.shardIds) {
        localStorage.removeItem(`dataset:${this.datasetId}:shard:${shardId}`)
      }

      // 重置元数据
      this.metadata = {
        id: this.datasetId,
        totalItems: 0,
        totalShards: 0,
        lastUpdated: Date.now(),
        shardIds: [],
        version: this.metadata.version + 1,
      }

      // 保存元数据
      this.saveMetadata()

      // 清空缓存
      this.loadedShards.clear()
    } catch (error) {
      console.error("清空数据集失败:", error)
      throw error
    }
  }

  // 获取数据集大小
  public getSize(): number {
    return this.metadata?.totalItems || 0
  }

  // 获取数据集元数据
  public getMetadata(): DatasetMetadata | null {
    return this.metadata
  }

  // 优化数据集
  public async optimize(): Promise<void> {
    if (!this.metadata) {
      throw new Error("数据集未初始化")
    }

    try {
      // 获取所有项目
      const allItems = await this.getAllItems()

      // 清空数据集
      await this.clear()

      // 重新添加项目，以优化分片
      await this.addItems(allItems)
    } catch (error) {
      console.error("优化数据集失败:", error)
      throw error
    }
  }
}

// 获取大型数据集优化服务实例
export function getLargeDatasetOptimizer<T>(datasetId: string): LargeDatasetOptimizer<T> {
  return LargeDatasetOptimizer.getInstance<T>(datasetId)
}

// 初始化大型数据集优化服务
export async function initLargeDatasetOptimizer<T>(datasetId: string): Promise<LargeDatasetOptimizer<T>> {
  const optimizer = getLargeDatasetOptimizer<T>(datasetId)
  await optimizer.initialize()
  return optimizer
}
