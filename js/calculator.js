(function () {
  /* ── PRICING ── edit these to tune quotes ── */
  const SERVICES = {
    graphics: { label: 'Graphics Design',  base: 25000,  perExtra: 5000 },
    web:      { label: 'Web Development',  base: 120000, perExtra: 20000 },
    internet: { label: 'Internet Services', base: 80000,  perExtra: 15000 },
    domain:   { label: 'Domain & Hosting', base: 40000,  perExtra: 8000 }
  };

  const COMPLEXITY = {
    simple:  { label: 'Simple',  factor: 1.0 },
    medium:  { label: 'Medium',  factor: 1.35 },
    complex: { label: 'Complex', factor: 1.75 }
  };

  const TIMELINE = {
    standard: { label: 'Standard (2–4 weeks)', factor: 1.0 },
    fast:     { label: 'Fast (1–2 weeks)',     factor: 1.25 },
    urgent:   { label: 'Urgent (3–7 days)',    factor: 1.6 }
  };

  /* ── FX rates for display only (edit if you like) ── */
  const FX = { NGN: 1, USD: 1 / 1500, EUR: 1 / 1650 };
  const SYMBOL = { NGN: '₦', USD: '$', EUR: '€' };

  const WHATSAPP = '+2348142442012';

  /* ── DOM ── */
  const $ = id => document.getElementById(id);
  const serviceEl    = $('calcService');
  const complexityEl = $('calcComplexity');
  const timelineEl   = $('calcTimeline');
  const pagesEl      = $('calcPages');
  const currencyEl   = $('calcCurrency');

  const baseEl              = $('calcBase');
  const complexityFactorEl  = $('calcComplexityFactor');
  const timelineFactorEl    = $('calcTimelineFactor');
  const additionalEl        = $('calcAdditional');
  const totalEl             = $('calcTotal');

  const waBtn    = $('calcWhatsApp');
  const resetBtn = $('calcReset');

  if (!serviceEl) return; // calculator not on this page

  const fmt = (amount, cur) =>
    SYMBOL[cur] + Math.round(amount * FX[cur]).toLocaleString();

  let latest = { total: 0, currency: 'NGN', service: '', complexity: '', timeline: '', pages: 1 };

  function compute() {
    const svc  = SERVICES[serviceEl.value];
    const cplx = COMPLEXITY[complexityEl.value];
    const time = TIMELINE[timelineEl.value];
    const pages = Math.max(1, Math.min(50, parseInt(pagesEl.value, 10) || 1));
    const cur = currencyEl.value;

    const base       = svc.base;
    const additional = (pages - 1) * svc.perExtra;
    const subtotal   = base + additional;
    const total      = subtotal * cplx.factor * time.factor;

    baseEl.textContent             = fmt(base, cur);
    additionalEl.textContent       = fmt(additional, cur);
    complexityFactorEl.textContent = cplx.factor.toFixed(2) + '×';
    timelineFactorEl.textContent   = time.factor.toFixed(2) + '×';
    totalEl.textContent            = fmt(total, cur);

    latest = {
      total,
      currency: cur,
      service: svc.label,
      complexity: cplx.label,
      timeline: time.label,
      pages
    };
  }

  ['change', 'input'].forEach(ev => {
    serviceEl.addEventListener(ev, compute);
    complexityEl.addEventListener(ev, compute);
    timelineEl.addEventListener(ev, compute);
    pagesEl.addEventListener(ev, compute);
    currencyEl.addEventListener(ev, compute);
  });

  resetBtn && resetBtn.addEventListener('click', () => {
    serviceEl.value = 'graphics';
    complexityEl.value = 'medium';
    timelineEl.value = 'standard';
    pagesEl.value = 1;
    currencyEl.value = 'NGN';
    compute();
  });

  waBtn && waBtn.addEventListener('click', () => {
    const t = latest;
    const text =
      `*New Project Estimate — Envilinks*\n\n` +
      `*Service:* ${t.service}\n` +
      `*Complexity:* ${t.complexity}\n` +
      `*Timeline:* ${t.timeline}\n` +
      `*Pages / Units:* ${t.pages}\n` +
      `*Estimated total:* ${fmt(t.total, t.currency)}\n\n` +
      `Please confirm this estimate and share next steps.`;
    window.open(`https://wa.me/${WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  });

  compute();
})();