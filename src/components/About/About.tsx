import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import styles from './About.module.css';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // 패럴랙스 효과
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
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop"
                alt="프로필"
                className={styles.image}
              />
              <div className={styles.imageDecor} />
            </motion.div>
            <motion.div
              className={styles.experienceBadge}
              initial={{ scale: 0, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              <span className={styles.badgeNumber}>5+</span>
              <span className={styles.badgeText}>년 경력</span>
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
              소개
            </motion.span>

            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              디지털 경험을<br />
              <span className="accent">창조합니다</span>
            </motion.h2>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              브랜드의 본질을 이해하고, 이를 시각적 언어로 표현하는 것에
              전문성을 가진 열정적인 디자이너입니다. 전략적 사고와 창의적 감각을
              바탕으로 브랜드와 사용자 사이의 연결고리를 만듭니다.
            </motion.p>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              섬세한 디테일과 대담한 아이디어를 결합하는 접근 방식으로,
              모든 프로젝트가 브랜드의 가치를 높이고 사람들의 마음에 남을 수 있도록 합니다.
            </motion.p>

            <motion.div
              className={styles.stats}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              {[
                { number: '50+', label: '완료 프로젝트' },
                { number: '30+', label: '만족한 고객' },
                { number: '5+', label: '수상 경력' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={styles.stat}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                >
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.a
              href="#contact"
              className="btn btn-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              함께 일해요
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
