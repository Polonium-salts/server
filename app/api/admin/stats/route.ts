import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { withAuth } from '../../../../lib/apiMiddleware';

// 获取统计数据（受保护的路由）
export async function GET(request: NextRequest) {
  try {
    // 获取用户总数
    const [userRows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const totalUsers = (userRows as any[])[0].count;

    // 获取消息总数
    const [messageRows] = await pool.execute('SELECT COUNT(*) as count FROM messages');
    const totalMessages = (messageRows as any[])[0].count;

    // 获取关系总数
    const [relationRows] = await pool.execute('SELECT COUNT(*) as count FROM user_relations');
    const totalRelations = (relationRows as any[])[0].count;

    return NextResponse.json({
      message: '统计数据获取成功',
      data: {
        totalUsers,
        totalMessages,
        totalRelations
      }
    });
  } catch (error) {
    console.error('Error retrieving stats:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}