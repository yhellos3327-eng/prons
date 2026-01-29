import { motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import styles from './Footer.module.css';

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: FaGithub },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedinIn },
  { name: 'Email', href: 'mailto:hello@example.com', icon: FaEnvelope },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <a href="#home" className={styles.logo}>
              <span className={styles.logoAccent}>포트</span>폴리오
            </a>
            <p className={styles.tagline}>
              영감을 주는 디지털 경험을 만듭니다
            </p>
          </div>

          <div className={styles.footerLinks}>
            <h4 className={styles.linksTitle}>빠른 링크</h4>
            <nav className={styles.links}>
              <a href="#projects">프로젝트</a>
              <a href="#about">소개</a>
              <a href="#contact">연락처</a>
            </nav>
          </div>

          <div className={styles.footerSocial}>
            <h4 className={styles.linksTitle}>연결</h4>
            <div className={styles.socialIcons}>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.name}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} 포트폴리오. All rights reserved.
          </p>
          <p className={styles.credit}>
            정성껏 디자인 & 개발 <span className={styles.heart}>&#10084;</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
