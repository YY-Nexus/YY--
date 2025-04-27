import { Suspense } from "react"
import { ReportExportContent } from "@/components/report-export/report-export-content"

export default function ReportExportPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">加载报表导出工具...</div>}>
      <ReportExportContent />
    </Suspense>
  )
}
