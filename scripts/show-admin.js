const mysql = require('mysql2/promise');
require('dotenv').config();

async function showAdmin() {
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
    
    // 检查是否存在管理员账户
    const [adminRows] = await connection.execute('SELECT username, email FROM admins LIMIT 1');
    
    if (adminRows.length === 0) {
      console.log('未找到管理员账户');
      console.log('请先运行以下命令初始化管理员账户:');
      console.log('npm run init-admin');
      return;
    }
    
    const admin = adminRows[0];
    
    console.log('\n=== 管理员账户信息 ===');
    console.log('用户名:', admin.username);
    console.log('邮箱:', admin.email);
    console.log('默认密码: admin123');
    console.log('========================\n');
    console.log('提示: 为了安全起见，请在首次登录后立即修改默认密码。');
    
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('未找到管理员表，请先运行以下命令初始化管理员账户:');
      console.log('npm run init-admin');
    } else {
      console.error('获取管理员账户信息失败:', error.message);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行显示管理员信息
showAdmin();