import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import pool from '../../../../lib/db';

// 重新初始化应用
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: '未提供访问令牌' },
        { status: 401 }
      );
    }
    
    const decoded = await verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: '无效的访问令牌' },
        { status: 401 }
      );
    }
    
    // 获取数据库连接
    const connection = await pool.getConnection();
    
    try {
      // 清空所有表数据
      await connection.execute('DELETE FROM user_relations');
      await connection.execute('DELETE FROM users');
      await connection.execute('DELETE FROM admins');
      
      // 重置自增ID
      await connection.execute('ALTER TABLE user_relations AUTO_INCREMENT = 1');
      await connection.execute('ALTER TABLE users AUTO_INCREMENT = 1');
      await connection.execute('ALTER TABLE admins AUTO_INCREMENT = 1');
      
      connection.release();
      
      return NextResponse.json({
        message: '数据库重新初始化成功'
      });
    } catch (queryError) {
      connection.release();
      throw queryError;
    }
  } catch (error) {
    console.error('应用重新初始化失败:', error);
    return NextResponse.json(
      { error: '应用重新初始化失败: ' + (error as Error).message },
      { status: 500 }
    );
  }
}