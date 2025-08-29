import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { adminAuthMiddleware } from '../../../../middleware/adminAuth';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// 获取数据库连接信息
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResponse = await adminAuthMiddleware(request, {} as any);
    if (authResponse) return authResponse;
    
    // 获取管理员信息
    const admin = (request as any).user;
    
    try {
      const connection = await pool.getConnection();
      
      try {
        // 获取数据库统计信息
        const [userCount] = await connection.execute<RowDataPacket[]>(
          'SELECT COUNT(*) as count FROM users'
        );
        const [relationCount] = await connection.execute<RowDataPacket[]>(
          'SELECT COUNT(*) as count FROM user_relations'
        );
        
        // 获取管理员数量
        const [adminCount] = await connection.execute<RowDataPacket[]>(
          'SELECT COUNT(*) as count FROM admins'
        );
        
        const dbStats = {
          users: (userCount[0] as any).count,
          relations: (relationCount[0] as any).count,
          admins: (adminCount[0] as any).count,
        };
        
        // 获取数据库表结构信息
        const [tables] = await connection.execute<RowDataPacket[]>(
          `SELECT 
            table_name,
            table_rows,
            data_length,
            index_length,
            create_time
          FROM information_schema.tables 
          WHERE table_schema = ? 
          ORDER BY table_name`,
          [process.env.DB_NAME]
        );
        
        // 获取数据库版本
        const [versionResult] = await connection.execute<RowDataPacket[]>(
          'SELECT VERSION() as version'
        );
        const version = (versionResult[0] as any).version;
        
        connection.release();
        
        return NextResponse.json({
          success: true,
          message: '数据库信息获取成功',
          data: {
            connectionStatus: 'connected',
            database: process.env.DB_NAME,
            version: version,
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