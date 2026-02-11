-- Phase 3: D1 Database Migration Schema
-- 1. Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    video TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 2. Tags table (Relational)
CREATE TABLE IF NOT EXISTS tags (
    project_id INTEGER,
    tag TEXT NOT NULL,
    PRIMARY KEY (project_id, tag),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
-- 4. Initial Migration from current static data (based on projects.ts)
INSERT INTO projects (id, title, description, video, display_order)
VALUES (
        1,
        '디자이너 판다',
        '메탈릭 질감과 3D 효과를 활용한 타이포그래피 로고 디자인. 차가운 금속 텍스처와 블루 그라디언트로 강렬한 인상을 전달합니다.',
        '/projects/work-01.mp4',
        0
    );
INSERT INTO tags (project_id, tag)
VALUES (1, '3D 타이포그래피'),
    (1, '로고 디자인'),
    (1, 'Photoshop'),
    (1, '텍스처');
INSERT INTO projects (id, title, description, video, display_order)
VALUES (
        2,
        '모션 그래픽 쇼릴',
        '다양한 비주얼 이펙트와 모션 그래픽 기법을 결합한 영상 작업물입니다. 역동적인 움직임과 세련된 트랜지션이 특징입니다.',
        '/projects/work-02.mp4',
        1
    );
INSERT INTO tags (project_id, tag)
VALUES (2, '모션 그래픽'),
    (2, 'After Effects'),
    (2, '비주얼 이펙트');
INSERT INTO projects (id, title, description, video, display_order)
VALUES (
        3,
        '비주얼 아이덴티티 영상',
        '브랜드의 시각적 정체성을 영상으로 표현한 프로젝트. 일관된 디자인 언어와 애니메이션으로 브랜드 스토리를 전달합니다.',
        '/projects/work-03.mp4',
        2
    );
INSERT INTO tags (project_id, tag)
VALUES (3, '브랜딩'),
    (3, '영상 편집'),
    (3, 'Premiere Pro');
INSERT INTO projects (id, title, description, image, display_order)
VALUES (
        4,
        '시그널 블랙 커뮤니티',
        '다크 판타지 컨셉의 커뮤니티 브랜딩 디자인. 강렬한 비주얼과 어두운 분위기로 몰입감 있는 세계관을 구축했습니다.',
        '/projects/work-04.png',
        3
    );
INSERT INTO tags (project_id, tag)
VALUES (4, '브랜딩'),
    (4, '컨셉 아트'),
    (4, 'Photoshop'),
    (4, '다크 판타지');
INSERT INTO projects (id, title, description, video, display_order)
VALUES (
        5,
        '타이틀 모션 디자인',
        '텍스트와 그래픽 요소가 결합된 타이틀 모션 디자인. 시청자의 시선을 사로잡는 인트로 영상을 제작했습니다.',
        '/projects/work-05.mp4',
        4
    );
INSERT INTO tags (project_id, tag)
VALUES (5, '모션 디자인'),
    (5, '타이틀 시퀀스'),
    (5, 'After Effects');
INSERT INTO projects (id, title, description, video, display_order)
VALUES (
        6,
        '시네마틱 비주얼',
        '영화적 연출 기법을 활용한 비주얼 콘텐츠. 색보정과 VFX를 통해 극적인 분위기를 연출했습니다.',
        '/projects/work-06.mp4',
        5
    );
INSERT INTO tags (project_id, tag)
VALUES (6, 'VFX'),
    (6, '색보정'),
    (6, 'DaVinci Resolve'),
    (6, '시네마틱');
INSERT INTO projects (id, title, description, video, display_order)
VALUES (
        7,
        '크리에이티브 영상 편집',
        '빠른 컷 전환과 리듬감 있는 편집이 특징인 크리에이티브 영상 작업물입니다.',
        '/projects/work-07.mp4',
        6
    );
INSERT INTO tags (project_id, tag)
VALUES (7, '영상 편집'),
    (7, 'Premiere Pro'),
    (7, '크리에이티브');
INSERT INTO projects (id, title, description, video, display_order)
VALUES (
        8,
        '인터랙티브 모션',
        '인터랙티브 요소와 모션 그래픽이 결합된 실험적 영상 작업물입니다.',
        '/projects/work-08.mp4',
        7
    );
INSERT INTO tags (project_id, tag)
VALUES (8, '모션 그래픽'),
    (8, 'After Effects'),
    (8, '인터랙티브');
INSERT INTO projects (id, title, description, video, display_order)
VALUES (
        9,
        '비주얼 콘텐츠',
        '다양한 시각적 표현 기법을 활용한 크리에이티브 콘텐츠 작업물입니다.',
        '/projects/work-09.mp4',
        8
    );
INSERT INTO tags (project_id, tag)
VALUES (9, '비주얼 디자인'),
    (9, '영상 편집'),
    (9, '크리에이티브');