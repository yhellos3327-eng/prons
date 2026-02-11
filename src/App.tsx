import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, Footer } from './components/Layout';
import { Hero } from './components/Hero';
import { ProjectSlider } from './components/Projects';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Dashboard } from './components/Dashboard';
import { usePageNavigation } from './hooks/usePageNavigation';
import './styles/global.css';

const pages = [
  { id: 'home', component: Hero },
  { id: 'projects', component: ProjectSlider },
  { id: 'about', component: About },
  { id: 'contact', component: Contact },
];

const pageVariants = {
  enter: {
    opacity: 0,
  },
  center: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

function App() {
  const [isDashboard, setIsDashboard] = useState(false);
  const { currentPage, goToPage } = usePageNavigation(pages.length);

  useEffect(() => {
    const checkDashboard = () => {
      const params = new URLSearchParams(window.location.search);
      const isDash = params.get('page') === 'dashboard';
      setIsDashboard(isDash);

      if (isDash) {
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
      } else {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
      }
    };

    checkDashboard();
    window.addEventListener('popstate', checkDashboard);
    return () => window.removeEventListener('popstate', checkDashboard);
  }, []);

  const CurrentComponent = pages[currentPage].component;

  const handleNavClick = useCallback((sectionId: string) => {
    const index = pages.findIndex(p => p.id === sectionId);
    if (index !== -1) goToPage(index);
  }, [goToPage]);

  if (isDashboard) {
    return <Dashboard />;
  }

  return (
    <>
      <Navbar onNavigate={handleNavClick} currentPage={pages[currentPage].id} />
      <main style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <CurrentComponent onNavigate={handleNavClick} />
          </motion.div>
        </AnimatePresence>
      </main>
      {currentPage === pages.length - 1 && <Footer />}

      {/* 페이지 인디케이터 */}
      <div className="page-indicators">
        {pages.map((page, index) => (
          <button
            key={page.id}
            className={`page-dot ${index === currentPage ? 'active' : ''}`}
            onClick={() => goToPage(index)}
            aria-label={`${page.id}로 이동`}
          />
        ))}
      </div>
    </>
  );
}

export default App;
