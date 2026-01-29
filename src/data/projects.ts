export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  behanceUrl?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: '브랜드 아이덴티티 디자인',
    description: '스타트업을 위한 로고, 컬러 시스템, 타이포그래피, 브랜드 가이드라인을 포함한 종합 브랜드 아이덴티티 디자인입니다.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    tags: ['브랜딩', '로고 디자인', 'CI/BI', 'Adobe Illustrator'],
    liveUrl: 'https://example.com',
    behanceUrl: 'https://behance.net',
  },
  {
    id: 2,
    title: '모바일 앱 UI/UX',
    description: '사용자 경험을 최우선으로 고려한 핀테크 앱 UI/UX 디자인. 사용자 리서치부터 프로토타입까지 전 과정을 담당했습니다.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    tags: ['UI/UX', 'Figma', '프로토타이핑', '사용자 리서치'],
    liveUrl: 'https://example.com',
    behanceUrl: 'https://behance.net',
  },
  {
    id: 3,
    title: '웹사이트 리디자인',
    description: '기업 웹사이트의 전면 리디자인 프로젝트. 모던한 디자인 시스템과 반응형 레이아웃을 적용했습니다.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
    tags: ['웹 디자인', '반응형', 'Figma', 'Webflow'],
    liveUrl: 'https://example.com',
    behanceUrl: 'https://behance.net',
  },
  {
    id: 4,
    title: '패키지 디자인',
    description: '프리미엄 화장품 브랜드를 위한 패키지 디자인. 고급스러운 소재와 미니멀한 디자인으로 브랜드 가치를 높였습니다.',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=600&fit=crop',
    tags: ['패키지 디자인', '인쇄물', 'Adobe Photoshop', '3D 목업'],
    liveUrl: 'https://example.com',
    behanceUrl: 'https://behance.net',
  },
];
