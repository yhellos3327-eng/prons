
import { projects as defaultProjects } from '../../src/data/projects';

const CONFIG_KEY = 'portfolio-config.json';

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export const onRequestGet: PagesFunction = async (context) => {
  try {
    const bucket = context.env.PORTFOLIO_BUCKET;
    if (!bucket) {
       return new Response(JSON.stringify(defaultProjects), {
        headers: jsonHeaders,
      });
    }

    const object = await bucket.get(CONFIG_KEY);

    if (!object) {
      return new Response(JSON.stringify(defaultProjects), {
        headers: jsonHeaders,
      });
    }

    const data = await object.json();
    return new Response(JSON.stringify(data), {
      headers: jsonHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch config' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
};

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const bucket = context.env.PORTFOLIO_BUCKET;
    if (!bucket) {
      return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
        status: 500,
        headers: jsonHeaders,
      });
    }

    const data = await context.request.json();

    // R2에 데이터 저장
    await bucket.put(CONFIG_KEY, JSON.stringify(data));

    return new Response(JSON.stringify({ success: true, data }), {
      headers: jsonHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save config' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
};
