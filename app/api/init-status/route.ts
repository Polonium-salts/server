import { NextRequest, NextResponse } from 'next/server';
import { reinitializePool } from '../../../lib/db';

// 检查应用初始化状态
export async function GET(request: NextRequest) {
  try {
    // 重新初始化数据库连接池以确保使用最新的配置
    const pool = reinitializePool();
    
    // 检查是否存在管理员账户
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM admins');
    const adminCount = (rows as any[])[0].count;
    
    const isInitialized = adminCount > 0;
    
    return NextResponse.json({
      isInitialized
    });
  } catch (error) {
    console.error('检查初始化状态失败:', error);
    // 如果出现数据库错误，可能是因为数据库未配置或表不存在，返回未初始化状态
    return NextResponse.json({
      isInitialized: false
    });
  }
}