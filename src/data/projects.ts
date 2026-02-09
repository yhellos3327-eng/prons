export interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
  tags: string[];
  liveUrl?: string;
  behanceUrl?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: '디자이너 판다',
    description: '메탈릭 질감과 3D 효과를 활용한 타이포그래피 로고 디자인. 차가운 금속 텍스처와 블루 그라디언트로 강렬한 인상을 전달합니다.',
    video: '/projects/work-01.mp4',
    tags: ['3D 타이포그래피', '로고 디자인', 'Photoshop', '텍스처'],
  },
  {
    id: 2,
    title: '모션 그래픽 쇼릴',
    description: '다양한 비주얼 이펙트와 모션 그래픽 기법을 결합한 영상 작업물입니다. 역동적인 움직임과 세련된 트랜지션이 특징입니다.',
    video: '/projects/work-02.mp4',
    tags: ['모션 그래픽', 'After Effects', '비주얼 이펙트'],
  },
  {
    id: 3,
    title: '비주얼 아이덴티티 영상',
    description: '브랜드의 시각적 정체성을 영상으로 표현한 프로젝트. 일관된 디자인 언어와 애니메이션으로 브랜드 스토리를 전달합니다.',
    video: '/projects/work-03.mp4',
    tags: ['브랜딩', '영상 편집', 'Premiere Pro'],
  },
  {
    id: 4,
    title: '시그널 블랙 커뮤니티',
    description: '다크 판타지 컨셉의 커뮤니티 브랜딩 디자인. 강렬한 비주얼과 어두운 분위기로 몰입감 있는 세계관을 구축했습니다.',
    image: '/projects/work-04.png',
    tags: ['브랜딩', '컨셉 아트', 'Photoshop', '다크 판타지'],
  },
  {
    id: 5,
    title: '타이틀 모션 디자인',
    description: '텍스트와 그래픽 요소가 결합된 타이틀 모션 디자인. 시청자의 시선을 사로잡는 인트로 영상을 제작했습니다.',
    video: '/projects/work-05.mp4',
    tags: ['모션 디자인', '타이틀 시퀀스', 'After Effects'],
  },
  {
    id: 6,
    title: '시네마틱 비주얼',
    description: '영화적 연출 기법을 활용한 비주얼 콘텐츠. 색보정과 VFX를 통해 극적인 분위기를 연출했습니다.',
    video: '/projects/work-06.mp4',
    tags: ['VFX', '색보정', 'DaVinci Resolve', '시네마틱'],
  },
  {
    id: 7,
    title: '크리에이티브 영상 편집',
    description: '빠른 컷 전환과 리듬감 있는 편집이 특징인 크리에이티브 영상 작업물입니다.',
    video: '/projects/work-07.mp4',
    tags: ['영상 편집', 'Premiere Pro', '크리에이티브'],
  },
  {
    id: 8,
    title: '인터랙티브 모션',
    description: '인터랙티브 요소와 모션 그래픽이 결합된 실험적 영상 작업물입니다.',
    video: '/projects/work-08.mp4',
    tags: ['모션 그래픽', 'After Effects', '인터랙티브'],
  },
  {
    id: 9,
    title: '비주얼 콘텐츠',
    description: '다양한 시각적 표현 기법을 활용한 크리에이티브 콘텐츠 작업물입니다.',
    video: '/projects/work-09.mp4',
    tags: ['비주얼 디자인', '영상 편집', '크리에이티브'],
  },
];
