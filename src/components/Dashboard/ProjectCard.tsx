import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { HiTrash, HiMenu } from 'react-icons/hi';
import type { Project } from '../../data/projects';
import { MediaUploader } from './MediaUploader';
import styles from './Dashboard.module.css';

interface ProjectCardProps {
    project: Project;
    onUpdate: (id: number, field: keyof Project, value: any) => void;
    onUpload: (id: number, field: 'image' | 'video', file: File) => Promise<void>;
    onDelete: (id: number) => void;
}

export const ProjectCard = ({ project, onUpdate, onUpload, onDelete }: ProjectCardProps) => {
    const dragControls = useDragControls();
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTags = [...project.tags, tagInput.trim()];
            onUpdate(project.id, 'tags', newTags);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = project.tags.filter(tag => tag !== tagToRemove);
        onUpdate(project.id, 'tags', newTags);
    };

    return (
        <Reorder.Item
            value={project}
            id={String(project.id)}
            dragListener={false}
            dragControls={dragControls}
            className={styles.card}
        >
            <div className={styles.cardHeader}>
                <div
                    className={styles.dragHandle}
                    onPointerDown={(e) => dragControls.start(e)}
                >
                    <HiMenu size={20} />
                </div>
                <input
                    className={`${styles.input} ${styles.cardTitle}`}
                    value={project.title}
                    onChange={(e) => onUpdate(project.id, 'title', e.target.value)}
                    placeholder="프로젝트 제목"
                />
                <button
                    className={styles.deleteButton}
                    onClick={() => {
                        if (confirm('정말 이 프로젝트를 삭제하시겠습니까?')) {
                            onDelete(project.id);
                        }
                    }}
                    title="프로젝트 삭제"
                >
                    <HiTrash size={20} />
                </button>
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

            <div className={styles.cardContent}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>설명</label>
                    <textarea
                        className={styles.textArea}
                        value={project.description}
                        onChange={(e) => onUpdate(project.id, 'description', e.target.value)}
                        placeholder="프로젝트 설명"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>태그 (Enter로 추가, 클릭하여 삭제)</label>
                    <input
                        className={styles.input}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="태그 추가..."
                    />
                    <div className={styles.tagInputContainer}>
                        {project.tags.map(tag => (
                            <span
                                key={tag}
                                className={styles.tag}
                                onClick={() => handleRemoveTag(tag)}
                                title="클릭하여 삭제"
                            >
                                {tag} ×
                            </span>
                        ))}
                    </div>
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
        </Reorder.Item>
    );
};
