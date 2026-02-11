import { useState } from 'react';
import styles from './Dashboard.module.css';

interface LoginProps {
    onLogin: (password: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('비밀번호를 입력해주세요.');
            return;
        }

        try {
            // Validate password against the server
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': password,
                },
            });

            if (response.ok) {
                onLogin(password);
            } else {
                setError('비밀번호가 일치하지 않습니다.');
            }
        } catch (err) {
            setError('로그인 확인 중 오류가 발생했습니다.');
        }
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
