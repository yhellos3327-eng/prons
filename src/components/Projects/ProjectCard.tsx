import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaBehance } from 'react-icons/fa';
import type { Project } from '../../data/projects';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
}

const ProjectCard = ({ project, isActive }: ProjectCardProps) => {
  return (
    <motion.div
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={project.image}
          alt={project.title}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>

        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <motion.span
              key={tag}
              className={styles.tag}
              whileHover={{ scale: 1.1 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        <div className={styles.links}>
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label="라이브 데모 보기"
              whileHover={{ x: 5 }}
            >
              <FaExternalLinkAlt size={16} />
              <span>데모 보기</span>
            </motion.a>
          )}
          {project.behanceUrl && (
            <motion.a
              href={project.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label="Behance에서 보기"
              whileHover={{ x: 5 }}
            >
              <FaBehance size={18} />
              <span>Behance</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
