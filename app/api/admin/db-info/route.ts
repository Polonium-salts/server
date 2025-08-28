import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import pool from '../../../../lib/db';

// 获取数据库连接信息
export async function GET(request: NextRequest) {
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
    
    try {
      const connection = await pool.getConnection();
      
      try {
        // 获取数据库统计信息
        const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
        const [relationCount] = await connection.execute('SELECT COUNT(*) as count FROM user_relations');
        
        const dbStats = {
          users: (userCount as any[])[0].count,
          relations: (relationCount as any[])[0].count,
        };
        
        // 获取数据库表结构信息
        const [tables] = await connection.execute(
          "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = ? ORDER BY table_name, ordinal_position",
          [process.env.DB_NAME]
        );
        
        connection.release();
        
        return NextResponse.json({
          message: '数据库信息获取成功',
          data: {
            connection: {
              host: process.env.DB_HOST,
              user: process.env.DB_USER,
              database: process.env.DB_NAME,
              port: parseInt(process.env.DB_PORT || '3306')
            },
            stats: dbStats,
            tables: tables
          }
        });
      } catch (queryError) {
        connection.release();
        throw queryError;
      }
    } catch (error) {
      console.error('获取数据库信息失败:', error);
      return NextResponse.json(
        { 
          success: false,
          error: '获取数据库信息失败: ' + (error as Error).message,
          connectionStatus: 'disconnected'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('获取数据库信息失败:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '获取数据库信息失败: ' + (error as Error).message,
        connectionStatus: 'disconnected'
      },
      { status: 500 }
    );
  }
}