
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

    const newData = await context.request.json();
    
    // 이전 데이터 가져와서 삭제된 미디어 파일 확인
    const oldObject = await bucket.get(CONFIG_KEY);
    if (oldObject) {
      try {
        const oldData = await oldObject.json();
        const newUrls = new Set<string>();
        
        // 새로운 데이터의 모든 미디어 URL 수집
        if (Array.isArray(newData)) {
          newData.forEach((p: any) => {
            if (p.image) newUrls.add(p.image);
            if (p.video) newUrls.add(p.video);
          });
        }

        // 이전 데이터 중 새로운 데이터에 없는 URL 삭제 루틴
        if (Array.isArray(oldData)) {
          for (const p of oldData) {
            const urlsToCheck = [p.image, p.video].filter(Boolean);
            for (const url of urlsToCheck) {
              if (typeof url === 'string' && !newUrls.has(url) && url.startsWith('/api/media/')) {
                // URL에서 파일명 추출
                const filename = url.replace('/api/media/', '');
                if (filename) {
                  try {
                    const decodedFilename = decodeURIComponent(filename);
                    await bucket.delete(decodedFilename);
                    console.log(`Deleted media file: ${decodedFilename}`);
                  } catch (e) {
                    console.error(`Failed to delete media file ${filename}:`, e);
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.error('Failed to process media deletion:', e);
      }
    }

    // R2에 데이터 저장
    await bucket.put(CONFIG_KEY, JSON.stringify(newData));

    return new Response(JSON.stringify({ success: true, data: newData }), {
      headers: jsonHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save config' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
};
