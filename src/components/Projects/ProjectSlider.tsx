import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPhotograph, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useProjectData } from '../../hooks/useProjectData';
import styles from './ProjectSlider.module.css';

const SLIDE_INTERVAL = 5000;

const ProjectSlider = () => {
  const { projects, isLoading } = useProjectData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 미디어가 있는 프로젝트만 필터링
  const visibleProjects = useMemo(() => projects.filter(p => p.video || p.image), [projects]);

  // activeIndex가 범위를 초과하면 보정
  const safeIndex = visibleProjects.length > 0 ? activeIndex % visibleProjects.length : 0;

  const currentProject = visibleProjects[safeIndex];
  const isVideo = !!currentProject?.video;

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => {
      const len = visibleProjects.length;
      return len > 0 ? (prev + 1) % len : 0;
    });
  }, [visibleProjects.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => {
      const len = visibleProjects.length;
      return len > 0 ? (prev - 1 + len) % len : 0;
    });
  }, [visibleProjects.length]);

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

  /** 인접 슬라이드 프리로드 인덱스 계산 */
  const preloadIndices = useMemo(() => {
    if (visibleProjects.length <= 1) return [];
    const next = (safeIndex + 1) % visibleProjects.length;
    const prev = (safeIndex - 1 + visibleProjects.length) % visibleProjects.length;
    return [prev, next];
  }, [safeIndex, visibleProjects.length]);

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  /* 터치 스와이프 로직 */
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (isLoading) {
    return (
      <section id="projects" className={`section ${styles.projects}`}>
        <div className={styles.backgroundGradient} />
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
          <div className={styles.sliderContainer}>
            <div className={styles.cardContainer}>
              <div className={styles.skeletonCard}>
                <div className={`${styles.skeletonMedia} ${styles.skeletonLine}`} />
                <div className={styles.skeletonContent}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonDesc}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonDesc}`} />
                  <div className={styles.skeletonTagsRow}>
                    <div className={styles.skeletonTag} />
                    <div className={styles.skeletonTag} />
                    <div className={styles.skeletonTag} />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.skeletonIndicators}>
              <div className={styles.skeletonIndicatorDot} />
              <div className={styles.skeletonIndicatorDot} />
              <div className={styles.skeletonIndicatorDot} />
              <div className={styles.skeletonIndicatorDot} />
            </div>
            <div className={styles.skeletonCounter}>
              <div className={styles.skeletonCounterBlock} />
              <span className={styles.skeletonCounterDivider}>/</span>
              <div className={styles.skeletonCounterBlock} />
            </div>
          </div>
        </div>
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
  }

  if (visibleProjects.length === 0) {
    return (
      <section id="projects" className={`section ${styles.projects}`}>
        <div className={styles.backgroundGradient} />
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
          <div className={styles.sliderContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>등록된 작업물이 없습니다.</p>
          </div>
        </div>
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
  }

  return (
    <section id="projects" className={`section ${styles.projects} `}>
      <div className={styles.backgroundGradient} />

      {/* 글로우 오브 효과 */}
      <div className={styles.glowOrbs}>
        <div className={`${styles.orb} ${styles.orbPrimary} `} />
        <div className={`${styles.orb} ${styles.orbSecondary} `} />
        <div className={`${styles.orb} ${styles.orbAccent} `} />
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
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 좌/우 네비게이션 버튼 */}
          <button
            className={`${styles.navigationButton} ${styles.prevButton} `}
            onClick={handlePrev}
            aria-label="이전 프로젝트"
          >
            <HiChevronLeft size={24} />
          </button>
          <button
            className={`${styles.navigationButton} ${styles.nextButton} `}
            onClick={handleNext}
            aria-label="다음 프로젝트"
          >
            <HiChevronRight size={24} />
          </button>

          {/* 카드 슬라이더 */}
          <div className={styles.cardContainer}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={safeIndex}
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
                    {String(safeIndex + 1).padStart(2, '0')}
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
              const p = visibleProjects[i];
              if (!p) return null;
              if (p.video) return <link key={i} rel="preload" as="video" href={p.video} />;
              if (p.image) return <link key={i} rel="preload" as="image" href={p.image} />;
              return null;
            })}
          </div>

          {/* 인디케이터 */}
          <div className={styles.indicators}>
            {visibleProjects.map((project, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === safeIndex ? styles.active : ''
                  } `}
                onClick={() => {
                  setDirection(index > safeIndex ? 1 : -1);
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
              {String(safeIndex + 1).padStart(2, '0')}
            </span>
            <span className={styles.counterDivider}>/</span>
            <span className={styles.counterTotal}>
              {String(visibleProjects.length).padStart(2, '0')}
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