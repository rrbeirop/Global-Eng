/* ════════════════════════════════════════
   TerraForte Engenharia — script.js
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger menu ──────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  // ── Carrossel ───────────────────────────────────────
  const track    = document.getElementById('carouselTrack');
  const slides   = track.querySelectorAll('.carousel-slide');
  const dotsWrap = document.getElementById('cDots');
  let cur = 0, timer;

  // Cria os dots dinamicamente
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'c-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsWrap.appendChild(d);
  });

  function goTo(n) {
    cur = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dotsWrap.querySelectorAll('.c-dot').forEach((d, i) =>
      d.classList.toggle('active', i === cur)
    );
  }

  document.getElementById('prevBtn').addEventListener('click', () => { goTo(cur - 1); resetTimer(); });
  document.getElementById('nextBtn').addEventListener('click', () => { goTo(cur + 1); resetTimer(); });

  // Swipe touch support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? cur + 1 : cur - 1); resetTimer(); }
  });

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(cur + 1), 5000);
  }
  timer = setInterval(() => goTo(cur + 1), 5000);

  // ── Contador animado ────────────────────────────────
  function animateCount(el) {
    const target   = parseInt(el.dataset.count);
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

    const fmt = n =>
      n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' :
      n >= 1000    ? (n / 1000).toFixed(0) + 'k'    :
      Math.floor(n);

    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = fmt(current) + '+';
      if (current >= target) clearInterval(iv);
    }, 16);
  }

  // ── Reveal ao rolar ─────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

});