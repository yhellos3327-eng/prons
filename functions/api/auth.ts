export const onRequestPost: PagesFunction = async (context) => {
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
