import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiChevronDoubleDown } from 'react-icons/hi';

import styles from './Hero.module.css';

// 타이핑 효과를 위한 텍스트
const roles = ['PANDA DESIGN', '고객 신뢰 1순위 디자인 파트너'];

// 파티클 데이터 (컴포넌트 외부에서 한 번만 생성)
const particleData = Array.from({ length: 15 }, () => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 12}s`,
  animationDuration: `${10 + Math.random() * 15}s`,
  size: `${2 + Math.random() * 3}px`,
  opacity: 0.2 + Math.random() * 0.4,
}));

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

      {/* 글로우 오브 효과 */}
      <div className={styles.glowOrbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      {/* 파티클 */}
      <div className={styles.particles}>
        {particleData.map((p, i) => (
          <div key={i} className={styles.particle} style={{
            left: p.left,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }} />
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
              src="/video/composition_1_2.webm"
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
    </section>
  );
};

export default Hero;
