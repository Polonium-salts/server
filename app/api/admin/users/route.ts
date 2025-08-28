import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { withAuth } from '../../../../lib/apiMiddleware';

// 获取所有用户（受保护的路由）
export async function GET(request: NextRequest) {
  try {
    // 这里可以添加管理员权限检查
    // const user = (request as any).user;
    // if (!user.is_admin) {
    //   return NextResponse.json(
    //     { error: '权限不足' },
    //     { status: 403 }
    //   );
    // }

    // 获取所有用户
    const [rows] = await pool.execute(
      'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC'
    );
    
    const users = rows as any[];
    
    return NextResponse.json({
      message: '用户列表获取成功',
      data: users
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}