# API 文档

## 认证

大部分 API 端点需要认证。认证通过在请求头中包含 `Authorization` 字段实现：

```
Authorization: Bearer <your_jwt_token>
```

## 用户相关 API

### 注册新用户

**请求**
```
POST /api/users
```

**参数**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**响应**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  }
}
```

### 用户登录

**请求**
```
PUT /api/users
```

**参数**
```json
{
  "email": "string",
  "password": "string"
}
```

**响应**
```json
{
  "message": "Login successful",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  },
  "token": "string"
}
```

### 获取用户信息

**请求**
```
GET /api/users/{id}
```

**参数**
- id: 用户ID

**响应**
```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": "number",
    "username": "string",
    "email": "string",
    "created_at": "date"
  }
}
```

## 消息相关 API

### 发送消息

**请求**
```
POST /api/messages
```

**参数**
```json
{
  "receiver_id": "number",
  "content": "string"
}
```

**响应**
```json
{
  "message": "Message sent successfully",
  "data": {
    "id": "number",
    "sender_id": "number",
    "receiver_id": "number",
    "content": "string",
    "created_at": "date"
  }
}
```

### 获取消息

**请求**
```
GET /api/messages?user_id={user_id}
```

**参数**
- user_id (可选): 获取与特定用户的消息

**响应**
```json
{
  "message": "Messages retrieved successfully",
  "data": [
    {
      "id": "number",
      "sender_id": "number",
      "receiver_id": "number",
      "content": "string",
      "created_at": "date"
    }
  ]
}
```

## 用户关系相关 API

### 添加好友

**请求**
```
POST /api/relations
```

**参数**
```json
{
  "related_user_id": "number"
}
```

**响应**
```json
{
  "message": "Friend request sent successfully",
  "data": {
    "id": "number",
    "user_id": "number",
    "related_user_id": "number",
    "status": "pending",
    "created_at": "date",
    "updated_at": "date"
  }
}
```

### 获取好友列表

**请求**
```
GET /api/relations
```

**响应**
```json
{
  "message": "Friend list retrieved successfully",
  "data": [
    {
      "id": "number",
      "user_id": "number",
      "related_user_id": "number",
      "status": "accepted",
      "created_at": "date",
      "updated_at": "date",
      "friend_username": "string",
      "friend_email": "string"
    }
  ]
}
```

### 接受好友请求

**请求**
```
PUT /api/relations
```

**参数**
```json
{
  "relation_id": "number"
}
```

**响应**
```json
{
  "message": "Friend request accepted successfully"
}
```

### 删除好友关系

**请求**
```
DELETE /api/relations?id={relation_id}
```

**参数**
- relation_id: 关系ID

**响应**
```json
{
  "message": "Friend relationship deleted successfully"
}
```

## 错误响应

所有错误响应都遵循以下格式：

```json
{
  "error": "Error message"
}
```

### 常见 HTTP 状态码

- 200: 请求成功
- 201: 创建成功
- 400: 请求参数错误
- 401: 未授权
- 404: 资源未找到
- 409: 资源冲突
- 500: 服务器内部错误