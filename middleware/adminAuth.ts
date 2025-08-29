import { NextRequest, NextFetchEvent } from 'next/server';
import pool from '../lib/db';
import { RowDataPacket } from 'mysql2/promise';

interface Admin {
  id: number;
  username: string;
  email: string;
}

export async function adminAuthMiddleware(request: NextRequest, event: NextFetchEvent) {
  // 获取认证token
  const authHeader = request.headers.get('authorization');
  let token = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // 从cookies中获取token
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
      const tokenCookie = cookies.find(cookie => cookie.startsWith('admin_token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }
  }
  
  // 如果没有token，重定向到登录页面
  if (!token) {
    return new Response(null, {
      status: 307,
      headers: {
        'Location': '/admin/login',
      },
    });
  }
  
  // 验证token (这里简化处理，实际应用中应该使用JWT)
  try {
    // 在实际应用中，您应该使用JWT来验证token
    // 这里我们假设token就是用户名
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, email FROM admins WHERE username = ?',
      [token]
    );
    
    const admins = rows as Admin[];
    
    if (admins.length === 0) {
      // token无效，重定向到登录页面
      return new Response(null, {
        status: 307,
        headers: {
          'Location': '/admin/login',
        },
      });
    }
    
    // 将用户信息添加到请求中
    (request as any).user = admins[0];
    return null; // 表示验证通过
  } catch (error) {
    console.error('认证错误:', error);
    return new Response(null, {
      status: 307,
      headers: {
        'Location': '/admin/login',
      },
    });
  }
}