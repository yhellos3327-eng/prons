import { lazy } from 'react';

const Hero = lazy(() => import('../components/Hero/Hero'));
const ProjectSlider = lazy(() => import('../components/Projects/ProjectSlider'));
const About = lazy(() => import('../components/About/About'));
const Contact = lazy(() => import('../components/Contact/Contact'));

export interface PageConfig {
    id: string;
    component: React.ComponentType<any>;
    label: string;
}

export const APP_PAGES: PageConfig[] = [
    { id: 'home', component: Hero, label: 'Home' },
    { id: 'projects', component: ProjectSlider, label: 'Projects' },
    { id: 'about', component: About, label: 'About' },
    { id: 'contact', component: Contact, label: 'Contact' },
];
