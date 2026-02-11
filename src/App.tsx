import { useCallback, Suspense } from 'react';
import { Outlet } from 'react-router';
import { m, AnimatePresence, LazyMotion, domMax } from 'framer-motion';
import { Navbar, Footer } from './components/Layout';
import { usePageNavigation } from './hooks/usePageNavigation';
import { APP_PAGES } from './config/pages';
import styles from './App.module.css';
import './styles/global.css';

const pageVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export const MainPage = () => {
  const { currentPage, goToPage } = usePageNavigation(APP_PAGES.length);

  const handleNavClick = useCallback((sectionId: string) => {
    const index = APP_PAGES.findIndex(p => p.id === sectionId);
    if (index !== -1) goToPage(index);
  }, [goToPage]);

  const CurrentComponent = APP_PAGES[currentPage].component;

  return (
    <LazyMotion features={domMax}>
      <Navbar onNavigate={handleNavClick} currentPage={APP_PAGES[currentPage].id} />
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <m.div
            key={currentPage}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={styles.pageContainer}
          >
            <Suspense fallback={null}>
              <CurrentComponent onNavigate={handleNavClick} />
            </Suspense>
          </m.div>
        </AnimatePresence>
      </main>
      {currentPage === APP_PAGES.length - 1 && <Footer />}

      <div className="page-indicators">
        {APP_PAGES.map((page, index) => (
          <button
            key={page.id}
            className={`page-dot ${index === currentPage ? 'active' : ''}`}
            onClick={() => goToPage(index)}
            aria-label={`${page.label}로 이동`}
          />
        ))}
      </div>
    </LazyMotion>
  );
}

const App = () => {
  return <Outlet />;
};

export default App;
