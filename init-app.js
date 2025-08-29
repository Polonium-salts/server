const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chat_app',
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function initDatabase() {
  let pool;
  
  try {
    console.log('正在连接数据库...');
    pool = mysql.createPool(dbConfig);
    console.log('数据库连接成功!');
    
    // 创建用户表
    console.log('正在创建用户表...');
    await pool.execute(`
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
    await pool.execute(`
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
    await pool.execute(`
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
    
    // 创建管理员表
    console.log('正在创建管理员表...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('管理员表创建成功!');
    
    console.log('所有表结构创建完成!');
    
    return pool;
  } catch (error) {
    console.error('数据库初始化失败:', error.message);
    if (error.code) {
      console.error('错误代码:', error.code);
    }
    if (error.errno) {
      console.error('错误编号:', error.errno);
    }
    process.exit(1);
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdminUser(pool) {
  try {
    console.log('\n=== 设置管理面板管理员账户 ===');
    
    const username = await askQuestion('请输入管理员用户名 (默认: admin): ');
    const email = await askQuestion('请输入管理员邮箱 (默认: admin@example.com): ');
    const password = await askQuestion('请输入管理员密码 (默认: admin123): ');
    
    const adminUsername = username || 'admin';
    const adminEmail = email || 'admin@example.com';
    const adminPassword = password || 'admin123';
    
    // 检查是否已存在管理员账户
    const [existingAdmins] = await pool.execute(
      'SELECT id FROM admins WHERE username = ? OR email = ?',
      [adminUsername, adminEmail]
    );
    
    if (existingAdmins.length > 0) {
      console.log('管理员账户已存在，跳过创建...');
      return;
    }
    
    // 对密码进行哈希处理
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    
    // 插入管理员到数据库
    const [result] = await pool.execute(
      'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
      [adminUsername, adminEmail, hashedPassword]
    );
    
    console.log('管理员账户创建成功!');
    console.log('管理员用户名:', adminUsername);
    console.log('管理员邮箱:', adminEmail);
    console.log('请妥善保管您的密码!');
    
  } catch (error) {
    console.error('创建管理员账户失败:', error.message);
  }
}

async function main() {
  console.log('=== 聊天应用初始化工具 ===\n');
  
  // 初始化数据库
  const pool = await initDatabase();
  
  // 创建管理员账户
  await createAdminUser(pool);
  
  // 关闭数据库连接
  await pool.end();
  
  console.log('\n应用初始化完成!');
  console.log('现在您可以启动应用并使用管理员账户登录管理面板。');
  
  rl.close();
}

main();