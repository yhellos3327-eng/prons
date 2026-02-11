import type { FC } from 'react';
import { Reorder } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import type { Project } from '../../data/projects';
import { ProjectCard } from './ProjectCard';
import styles from './Dashboard.module.css';

interface ProjectListProps {
    projects: Project[];
    onReorder: (newOrder: Project[]) => void;
    onUpdate: (id: number, field: keyof Project, value: any) => void;
    onUpload: (id: number, field: 'image' | 'video', file: File) => Promise<void>;
    onDelete: (id: number) => void;
}

const ProjectList: FC<ProjectListProps> = ({
    projects,
    onReorder,
    onUpdate,
    onUpload,
    onDelete,
}) => {
    if (projects.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <HiPlus size={64} />
                </div>
                <h2 className={styles.emptyTitle}>프로젝트가 없습니다</h2>
                <p className={styles.emptyDescription}>
                    새 프로젝트를 추가하여 포트폴리오를 관리하세요.
                </p>
            </div>
        );
    }

    return (
        <Reorder.Group
            axis="y"
            values={projects}
            onReorder={onReorder}
            className={styles.grid}
        >
            {projects.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onUpdate={onUpdate}
                    onUpload={onUpload}
                    onDelete={onDelete}
                />
            ))}
        </Reorder.Group>
    );
};

export default ProjectList;
