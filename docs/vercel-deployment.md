# Vercel 部署指南

本指南将帮助您将此 Next.js 应用程序部署到 Vercel。

## 部署前准备

1. 确保您的代码已推送到 GitHub、GitLab 或 Bitbucket 仓库
2. 准备好您的 MySQL 数据库连接信息
3. 准备好 JWT 密钥

## 部署步骤

### 1. 在 Vercel 上创建项目

1. 访问 [vercel.com](https://vercel.com) 并登录您的账户
2. 点击 "New Project"
3. 选择您的 Git 仓库
4. 配置项目设置：
   - Framework Preset: Next.js
   - Root Directory: 保持为空（如果代码在根目录）
   - Build and Output Settings: 使用默认设置

### 2. 配置环境变量

在 Vercel 项目的 "Settings" -> "Environment Variables" 中添加以下环境变量：

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=production
```

### 3. 部署

1. 点击 "Deploy" 按钮
2. 等待构建和部署完成
3. 部署成功后，您将获得一个 Vercel URL

## 注意事项

### 数据库连接

- 确保您的 MySQL 数据库可以从 Vercel 访问
- 如果使用本地数据库，您需要将其暴露到公网或使用云数据库服务
- Vercel Serverless Functions 有执行时间限制，请确保数据库查询不会超时

### 环境变量

- 不要在代码中硬编码敏感信息
- 所有敏感信息应通过 Vercel 环境变量配置

### 自定义域名

如果您想使用自定义域名：
1. 在 Vercel 项目的 "Settings" -> "Domains" 中添加您的域名
2. 按照指示配置 DNS 记录

## 故障排除

### "Unexpected token '<'" 错误

这是最常见的部署问题，通常表示 JavaScript 文件被错误地返回为 HTML 内容。解决方法：

1. 检查您的 [vercel.json](file://d:\Users\17932\Documents\GitHub\server\vercel.json) 配置文件，确保路由规则不会拦截静态资源请求
2. 确保您的 Next.js 配置中没有设置冲突的 basePath 或 assetPrefix
3. 检查 API 路由是否与静态资源路径冲突

### 数据库连接问题

如果遇到数据库连接问题：
1. 检查环境变量是否正确配置
2. 确保数据库可以从外部访问
3. 检查防火墙设置

### 构建失败

如果构建失败：
1. 检查依赖是否正确安装
2. 确保 Node.js 版本兼容（建议使用 Node.js 18 或更高版本）
3. 查看构建日志以获取详细错误信息

## 本地开发与生产环境的区别

1. 环境变量来源不同：本地使用 `.env` 文件，Vercel 使用项目设置中的环境变量
2. 数据库连接可能需要不同的配置
3. 日志输出在 Vercel 上会受到限制

## Vercel 特定配置

本项目包含以下 Vercel 特定配置文件：

1. **[vercel.json](file://d:\Users\17932\Documents\GitHub\server\vercel.json)** - Vercel 部署配置
2. **[next.config.ts](file://d:\Users\17932\Documents\GitHub\server\next.config.ts)** - Next.js 配置，包含 Vercel 优化设置
3. **[lib/db.ts](file://d:\Users\17932\Documents\GitHub\server\lib\db.ts)** - 数据库连接配置，支持 Vercel 环境

这些配置确保了应用程序在 Vercel 上的正确运行。