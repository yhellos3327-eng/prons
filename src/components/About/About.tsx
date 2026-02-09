import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { HiUser } from 'react-icons/hi';
import { FaProjectDiagram, FaUsers, FaTrophy } from 'react-icons/fa';
import styles from './About.module.css';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container">
        <motion.div
          ref={ref}
          className={styles.content}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.imageSection}>
            <motion.div
              className={styles.imageWrapper}
              style={{ y: imageY }}
            >
              <video
                src="/projects/work-01.mp4"
                className={styles.image}
                autoPlay
                muted
                loop
                playsInline
              />
              <div className={styles.imageDecor} />
            </motion.div>
          </div>

          <div className={styles.textSection}>
            <motion.span
              className={styles.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <HiUser className={styles.labelIcon} />
              소개
            </motion.span>

            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className={styles.companyName}>판다디자인</span><br />
              <span className="accent">결과로 말하는 디자이너</span>
            </motion.h2>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              판다디자인을 선택해주셔서 감사합니다.
            </motion.p>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              저희는 한 번의 작업이 아닌,
              오래 함께할 파트너가 되고자 합니다.
            </motion.p>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 }}
            >
              고객님의 고민과 목표를 충분히 이해하고,
              1:1 맞춤 소통을 통해
              가장 만족스러운 결과를 만들어드립니다.
            </motion.p>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              작은 부분까지 책임지고, 끝까지 함께하는 디자인,
              그것이 판다 디자인의 약속입니다.
            </motion.p>

            <motion.div
              className={styles.stats}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              {[
                { number: '50+', label: '완료 프로젝트', icon: FaProjectDiagram },
                { number: '30+', label: '만족한 고객', icon: FaUsers },
                { number: '7+', label: '년 경력', icon: FaTrophy }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={styles.stat}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                >
                  <stat.icon className={styles.statIcon} />
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* SVG Gradient Definition */}
      <svg width="0" height="0" className="visually-hidden">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#dcdcdd' }} />
            <stop offset="100%" style={{ stopColor: '#626262' }} />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
};

export default About;
