import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { UserSettingsProvider } from "@/lib/user-settings"
import { Toaster } from "@/components/ui/toaster"
import { NotificationsProvider } from "@/lib/notifications"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "言语「逸品」数字驾驶舱",
  description: "企业财务分析与决策支持系统",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <UserSettingsProvider>
              <NotificationsProvider>
                {children}
                <Toaster />
              </NotificationsProvider>
            </UserSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
