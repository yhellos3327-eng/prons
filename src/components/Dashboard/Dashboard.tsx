import { useState, useEffect, useCallback } from 'react';
import { Reorder } from 'framer-motion';
import { HiPlus, HiRefresh, HiSave, HiLogout } from 'react-icons/hi';
import { useProjectData } from '../../hooks/useProjectData';
import { useAdminActions } from '../../hooks/useAdminActions';
import type { Project } from '../../data/projects';
import { Login } from './Login';
import { ProjectCard } from './ProjectCard';
import { useToast } from '../UI/Toast';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { projects, isLoading: projectsLoading, saveProjects, refetch, isSaving: mutationIsSaving } = useProjectData();
    const { addToast } = useToast();

    useEffect(() => {
        document.body.classList.add('dashboard-active');
        return () => document.body.classList.remove('dashboard-active');
    }, []);

    const [localProjects, setLocalProjects] = useState<Project[]>([]);
    const [isDirty, setIsDirty] = useState(false);

    const handleUpdate = useCallback((id: number, field: keyof Project, value: any) => {
        setLocalProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
        setIsDirty(true);
    }, []);

    const {
        token,
        handleLogin,
        handleLogout,
        handleFileUpload,
        handleSave,
    } = useAdminActions(saveProjects, refetch);

    const isSaving = mutationIsSaving;

    // 서버 데이터가 로드되면 로컬 상태에 동기화
    useEffect(() => {
        if (!projectsLoading && !mutationIsSaving && !isDirty) {
            setLocalProjects(projects);
        }
    }, [projects, projectsLoading, mutationIsSaving, isDirty]);

    const handleSaveWithReset = async (data: Project[]) => {
        await handleSave(data);
        setIsDirty(false);
    };

    const handleDelete = (id: number) => {
        setLocalProjects((prev) => prev.filter((p) => p.id !== id));
        setIsDirty(true);
        addToast('프로젝트가 목록에서 제거되었습니다. (저장 시 반영)', 'info');
    };

    const handleAddProject = () => {
        const newProject: Project = {
            id: Date.now(),
            title: '새 프로젝트',
            description: '',
            image: '',
            tags: [],
        };
        setLocalProjects((prev) => [newProject, ...prev]);
        setIsDirty(true);
        addToast('새 프로젝트가 추가되었습니다.', 'info');
    };

    if (!token) {
        return <Login onLogin={handleLogin} />;
    }

    if (projectsLoading && !isDirty) {
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
                    <button
                        className={`${styles.button} ${styles.buttonPrimary}`}
                        onClick={() => handleSaveWithReset(localProjects)}
                        disabled={isSaving}
                    >
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
                            onUpload={(id, field, file) => handleFileUpload(id, field, file, handleUpdate)}
                            onDelete={handleDelete}
                        />
                    ))}
                </Reorder.Group>
            )}
        </div>
    );
};

export default Dashboard;
