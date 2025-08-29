import pool from './db';
import { Message, MessageCreationParams } from '../models/Message';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class MessageService {
  // 发送消息
  static async sendMessage(params: MessageCreationParams): Promise<Message | null> {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
        [params.sender_id, params.receiver_id, params.content]
      );
      
      const messageId = result.insertId;
      const message = await this.getMessageById(messageId);
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  // 根据ID获取消息
  static async getMessageById(id: number): Promise<Message | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM messages WHERE id = ?',
        [id]
      );
      
      const messages = rows as Message[];
      return messages.length > 0 ? messages[0] : null;
    } catch (error) {
      console.error('Error getting message by ID:', error);
      return null;
    }
  }

  // 获取两个用户之间的消息
  static async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM messages 
         WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?)
         ORDER BY created_at ASC`,
        [userId1, userId2, userId2, userId1]
      );
      
      return rows as Message[];
    } catch (error) {
      console.error('Error getting messages between users:', error);
      return [];
    }
  }

  // 获取用户的所有消息
  static async getUserMessages(userId: number): Promise<Message[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM messages 
         WHERE sender_id = ? OR receiver_id = ?
         ORDER BY created_at DESC`,
        [userId, userId]
      );
      
      return rows as Message[];
    } catch (error) {
      console.error('Error getting user messages:', error);
      return [];
    }
  }

  // 删除消息
  static async deleteMessage(messageId: number, userId: number): Promise<boolean> {
    try {
      // 只有发送者可以删除消息
      const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM messages WHERE id = ? AND sender_id = ?',
        [messageId, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }
}