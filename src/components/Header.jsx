import { useEffect, useState } from 'react';
import ChakraIcon from './ChakraIcon.jsx';

const NAV_ITEMS = [
  ['overview', 'Overview'],
  ['layers', 'Layers'],
  ['systems', 'Systems'],
  ['simulator', 'Simulator'],
  ['timeline', 'Timeline'],
  ['compare', 'Compare']
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Highlight the nav link for the section in view (the hero, #top, clears it)
  useEffect(() => {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#top" className="brand" aria-label="Iron Dome of India — home">
          <ChakraIcon />
          <span>Iron Dome <b>of India</b></span>
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-controls="site-nav"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
        <nav id="site-nav" className={`site-nav${open ? ' open' : ''}`} aria-label="Main">
          {NAV_ITEMS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'active' : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
