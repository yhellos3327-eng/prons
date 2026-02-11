import { SignJWT } from 'jose';

interface Env {
  ADMIN_PASSWORD?: string;
  JWT_SECRET?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const adminPassword = context.env.ADMIN_PASSWORD;
  const jwtSecret = context.env.JWT_SECRET || adminPassword || 'default-secret-at-least-8-chars';
  
  const requestPassword = context.request.headers.get('x-admin-password');

  if (!adminPassword || adminPassword !== requestPassword) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // JWT 생성
  const secret = new TextEncoder().encode(jwtSecret);
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // 2시간 유효
    .sign(secret);

  return new Response(JSON.stringify({ success: true, token }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
