const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chat_app',
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function initDatabase() {
  let pool;
  let connection;
  
  try {
    console.log('正在连接数据库...');
    pool = mysql.createPool(dbConfig);
    connection = await pool.getConnection();
    console.log('数据库连接成功!');
    
    // 创建用户表
    console.log('正在创建用户表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('用户表创建成功!');
    
    // 创建消息表
    console.log('正在创建消息表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (receiver_id) REFERENCES users(id)
      )
    `);
    console.log('消息表创建成功!');
    
    // 创建好友关系表
    console.log('正在创建用户关系表...');
    await connection.execute(`
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
    console.log('用户关系表创建成功!');
    
    console.log('所有表结构创建完成!');
    
  } catch (error) {
    console.error('数据库初始化失败:', error.message);
    if (error.code) {
      console.error('错误代码:', error.code);
    }
    if (error.errno) {
      console.error('错误编号:', error.errno);
    }
  } finally {
    if (connection) {
      connection.release();
    }
    if (pool) {
      await pool.end();
    }
  }
}

initDatabase();