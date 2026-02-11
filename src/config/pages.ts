import { Hero } from '../components/Hero';
import { ProjectSlider } from '../components/Projects';
import { About } from '../components/About';
import { Contact } from '../components/Contact';

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
