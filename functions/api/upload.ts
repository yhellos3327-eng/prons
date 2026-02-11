
export const onRequestPost: PagesFunction = async (context) => {
  try {
    const bucket = context.env.PORTFOLIO_BUCKET;
    if (!bucket) {
      return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(context.request.url);
    const filename = url.searchParams.get('filename') || `upload-${Date.now()}`;
    
    if (!context.request.body) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await bucket.put(filename, context.request.body, {
      httpMetadata: {
        contentType: context.request.headers.get('content-type') || 'application/octet-stream',
      },
    });

    return new Response(JSON.stringify({ 
      success: true, 
      url: `/api/media/${filename}`,
      filename 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
