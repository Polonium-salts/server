const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chat_app',
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function testUserRegistration() {
  let pool;
  
  try {
    console.log('正在连接数据库...');
    pool = mysql.createPool(dbConfig);
    console.log('数据库连接成功!');
    
    // 测试注册一个新用户
    console.log('正在注册测试用户...');
    const username = 'testuser';
    const email = 'test@example.com';
    const password = 'password123';
    
    // 对密码进行哈希处理
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // 插入用户到数据库
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    console.log('用户注册成功!');
    console.log('插入的用户ID:', result.insertId);
    
    // 验证用户是否正确插入
    const [rows] = await pool.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    if (rows.length > 0) {
      console.log('用户信息验证成功:');
      console.log('ID:', rows[0].id);
      console.log('用户名:', rows[0].username);
      console.log('邮箱:', rows[0].email);
      console.log('创建时间:', rows[0].created_at);
    } else {
      console.log('用户信息验证失败');
    }
    
  } catch (error) {
    console.error('用户注册测试失败:', error.message);
    if (error.code) {
      console.error('错误代码:', error.code);
    }
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

testUserRegistration();