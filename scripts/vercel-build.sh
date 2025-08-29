#!/bin/bash
# Vercel 构建脚本

echo "开始 Vercel 构建过程..."

# 安装依赖
echo "安装依赖..."
npm ci

# 构建 Next.js 应用
echo "构建 Next.js 应用..."
npm run build

echo "Vercel 构建完成!"