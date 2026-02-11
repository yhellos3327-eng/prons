import { useState } from 'react';
import styles from './Dashboard.module.css';

interface LoginProps {
    onLogin: (password: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('비밀번호를 입력해주세요.');
            return;
        }
        onLogin(password);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h2>관리자 로그인</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="관리자 비밀번호"
                        className={styles.input}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.button}>
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};
