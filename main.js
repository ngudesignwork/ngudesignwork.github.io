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
   2. Butterfly cursor — a monarch butterfly trails the pointer and flaps its
      wings over links and buttons.
   ------------------------------------------------------------------------ */
// One left wing pair; the right side is the same drawing mirrored.
const FOREWING = 'M31 24C26 15 15 8.5 8.5 11.5C4.5 14 5.5 23 11.5 27.5C17.5 31 26 31 31 30Z';
const HINDWING = 'M31 31.5C24 31 14.5 33 13 40C12 46.5 19.5 50 24.5 46.5C28 43.5 30 38.5 31 34Z';
const WING = `
  <g class="wing">
    <path d="${HINDWING}" fill="var(--accent)" stroke="#1F1B26" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M31 32.8Q21.5 34.2 13.4 40.4M31 34.2Q23 39.6 18.2 48M30.6 35.8Q27.4 41.8 25.4 47.4"
      fill="none" stroke="#1F1B26" stroke-width=".8" stroke-linecap="round" clip-path="url(#bf-hw)"/>
    <path d="${FOREWING}" fill="var(--accent)" stroke="#1F1B26" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M31 25.8Q21 18.4 9.6 12.8M31 27Q19.5 21.8 6.4 18.6M30.8 28.4Q19 26 7.4 25.2M30.6 29.6Q21.5 30.6 12.6 28.6"
      fill="none" stroke="#1F1B26" stroke-width=".8" stroke-linecap="round" clip-path="url(#bf-fw)"/>
    <g fill="#FFFFFF">
      <circle cx="13.69" cy="11.49" r=".38"/><circle cx="11.74" cy="11.39" r=".38"/><circle cx="9.85" cy="11.67" r=".38"/>
      <circle cx="8.15" cy="12.58" r=".38"/><circle cx="7.2" cy="14.11" r=".38"/><circle cx="6.77" cy="15.95" r=".38"/>
      <circle cx="6.77" cy="17.9" r=".38"/><circle cx="7.11" cy="19.84" r=".38"/><circle cx="7.75" cy="21.69" r=".38"/>
      <circle cx="8.65" cy="23.44" r=".38"/><circle cx="9.8" cy="25.03" r=".38"/>
      <circle cx="17.09" cy="35.11" r=".38"/><circle cx="15.62" cy="36.37" r=".38"/><circle cx="14.47" cy="37.89" r=".38"/>
      <circle cx="13.73" cy="39.63" r=".38"/><circle cx="13.53" cy="41.05" r=".38"/><circle cx="13.78" cy="42.91" r=".38"/>
      <circle cx="14.6" cy="44.57" r=".38"/><circle cx="15.92" cy="45.91" r=".38"/><circle cx="17.58" cy="46.81" r=".38"/>
      <circle cx="19.43" cy="47.23" r=".38"/><circle cx="21.32" cy="47.16" r=".38"/><circle cx="23.12" cy="46.59" r=".38"/>
    </g>
  </g>`;

const BUTTERFLY_SVG = `
<svg viewBox="0 0 64 64" aria-hidden="true">
  <defs>
    <clipPath id="bf-fw"><path d="${FOREWING}"/></clipPath>
    <clipPath id="bf-hw"><path d="${HINDWING}"/></clipPath>
  </defs>
  ${WING}
  <g transform="matrix(-1 0 0 1 64 0)">${WING}</g>
  <ellipse cx="32" cy="33" rx="1.7" ry="11" fill="#1F1B26"/>
  <circle cx="32" cy="20.5" r="2.3" fill="#1F1B26"/>
  <path d="M31.2 19C29.5 13.5 27.5 10.5 25 9M32.8 19C34.5 13.5 36.5 10.5 39 9"
    fill="none" stroke="#1F1B26" stroke-width=".9" stroke-linecap="round"/>
  <circle cx="25" cy="9" r="1.1" fill="#1F1B26"/><circle cx="39" cy="9" r="1.1" fill="#1F1B26"/>
</svg>`;

const STORE_KEY = 'butterfly-cursor';
const readPref = () => { try { return localStorage.getItem(STORE_KEY) !== 'off'; } catch { return true; } };
const writePref = (on) => { try { localStorage.setItem(STORE_KEY, on ? 'on' : 'off'); } catch { /* private mode */ } };

if (canHover) {
  const buddy = document.createElement('div');
  buddy.className = 'cursor-buddy';
  buddy.innerHTML = BUTTERFLY_SVG;
  document.body.append(buddy);

  let enabled = readPref();
  let x = -100, y = -100, tx = -100, ty = -100;
  const OFFSET = 18; // sits just below-right of the pointer

  addEventListener('pointermove', (e) => {
    tx = e.clientX + OFFSET;
    ty = e.clientY + OFFSET;
    if (enabled) buddy.classList.add('is-visible');
    buddy.classList.toggle('is-excited', e.target instanceof Element && !!e.target.closest('a, button'));
  });
  document.documentElement.addEventListener('pointerleave', () => buddy.classList.remove('is-visible'));

  const tick = () => {
    const ease = reduceMotion ? 1 : 0.18; // trailing follow, or instant
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    const tilt = reduceMotion ? 0 : Math.max(-10, Math.min(10, (tx - x) * 0.35));
    buddy.style.transform = `translate(${x}px, ${y}px) rotate(${tilt}deg)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // On/off switch — any button with [data-cursor-toggle] and role="switch"
  const toggles = document.querySelectorAll('[data-cursor-toggle]');
  const sync = () => {
    toggles.forEach((t) => t.setAttribute('aria-checked', String(enabled)));
    if (!enabled) buddy.classList.remove('is-visible');
  };
  toggles.forEach((t) => t.addEventListener('click', () => {
    enabled = !enabled;
    writePref(enabled);
    sync();
  }));
  sync();
}
