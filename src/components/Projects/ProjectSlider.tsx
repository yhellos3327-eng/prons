import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { projects } from '../../data/projects';
import ProjectCard from './ProjectCard';
import styles from './ProjectSlider.module.css';

const ProjectSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  }, []);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff =
      diff > projects.length / 2
        ? diff - projects.length
        : diff < -projects.length / 2
          ? diff + projects.length
          : diff;

    if (normalizedDiff === 0) {
      return {
        x: 0,
        rotateY: 0,
        scale: 1,
        zIndex: 10,
        opacity: 1,
      };
    }

    if (normalizedDiff === -1) {
      return {
        x: '-55%',
        rotateY: 25,
        scale: 0.85,
        zIndex: 5,
        opacity: 0.6,
      };
    }

    if (normalizedDiff === 1) {
      return {
        x: '55%',
        rotateY: -25,
        scale: 0.85,
        zIndex: 5,
        opacity: 0.6,
      };
    }

    return {
      x: normalizedDiff < 0 ? '-100%' : '100%',
      rotateY: normalizedDiff < 0 ? 45 : -45,
      scale: 0.7,
      zIndex: 0,
      opacity: 0,
    };
  };

  return (
    <section id="projects" className={`section ${styles.projects}`}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            주요 <span className="accent">작업물</span>
          </h2>
          <p className="section-subtitle">
            브랜딩, UI/UX, 그래픽 디자인 포트폴리오
          </p>
        </motion.div>

        <div className={styles.sliderContainer}>
          <div className={styles.slider}>
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => {
                const cardStyle = getCardStyle(index);
                return (
                  <motion.div
                    key={project.id}
                    className={styles.cardWrapper}
                    initial={{
                      x: direction > 0 ? '100%' : '-100%',
                      rotateY: direction > 0 ? -45 : 45,
                      opacity: 0,
                    }}
                    animate={{
                      x: cardStyle.x,
                      rotateY: cardStyle.rotateY,
                      scale: cardStyle.scale,
                      zIndex: cardStyle.zIndex,
                      opacity: cardStyle.opacity,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    style={{
                      position: 'absolute',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <ProjectCard
                      project={project}
                      isActive={index === activeIndex}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className={styles.controls}>
            <motion.button
              className={styles.navButton}
              onClick={handlePrev}
              aria-label="이전 프로젝트"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <HiChevronLeft size={28} />
            </motion.button>

            <div className={styles.indicators}>
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${
                    index === activeIndex ? styles.active : ''
                  }`}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                  }}
                  aria-label={`${index + 1}번 프로젝트로 이동`}
                />
              ))}
            </div>

            <motion.button
              className={styles.navButton}
              onClick={handleNext}
              aria-label="다음 프로젝트"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <HiChevronRight size={28} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSlider;
