import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { authMiddleware } from '../../../../middleware/auth';
import { RowDataPacket } from 'mysql2/promise';

// 获取特定用户信息
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 验证用户身份
    const authResponse = await authMiddleware(request, {} as any);
    if (authResponse) return authResponse;
    
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    
    // 获取用户信息
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    const users = rows;
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'User retrieved successfully',
      data: users[0]
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}