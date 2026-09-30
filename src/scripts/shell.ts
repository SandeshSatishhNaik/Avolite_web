export {}; // module scope: a top-level `opener` would collide with window globals (TS2451)

const menu = document.querySelector<HTMLDialogElement>('#menu');
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
if (menu && menuBtn) {
  // Invoker Commands cover modern browsers (and JS off); this is the older-browser fallback.
  if (!('command' in HTMLButtonElement.prototype)) {
    menuBtn.addEventListener('click', () => menu.showModal());
    menu.querySelector('[command="close"]')?.addEventListener('click', () => menu.close());
  }
  // Link click closes the sheet; default hash navigation still runs.
  menu.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('a')) menu.close();
  });
  // Resized or rotated to desktop while open.
  matchMedia('(min-width:1024px)').addEventListener('change', (e) => {
    if (e.matches) menu.close();
  });
}

// Scroll-spy: active set of sections inside a 5% band at 40-45% of the viewport.
const links = [...document.querySelectorAll<HTMLAnchorElement>('.site-nav a, #menu a')];
const secs = [...document.querySelectorAll<HTMLElement>('main section[data-section]')];
const inBand = new Set<string>();
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) inBand.add(e.target.id);
      else inBand.delete(e.target.id);
    }
    const active = [...secs].reverse().find((s) => inBand.has(s.id))?.id; // undefined over the hero clears all
    for (const a of links) {
      if (a.getAttribute('href') === `#${active}`) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    }
  },
  { rootMargin: '-40% 0px -55% 0px' },
);
secs.forEach((s) => io.observe(s));
