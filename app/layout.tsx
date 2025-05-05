import type React from "react"
import "@/app/globals.css"
import "@/styles/accessibility.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { NotificationProvider } from "@/lib/notification-context"
import { NotificationToast } from "@/components/notifications/notification-toast"
import { AuthProvider } from "@/lib/auth-context"
import { SupabaseProvider } from "@/lib/supabase-context"
import { PerformanceMonitorInit } from "@/components/performance/performance-monitor-init"
import { OfflineIndicator } from "@/components/mobile/offline-indicator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NavigationProvider } from "@/hooks/use-navigation"
import { NavThemeProvider } from "@/hooks/use-nav-theme"
import { NavHistoryProvider } from "@/hooks/use-nav-history"
import { NavFavoritesProvider } from "@/hooks/use-nav-favorites"
import { I18nProvider } from "@/hooks/use-i18n"
import { NavAnalyticsProvider } from "@/hooks/use-nav-analytics"
import { SkipLink } from "@/components/accessibility/skip-link"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingProvider } from "@/lib/loading-context"
import { ConfirmDialogProvider } from "@/components/confirm-dialog"
import { AppStateProvider } from "@/lib/app-state"
import { PreloadInit } from "@/components/preload-init"
import { RecoveryInit } from "@/components/error-recovery/recovery-init"
import { OptimizationInit } from "@/components/optimization-init"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "言语「逸品」数字驾驶舱",
  description: "工作生活全栈赋能平台 - 实时数据与智能分析",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    generator: 'v0.dev'
}

// 组合多个上下文提供者以减少嵌套
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AppStateProvider>
          <SupabaseProvider>
            <AuthProvider>
              <LoadingProvider>
                <NotificationProvider>
                  <ConfirmDialogProvider>
                    <I18nProvider>
                      <NavigationProvider>
                        <NavThemeProvider>
                          <NavHistoryProvider>
                            <NavFavoritesProvider>
                              <NavAnalyticsProvider>{children}</NavAnalyticsProvider>
                            </NavFavoritesProvider>
                          </NavHistoryProvider>
                        </NavThemeProvider>
                      </NavigationProvider>
                    </I18nProvider>
                  </ConfirmDialogProvider>
                </NotificationProvider>
              </LoadingProvider>
            </AuthProvider>
          </SupabaseProvider>
        </AppStateProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <SkipLink />
          <OfflineIndicator />
          <DashboardLayout>
            <main id="main-content" tabIndex={-1}>
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </DashboardLayout>
          <NotificationToast />
          <Toaster />
          <PerformanceMonitorInit />
          <PreloadInit />
          <RecoveryInit />
          <OptimizationInit />
        </Providers>
      </body>
    </html>
  )
}
