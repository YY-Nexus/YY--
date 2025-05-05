import { Button } from "@/components/ui/button"
import { RefreshCw, Settings, Download, Upload } from "lucide-react"

export function DataIntegrationHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">数据集成中心</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Upload className="h-4 w-4" />
            <span>导入</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>导出</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Settings className="h-4 w-4" />
            <span>设置</span>
          </Button>
          <Button size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>立即同步</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
