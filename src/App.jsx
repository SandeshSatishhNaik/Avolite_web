import BackToTop from './components/BackToTop.jsx';
import Compare from './components/Compare.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Layers from './components/Layers.jsx';
import Overview from './components/Overview.jsx';
import Simulator from './components/Simulator.jsx';
import Systems from './components/Systems.jsx';
import Timeline from './components/Timeline.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Overview />
        <Layers />
        <Systems />
        <Simulator />
        <Timeline />
        <Compare />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
