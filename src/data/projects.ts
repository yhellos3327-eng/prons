import { type Project } from '../schemas';
export type { Project };

/**
 * 기본 프로젝트 데이터
 * 
 * 이제 Cloudflare D1 데이터베이스를 사용하므로, 이 파일은 초기 로딩용으로만 사용됩니다.
 * 원치 않는 데이터가 계속 나타나는 것을 방지하기 위해 빈 배열로 초기화하거나 
 * 최소한의 데이터만 남겨둡니다.
 */
export const projects: Project[] = [];
