import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '../../../../lib/db';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// 修改管理员密码
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
    
    // 验证JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string; email: string };
    } catch (error) {
      return NextResponse.json(
        { error: '无效的访问令牌' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { newPassword } = body;
    
    // 验证输入
    if (!newPassword) {
      return NextResponse.json(
        { error: '新密码是必填项' },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码长度至少为6位' },
        { status: 400 }
      );
    }
    
    // 获取数据库连接
    const connection = await pool.getConnection();
    
    try {
      // 获取当前管理员信息
      const [rows] = await connection.execute(
        'SELECT id, username FROM admins WHERE id = ?',
        [decoded.id]
      );
      
      const admin = (rows as any[])[0];
      
      if (!admin) {
        connection.release();
        return NextResponse.json(
          { error: '管理员账户不存在' },
          { status: 404 }
        );
      }
      
      // 加密新密码
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // 更新密码
      await connection.execute(
        'UPDATE admins SET password = ? WHERE id = ?',
        [hashedPassword, decoded.id]
      );
      
      connection.release();
      
      return NextResponse.json({
        message: '密码修改成功'
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('修改密码失败:', error);
    return NextResponse.json(
      { error: '修改密码失败: ' + (error as Error).message },
      { status: 500 }
    );
  }
}