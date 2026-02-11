import { jwtVerify } from 'jose';

interface Env {
  PORTFOLIO_BUCKET: R2Bucket;
  ADMIN_PASSWORD?: string;
  JWT_SECRET?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const bucket = context.env.PORTFOLIO_BUCKET;
    const adminPassword = context.env.ADMIN_PASSWORD;
    const jwtSecret = context.env.JWT_SECRET || adminPassword || 'default-secret-at-least-8-chars';

    if (!bucket) {
      return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. JWT 검증
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    try {
      const secret = new TextEncoder().encode(jwtSecret);
      await jwtVerify(token, secret);
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Multipart Form Data 처리
    const formData = await context.request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. 서버 측 파일명 생성 및 검증
    const extension = file.name.split('.').pop() || 'bin';
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm'];
    
    if (!allowedExtensions.includes(extension.toLowerCase())) {
        return new Response(JSON.stringify({ error: 'Unsupported file type' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const filename = `${crypto.randomUUID()}.${extension}`;
    
    await bucket.put(filename, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    return new Response(JSON.stringify({ 
      success: true, 
      url: `/api/media/${encodeURIComponent(filename)}`,
      filename 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
