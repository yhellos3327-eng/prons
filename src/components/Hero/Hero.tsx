import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiChevronDoubleDown } from 'react-icons/hi';

import styles from './Hero.module.css';

/** 타이핑 효과를 위한 텍스트 배열 */
const roles = ['PANDA DESIGN', '고객 신뢰 1순위 디자인 파트너'];

/** 파티클 데이터 (컴포넌트 외부에서 한 번만 생성) */
const Hero = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  /** 타이핑 애니메이션 효과 */
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentRole.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRoleIndex]);

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.backgroundGradient} />

      {/* 글로우 오브 효과 */}
      <div className={styles.glowOrbs}>
        <div className={`${styles.orb} ${styles.orbPrimary}`} />
        <div className={`${styles.orb} ${styles.orbSecondary}`} />
        <div className={`${styles.orb} ${styles.orbAccent}`} />
      </div>


      <div className={`container ${styles.heroContent}`}>
        <motion.div
          className={styles.textContent}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <video
              src="/video/logo3.webm"
              className={styles.name}
              autoPlay
              muted
              loop
              playsInline
            />
            <span className={styles.role}>
              {currentRoleIndex === 0 ? (
                <>
                  <span style={{ color: '#ffffff' }}>{displayText.slice(0, 6)}</span>
                  <span className={styles.accent}>{displayText.slice(6)}</span>
                </>
              ) : (
                <>
                  <span style={{ color: '#ffffff' }}>{displayText.slice(0, 10)}</span>
                  <span className={styles.accent}>{displayText.slice(10)}</span>
                </>
              )}
              <motion.span
                className={styles.cursor}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                |
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            작은 디테일에 강렬함을, 과감함에 부드러움을 담아<br />
            '<b>아, 괜찮은 디자이너 만났네</b>' 싶은 순간을 선사하겠습니다.
          </motion.p>

        </motion.div>
      </div>

      <motion.a
        href="#projects"
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className={styles.scrollText}>스크롤</span>
        <motion.div
          className={styles.scrollIcon}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HiChevronDoubleDown size={28} />
        </motion.div>
      </motion.a>

      {/* SVG 그라이언트 */}
      <svg width="0" height="0" className="visually-hidden">
        <defs>
          <linearGradient id="hero-scroll-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#09bbfe' }} />
            <stop offset="100%" style={{ stopColor: '#5a42ec' }} />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
};

export default Hero;
