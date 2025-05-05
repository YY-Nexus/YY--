import { NextResponse } from "next/server"
import { getErrorService, ErrorType, ErrorSeverity } from "./error-service"

// API错误类
export class ApiError extends Error {
  statusCode: number
  errorCode: string

  constructor(message: string, statusCode = 500, errorCode = "INTERNAL_SERVER_ERROR") {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
    this.errorCode = errorCode
  }
}

// API响应包装器
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    details?: any
  }
}

// 创建成功响应
export function createSuccessResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  })
}

// 创建错误响应
export function createErrorResponse(error: ApiError | Error, details?: any): NextResponse<ApiResponse<never>> {
  const statusCode = error instanceof ApiError ? error.statusCode : 500
  const errorCode = error instanceof ApiError ? error.errorCode : "INTERNAL_SERVER_ERROR"

  // 记录错误
  const errorService = getErrorService()
  errorService.captureError({
    type: ErrorType.API,
    severity: statusCode >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
    message: error.message,
    stack: error.stack,
    context: {
      timestamp: Date.now(),
      additionalData: {
        statusCode,
        errorCode,
        details,
      },
    },
  })

  return NextResponse.json(
    {
      success: false,
      error: {
        message: error.message,
        code: errorCode,
        details,
      },
    },
    { status: statusCode },
  )
}

// API处理器包装函数
export function withErrorHandling<T>(handler: () => Promise<T>): Promise<NextResponse<ApiResponse<T>>> {
  return handler()
    .then((data) => createSuccessResponse(data))
    .catch((error) => createErrorResponse(error))
}
