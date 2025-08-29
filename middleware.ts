import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 这个中间件将在每个请求上运行
export function middleware(request: NextRequest) {
  // 对于 API 路由，我们让它们自己处理认证
  // 这里可以添加任何全局中间件逻辑
  return NextResponse.next()
}

// 配置中间件匹配器
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了那些以以下内容开头的路径：
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (优化图片)
     * - favicon.ico (favicon 文件)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}