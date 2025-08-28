import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    // 验证用户是否仍然存在
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    return null;
  }
}

export async function registerUser(username: string, email: string, password: string): Promise<User | null> {
  try {
    const hashedPassword = await hashPassword(password);
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    const userId = (result as any).insertId;
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    const users = rows as User[];
    return users[0];
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as User[];
    
    if (users.length === 0) {
      return null;
    }
    
    const user = users[0];
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return null;
    }
    
    const token = generateToken(user);
    return { user, token };
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
}