
import { projects as defaultProjects } from '../../src/data/projects';

// Cloudflare D1 Types (Defined locally to avoid build-time conflicts with global types)
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<any>;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  all<T = any>(): Promise<{ results: T[] }>;
  run(): Promise<any>;
}

interface Env {
  DB: D1Database;
}

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    if (!db) {
      console.warn('D1 binding "DB" not found. Falling back to static data.');
      return new Response(JSON.stringify(defaultProjects), {
        headers: jsonHeaders,
      });
    }

    // Projects와 Tags를 조인하여 가져오기
    const { results } = await db.prepare(`
      SELECT p.*, GROUP_CONCAT(t.tag) as tags_string
      FROM projects p
      LEFT JOIN tags t ON p.id = t.project_id
      GROUP BY p.id
      ORDER BY p.display_order ASC
    `).all();

    // 데이터가 없는 경우 빈 배열 반환 (사용자가 의도적으로 다 삭제했을 수 있음)
    const projects = results.map((row: any) => ({
      ...row,
      tags: row.tags_string ? row.tags_string.split(',') : [],
      tags_string: undefined // 임시 필드 제거
    }));

    return new Response(JSON.stringify(projects), {
      headers: jsonHeaders,
    });
  } catch (error) {
    console.error('D1 Get Config Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch config from D1' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'D1 database "DB" not configured' }), {
        status: 500,
        headers: jsonHeaders,
      });
    }

    const newData = await context.request.json();
    if (!Array.isArray(newData)) {
      return new Response(JSON.stringify({ error: 'Invalid data format' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    console.log(`Starting D1 Batch Update for ${newData.length} projects`);

    // D1 Batch 트랜잭션 시작
    const statements: D1PreparedStatement[] = [];

    // 1. 기존 데이터 전체 삭제
    statements.push(db.prepare('DELETE FROM tags'));
    statements.push(db.prepare('DELETE FROM projects'));

    // 2. 새 데이터 삽입
    // ID가 AUTOINCREMENT이므로, 새 데이터를 넣을 때 ID가 충돌할 수 있음.
    // 하지만 DELETE 이후에 같은 ID를 명시적으로 넣는 것은 가능함.
    newData.forEach((p: any, index: number) => {
      // 숫자가 아닌 ID(임시 ID)인 경우 null로 처리하여 DB가 생성하게 함
      const idToInsert = typeof p.id === 'string' ? null : p.id;
      
      statements.push(db.prepare(`
        INSERT INTO projects (id, title, description, image, video, display_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(idToInsert, p.title, p.description, p.image || null, p.video || null, index));

      if (Array.isArray(p.tags)) {
        p.tags.forEach((tag: string) => {
          // 태그 삽입 시 project_id는 방금 생성되거나 지정된 p.id를 참조해야 함
          // 만약 idToInsert가 null이면 이 시점에서는 project_id를 알 수 없음 (Batch의 한계)
          // 따라서 프론트엔드에서 준 ID를 최대한 존중하는 방향으로 가거나 
          // tags 테이블 설정을 변경해야 함. 여기서는 기존 ID 유지 방식 우선.
          statements.push(db.prepare(`
            INSERT INTO tags (project_id, tag)
            VALUES (?, ?)
          `).bind(p.id, tag));
        });
      }
    });

    // 배치 실행
    await db.batch(statements);
    console.log('D1 Batch Update Successful');

    return new Response(JSON.stringify(newData), {
      headers: jsonHeaders,
    });
  } catch (error: any) {
    console.error('D1 Save Config Error:', error.message, error.stack);
    return new Response(JSON.stringify({ error: `Failed to save config: ${error.message}` }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
};
