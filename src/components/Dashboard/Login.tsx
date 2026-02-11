import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLockClosed } from 'react-icons/hi';
import styles from './Dashboard.module.css';

interface LoginProps {
    onLogin: (password: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            {/* Animated Background */}
            <div className={styles.loginBackground}>
                <div className={`${styles.orb} ${styles.orb1}`} />
                <div className={`${styles.orb} ${styles.orb2}`} />
                <div className={`${styles.orb} ${styles.orb3}`} />
            </div>

            <motion.div
                className={styles.loginCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className={styles.loginHeader}>
                    <motion.div
                        className={styles.loginIcon}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <HiLockClosed />
                    </motion.div>
                    <h2 className={styles.loginTitle}>Admin Access</h2>
                    <p className={styles.loginSubtitle}>포트폴리오 관리자 페이지</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className={styles.loginInput}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <motion.div
                            className={styles.error}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        className={styles.loginButton}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? 'Checking...' : 'Login'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};
