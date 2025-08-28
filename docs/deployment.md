# 部署指南

本指南将帮助您将聊天应用服务端部署到生产环境。

## 部署选项

### 1. 使用 Docker (推荐)

#### 要求
- Docker
- Docker Compose

#### 步骤
1. 克隆仓库到您的服务器
   ```bash
   git clone <repository-url>
   cd server
   ```

2. 更新 `docker-compose.yml` 中的环境变量
   ```yaml
   environment:
     - JWT_SECRET=your_secure_jwt_secret_here
     # 更新其他敏感信息
   ```

3. 启动服务
   ```bash
   docker-compose up -d
   ```

4. 应用将在端口 3000 上运行

#### 数据库迁移
首次部署时，您可能需要初始化数据库表：
```bash
docker-compose exec app node lib/initDb.js
```

### 2. 手动部署

#### 要求
- Node.js 18+
- MySQL 8.0+
- npm 或 yarn

#### 步骤
1. 克隆仓库
   ```bash
   git clone <repository-url>
   cd server
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 配置环境变量
   创建 `.env.production` 文件：
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=chat_app
   DB_PORT=3306

   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRES_IN=24h

   NODE_ENV=production
   ```

4. 构建应用
   ```bash
   npm run build
   ```

5. 启动应用
   ```bash
   npm start
   ```

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| DB_HOST | 数据库主机地址 | localhost |
| DB_USER | 数据库用户名 | chatuser |
| DB_PASSWORD | 数据库密码 | chatpassword |
| DB_NAME | 数据库名称 | chat_app |
| DB_PORT | 数据库端口 | 3306 |
| JWT_SECRET | JWT密钥 | your_jwt_secret |
| JWT_EXPIRES_IN | JWT过期时间 | 24h |
| NODE_ENV | 运行环境 | production |

## 数据库设置

### 创建数据库用户
```sql
CREATE DATABASE chat_app;
CREATE USER 'chatuser'@'%' IDENTIFIED BY 'chatpassword';
GRANT ALL PRIVILEGES ON chat_app.* TO 'chatuser'@'%';
FLUSH PRIVILEGES;
```

### 初始化表结构
运行初始化脚本创建表：
```bash
node lib/initDb.js
```

## 反向代理配置

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 安全建议

1. 使用强密码和密钥
2. 启用 HTTPS (使用 Let's Encrypt 等)
3. 定期备份数据库
4. 限制数据库访问权限
5. 使用防火墙限制不必要的端口访问

## 监控和日志

### 使用 PM2 进程管理
```bash
npm install -g pm2
pm2 start npm --name "chat-app" -- start
pm2 startup
pm2 save
```

### 日志查看
```bash
pm2 logs chat-app
```

## 故障排除

### 数据库连接问题
1. 检查数据库服务是否运行
2. 验证环境变量中的数据库配置
3. 确认数据库用户权限

### 应用启动失败
1. 检查端口是否被占用
2. 查看日志文件获取错误信息
3. 验证所有环境变量是否正确设置

## 更新部署

### 使用 Docker
```bash
git pull
docker-compose down
docker-compose up --build -d
```

### 手动部署
```bash
git pull
npm install
npm run build
pm2 restart chat-app
```