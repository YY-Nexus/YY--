import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EmployeeNotFound() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">未找到员工</h2>
        <p className="text-gray-600 mb-6">很抱歉，我们找不到您请求的员工信息。该员工可能不存在或已被删除。</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/employee-lifecycle">查看所有员工</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
