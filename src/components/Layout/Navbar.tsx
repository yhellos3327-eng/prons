import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import styles from './Navbar.module.css';

// 판다 SVG 컴포넌트
const PandaIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    width="1em"
    height="1em"
  >
    {/* 얼굴 */}
    <circle cx="32" cy="34" r="22" fill="white" />
    {/* 귀 */}
    <circle cx="14" cy="16" r="10" fill="#222" />
    <circle cx="50" cy="16" r="10" fill="#222" />
    {/* 눈 패치 (다크) */}
    <ellipse cx="22" cy="30" rx="8" ry="9" fill="#222" transform="rotate(-10 22 30)" />
    <ellipse cx="42" cy="30" rx="8" ry="9" fill="#222" transform="rotate(10 42 30)" />
    {/* 눈 (흰자) */}
    <circle cx="23" cy="30" r="4" fill="white" />
    <circle cx="41" cy="30" r="4" fill="white" />
    {/* 눈동자 */}
    <circle cx="24" cy="31" r="2.2" fill="#111" />
    <circle cx="42" cy="31" r="2.2" fill="#111" />
    {/* 눈 하이라이트 */}
    <circle cx="25" cy="29.5" r="0.8" fill="white" />
    <circle cx="43" cy="29.5" r="0.8" fill="white" />
    {/* 코 */}
    <ellipse cx="32" cy="39" rx="4" ry="2.8" fill="#333" />
    {/* 입 */}
    <path d="M29 42 Q32 46 35 42" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

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
          <PandaIcon className={styles.logoIcon} />
          <span className={styles.logoAccent}>판다</span> 디자인
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
            <motion.nav
              className={styles.mobileNav}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
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
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
