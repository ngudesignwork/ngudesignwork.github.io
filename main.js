// Mini interactions. Everything here is progressive enhancement:
// the site works fully with JavaScript turned off.

const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------------------
   1. Rolling link text — add data-roll to any link or button.
   ------------------------------------------------------------------------ */
document.querySelectorAll('[data-roll]').forEach((el) => {
  const text = el.textContent.trim();
  const roll = document.createElement('span');
  roll.className = 'roll';
  const inner = document.createElement('span');
  inner.className = 'roll-inner';
  const a = document.createElement('span');
  a.textContent = text;
  const b = document.createElement('span');
  b.textContent = text;
  b.setAttribute('aria-hidden', 'true');
  inner.append(a, b);
  roll.append(inner);
  el.replaceChildren(roll);
});

/* ---------------------------------------------------------------------------
   2. Dog cursor — a small dog trails the pointer and perks up over links.
   ------------------------------------------------------------------------ */
const DOG_SVG = `
<svg viewBox="0 0 64 64" aria-hidden="true">
  <ellipse cx="15" cy="27" rx="7" ry="13" transform="rotate(20 15 27)" fill="#6B4A3A"/>
  <ellipse cx="49" cy="27" rx="7" ry="13" transform="rotate(-20 49 27)" fill="#6B4A3A"/>
  <circle cx="32" cy="33" r="18" fill="#F2DDC0" stroke="#1F1B26" stroke-width="1.5"/>
  <ellipse cx="32" cy="42" rx="10" ry="7.5" fill="#FFF8EE"/>
  <circle cx="25" cy="30" r="2.3" fill="#1F1B26"/>
  <circle cx="39" cy="30" r="2.3" fill="#1F1B26"/>
  <ellipse cx="32" cy="38.5" rx="3.4" ry="2.4" fill="#1F1B26"/>
  <path d="M28.5 43 q3.5 3.5 7 0" fill="none" stroke="#1F1B26" stroke-width="1.4" stroke-linecap="round"/>
  <path class="dog-tongue" d="M30.5 45 q1.5 5 3 0" fill="#F27D8A" opacity="0"/>
  <path d="M19 47 q13 9 26 0" fill="none" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/>
</svg>`;

const STORE_KEY = 'dog-cursor';
const readPref = () => { try { return localStorage.getItem(STORE_KEY) !== 'off'; } catch { return true; } };
const writePref = (on) => { try { localStorage.setItem(STORE_KEY, on ? 'on' : 'off'); } catch { /* private mode */ } };

if (canHover) {
  const dog = document.createElement('div');
  dog.className = 'dog-cursor';
  dog.innerHTML = DOG_SVG;
  document.body.append(dog);
  const tongue = dog.querySelector('.dog-tongue');

  let enabled = readPref();
  let x = -100, y = -100, tx = -100, ty = -100;
  const OFFSET = 18; // dog sits just below-right of the pointer

  addEventListener('pointermove', (e) => {
    tx = e.clientX + OFFSET;
    ty = e.clientY + OFFSET;
    if (enabled) dog.classList.add('is-visible');
    const excited = !!e.target.closest('a, button');
    dog.classList.toggle('is-excited', excited);
    tongue.setAttribute('opacity', excited ? '1' : '0');
  });
  document.documentElement.addEventListener('pointerleave', () => dog.classList.remove('is-visible'));

  const tick = () => {
    const ease = reduceMotion ? 1 : 0.18; // trailing follow, or instant
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    const tilt = reduceMotion ? 0 : Math.max(-12, Math.min(12, (tx - x) * 0.4));
    dog.style.transform = `translate(${x}px, ${y}px) rotate(${tilt}deg)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // On/off switch — any button with [data-dog-toggle]
  const toggles = document.querySelectorAll('[data-dog-toggle]');
  const sync = () => {
    toggles.forEach((t) => {
      t.setAttribute('aria-pressed', String(enabled));
      t.querySelector('[data-dog-state]').textContent = enabled ? 'on' : 'off';
    });
    if (!enabled) dog.classList.remove('is-visible');
  };
  toggles.forEach((t) => t.addEventListener('click', () => {
    enabled = !enabled;
    writePref(enabled);
    sync();
  }));
  sync();
}
