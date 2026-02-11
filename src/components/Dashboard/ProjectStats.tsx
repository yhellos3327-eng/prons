import type { FC } from 'react';
import type { Project } from '../../data/projects';
import styles from './Dashboard.module.css';

interface ProjectStatsProps {
    projects: Project[];
}

const ProjectStats: FC<ProjectStatsProps> = ({ projects }) => {
    if (projects.length === 0) return null;

    const withVideo = projects.filter((p) => p.video).length;
    const withImage = projects.filter((p) => p.image).length;
    const totalTags = new Set(projects.flatMap((p) => p.tags)).size;

    return (
        <div className={styles.statsBar}>
            <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Projects</div>
                <div className={styles.statValue}>{projects.length}</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statLabel}>With Video</div>
                <div className={styles.statValue}>{withVideo}</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statLabel}>With Image</div>
                <div className={styles.statValue}>{withImage}</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Tags</div>
                <div className={styles.statValue}>{totalTags}</div>
            </div>
        </div>
    );
};

export default ProjectStats;
