import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { withAuth } from '../../../../lib/apiMiddleware';

// 获取所有消息（受保护的路由）
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

    // 获取所有消息，按创建时间倒序排列
    const [rows] = await pool.execute(
      'SELECT * FROM messages ORDER BY created_at DESC'
    );
    
    const messages = rows as any[];
    
    return NextResponse.json({
      message: '消息列表获取成功',
      data: messages
    });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}