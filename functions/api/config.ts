
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
        headers: {
          ...jsonHeaders,
          'ETag': 'initial',
        },
      });
    }

    const data = await object.json();
    return new Response(JSON.stringify(data), {
      headers: {
        ...jsonHeaders,
        'ETag': object.httpEtag, // R2의 객체 ETag 전달
      },
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

    const ifMatch = context.request.headers.get('If-Match');
    const newData = await context.request.json();
    
    // 이전 데이터 가져와서 ETag 검증 및 삭제 작업 수행
    const oldObject = await bucket.get(CONFIG_KEY);
    
    // ETag 정규화 함수 (따옴표 제거)
    const normalizeEtag = (tag: string | null | undefined) => {
        if (!tag) return null;
        return tag.replace(/^W\//, '').replace(/"/g, '');
    };

    const normalizedIfMatch = normalizeEtag(ifMatch);
    const normalizedOldEtag = oldObject ? normalizeEtag(oldObject.httpEtag) : 'initial';

    // Concurrency Check (Lost Update 방지)
    if (oldObject && normalizedIfMatch && normalizedIfMatch !== 'initial' && normalizedOldEtag !== normalizedIfMatch) {
        return new Response(JSON.stringify({ 
          error: 'Precondition Failed: Data has been modified by another user.',
          debug: { ifMatch: normalizedIfMatch, current: normalizedOldEtag }
        }), {
            status: 412,
            headers: jsonHeaders,
        });
    }

    if (oldObject) {
      try {
        const oldData = await oldObject.json();
        const newUrls = new Set<string>();
        
        if (Array.isArray(newData)) {
          newData.forEach((p: any) => {
            if (p.image) newUrls.add(p.image);
            if (p.video) newUrls.add(p.video);
          });
        }

        if (Array.isArray(oldData)) {
          for (const p of oldData) {
            const urlsToCheck = [p.image, p.video].filter(Boolean);
            for (const url of urlsToCheck) {
              if (typeof url === 'string' && !newUrls.has(url) && url.startsWith('/api/media/')) {
                const filename = url.replace('/api/media/', '');
                if (filename) {
                  try {
                    const decodedFilename = decodeURIComponent(filename);
                    await bucket.delete(decodedFilename);
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

    // R2에 데이터 저장 (객체 형태로 감싸서 저장)
    const savedObject = { 
      projects: newData,
      updatedAt: new Date().toISOString()
    };
    const putResult = await bucket.put(CONFIG_KEY, JSON.stringify(savedObject));

    return new Response(JSON.stringify(savedObject), {
      headers: {
        ...jsonHeaders,
        'ETag': putResult.httpEtag,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save config' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
};
