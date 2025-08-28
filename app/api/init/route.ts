import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// 初始化应用
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dbConfig, admin } = body;
    
    // 验证数据
    if (!dbConfig || !admin) {
      return NextResponse.json(
        { error: '配置信息不完整' },
        { status: 400 }
      );
    }
    
    // 验证管理员数据
    if (!admin.username || !admin.email || !admin.password) {
      return NextResponse.json(
        { error: '管理员信息不完整' },
        { status: 400 }
      );
    }
    
    // 验证数据库配置
    if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database || !dbConfig.port) {
      return NextResponse.json(
        { error: '数据库配置不完整' },
        { status: 400 }
      );
    }
    
    // 更新.env文件
    const envPath = path.join(process.cwd(), '.env');
    const envContent = `# 数据库配置
DB_HOST=${dbConfig.host}
DB_USER=${dbConfig.user}
DB_PASSWORD=${dbConfig.password}
DB_NAME=${dbConfig.database}
DB_PORT=${dbConfig.port}

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# 应用配置
PORT=3001
NODE_ENV=development`;
    
    fs.writeFileSync(envPath, envContent);
    
    // 重新加载环境变量
    process.env.DB_HOST = dbConfig.host;
    process.env.DB_USER = dbConfig.user;
    process.env.DB_PASSWORD = dbConfig.password;
    process.env.DB_NAME = dbConfig.database;
    process.env.DB_PORT = dbConfig.port;
    
    // 动态导入数据库连接池
    const { default: pool } = await import('../../../lib/db');
    
    // 获取数据库连接
    const connection = await pool.getConnection();
    
    try {
      // 检查admins表是否存在
      let tableExists = false;
      try {
        await connection.execute('SHOW TABLES LIKE "admins"');
        const [rows] = await connection.execute('SHOW TABLES LIKE "admins"');
        tableExists = (rows as any[]).length > 0;
      } catch (error) {
        tableExists = false;
      }
      
      // 如果表不存在，创建所有表结构
      if (!tableExists) {
        await createTables(connection);
      }
      
      // 检查是否已存在管理员账户
      const [adminRows] = await connection.execute('SELECT COUNT(*) as count FROM admins');
      const adminCount = (adminRows as any[])[0].count;
      
      if (adminCount > 0) {
        connection.release();
        return NextResponse.json(
          { error: '应用已初始化' },
          { status: 400 }
        );
      }
      
      // 创建管理员账户
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(admin.password, saltRounds);
      
      const [result] = await connection.execute(
        'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
        [admin.username, admin.email, hashedPassword]
      );
      
      connection.release();
      
      return NextResponse.json({
        message: '应用初始化成功',
        admin: {
          id: (result as any).insertId,
          username: admin.username,
          email: admin.email
        }
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('应用初始化失败:', error);
    return NextResponse.json(
      { error: '应用初始化失败: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// 创建所有表结构
async function createTables(connection: any) {
  // 创建用户表
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  // 创建好友关系表
  await connection.query(`
    CREATE TABLE IF NOT EXISTS user_relations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      related_user_id INT NOT NULL,
      status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (related_user_id) REFERENCES users(id),
      UNIQUE KEY unique_relation (user_id, related_user_id)
    )
  `);
  
  // 创建管理员表
  await connection.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}
