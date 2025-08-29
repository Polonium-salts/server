import { NextRequest, NextFetchEvent } from 'next/server';
import { verifyToken } from '../lib/auth';

export async function authMiddleware(request: NextRequest, event: NextFetchEvent) {
  const authHeader = request.headers.get('authorization');
  
  console.log('Auth middleware called');
  console.log('Authorization header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No valid Authorization header found');
    return new Response(
      JSON.stringify({ error: 'Unauthorized: No token provided' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  const token = authHeader.substring(7);
  console.log('Token extracted:', token.substring(0, 20) + '...');
  
  const user = await verifyToken(token);
  console.log('User from verifyToken:', user);
  
  if (!user) {
    console.log('Token verification failed');
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Invalid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // 将用户信息添加到请求中
  (request as any).user = user;
  console.log('Auth middleware passed');
  return null; // 表示验证通过
}