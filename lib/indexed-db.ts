// IndexedDB数据库名称和版本
const DB_NAME = "yipin_offline_db"
const DB_VERSION = 1

// 存储对象名称
export enum StoreNames {
  PENDING_ACTIONS = "pendingActions",
  CACHED_DATA = "cachedData",
}

// 待处理操作类型
export enum ActionTypes {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

// 待处理操作接口
export interface PendingAction {
  id: string
  timestamp: number
  type: ActionTypes
  table: string
  data: any
  synced: boolean
  retryCount: number
}

// 缓存数据接口
export interface CachedData {
  id: string
  table: string
  data: any
  timestamp: number
  expires?: number
}

// 打开数据库连接
export async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    // 数据库升级事件
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // 创建待处理操作存储对象
      if (!db.objectStoreNames.contains(StoreNames.PENDING_ACTIONS)) {
        const store = db.createObjectStore(StoreNames.PENDING_ACTIONS, { keyPath: "id" })
        store.createIndex("synced", "synced", { unique: false })
        store.createIndex("table", "table", { unique: false })
        store.createIndex("timestamp", "timestamp", { unique: false })
      }

      // 创建缓存数据存储对象
      if (!db.objectStoreNames.contains(StoreNames.CACHED_DATA)) {
        const store = db.createObjectStore(StoreNames.CACHED_DATA, { keyPath: "id" })
        store.createIndex("table", "table", { unique: false })
        store.createIndex("timestamp", "timestamp", { unique: false })
      }
    }

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    request.onerror = (event) => {
      console.error("打开IndexedDB数据库失败:", (event.target as IDBOpenDBRequest).error)
      reject((event.target as IDBOpenDBRequest).error)
    }
  })
}

// 添加待处理操作
export async function addPendingAction(
  action: Omit<PendingAction, "id" | "timestamp" | "synced" | "retryCount">,
): Promise<string> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([StoreNames.PENDING_ACTIONS], "readwrite")
    const store = transaction.objectStore(StoreNames.PENDING_ACTIONS)

    const id = crypto.randomUUID()
    const timestamp = Date.now()

    const request = store.add({
      ...action,
      id,
      timestamp,
      synced: false,
      retryCount: 0,
    })

    request.onsuccess = () => {
      resolve(id)
    }

    request.onerror = () => {
      reject(request.error)
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 获取未同步的待处理操作
export async function getUnSyncedActions(): Promise<PendingAction[]> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([StoreNames.PENDING_ACTIONS], "readonly")
    const store = transaction.objectStore(StoreNames.PENDING_ACTIONS)
    const index = store.index("synced")

    const request = index.getAll(false)

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 标记待处理操作为已同步
export async function markActionSynced(id: string): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([StoreNames.PENDING_ACTIONS], "readwrite")
    const store = transaction.objectStore(StoreNames.PENDING_ACTIONS)

    const request = store.get(id)

    request.onsuccess = () => {
      const action = request.result
      if (action) {
        action.synced = true
        store.put(action)
        resolve()
      } else {
        reject(new Error("待处理操作不存在"))
      }
    }

    request.onerror = () => {
      reject(request.error)
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 增加待处理操作的重试次数
export async function incrementRetryCount(id: string): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([StoreNames.PENDING_ACTIONS], "readwrite")
    const store = transaction.objectStore(StoreNames.PENDING_ACTIONS)

    const request = store.get(id)

    request.onsuccess = () => {
      const action = request.result
      if (action) {
        action.retryCount += 1
        store.put(action)
        resolve()
      } else {
        reject(new Error("待处理操作不存在"))
      }
    }

    request.onerror = () => {
      reject(request.error)
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 删除待处理操作
export async function deletePendingAction(id: string): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([StoreNames.PENDING_ACTIONS], "readwrite")
    const store = transaction.objectStore(StoreNames.PENDING_ACTIONS)

    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 缓存数据
export async function cacheData(table: string, data: any, expires?: number): Promise<string> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([StoreNames.CACHED_DATA], "readwrite")
    const store = transaction.objectStore(StoreNames.CACHED_DATA)

    const id = `${table}:${data.id || crypto.randomUUID()}`
    const timestamp = Date.now()

    const cachedData: CachedData = {
      id,
      table,
      data,
      timestamp,
      expires,
    }

    const request = store.put(cachedData)

    request.onsuccess = () => {
      resolve(id)
    }

    request.onerror = () => {
      reject(request.error)
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 获取缓存数据
export async function getCachedData(table: string, id?: string): Promise<any> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([StoreNames.CACHED_DATA], "readonly")
    const store = transaction.objectStore(StoreNames.CACHED_DATA)

    if (id) {
      // 获取特定ID的缓存数据
      const request = store.get(`${table}:${id}`)

      request.onsuccess = () => {
        const cachedData = request.result as CachedData

        if (cachedData) {
          // 检查缓存是否过期
          if (cachedData.expires && Date.now() > cachedData.expires) {
            resolve(null)
          } else {
            resolve(cachedData.data)
          }
        } else {
          resolve(null)
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    } else {
      // 获取表中的所有缓存数据
      const index = store.index("table")
      const request = index.getAll(table)

      request.onsuccess = () => {
        const cachedItems = request.result as CachedData[]
        const now = Date.now()

        // 过滤掉过期的缓存
        const validItems = cachedItems.filter((item) => !item.expires || now <= item.expires)

        resolve(validItems.map((item) => item.data))
      }

      request.onerror = () => {
        reject(request.error)
      }
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 删除缓存数据
export async function deleteCachedData(table: string, id?: string): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([StoreNames.CACHED_DATA], "readwrite")
    const store = transaction.objectStore(StoreNames.CACHED_DATA)

    if (id) {
      // 删除特定ID的缓存数据
      const request = store.delete(`${table}:${id}`)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    } else {
      // 删除表中的所有缓存数据
      const index = store.index("table")
      const request = index.openCursor(table)

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue

        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 清除过期缓存
export async function clearExpiredCache(): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([StoreNames.CACHED_DATA], "readonly")
    const store = transaction.objectStore(StoreNames.CACHED_DATA)
    const index = store.index("timestamp")
    const now = Date.now()

    const request = index.openCursor()
    const expiredIds: string[] = []

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result as IDBCursorWithValue

      if (cursor) {
        const cachedData = cursor.value as CachedData

        if (cachedData.expires && now > cachedData.expires) {
          expiredIds.push(cachedData.id)
        }

        cursor.continue()
      } else {
        // 删除所有过期的缓存
        if (expiredIds.length > 0) {
          const deleteTransaction = db.transaction([StoreNames.CACHED_DATA], "readwrite")
          const deleteStore = deleteTransaction.objectStore(StoreNames.CACHED_DATA)

          expiredIds.forEach((id) => {
            deleteStore.delete(id)
          })

          deleteTransaction.oncomplete = () => {
            db.close()
            resolve()
          }

          deleteTransaction.onerror = () => {
            db.close()
            reject(deleteTransaction.error)
          }
        } else {
          db.close()
          resolve()
        }
      }
    }

    request.onerror = () => {
      db.close()
      reject(request.error)
    }
  })
}
