import { useState, useEffect, useCallback, useRef } from 'react';

const TRANSITION_COOLDOWN = 800;

export function usePageNavigation(totalPages: number) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const isTransitioning = useRef(false);
  const lastTransition = useRef(0);

  const goToPage = useCallback((page: number) => {
    const now = Date.now();
    if (now - lastTransition.current < TRANSITION_COOLDOWN) return;
    if (page < 0 || page >= totalPages) return;
    if (page === currentPage) return;

    isTransitioning.current = true;
    lastTransition.current = now;
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);

    setTimeout(() => {
      isTransitioning.current = false;
    }, TRANSITION_COOLDOWN);
  }, [currentPage, totalPages]);

  const goNext = useCallback(() => {
    if (currentPage >= totalPages - 1) return;
    goToPage(currentPage + 1);
  }, [currentPage, totalPages, goToPage]);

  const goPrev = useCallback(() => {
    if (currentPage <= 0) return;
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  /** 휠 이벤트 처리 */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning.current) return;

      if (e.deltaY > 30) {
        goNext();
      } else if (e.deltaY < -30) {
        goPrev();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goNext, goPrev]);

  /** 터치 이벤트 처리 */
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goNext, goPrev]);

  /** 키보드 이벤트 처리 */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToPage(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToPage(totalPages - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, goToPage, totalPages]);

  return { currentPage, direction, goToPage, goNext, goPrev };
}
