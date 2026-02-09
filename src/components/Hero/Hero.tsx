import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiChevronDoubleDown } from 'react-icons/hi';

import styles from './Hero.module.css';

// 타이핑 효과를 위한 텍스트
const roles = ['PANDA DESIGN', '고객 신뢰 1순위 디자인 파트너'];

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // 타이핑 애니메이션 효과
  useEffect(() => {
    const currentRole = roles[roleIndex];
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
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.backgroundGradient} />

      {/* 플로팅 파티클 효과 */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
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
            {/* <span className={styles.name}>홍길동</span> */}
            <video
              src="/video/panra_logo.webm"
              className={styles.name}
              autoPlay
              muted
              loop
              playsInline
            />
            <span className={styles.role}>
              {roleIndex === 0 ? (
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
            브랜드의 본질을 담은 시각 언어로 아름다운 경험을 디자인합니다.
            <br />
            감각적인 비주얼과 전략적 사고로 브랜드 가치를 높입니다.
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
    </section>
  );
};

export default Hero;
