import { useState, useEffect, useRef } from 'react';
import { Reorder } from 'framer-motion';
import { HiPlus, HiRefresh, HiSave, HiLogout } from 'react-icons/hi';
import { useProjectData } from '../../hooks/useProjectData';
import type { Project } from '../../data/projects';
import { Login } from './Login';
import { ProjectCard } from './ProjectCard';
import { useToast } from '../UI/Toast';
import styles from './Dashboard.module.css';

// R2 업로드 API 호출 함수
const uploadFile = async (file: File, password: string): Promise<string> => {
    // 한글 및 특수문자 처리를 위해 파일명 안전하게 변환
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${sanitizedFilename}`;
    const encodedFilename = encodeURIComponent(filename);

    const response = await fetch(`/api/upload?filename=${encodedFilename}`, {
        method: 'POST',
        headers: {
            'Content-Type': file.type,
            'x-admin-password': password,
        },
        body: file,
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
};

export default function Dashboard() {
    const { projects, isLoading, saveProjects, refetch } = useProjectData();
    const { addToast } = useToast();
    const [password, setPassword] = useState(sessionStorage.getItem('admin_password') || '');
    const [localProjects, setLocalProjects] = useState<Project[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const isInitialized = useRef(false);

    // 서버 데이터가 로드되면 로컬 상태에 동기화
    useEffect(() => {
        if (!isLoading && !isSaving) {
            setLocalProjects(projects);
            isInitialized.current = true;
        }
    }, [projects, isLoading]);

    const handleLogin = (pwd: string) => {
        sessionStorage.setItem('admin_password', pwd);
        setPassword(pwd);
        addToast('로그인되었습니다.', 'success');
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_password');
        setPassword('');
        addToast('로그아웃되었습니다.', 'info');
    };

    const handleUpdate = (id: number, field: keyof Project, value: any) => {
        setLocalProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    const handleDelete = (id: number) => {
        setLocalProjects((prev) => prev.filter((p) => p.id !== id));
        addToast('프로젝트가 목록에서 제거되었습니다. (저장 시 반영)', 'info');
    };

    const handleAddProject = () => {
        const newProject: Project = {
            id: Date.now(), // Temporary ID
            title: '새 프로젝트',
            description: '',
            image: '',
            tags: [],
        };
        setLocalProjects((prev) => [newProject, ...prev]);
        addToast('새 프로젝트가 추가되었습니다.', 'info');
    };

    const handleFileUpload = async (id: number, field: 'image' | 'video', file: File) => {
        try {
            addToast('파일 업로드 중...', 'info');
            const url = await uploadFile(file, password);
            handleUpdate(id, field, url);
            addToast('파일 업로드 완료!', 'success');
        } catch (err) {
            console.error(err);
            addToast(`파일 업로드 실패: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await saveProjects(localProjects, password);
            addToast('모든 변경사항이 저장되었습니다!', 'success');
            refetch();
        } catch (err) {
            addToast(err instanceof Error ? err.message : '저장 실패', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!password) {
        return <Login onLogin={handleLogin} />;
    }

    if (isLoading) {
        return (
            <div className={styles.dashboard}>
                <header className={styles.header}>
                    <h1 className={styles.title}>미디어 대시보드</h1>
                </header>
                <div className={styles.loadingContainer}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.skeletonCard}>
                            <div className={styles.skeletonHeader} />
                            <div className={styles.skeletonBody}>
                                <div className={styles.skeletonPreview} />
                                <div className={styles.skeletonContent}>
                                    <div className={styles.skeletonLine} />
                                    <div className={styles.skeletonLine} />
                                    <div className={styles.skeletonLine} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1 className={styles.title}>미디어 대시보드</h1>
                <div className={styles.actions}>
                    <button className={`${styles.button} ${styles.buttonSuccess}`} onClick={handleAddProject}>
                        <HiPlus /> 프로젝트 추가
                    </button>
                    <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => refetch()}>
                        <HiRefresh /> 새로고침
                    </button>
                    <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleSave} disabled={isSaving}>
                        <HiSave /> {isSaving ? '저장 중...' : '변경사항 저장'}
                    </button>
                    <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleLogout}>
                        <HiLogout /> 로그아웃
                    </button>
                </div>
            </header>

            {localProjects.length > 0 && (
                <div className={styles.statsBar}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total Projects</div>
                        <div className={styles.statValue}>{localProjects.length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>With Video</div>
                        <div className={styles.statValue}>
                            {localProjects.filter((p) => p.video).length}
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>With Image</div>
                        <div className={styles.statValue}>
                            {localProjects.filter((p) => p.image).length}
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total Tags</div>
                        <div className={styles.statValue}>
                            {new Set(localProjects.flatMap((p) => p.tags)).size}
                        </div>
                    </div>
                </div>
            )}

            {localProjects.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <HiPlus size={64} />
                    </div>
                    <h2 className={styles.emptyTitle}>프로젝트가 없습니다</h2>
                    <p className={styles.emptyDescription}>
                        새 프로젝트를 추가하여 포트폴리오를 관리하세요.
                    </p>
                </div>
            ) : (
                <Reorder.Group
                    axis="y"
                    values={localProjects}
                    onReorder={setLocalProjects}
                    className={styles.grid}
                >
                    {localProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            onUpdate={handleUpdate}
                            onUpload={handleFileUpload}
                            onDelete={handleDelete}
                        />
                    ))}
                </Reorder.Group>
            )}
        </div>
    );
}
