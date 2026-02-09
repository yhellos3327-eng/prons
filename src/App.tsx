import { Navbar } from './components/Layout';
import { Hero } from './components/Hero';
import { ProjectSlider } from './components/Projects';
import { About } from './components/About';
import { Contact } from './components/Contact';
import './styles/global.css';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProjectSlider />
        <About />
        <Contact />
      </main>
    </>
  );
}

export default App;
