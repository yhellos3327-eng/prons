import { motion } from 'framer-motion';
import { HiMail, HiLocationMarker, HiPhone } from 'react-icons/hi';
import { FaGithub, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import styles from './Contact.module.css';

const contactInfo = [
  {
    icon: HiMail,
    label: '이메일',
    value: 'hello@example.com',
    href: 'mailto:hello@example.com',
  },
  {
    icon: HiLocationMarker,
    label: '위치',
    value: '서울, 대한민국',
    href: null,
  },
  {
    icon: HiPhone,
    label: '전화',
    value: '010-1234-5678',
    href: 'tel:+821012345678',
  },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: FaGithub },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedinIn },
  { name: 'Twitter', href: 'https://twitter.com', icon: FaTwitter },
];

const Contact = () => {
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
          <span className={styles.label}>연락처</span>
          <h2 className="section-title">
            함께 <span className="accent">연결해요</span>
          </h2>
          <p className="section-subtitle">
            프로젝트가 있으신가요? 어떻게 함께 일할 수 있을지 이야기해요
          </p>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            className={styles.infoSection}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.infoCards}>
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  className={styles.infoCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className={styles.iconWrapper}>
                    <info.icon size={24} />
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{info.label}</span>
                    {info.href ? (
                      <a href={info.href} className={styles.infoValue}>
                        {info.value}
                      </a>
                    ) : (
                      <span className={styles.infoValue}>{info.value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.socialSection}>
              <span className={styles.socialLabel}>SNS 팔로우</span>
              <div className={styles.socialLinks}>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    whileHover={{ scale: 1.2, y: -5, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    aria-label={social.name}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.form
            className={styles.form}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles.formRow}>
              <motion.div
                className={styles.formGroup}
                whileFocus={{ scale: 1.02 }}
              >
                <label htmlFor="name" className={styles.formLabel}>
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.formInput}
                  placeholder="홍길동"
                  required
                />
              </motion.div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.formInput}
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.formLabel}>
                제목
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className={styles.formInput}
                placeholder="프로젝트 문의"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>
                메시지
              </label>
              <textarea
                id="message"
                name="message"
                className={styles.formTextarea}
                placeholder="프로젝트에 대해 알려주세요..."
                rows={5}
                required
              />
            </div>

            <motion.button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              메시지 보내기
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
