import { NextRequest, NextFetchEvent } from 'next/server';
import { verifyToken } from '../lib/auth';

export async function authMiddleware(request: NextRequest, event: NextFetchEvent) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: No token provided' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  const token = authHeader.substring(7);
  const user = await verifyToken(token);
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Invalid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // 将用户信息添加到请求中
  (request as any).user = user;
  return null; // 表示验证通过
}