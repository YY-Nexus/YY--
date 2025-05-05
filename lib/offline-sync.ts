import { getSupabase } from "@/lib/supabase"
import {
  addPendingAction,
  getUnSyncedActions,
  markActionSynced,
  incrementRetryCount,
  ActionTypes,
  type PendingAction,
} from "@/lib/indexed-db"

// 最大重试次数
const MAX_RETRY_COUNT = 5

// 同步单个操作
async function syncAction(action: PendingAction): Promise<boolean> {
  const supabase = getSupabase()

  try {
    switch (action.type) {
      case ActionTypes.CREATE:
        // 创建记录
        const { error: createError } = await supabase.from(action.table).insert(action.data)

        if (createError) throw createError
        break

      case ActionTypes.UPDATE:
        // 更新记录
        const { error: updateError } = await supabase.from(action.table).update(action.data).eq("id", action.data.id)

        if (updateError) throw updateError
        break

      case ActionTypes.DELETE:
        // 删除记录
        const { error: deleteError } = await supabase.from(action.table).delete().eq("id", action.data.id)

        if (deleteError) throw deleteError
        break

      default:
        console.warn(`未知的操作类型: ${action.type}`)
        return false
    }

    // 标记为已同步
    await markActionSynced(action.id)
    return true
  } catch (error) {
    console.error(`同步操作失败:`, error)

    // 增加重试次数
    await incrementRetryCount(action.id)

    // 如果超过最大重试次数，标记为已同步（放弃）
    if (action.retryCount >= MAX_RETRY_COUNT) {
      await markActionSynced(action.id)
      console.warn(`操作 ${action.id} 已达到最大重试次数，放弃同步`)
    }

    return false
  }
}

// 同步所有未同步的操作
export async function syncPendingActions(): Promise<{
  success: number
  failed: number
  total: number
}> {
  // 检查网络连接
  if (!navigator.onLine) {
    return { success: 0, failed: 0, total: 0 }
  }

  try {
    // 获取所有未同步的操作
    const actions = await getUnSyncedActions()

    if (actions.length === 0) {
      return { success: 0, failed: 0, total: 0 }
    }

    // 按时间戳排序
    actions.sort((a, b) => a.timestamp - b.timestamp)

    let success = 0
    let failed = 0

    // 依次同步每个操作
    for (const action of actions) {
      const result = await syncAction(action)

      if (result) {
        success++
      } else {
        failed++
      }
    }

    return {
      success,
      failed,
      total: actions.length,
    }
  } catch (error) {
    console.error("同步待处理操作失败:", error)
    return { success: 0, failed: 0, total: 0 }
  }
}

// 创建离线操作
export async function createOfflineRecord(table: string, data: any): Promise<string> {
  return addPendingAction({
    type: ActionTypes.CREATE,
    table,
    data,
  })
}

// 更新离线操作
export async function updateOfflineRecord(table: string, data: any): Promise<string> {
  return addPendingAction({
    type: ActionTypes.UPDATE,
    table,
    data,
  })
}

// 删除离线操作
export async function deleteOfflineRecord(table: string, id: string): Promise<string> {
  return addPendingAction({
    type: ActionTypes.DELETE,
    table,
    data: { id },
  })
}

// 设置自动同步
let syncInterval: number | null = null

export function startAutoSync(intervalMs = 60000): void {
  if (syncInterval) {
    clearInterval(syncInterval)
  }

  // 立即执行一次同步
  syncPendingActions()

  // 设置定时同步
  syncInterval = window.setInterval(() => {
    syncPendingActions()
  }, intervalMs)
}

export function stopAutoSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval)
    syncInterval = null
  }
}

// 监听网络状态变化
export function setupNetworkListeners(): void {
  window.addEventListener("online", () => {
    console.log("网络已连接，开始同步数据...")
    syncPendingActions()
  })

  window.addEventListener("offline", () => {
    console.log("网络已断开，停止自动同步")
    if (syncInterval) {
      clearInterval(syncInterval)
    }
  })
}
