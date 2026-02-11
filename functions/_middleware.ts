interface Env {
  ADMIN_PASSWORD?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  // /api/ 경로에 대해서만 인증 체크
  if (url.pathname.startsWith('/api/') && context.request.method !== 'GET') {
    const adminPassword = context.env.ADMIN_PASSWORD;
    const requestPassword = context.request.headers.get('x-admin-password');

    // 환경변수가 설정되지 않았거나 비밀번호가 일치하지 않으면 401 반환
    if (!adminPassword || adminPassword !== requestPassword) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return context.next();
};
