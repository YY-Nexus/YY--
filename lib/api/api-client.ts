import { getErrorService, ErrorType, ErrorSeverity } from "@/lib/error-service"
import { getSupabase } from "@/lib/supabase"

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    details?: any
  }
}

// API客户端配置
interface ApiClientConfig {
  baseUrl?: string
  timeout?: number
  headers?: Record<string, string>
}

// API客户端类
export class ApiClient {
  private baseUrl: string
  private timeout: number
  private headers: Record<string, string>
  private errorService = getErrorService()

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || "/api"
    this.timeout = config.timeout || 30000
    this.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    }
  }

  // 设置请求头
  public setHeader(key: string, value: string): void {
    this.headers[key] = value
  }

  // 移除请求头
  public removeHeader(key: string): void {
    delete this.headers[key]
  }

  // GET请求
  public async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params)
    return this.request<T>("GET", url)
  }

  // POST请求
  public async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint)
    return this.request<T>("POST", url, data)
  }

  // PUT请求
  public async put<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint)
    return this.request<T>("PUT", url, data)
  }

  // PATCH请求
  public async patch<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint)
    return this.request<T>("PATCH", url, data)
  }

  // DELETE请求
  public async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint)
    return this.request<T>("DELETE", url)
  }

  // 构建URL
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`

    if (!params) {
      return url
    }

    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })

    const queryString = queryParams.toString()
    return queryString ? `${url}?${queryString}` : url
  }

  // 发送请求
  private async request<T>(method: string, url: string, data?: any): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method,
        headers: this.headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        credentials: "include", // 包含cookies
      })

      clearTimeout(timeoutId)

      const contentType = response.headers.get("Content-Type") || ""
      let responseData: any

      if (contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }

      if (!response.ok) {
        // 处理API错误
        const error = responseData.error || {
          message: `请求失败: ${response.status} ${response.statusText}`,
          code: `HTTP_${response.status}`,
        }

        this.errorService.captureError({
          type: ErrorType.API,
          severity: response.status >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
          message: error.message,
          context: {
            timestamp: Date.now(),
            url,
            additionalData: {
              method,
              status: response.status,
              errorCode: error.code,
              details: error.details,
            },
          },
        })

        throw new Error(error.message)
      }

      // 处理标准API响应
      if (responseData.success !== undefined) {
        if (!responseData.success) {
          throw new Error(responseData.error?.message || "未知错误")
        }
        return responseData.data
      }

      return responseData
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          this.errorService.captureError({
            type: ErrorType.NETWORK,
            severity: ErrorSeverity.MEDIUM,
            message: "请求超时",
            context: {
              timestamp: Date.now(),
              url,
              additionalData: { method, timeout: this.timeout },
            },
          })
          throw new Error(`请求超时: ${url}`)
        }

        throw error
      }

      throw new Error("请求失败")
    }
  }
}

// 创建默认API客户端实例
let defaultClient: ApiClient | null = null

export function getApiClient(config?: ApiClientConfig): ApiClient {
  if (!defaultClient) {
    defaultClient = new ApiClient(config)
  }
  return defaultClient
}

// Supabase API客户端
export class SupabaseApiClient {
  private errorService = getErrorService()

  // 获取表数据
  public async getTable<T>(
    table: string,
    options?: {
      select?: string
      filter?: Record<string, any>
      limit?: number
      offset?: number
      orderBy?: { column: string; ascending?: boolean }
    },
  ): Promise<T[]> {
    try {
      const supabase = getSupabase()
      let query = supabase.from(table).select(options?.select || "*")

      // 应用过滤条件
      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })
      }

      // 应用排序
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        })
      }

      // 应用分页
      if (options?.limit) {
        query = query.limit(options.limit)
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) {
        this.errorService.captureError({
          type: ErrorType.API,
          severity: ErrorSeverity.MEDIUM,
          message: `Supabase查询错误: ${error.message}`,
          context: {
            timestamp: Date.now(),
            additionalData: {
              table,
              options,
              error: error.details,
            },
          },
        })
        throw new Error(error.message)
      }

      return data as T[]
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("查询数据失败")
    }
  }

  // 获取单条记录
  public async getRecord<T>(table: string, id: string | number, select?: string): Promise<T | null> {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from(table)
        .select(select || "*")
        .eq("id", id)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // 记录不存在
          return null
        }

        this.errorService.captureError({
          type: ErrorType.API,
          severity: ErrorSeverity.MEDIUM,
          message: `Supabase获取记录错误: ${error.message}`,
          context: {
            timestamp: Date.now(),
            additionalData: {
              table,
              id,
              select,
              error: error.details,
            },
          },
        })
        throw new Error(error.message)
      }

      return data as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("获取记录失败")
    }
  }

  // 创建记录
  public async createRecord<T>(table: string, data: Partial<T>): Promise<T> {
    try {
      const supabase = getSupabase()
      const { data: result, error } = await supabase.from(table).insert(data).select().single()

      if (error) {
        this.errorService.captureError({
          type: ErrorType.API,
          severity: ErrorSeverity.MEDIUM,
          message: `Supabase创建记录错误: ${error.message}`,
          context: {
            timestamp: Date.now(),
            additionalData: {
              table,
              data,
              error: error.details,
            },
          },
        })
        throw new Error(error.message)
      }

      return result as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("创建记录失败")
    }
  }

  // 更新记录
  public async updateRecord<T>(table: string, id: string | number, data: Partial<T>): Promise<T> {
    try {
      const supabase = getSupabase()
      const { data: result, error } = await supabase.from(table).update(data).eq("id", id).select().single()

      if (error) {
        this.errorService.captureError({
          type: ErrorType.API,
          severity: ErrorSeverity.MEDIUM,
          message: `Supabase更新记录错误: ${error.message}`,
          context: {
            timestamp: Date.now(),
            additionalData: {
              table,
              id,
              data,
              error: error.details,
            },
          },
        })
        throw new Error(error.message)
      }

      return result as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("更新记录失败")
    }
  }

  // 删除记录
  public async deleteRecord(table: string, id: string | number): Promise<void> {
    try {
      const supabase = getSupabase()
      const { error } = await supabase.from(table).delete().eq("id", id)

      if (error) {
        this.errorService.captureError({
          type: ErrorType.API,
          severity: ErrorSeverity.MEDIUM,
          message: `Supabase删除记录错误: ${error.message}`,
          context: {
            timestamp: Date.now(),
            additionalData: {
              table,
              id,
              error: error.details,
            },
          },
        })
        throw new Error(error.message)
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("删除记录失败")
    }
  }

  // 执行自定义查询
  public async executeQuery<T>(query: string, params?: any[]): Promise<T[]> {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.rpc("execute_query", {
        query_text: query,
        query_params: params || [],
      })

      if (error) {
        this.errorService.captureError({
          type: ErrorType.API,
          severity: ErrorSeverity.MEDIUM,
          message: `Supabase执行查询错误: ${error.message}`,
          context: {
            timestamp: Date.now(),
            additionalData: {
              query,
              params,
              error: error.details,
            },
          },
        })
        throw new Error(error.message)
      }

      return data as T[]
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("执行查询失败")
    }
  }
}

// 创建默认Supabase API客户端实例
let defaultSupabaseClient: SupabaseApiClient | null = null

export function getSupabaseApiClient(): SupabaseApiClient {
  if (!defaultSupabaseClient) {
    defaultSupabaseClient = new SupabaseApiClient()
  }
  return defaultSupabaseClient
}
