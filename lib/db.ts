import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 创建一个函数来获取数据库配置，支持动态更新
const getDbConfig = () => ({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chat_app',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  charset: 'utf8mb4'
});

// 创建连接池工厂函数
const createPool = () => {
  return mysql.createPool(getDbConfig());
};

// 初始化连接池
let pool = createPool();

// 导出一个函数来重新初始化连接池
export const reinitializePool = () => {
  pool = createPool();
  return pool;
};

// 添加测试连接函数
export const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return { success: true };
  } catch (error) {
    if (connection) {
      connection.release();
    }
    console.error('数据库连接测试失败:', error);
    return { success: false, error: (error as Error).message };
  }
};

export default pool;