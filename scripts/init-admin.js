const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initAdmin() {
  // 数据库配置
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'chat_app',
    port: parseInt(process.env.DB_PORT || '3306'),
  };

  let connection;
  
  try {
    // 连接到数据库
    connection = await mysql.createConnection(dbConfig);
    
    console.log('数据库连接成功');
    
    // 检查admins表是否存在
    try {
      await connection.execute('SELECT 1 FROM admins LIMIT 1');
    } catch (error) {
      // 表不存在，创建表
      console.log('创建admins表...');
      await connection.execute(`
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
    
    // 检查是否已存在管理员账户
    const [adminRows] = await connection.execute('SELECT COUNT(*) as count FROM admins');
    const adminCount = adminRows[0].count;
    
    if (adminCount > 0) {
      console.log('管理员账户已存在，跳过初始化');
      return;
    }
    
    // 创建默认管理员账户
    const username = 'admin';
    const email = 'admin@example.com';
    const password = 'admin123';
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const [result] = await connection.execute(
      'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    console.log('管理员账户创建成功:');
    console.log('- 用户名:', username);
    console.log('- 邮箱:', email);
    console.log('- 密码:', password);
    console.log('- 提示: 请在首次登录后立即修改密码');
    
  } catch (error) {
    console.error('初始化管理员账户失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行初始化
initAdmin();