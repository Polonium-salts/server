const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chat_app',
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function testConnection() {
  try {
    console.log('正在尝试连接数据库...');
    console.log('数据库配置:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('数据库连接成功!');
    await connection.ping();
    console.log('数据库连接正常!');
    connection.release();
    await pool.end();
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    if (error.code) {
      console.error('错误代码:', error.code);
    }
    if (error.errno) {
      console.error('错误编号:', error.errno);
    }
  }
}

testConnection();