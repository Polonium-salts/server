import pool from './db';
import { UserRelation, UserRelationCreationParams, RelationStatus } from '../models/UserRelation';

export class UserRelationService {
  // 创建用户关系
  static async createRelation(params: UserRelationCreationParams): Promise<UserRelation | null> {
    try {
      // 检查是否已经存在关系
      const existingRelation = await this.getRelationBetweenUsers(
        params.user_id,
        params.related_user_id
      );
      
      if (existingRelation) {
        return null; // 关系已存在
      }
      
      const [result] = await pool.execute(
        'INSERT INTO user_relations (user_id, related_user_id, status) VALUES (?, ?, ?)',
        [params.user_id, params.related_user_id, params.status]
      );
      
      const relationId = (result as any).insertId;
      const relation = await this.getRelationById(relationId);
      return relation;
    } catch (error) {
      console.error('Error creating user relation:', error);
      return null;
    }
  }

  // 根据ID获取关系
  static async getRelationById(id: number): Promise<UserRelation | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM user_relations WHERE id = ?',
        [id]
      );
      
      const relations = rows as UserRelation[];
      return relations.length > 0 ? relations[0] : null;
    } catch (error) {
      console.error('Error getting relation by ID:', error);
      return null;
    }
  }

  // 获取两个用户之间的关系
  static async getRelationBetweenUsers(userId1: number, userId2: number): Promise<UserRelation | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM user_relations WHERE (user_id = ? AND related_user_id = ?) OR (user_id = ? AND related_user_id = ?)',
        [userId1, userId2, userId2, userId1]
      );
      
      const relations = rows as UserRelation[];
      return relations.length > 0 ? relations[0] : null;
    } catch (error) {
      console.error('Error getting relation between users:', error);
      return null;
    }
  }

  // 获取用户的好友列表
  static async getUserFriends(userId: number): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT ur.*, u.username as friend_username, u.email as friend_email
         FROM user_relations ur
         JOIN users u ON ur.related_user_id = u.id
         WHERE ur.user_id = ? AND ur.status = 'accepted'`,
        [userId]
      );
      
      return rows as any[];
    } catch (error) {
      console.error('Error getting user friends:', error);
      return [];
    }
  }

  // 更新关系状态
  static async updateRelationStatus(relationId: number, status: RelationStatus, userId: number): Promise<boolean> {
    try {
      // 检查用户是否有权限更新此关系
      const [rows] = await pool.execute(
        'SELECT * FROM user_relations WHERE id = ? AND related_user_id = ?',
        [relationId, userId]
      );
      
      const relations = rows as UserRelation[];
      
      if (relations.length === 0) {
        return false; // 用户无权限更新此关系
      }
      
      // 更新关系状态
      await pool.execute(
        'UPDATE user_relations SET status = ? WHERE id = ?',
        [status, relationId]
      );
      
      // 如果是接受好友请求，创建反向关系
      if (status === 'accepted') {
        await pool.execute(
          'INSERT INTO user_relations (user_id, related_user_id, status) VALUES (?, ?, ?)',
          [userId, relations[0].user_id, 'accepted']
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error updating relation status:', error);
      return false;
    }
  }

  // 删除关系
  static async deleteRelation(relationId: number, userId: number): Promise<boolean> {
    try {
      // 检查用户是否有权限删除此关系
      const [rows] = await pool.execute(
        'SELECT * FROM user_relations WHERE id = ? AND (user_id = ? OR related_user_id = ?)',
        [relationId, userId, userId]
      );
      
      const relations = rows as UserRelation[];
      
      if (relations.length === 0) {
        return false; // 用户无权限删除此关系
      }
      
      // 删除关系
      await pool.execute(
        'DELETE FROM user_relations WHERE id = ?',
        [relationId]
      );
      
      // 删除反向关系
      await pool.execute(
        'DELETE FROM user_relations WHERE user_id = ? AND related_user_id = ?',
        [relations[0].related_user_id, relations[0].user_id]
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting relation:', error);
      return false;
    }
  }
}