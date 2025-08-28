const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDbConnection() {
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
    console.log('正在测试数据库连接...');
    console.log('配置信息:');
    console.log('- 主机:', dbConfig.host);
    console.log('- 用户:', dbConfig.user);
    console.log('- 数据库:', dbConfig.database);
    console.log('- 端口:', dbConfig.port);
    
    // 连接到数据库
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✓ 数据库连接成功');
    
    // 测试查询
    const [rows] = await connection.execute('SELECT 1 as connected');
    console.log('✓ 数据库查询测试成功');
    
    // 检查是否存在admins表
    try {
      const [adminRows] = await connection.execute('SELECT COUNT(*) as count FROM admins');
      console.log('✓ admins表存在，管理员账户数量:', adminRows[0].count);
    } catch (error) {
      console.log('⚠ admins表不存在或无法访问:', error.message);
    }
    
    await connection.end();
    console.log('数据库连接测试完成');
    
  } catch (error) {
    console.error('✗ 数据库连接失败:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// 执行测试
testDbConnection();