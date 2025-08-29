import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../../../lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

interface Admin {
  id: number;
  username: string;
  email: string;
  password: string;
}

// 管理员登录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码是必填项' },
        { status: 400 }
      );
    }
    
    // 查找管理员
    let rows: RowDataPacket[];
    try {
      [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM admins WHERE username = ?',
        [username]
      );
    } catch (dbError: any) {
      console.error('数据库查询错误:', dbError);
      
      // 如果是连接错误，尝试重新初始化连接池
      if (dbError.code === 'ECONNRESET' || dbError.code === 'ECONNREFUSED') {
        console.log('尝试重新连接数据库...');
        const { reinitializePool } = await import('../../../../lib/db');
        reinitializePool();
        
        // 重新尝试查询
        try {
          [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM admins WHERE username = ?',
            [username]
          );
        } catch (retryError: any) {
          console.error('重试查询失败:', retryError);
          return NextResponse.json(
            { error: '数据库连接失败，请稍后重试' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: '服务器内部错误' },
          { status: 500 }
        );
      }
    }
    
    const admins = rows as Admin[];
    
    if (admins.length === 0) {
      return NextResponse.json(
        { error: '无效的用户名或密码' },
        { status: 401 }
      );
    }
    
    const admin = admins[0];
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '无效的用户名或密码' },
        { status: 401 }
      );
    }
    
    // 生成JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );
    
    return NextResponse.json({
      message: '登录成功',
      user: { id: admin.id, username: admin.username, email: admin.email },
      token
    });
  } catch (error) {
    console.error('管理员登录错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}