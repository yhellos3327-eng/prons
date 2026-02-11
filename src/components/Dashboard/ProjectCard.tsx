import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { HiTrash, HiMenu } from 'react-icons/hi';
import type { Project } from '../../data/projects';
import { MediaUploader } from './MediaUploader';
import styles from './Dashboard.module.css';

interface ProjectCardProps {
    project: Project;
    index: number;
    onUpdate: (id: number, field: keyof Project, value: any) => void;
    onUpload: (id: number, field: 'image' | 'video', file: File) => Promise<void>;
    onDelete: (id: number) => void;
}

export const ProjectCard = ({ project, index, onUpdate, onUpload, onDelete }: ProjectCardProps) => {
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

    const descLength = project.description?.length || 0;

    return (
        <Reorder.Item
            value={project}
            id={String(project.id)}
            dragListener={false}
            dragControls={dragControls}
            className={styles.card}
            whileDrag={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
        >
            {/* Header: Drag Handle + Number + Title + Delete */}
            <div className={styles.cardHeader}>
                <div
                    className={styles.dragHandle}
                    onPointerDown={(e) => dragControls.start(e)}
                    title="드래그하여 순서 변경"
                >
                    <HiMenu size={20} />
                </div>
                <span className={styles.cardNumber}>#{index + 1}</span>
                <input
                    className={styles.cardTitleInput}
                    value={project.title}
                    onChange={(e) => onUpdate(project.id, 'title', e.target.value)}
                    placeholder="프로젝트 제목 입력"
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
                    <HiTrash size={18} />
                </button>
            </div>

            <div className={styles.cardBody}>
                {/* Left Column: Preview & Uploaders */}
                <div className={styles.previewColumn}>
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

                    <div className={styles.uploadSection}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Video Upload</label>
                            <MediaUploader
                                type="video"
                                currentUrl={project.video}
                                onUrlChange={(url) => onUpdate(project.id, 'video', url)}
                                onUpload={(file) => onUpload(project.id, 'video', file)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Image Upload</label>
                            <MediaUploader
                                type="image"
                                currentUrl={project.image}
                                onUrlChange={(url) => onUpdate(project.id, 'image', url)}
                                onUpload={(file) => onUpload(project.id, 'image', file)}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Info & Tags */}
                <div className={styles.infoColumn}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Description</label>
                        <div className={styles.textAreaWrapper}>
                            <textarea
                                className={styles.textArea}
                                value={project.description}
                                onChange={(e) => onUpdate(project.id, 'description', e.target.value)}
                                placeholder="프로젝트에 대한 상세 설명을 입력하세요..."
                                maxLength={500}
                            />
                            <span className={`${styles.charCount} ${descLength > 450 ? (descLength >= 500 ? styles.charCountError : styles.charCountWarning) : ''}`}>
                                {descLength}/500
                            </span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Tags</label>
                        <div className={styles.tagInputWrapper}>
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
                            <input
                                className={styles.tagInput}
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder={project.tags.length === 0 ? "태그 입력 후 Enter..." : "추가..."}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Reorder.Item>
    );
};
