
export const onRequestGet: PagesFunction = async (context) => {
  const bucket = context.env.PORTFOLIO_BUCKET;
  let filename = context.params.filename as string;
  
  // URL 인코딩된 파일명 처리
  if (filename) {
    try {
      filename = decodeURIComponent(filename);
    } catch (e) {
      console.error('Filename decode error:', e);
      // 디코딩 실패 시 원본 사용 시도 또는 에러 리턴
    }
  }

  if (!bucket || !filename) {
    return new Response('Not Found', { status: 404 });
  }

  const object = await bucket.get(filename);
  if (!object) {
    return new Response('Not Found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body, { headers });
};
