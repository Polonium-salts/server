import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { authMiddleware } from '../../../middleware/auth';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// 发送消息
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const authResponse = await authMiddleware(request, {} as any);
    if (authResponse) return authResponse;
    
    const user = (request as any).user;
    const body = await request.json();
    const { receiver_id, content } = body;
    
    // 验证必填字段
    if (!receiver_id || !content) {
      return NextResponse.json(
        { error: 'Receiver ID and content are required' },
        { status: 400 }
      );
    }
    
    // 检查接收者是否存在
    const [receiverRows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE id = ?',
      [receiver_id]
    );
    
    if (receiverRows.length === 0) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      );
    }
    
    // 插入消息
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [user.id, receiver_id, content]
    );
    
    const messageId = result.insertId;
    
    // 获取插入的消息
    const [messageRows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM messages WHERE id = ?',
      [messageId]
    );
    
    const messages = messageRows;
    
    return NextResponse.json({
      message: 'Message sent successfully',
      data: messages[0]
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 获取用户消息
export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const authResponse = await authMiddleware(request, {} as any);
    if (authResponse) return authResponse;
    
    const user = (request as any).user;
    
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    let messages: RowDataPacket[];
    if (userId) {
      // 获取与特定用户的消息
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM messages 
         WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?)
         ORDER BY created_at ASC`,
        [user.id, userId, userId, user.id]
      );
      messages = rows;
    } else {
      // 获取所有消息
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM messages 
         WHERE sender_id = ? OR receiver_id = ?
         ORDER BY created_at DESC`,
        [user.id, user.id]
      );
      messages = rows;
    }
    
    return NextResponse.json({
      message: 'Messages retrieved successfully',
      data: messages
    });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}