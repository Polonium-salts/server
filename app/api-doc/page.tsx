'use client';

import React, { useState } from 'react';

const ApiDocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: '概述' },
    { id: 'authentication', title: '认证' },
    { id: 'users', title: '用户相关API' },
    { id: 'messages', title: '消息相关API' },
    { id: 'relations', title: '用户关系相关API' },
    { id: 'admin', title: '管理员API' },
    { id: 'errors', title: '错误响应' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">API 文档</h1>
          <p className="text-lg text-gray-600">
            了解如何使用我们的 API 端点与服务进行交互
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏导航 */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">目录</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({
                        behavior: 'smooth',
                      });
                    }}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* 主内容区 */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                {/* 概述 */}
                <section id="overview" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">概述</h2>
                  <p className="text-gray-600 mb-4">
                    欢迎使用我们的 API 文档。本文档提供了关于如何使用我们的 API 端点的详细信息，
                    包括认证、用户管理、消息传递和好友关系等功能。
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          <strong>基础 URL:</strong> 所有 API 端点都基于应用的基础 URL。
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 认证 */}
                <section id="authentication" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">认证</h2>
                  <p className="text-gray-600 mb-4">
                    大部分 API 端点需要认证。认证通过在请求头中包含 <code className="bg-gray-100 px-1 rounded">Authorization</code> 字段实现：
                  </p>
                  <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
                    {`Authorization: Bearer <your_jwt_token>`}
                  </pre>
                  <p className="text-gray-600">
                    JWT token 通过用户登录接口获得。
                  </p>
                </section>

                {/* 用户相关API */}
                <section id="users" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">用户相关 API</h2>
                  
                  <div className="border rounded-lg mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">注册新用户</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          POST
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/users</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">请求参数</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
                        {`{
  "username": "string",
  "email": "string",
  "password": "string"
}`}
                      </pre>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "example_user",
    "email": "user@example.com"
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">用户登录</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          PUT
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/users</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">请求参数</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
                        {`{
  "email": "string",
  "password": "string"
}`}
                      </pre>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "example_user",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">获取所有用户</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          GET
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/users</code>
                      </div>
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          无需认证
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "username": "example_user",
      "email": "user@example.com",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">获取特定用户信息</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          GET
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/users/{'{id}'}</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">路径参数</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
                        <li><code>id</code>: 用户ID</li>
                      </ul>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "example_user",
    "email": "user@example.com",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </section>

                {/* 消息相关API */}
                <section id="messages" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">消息相关 API</h2>
                  
                  <div className="border rounded-lg mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">发送消息</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          POST
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/messages</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">请求参数</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
                        {`{
  "receiver_id": 2,
  "content": "Hello, how are you?"
}`}
                      </pre>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "Message sent successfully",
  "data": {
    "id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "content": "Hello, how are you?",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">获取消息</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          GET
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/messages?user_id={'{user_id}'}</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">查询参数</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
                        <li><code>user_id</code> (可选): 获取与特定用户的消息</li>
                      </ul>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "Messages retrieved successfully",
  "data": [
    {
      "id": 1,
      "sender_id": 1,
      "receiver_id": 2,
      "content": "Hello, how are you?",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                </section>

                {/* 用户关系相关API */}
                <section id="relations" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">用户关系相关 API</h2>
                  
                  <div className="border rounded-lg mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">添加好友</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          POST
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/relations</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">请求参数</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
                        {`{
  "related_user_id": 2
}`}
                      </pre>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "Friend request sent successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "related_user_id": 2,
    "status": "pending",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">获取好友列表</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          GET
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/relations</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "Friend list retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "related_user_id": 2,
      "status": "accepted",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z",
      "friend_username": "friend_user",
      "friend_email": "friend@example.com"
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">接受好友请求</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          PUT
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/relations</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">请求参数</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
                        {`{
  "relation_id": 1
}`}
                      </pre>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "Friend request accepted successfully"
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">删除好友关系</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          DELETE
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/relations?id={'{relation_id}'}</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">查询参数</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
                        <li><code>relation_id</code>: 关系ID</li>
                      </ul>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "Friend relationship deleted successfully"
}`}
                      </pre>
                    </div>
                  </div>
                </section>

                {/* 管理员API */}
                <section id="admin" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">管理员 API</h2>
                  
                  <div className="border rounded-lg mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">管理员登录</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          POST
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/admin/login</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">请求参数</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
                        {`{
  "username": "string",
  "password": "string"
}`}
                      </pre>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "登录成功",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">获取所有用户</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          GET
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/admin/users</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "用户列表获取成功",
  "data": [
    {
      "id": 1,
      "username": "example_user",
      "email": "user@example.com",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="text-lg font-medium text-gray-900">获取统计数据</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          GET
                        </span>
                        <code className="ml-2 text-sm text-gray-600">/api/admin/stats</code>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">响应示例</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {`{
  "message": "统计数据获取成功",
  "data": {
    "totalUsers": 10,
    "totalMessages": 50,
    "totalRelations": 20
  }
}`}
                      </pre>
                    </div>
                  </div>
                </section>

                {/* 错误响应 */}
                <section id="errors">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">错误响应</h2>
                  <p className="text-gray-600 mb-4">
                    所有错误响应都遵循以下格式：
                  </p>
                  <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-6">
                        {`{
  "error": "Error message"
}`}
                      </pre>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">常见 HTTP 状态码</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li><code className="bg-gray-100 px-1 rounded">200</code>: 请求成功</li>
                    <li><code className="bg-gray-100 px-1 rounded">201</code>: 创建成功</li>
                    <li><code className="bg-gray-100 px-1 rounded">400</code>: 请求参数错误</li>
                    <li><code className="bg-gray-100 px-1 rounded">401</code>: 未授权</li>
                    <li><code className="bg-gray-100 px-1 rounded">404</code>: 资源未找到</li>
                    <li><code className="bg-gray-100 px-1 rounded">409</code>: 资源冲突</li>
                    <li><code className="bg-gray-100 px-1 rounded">500</code>: 服务器内部错误</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentationPage;