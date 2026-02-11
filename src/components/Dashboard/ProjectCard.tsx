import type { Project } from '../../data/projects';
import { MediaUploader } from './MediaUploader';
import styles from './Dashboard.module.css';

interface ProjectCardProps {
    project: Project;
    onUpdate: (id: number, field: keyof Project, value: string) => void;
    onUpload: (id: number, field: 'image' | 'video', file: File) => Promise<void>;
}

export const ProjectCard = ({ project, onUpdate, onUpload }: ProjectCardProps) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{project.title}</span>
            </div>

            <div className={styles.preview}>
                {project.video ? (
                    <video
                        src={project.video}
                        className={styles.previewMedia}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <img src={project.image} alt={project.title} className={styles.previewMedia} />
                )}
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Video</label>
                <MediaUploader
                    type="video"
                    currentUrl={project.video}
                    onUrlChange={(url) => onUpdate(project.id, 'video', url)}
                    onUpload={(file) => onUpload(project.id, 'video', file)}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Image</label>
                <MediaUploader
                    type="image"
                    currentUrl={project.image}
                    onUrlChange={(url) => onUpdate(project.id, 'image', url)}
                    onUpload={(file) => onUpload(project.id, 'image', file)}
                />
            </div>
        </div>
    );
};
