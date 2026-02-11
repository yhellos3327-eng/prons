import { jwtVerify } from 'jose';

interface Env {
  ADMIN_PASSWORD?: string;
  JWT_SECRET?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  // /api/ 경로에 대해서만 인증 체크 (POST, PUT, DELETE 등 데이터 변경 요청)
  // auth endpoint와 GET, OPTIONS 요청은 제외
  if (
    url.pathname.startsWith('/api/') && 
    url.pathname !== '/api/auth' &&
    context.request.method !== 'GET' && 
    context.request.method !== 'OPTIONS'
  ) {
    const adminPassword = context.env.ADMIN_PASSWORD;
    const jwtSecret = context.env.JWT_SECRET || adminPassword || 'default-secret-at-least-8-chars';
    
    const authHeader = context.request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = new TextEncoder().encode(jwtSecret);
      await jwtVerify(token, secret);
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return context.next();
};
