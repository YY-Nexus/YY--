import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 多租户中间件
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { pathname } = url

  // 跳过静态资源和API路由
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // 检查是否是子域名访问
  const hostname = request.headers.get("host") || ""
  const subdomain = hostname.split(".")[0]

  // 如果已经在租户路径下，直接继续
  if (pathname.startsWith("/tenant/")) {
    return NextResponse.next()
  }

  // 如果是子域名访问，重定向到租户特定路径
  if (subdomain !== "www" && subdomain !== "app" && !hostname.startsWith("localhost")) {
    // 重定向到租户路径
    const tenantPath = pathname === "/" ? `/tenant/${subdomain}/dashboard` : `/tenant/${subdomain}${pathname}`
    url.pathname = tenantPath
    return NextResponse.redirect(url)
  }

  // 如果是访问根路径，但没有指定租户，重定向到租户选择页面
  if (pathname === "/" && !hostname.startsWith("localhost")) {
    url.pathname = "/select-tenant"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// 配置匹配的路径
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
