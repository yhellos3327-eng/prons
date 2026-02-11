
export const onRequestGet: PagesFunction = async (context) => {
  const bucket = context.env.PORTFOLIO_BUCKET;
  const filename = context.params.filename as string;

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
