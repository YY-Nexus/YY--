import dynamic from "next/dynamic"
import { Suspense, type ComponentType } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// 动态导入选项
interface DynamicImportOptions {
  ssr?: boolean
  loading?: ComponentType
  suspense?: boolean
  errorFallback?: ComponentType<{ error: Error }>
}

// 默认错误回退组件
const DefaultErrorFallback = ({ error }: { error: Error }) => (
  <Alert variant="destructive" className="my-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>加载组件失败</AlertTitle>
    <AlertDescription>
      <p className="mb-2">无法加载组件，请刷新页面重试。</p>
      <p className="text-xs mb-4">{error.message}</p>
    </AlertDescription>
  </Alert>
)

// 创建自定义动态导入函数
export function createDynamicComponent<T>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = {},
) {
  const {
    ssr = false, // 默认禁用SSR以减少服务器负载
    loading: LoadingComponent,
    suspense = false,
    errorFallback: ErrorComponent = DefaultErrorFallback,
  } = options

  // 使用错误边界包装组件
  const WrappedComponent = (props: T) => {
    try {
      const Component = dynamic(importFunc, {
        ssr,
        loading: LoadingComponent,
      })
      return <Component {...props} />
    } catch (error) {
      console.error("动态加载组件失败:", error)
      return <ErrorComponent error={error instanceof Error ? error : new Error("加载失败")} />
    }
  }

  // 如果启用了suspense，则包装在Suspense中
  if (suspense) {
    return function SuspenseDynamicComponent(props: T) {
      return (
        <Suspense fallback={LoadingComponent ? <LoadingComponent /> : <Skeleton className="w-full h-[200px]" />}>
          <WrappedComponent {...props} />
        </Suspense>
      )
    }
  }

  return WrappedComponent
}

// 预定义的加载组件
export const DefaultCardSkeleton = () => <Skeleton className="w-full h-[200px] rounded-lg" />
export const DefaultTableSkeleton = () => <Skeleton className="w-full h-[400px] rounded-lg" />
export const DefaultChartSkeleton = () => <Skeleton className="w-full h-[300px] rounded-lg" />
export const DefaultFormSkeleton = () => <Skeleton className="w-full h-[500px] rounded-lg" />
