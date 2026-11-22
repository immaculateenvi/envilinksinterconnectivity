document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── NAV ── */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('navMenu');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  /* ── TICKER (only if present) ── */
  const track = document.querySelector('.ticker-track');
  if (track) track.innerHTML += track.innerHTML;

  /* ── SCROLL REVEAL ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ── COUNTERS (only if present) ── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    let cur = 0;
    const step = target / 60;
    const tick = () => {
      cur += step;
      if (cur < target) { el.textContent = Math.floor(cur); requestAnimationFrame(tick); }
      else el.textContent = target;
    };
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { tick(); o.disconnect(); } }).observe(el);
  });

  /* ── TYPEWRITER (homepage) ── */
  const typer = document.getElementById('typer');
  if (typer) {
    const words = ['ideas.', 'brands.', 'networks.', 'the future.'];
    let w = 0, c = 0, del = false;
    (function type() {
      const word = words[w];
      typer.textContent = word.slice(0, c);
      if (!del && c < word.length) { c++; setTimeout(type, 90); }
      else if (!del && c === word.length) { del = true; setTimeout(type, 1600); }
      else if (del && c > 0) { c--; setTimeout(type, 45); }
      else { del = false; w = (w + 1) % words.length; setTimeout(type, 300); }
    })();
  }

  /* ── HERO CANVAS (kept off for lightness — no #heroCanvas in DOM) ── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w, h, pts = [];
    const isMobile = () => window.innerWidth < 768;
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const buildPoints = () => {
      pts = [];
      const count = isMobile() ? 28 : 70;
      for (let i = 0; i < count; i++)
        pts.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-.5)*.5, vy: (Math.random()-.5)*.5 });
    };
    buildPoints();
    window.addEventListener('resize', buildPoints);
    function draw() {
      ctx.clearRect(0,0,w,h);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>w) p.vx*=-1;
        if (p.y<0||p.y>h) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,1.6,0,7); ctx.fillStyle='rgba(162,28,175,.7)'; ctx.fill();
      });
      const maxD = isMobile() ? 90 : 130;
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy);
        if (d<maxD){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(30,64,255,${(1-d/maxD)*.35})`; ctx.stroke(); }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── TILT CARDS (skip on touch) ── */
  if (!window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  }

  /* ── TOAST ── */
  window.toast = msg => {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  };
});