import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// 测试数据库连接
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { host, user, password, database, port } = body;

    // 验证数据库配置
    if (!host || !user || !password || !database || !port) {
      return NextResponse.json(
        { error: '数据库配置不完整' },
        { status: 400 }
      );
    }

    // 创建临时连接测试数据库连接
    const testConnection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port: parseInt(port)
    });

    // 测试连接
    await testConnection.ping();
    
    // 关闭连接
    await testConnection.end();

    return NextResponse.json({
      message: '数据库连接成功'
    });
  } catch (error) {
    console.error('数据库连接测试失败:', error);
    return NextResponse.json(
      { error: '数据库连接测试失败: ' + (error as Error).message },
      { status: 500 }
    );
  }
}