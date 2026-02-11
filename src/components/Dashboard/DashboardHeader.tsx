import type { FC } from 'react';
import { HiPlus, HiRefresh, HiSave, HiLogout } from 'react-icons/hi';
import styles from './Dashboard.module.css';

interface DashboardHeaderProps {
    isSaving: boolean;
    onAdd: () => void;
    onRefresh: () => void;
    onSave: () => void;
    onLogout: () => void;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({
    isSaving,
    onAdd,
    onRefresh,
    onSave,
    onLogout,
}) => {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>미디어 대시보드</h1>
            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.buttonSuccess}`} onClick={onAdd}>
                    <HiPlus /> 프로젝트 추가
                </button>
                <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={onRefresh}>
                    <HiRefresh /> 새로고침
                </button>
                <button
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    onClick={onSave}
                    disabled={isSaving}
                >
                    <HiSave /> {isSaving ? '저장 중...' : '변경사항 저장'}
                </button>
                <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={onLogout}>
                    <HiLogout /> 로그아웃
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;
