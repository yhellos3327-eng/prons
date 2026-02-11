import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import { useProjectData } from '../../hooks/useProjectData';
import type { Project } from '../../data/projects';
import { Login } from './Login';
import { ProjectCard } from './ProjectCard';
import { useToast } from '../UI/Toast';
import styles from './Dashboard.module.css';

// R2 업로드 API 호출 함수
const uploadFile = async (file: File, password: string): Promise<string> => {
    const filename = `${Date.now()}-${file.name}`;
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
    const [localProjects, setLocalProjects] = useState<Project[]>(projects);
    const [isSaving, setIsSaving] = useState(false);

    // 초기 데이터 로드 시 로컬 상태 동기화
    if (projects !== localProjects && !isSaving && localProjects.length === 0 && projects.length > 0) {
        setLocalProjects(projects);
    }

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
                <div className={styles.loadingSpinner}>로딩 중...</div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1 className={styles.title}>미디어 대시보드</h1>
                <div className={styles.actions}>
                    <button className={styles.button} onClick={handleAddProject}>
                        <HiPlus style={{ marginRight: '5px' }} /> 프로젝트 추가
                    </button>
                    <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => refetch()}>
                        새로고침
                    </button>
                    <button className={styles.button} onClick={handleSave} disabled={isSaving}>
                        {isSaving ? '저장 중...' : '변경사항 저장'}
                    </button>
                    <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </header>

            <Reorder.Group
                axis="y"
                values={localProjects}
                onReorder={setLocalProjects}
                className={styles.grid}
            >
                {localProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onUpdate={handleUpdate}
                        onUpload={handleFileUpload}
                        onDelete={handleDelete}
                    />
                ))}
            </Reorder.Group>
        </div>
    );
}
