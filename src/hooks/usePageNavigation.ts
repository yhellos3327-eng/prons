import { useState, useCallback, useRef, useEffect } from 'react';
import { useScrollInput } from './useScrollInput';

const TRANSITION_COOLDOWN = 800;

export const usePageNavigation = (totalPages: number, isEnabled: boolean = true) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastTransition = useRef(0);

  const goToPage = useCallback((page: number, pushState: boolean = true) => {
    const now = Date.now();
    if (now - lastTransition.current < TRANSITION_COOLDOWN) return;
    if (page < 0 || page >= totalPages) return;
    if (page === currentPage) return;

    setIsTransitioning(true);
    lastTransition.current = now;
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);

    if (pushState) {
        window.history.pushState({ pageIndex: page }, '', window.location.pathname + window.location.search);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, TRANSITION_COOLDOWN);
  }, [currentPage, totalPages]);

  // 브라우저 뒤로 가기/앞으로 가기 대응
  useEffect(() => {
      const handlePopState = (e: PopStateEvent) => {
          if (e.state && typeof e.state.pageIndex === 'number') {
              goToPage(e.state.pageIndex, false);
          }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
  }, [goToPage]);


  const goNext = useCallback(() => {
    if (currentPage >= totalPages - 1) return;
    goToPage(currentPage + 1);
  }, [currentPage, totalPages, goToPage]);

  const goPrev = useCallback(() => {
    if (currentPage <= 0) return;
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goHome = useCallback(() => goToPage(0), [goToPage]);
  const goEnd = useCallback(() => goToPage(totalPages - 1), [goToPage, totalPages]);

  // 외부 입력(스크롤, 키보드 등) 연결
  useScrollInput({
      onNext: goNext,
      onPrev: goPrev,
      onHome: goHome,
      onEnd: goEnd,
      disabled: !isEnabled || isTransitioning
  });

  return { currentPage, direction, goToPage, goNext, goPrev };
}
