import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import styles from './Navbar.module.css';

const navLinks = [
  { name: '홈', id: 'home' },
  { name: '포트폴리오', id: 'projects' },
  { name: '소개', id: 'about' },
  { name: '문의하기', id: 'contact' },
];

/** 네비게이션 바 Props 인터페이스 */
interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
  currentPage?: string;
}

const Navbar = ({ onNavigate, currentPage }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    /** 홈 페이지가 아닐 때 스크롤 스타일 표시 */
    setIsScrolled(currentPage !== 'home');
  }, [currentPage]);

  /** 모바일 메뉴 열릴 때 ESC 키로 닫기 처리 */
  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isMobileMenuOpen]);

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <motion.header
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`container ${styles.navContainer}`}>
        <a
          className={styles.logo}
          onClick={(e) => { e.preventDefault(); handleLinkClick('home'); }}
          href="#"
          style={{ cursor: 'pointer' }}
        >
          <video
            src="/video/logo1.webm"
            className={styles.logoIcon}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '4.5em', height: '4.5em', objectFit: 'contain' }}
          />
          <span className={styles.logoText}>
            <span className={styles.logoPrimaryText}>판다</span><span className={styles.logoSecondaryText}>디자인</span>
          </span>
        </a>

        {/* 데스크탑 네비게이션 */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              className={`${styles.navLink} ${currentPage === link.id ? styles.navLinkActive : ''}`}
              onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}
              href="#"
              style={{ cursor: 'pointer' }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <button
          className={styles.mobileMenuToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          {isMobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>

        {/* 모바일 네비게이션 - Portal 사용 */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  className={styles.mobileOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-hidden="true"
                />
                <motion.nav
                  className={styles.mobileNav}
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  transition={{ duration: 0.3 }}
                  role="navigation"
                  aria-label="모바일 메뉴"
                >
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      className={`${styles.mobileNavLink} ${currentPage === link.id ? styles.navLinkActive : ''}`}
                      onClick={(e) => { e.preventDefault(); handleLinkClick(link.id); }}
                      href="#"
                      style={{ cursor: 'pointer' }}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </motion.nav>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

      </div>
    </motion.header>
  );
};

export default Navbar;
