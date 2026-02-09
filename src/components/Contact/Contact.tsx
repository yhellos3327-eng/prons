import { motion } from 'framer-motion';
import { HiChatAlt2 } from 'react-icons/hi';
import styles from './Contact.module.css';

// 텔레그램 SVG 아이콘
const TelegramIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const TELEGRAM_ID = 'PANDA_SGN';

const Contact = () => {
  const handleTelegramClick = () => {
    window.open(`https://t.me/${TELEGRAM_ID}`, '_blank');
  };

  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>
            <HiChatAlt2 className={styles.labelIcon} />
            문의하기
          </span>
          <h2 className="section-title">
            프로젝트 <span className="accent">문의</span>
          </h2>
          <p className="section-subtitle">
            디자인이 필요하신가요? 텔레그램으로 편하게 문의해주세요
          </p>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            className={styles.infoSection}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.telegramCard}>
              <div className={styles.telegramIconLarge}>
                <TelegramIcon size={36} />
              </div>
              <h3 className={styles.cardTitle}>텔레그램으로 빠른 상담</h3>
              <p className={styles.cardDesc}>
                평균 응답 시간 30분 이내<br />
                1:1 맞춤 상담으로 진행됩니다
              </p>
              <div className={styles.features}>
                {['빠른 응답', '무료 상담', '1:1 맞춤'].map((feature, i) => (
                  <motion.span
                    key={feature}
                    className={styles.featureTag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    {feature}
                  </motion.span>
                ))}
              </div>

              <div className={styles.telegramBtnWrapper}>
                <motion.button
                  className={styles.telegramBtn}
                  onClick={handleTelegramClick}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <TelegramIcon size={22} />
                  텔레그램 문의하기
                </motion.button>
                <p className={styles.telegramId} onClick={handleTelegramClick}>@PANDA_SGN</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>


      {/* SVG Gradient Definition */}
      <svg width="0" height="0" className="visually-hidden">
        <defs>
          <linearGradient id="contact-icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#dcdcdd' }} />
            <stop offset="100%" style={{ stopColor: '#626262' }} />
          </linearGradient>
        </defs>
      </svg>
    </section >
  );
};

export default Contact;