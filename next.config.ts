import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 在Vercel上使用环境变量
  env: {
    // 数据库配置
    DB_HOST: process.env.DB_HOST || '',
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || '',
    DB_PORT: process.env.DB_PORT || '3306',
    
    // JWT配置
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // 支持在Vercel上使用serverless函数
  serverExternalPackages: ['mysql2'],
  
  // 针对Vercel的优化配置
  poweredByHeader: false,
  compress: true,
  
  // 静态资源优化
  images: {
    unoptimized: true, // Vercel会处理图片优化
  },
  
  // 针对Vercel的路径配置
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;