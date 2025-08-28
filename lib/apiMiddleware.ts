import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';
import { verifyToken } from '../lib/auth';

export async function withAuth(handler: (req: NextRequest, event: NextFetchEvent) => Promise<NextResponse>) {
  return async (req: NextRequest, event: NextFetchEvent) => {
    // 获取认证token
    let token = null;
    
    // 从Authorization header获取token
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // 如果header中没有token，尝试从cookies获取
    if (!token) {
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
        const tokenCookie = cookies.find(cookie => cookie.startsWith('admin_token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }
    }
    
    // 如果没有token，返回401错误
    if (!token) {
      return NextResponse.json(
        { error: '未提供认证信息' },
        { status: 401 }
      );
    }
    
    // 验证token
    const user = await verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: '无效的认证信息' },
        { status: 401 }
      );
    }
    
    // 将用户信息添加到请求中
    (req as any).user = user;
    
    // 调用原始处理函数
    return handler(req, event);
  };
}