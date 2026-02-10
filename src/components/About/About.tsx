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
              <span className="accent">함께 성장하는 디자인 파트너</span>
            </motion.h2>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              판다디자인을 찾아주셔서 진심으로 감사합니다.
            </motion.p>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              한 번의 작업이 아닌, 오래 함께할
              파트너가 되는 것을 목표로 하고 있습니다.
            </motion.p>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 }}
            >
              고객님의 고민을 내 일처럼 생각하며,
              처음부터 끝까지 책임지는 디자인을 약속드립니다.
            </motion.p>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              앞으로도 믿고 맡길 수 있는 디자인 파트너로,
              늘 곁에서 함께 성장해 나가겠습니다.
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
