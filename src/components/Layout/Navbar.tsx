import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import styles from './Navbar.module.css';



const navLinks = [
  { name: '홈', href: '#home' },
  { name: '포트폴리오', href: '#projects' },
  { name: '소개', href: '#about' },
  { name: '문의하기', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모바일 메뉴 열릴 때 스크롤 잠금 + ESC 키로 닫기
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`container ${styles.navContainer}`}>
        <a href="#home" className={styles.logo}>
          <video
            src="/video/emoji_logo.webm"
            className={styles.logoIcon}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '2em', height: '2em', objectFit: 'contain' }}
          />
          판다디자인
        </a>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={styles.navLink}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          {isMobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>

        {/* Mobile Navigation */}
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
                    href={link.href}
                    className={styles.mobileNavLink}
                    onClick={handleLinkClick}
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
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
