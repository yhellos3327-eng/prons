
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

    if (!results || results.length === 0) {
      return new Response(JSON.stringify(defaultProjects), {
        headers: jsonHeaders,
      });
    }

    // 데이터 가공 (tags_string -> tags array)
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

    // D1 Batch 트랜잭션 시작
    const statements: D1PreparedStatement[] = [];

    // 1. 기존 데이터 전체 삭제
    statements.push(db.prepare('DELETE FROM tags'));
    statements.push(db.prepare('DELETE FROM projects'));

    // 2. 새 데이터 삽입
    newData.forEach((p: any, index: number) => {
      statements.push(db.prepare(`
        INSERT INTO projects (id, title, description, image, video, display_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(p.id, p.title, p.description, p.image || null, p.video || null, index));

      if (Array.isArray(p.tags)) {
        p.tags.forEach((tag: string) => {
          statements.push(db.prepare(`
            INSERT INTO tags (project_id, tag)
            VALUES (?, ?)
          `).bind(p.id, tag));
        });
      }
    });

    // 배치 실행
    await db.batch(statements);

    return new Response(JSON.stringify(newData), {
      headers: jsonHeaders,
    });
  } catch (error) {
    console.error('D1 Save Config Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save config to D1' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
};
