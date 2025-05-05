import { AccessibilitySettings } from "@/components/accessibility/accessibility-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SkipLink } from "@/components/accessibility/skip-link"

export default function AccessibilityPage() {
  return (
    <div className="container py-6 space-y-6">
      <SkipLink />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">辅助功能设置</h1>
        <p className="text-muted-foreground">自定义显示和交互选项，提高可访问性和用户体验</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AccessibilitySettings />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>辅助功能指南</CardTitle>
              <CardDescription>了解如何使用辅助功能提高可访问性</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">键盘导航</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  使用Tab键在页面元素之间导航，使用Enter或空格键激活按钮和链接。
                </p>
              </div>

              <div>
                <h3 className="font-medium">屏幕阅读器</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  我们的应用程序与NVDA、VoiceOver和TalkBack等主流屏幕阅读器兼容。
                </p>
              </div>

              <div>
                <h3 className="font-medium">文本大小</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  您可以使用浏览器的缩放功能或我们的字体大小设置来调整文本大小。
                </p>
              </div>

              <div>
                <h3 className="font-medium">颜色对比度</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  我们的界面符合WCAG 2.1 AA级对比度标准，高对比度模式提供更强的对比度。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>辅助技术支持</CardTitle>
              <CardDescription>我们支持的辅助技术和标准</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>WCAG 2.1 AA级标准</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>屏幕阅读器兼容性</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>键盘导航</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>高对比度模式</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>减少动画</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>文本大小调整</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
