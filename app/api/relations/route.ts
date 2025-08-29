import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { authMiddleware } from '../../../middleware/auth';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// 添加好友
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const authResponse = await authMiddleware(request, {} as any);
    if (authResponse) return authResponse;
    
    const user = (request as any).user;
    const body = await request.json();
    const { related_user_id } = body;
    
    // 验证必填字段
    if (!related_user_id) {
      return NextResponse.json(
        { error: 'Related user ID is required' },
        { status: 400 }
      );
    }
    
    // 不能添加自己为好友
    if (user.id === related_user_id) {
      return NextResponse.json(
        { error: 'You cannot add yourself as a friend' },
        { status: 400 }
      );
    }
    
    // 检查用户是否存在
    const [userRows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE id = ?',
      [related_user_id]
    );
    
    if (userRows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // 检查是否已经存在关系
    const [relationRows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM user_relations WHERE (user_id = ? AND related_user_id = ?) OR (user_id = ? AND related_user_id = ?)',
      [user.id, related_user_id, related_user_id, user.id]
    );
    
    if (relationRows.length > 0) {
      return NextResponse.json(
        { error: 'Friend relationship already exists' },
        { status: 409 }
      );
    }
    
    // 创建好友关系
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO user_relations (user_id, related_user_id, status) VALUES (?, ?, ?)',
      [user.id, related_user_id, 'pending']
    );
    
    const relationId = result.insertId;
    
    // 获取插入的关系
    const [relationRows2] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM user_relations WHERE id = ?',
      [relationId]
    );
    
    const relations = relationRows2;
    
    return NextResponse.json({
      message: 'Friend request sent successfully',
      data: relations[0]
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 获取好友列表
export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const authResponse = await authMiddleware(request, {} as any);
    if (authResponse) return authResponse;
    
    const user = (request as any).user;
    
    // 获取好友关系
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ur.*, u.username as friend_username, u.email as friend_email
       FROM user_relations ur
       JOIN users u ON (ur.related_user_id = u.id)
       WHERE ur.user_id = ? AND ur.status = 'accepted'`,
      [user.id]
    );
    
    const relations = rows;
    
    return NextResponse.json({
      message: 'Friend list retrieved successfully',
      data: relations
    });
  } catch (error) {
    console.error('Error retrieving friend list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 接受好友请求
export async function PUT(request: NextRequest) {
  try {
    // 验证用户身份
    const authResponse = await authMiddleware(request, {} as any);
    if (authResponse) return authResponse;
    
    const user = (request as any).user;
    const body = await request.json();
    const { relation_id } = body;
    
    // 验证必填字段
    if (!relation_id) {
      return NextResponse.json(
        { error: 'Relation ID is required' },
        { status: 400 }
      );
    }
    
    // 检查关系是否存在且用户是接收者
    const [relationRows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM user_relations WHERE id = ? AND related_user_id = ?',
      [relation_id, user.id]
    );
    
    const relations = relationRows;
    
    if (relations.length === 0) {
      return NextResponse.json(
        { error: 'Friend request not found' },
        { status: 404 }
      );
    }
    
    // 更新关系状态
    await pool.execute<ResultSetHeader>(
      'UPDATE user_relations SET status = ? WHERE id = ?',
      ['accepted', relation_id]
    );
    
    // 创建反向关系
    await pool.execute<ResultSetHeader>(
      'INSERT INTO user_relations (user_id, related_user_id, status) VALUES (?, ?, ?)',
      [user.id, relations[0].user_id, 'accepted']
    );
    
    return NextResponse.json({
      message: 'Friend request accepted successfully'
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 删除好友关系
export async function DELETE(request: NextRequest) {
  try {
    // 验证用户身份
    const authResponse = await authMiddleware(request, {} as any);
    if (authResponse) return authResponse;
    
    const user = (request as any).user;
    
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const relationId = searchParams.get('id');
    
    if (!relationId) {
      return NextResponse.json(
        { error: 'Relation ID is required' },
        { status: 400 }
      );
    }
    
    // 检查关系是否存在且用户参与其中
    const [relationRows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM user_relations WHERE id = ? AND (user_id = ? OR related_user_id = ?)',
      [relationId, user.id, user.id]
    );
    
    const relations = relationRows;
    
    if (relations.length === 0) {
      return NextResponse.json(
        { error: 'Friend relationship not found' },
        { status: 404 }
      );
    }
    
    // 删除关系
    await pool.execute<ResultSetHeader>(
      'DELETE FROM user_relations WHERE id = ?',
      [relationId]
    );
    
    // 删除反向关系
    await pool.execute<ResultSetHeader>(
      'DELETE FROM user_relations WHERE user_id = ? AND related_user_id = ?',
      [relations[0].related_user_id, relations[0].user_id]
    );
    
    return NextResponse.json({
      message: 'Friend relationship deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting friend relationship:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}