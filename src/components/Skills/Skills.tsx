import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiNodedotjs,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiFigma,
  SiGit,
  SiPython,
  SiAmazonwebservices,
} from 'react-icons/si';
import styles from './Skills.module.css';

const skills = [
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'AWS', icon: SiAmazonwebservices, color: '#FF9900' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className={`section ${styles.skills}`}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>What I Use</span>
          <h2 className="section-title">
            Skills & <span className="accent">Technologies</span>
          </h2>
          <p className="section-subtitle">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              className={styles.skillCard}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div
                className={styles.iconWrapper}
                style={{ '--skill-color': skill.color } as React.CSSProperties}
              >
                <skill.icon size={32} />
              </div>
              <span className={styles.skillName}>{skill.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
