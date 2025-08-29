@echo off
REM Vercel 构建脚本 (Windows)

echo 开始 Vercel 构建过程...

REM 安装依赖
echo 安装依赖...
npm ci

REM 构建 Next.js 应用
echo 构建 Next.js 应用...
npm run build

echo Vercel 构建完成!