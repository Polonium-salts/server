import { NextRequest, NextResponse } from 'next/server';
import { registerUser, loginUser } from '../../../lib/auth';
import pool from '../../../lib/db';

// 用户注册
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;
    
    // 验证必填字段
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
    
    // 检查用户是否已存在
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }
    
    // 注册用户
    const user = await registerUser(username, email, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to register user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'User registered successfully', user: { id: user.id, username: user.username, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in user registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 用户登录
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // 用户登录
    const result = await loginUser(email, password);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    const { user, token } = result;
    
    return NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (error) {
    console.error('Error in user login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}