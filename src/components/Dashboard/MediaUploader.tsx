import { useState, useRef } from 'react';
import { HiPhotograph, HiVideoCamera } from 'react-icons/hi';
import styles from './Dashboard.module.css';

interface MediaUploaderProps {
    type: 'image' | 'video';
    currentUrl?: string;
    onUpload: (file: File) => Promise<void>;
    onUrlChange: (url: string) => void;
}

export const MediaUploader = ({ type, currentUrl, onUpload, onUrlChange }: MediaUploaderProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) await processFile(file);
    };

    const processFile = async (file: File) => {
        if (!file.type.startsWith(type)) {
            alert(`Please upload a ${type} file`);
            return;
        }

        try {
            setIsUploading(true);
            await onUpload(file);
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const TypeIcon = type === 'image' ? HiPhotograph : HiVideoCamera;

    return (
        <div className={styles.uploaderContainer}>
            <div className={styles.urlInputWrapper}>
                <input
                    type="text"
                    className={styles.input}
                    value={currentUrl || ''}
                    onChange={(e) => onUrlChange(e.target.value)}
                    placeholder={`Enter ${type} URL...`}
                />
            </div>

            <div
                className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className={styles.hiddenInput}
                    accept={`${type}/*`}
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                />

                {isUploading ? (
                    <div className={styles.uploadingState}>
                        <div className={styles.spinner} />
                        <span>Uploading {type}...</span>
                        <div className={styles.uploadProgress}>
                            <div className={styles.uploadProgressBar} />
                        </div>
                    </div>
                ) : (
                    <div className={styles.placeholderState}>
                        <TypeIcon size={24} />
                        <span>Click or Drag to Upload {type}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
