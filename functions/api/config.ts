
import { projects as defaultProjects } from '../../src/data/projects';

const CONFIG_KEY = 'portfolio-config.json';

export const onRequestGet: PagesFunction = async (context) => {
  try {
    const bucket = context.env.PORTFOLIO_BUCKET;
    if (!bucket) {
       return new Response(JSON.stringify(defaultProjects), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const object = await bucket.get(CONFIG_KEY);

    if (!object) {
      return new Response(JSON.stringify(defaultProjects), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await object.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const bucket = context.env.PORTFOLIO_BUCKET;
    if (!bucket) {
      return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await context.request.json();
    
    // R2에 데이터 저장
    await bucket.put(CONFIG_KEY, JSON.stringify(data));

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
