"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function EmployeeDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // 记录错误到错误监控服务
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">加载员工详情时出错</h2>
        <p className="text-gray-600 mb-6">很抱歉，我们在加载员工详情时遇到了问题。请尝试刷新页面或返回上一页。</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => reset()} variant="default">
            重试
          </Button>
          <Button onClick={() => router.back()} variant="outline">
            返回上一页
          </Button>
          <Button onClick={() => router.push("/")} variant="outline">
            返回首页
          </Button>
        </div>
      </div>
    </div>
  )
}
