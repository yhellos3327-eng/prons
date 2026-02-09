import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} 판다디자인. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
