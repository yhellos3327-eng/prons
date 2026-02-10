import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPhotograph, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { projects } from '../../data/projects';
import styles from './ProjectSlider.module.css';

const SLIDE_INTERVAL = 5000;

/** 파티클 데이터 (컴포넌트 외부에서 한 번만 생성 — Hero와 동일 구조) */
const ProjectSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, []);

  /** 키보드 네비게이션 처리 */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  /** 자동 슬라이드 기능 */
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  /** 슬라이드 변경 시 비디오 자동 재생 처리 */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => { });
    }
  }, [activeIndex]);

  const currentProject = projects[activeIndex];
  const isVideo = !!currentProject.video;

  /** 인접 슬라이드 프리로드 인덱스 계산 */
  const preloadIndices = useMemo(() => {
    const next = (activeIndex + 1) % projects.length;
    const prev = (activeIndex - 1 + projects.length) % projects.length;
    return [prev, next];
  }, [activeIndex]);

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section id="projects" className={`section ${styles.projects}`}>
      <div className={styles.backgroundGradient} />

      {/* 글로우 오브 효과 */}
      <div className={styles.glowOrbs}>
        <div className={`${styles.orb} ${styles.orbPrimary}`} />
        <div className={`${styles.orb} ${styles.orbSecondary}`} />
        <div className={`${styles.orb} ${styles.orbAccent}`} />
      </div>

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.label}>
            <HiPhotograph className={styles.labelIcon} />
            Portfolio
          </span>
          <h2 className={styles.sectionTitle}>
            주요 <span className="accent">작업물</span>
          </h2>
        </motion.div>

        <div
          className={styles.sliderContainer}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* 좌/우 네비게이션 버튼 */}
          <button
            className={`${styles.navigationButton} ${styles.prevButton}`}
            onClick={handlePrev}
            aria-label="이전 프로젝트"
          >
            <HiChevronLeft size={24} />
          </button>
          <button
            className={`${styles.navigationButton} ${styles.nextButton}`}
            onClick={handleNext}
            aria-label="다음 프로젝트"
          >
            <HiChevronRight size={24} />
          </button>

          {/* 카드 슬라이더 */}
          <div className={styles.cardContainer}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                className={styles.card}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className={styles.mediaWrapper}>
                  {isVideo ? (
                    <video
                      ref={videoRef}
                      src={currentProject.video}
                      className={styles.media}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={currentProject.image}
                      alt={currentProject.title}
                      className={styles.media}
                      loading="lazy"
                    />
                  )}
                  <div className={styles.mediaOverlay} />
                  <span className={styles.projectNumber}>
                    {String(activeIndex + 1).padStart(2, '0')}
                  </span>
                  {isVideo && (
                    <span className={styles.mediaBadge}>▶ VIDEO</span>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.title}>{currentProject.title}</h3>
                  <p className={styles.description}>{currentProject.description}</p>
                  <div className={styles.tags}>
                    {currentProject.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 인접 슬라이드 프리로드 */}
          <div style={{ display: 'none' }}>
            {preloadIndices.map((i) => {
              const p = projects[i];
              if (p.video) return <link key={i} rel="preload" as="video" href={p.video} />;
              if (p.image) return <link key={i} rel="preload" as="image" href={p.image} />;
              return null;
            })}
          </div>

          {/* 인디케이터 */}
          <div className={styles.indicators}>
            {projects.map((project, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === activeIndex ? styles.active : ''
                  }`}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                aria-label={`${project.title}로 이동`}
              >
                <span className={styles.indicatorLabel}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>

          {/* 프로젝트 카운터 */}
          <div className={styles.counter}>
            <span className={styles.counterCurrent}>
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className={styles.counterDivider}>/</span>
            <span className={styles.counterTotal}>
              {String(projects.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* SVG 그라이언트 */}
      <svg width="0" height="0" className="visually-hidden">
        <defs>
          <linearGradient id="project-icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#dcdcdd' }} />
            <stop offset="100%" style={{ stopColor: '#626262' }} />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
};

export default ProjectSlider;
