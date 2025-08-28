import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../../lib/db';
import { withAuth } from '../../../../../lib/apiMiddleware';

// 获取用户统计数据（受保护的路由）
export async function GET(request: NextRequest) {
  try {
    // 获取用户总数
    const [userRows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const totalUsers = (userRows as any[])[0].count;

    return NextResponse.json({
      message: '用户统计数据获取成功',
      data: {
        totalUsers
      }
    });
  } catch (error) {
    console.error('Error retrieving user stats:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}