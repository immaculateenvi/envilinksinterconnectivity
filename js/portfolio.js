const projects = [
  ...[1,2,3,4,5].map(i => ({ src:`assets/projects/${i}.jpg`, cat:'graphics', label:`Graphics ${String(i).padStart(2,'0')}` })),
  ...[6,7,8,9,10].map(i => ({ src:`assets/projects/${i}.jpg`, cat:'branding', label:`Branding ${String(i).padStart(2,'0')}` }))
];

function fallbackSVG(label, hue){
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue},70%,30%)"/>
      <stop offset="1" stop-color="hsl(${hue+60},70%,45%)"/>
    </linearGradient></defs>
    <rect width="400" height="300" fill="#12121F"/>
    <rect width="400" height="300" fill="url(#g)" opacity=".35"/>
    <text x="200" y="158" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#F4F4FA">${label}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const gallery = document.getElementById('gallery');
let currentList = [...projects], currentIdx = 0;

function render(filter='all') {
  currentList = filter==='all' ? projects : projects.filter(p => p.cat === filter);

  const graphics = currentList.filter(p => p.cat === 'graphics');
  const branding = currentList.filter(p => p.cat === 'branding');

  const groupHTML = (title, kicker, range, items, offset, baseHue) => items.length ? `
    <div class="group-heading">
      <span class="group-count">${kicker}</span>
      <h3>${title}</h3>
      <span>${range}</span>
    </div>
    <div class="gallery">
      ${items.map((p, i) => `
        <div class="gallery-item" data-i="${offset + i}" data-label="${p.label}" style="animation-delay:${i*60}ms">
          <img src="${p.src}" alt="${p.label}" loading="lazy"
               onerror="this.onerror=null;this.src='${fallbackSVG(p.label, baseHue + i*20)}'">
        </div>`).join('')}
    </div>` : '';

  gallery.innerHTML =
    groupHTML('Graphic Design', 'A / 05', '01 — 05', graphics, 0, 280) +
    groupHTML('Branding', 'B / 05', '06 — 10', branding, graphics.length, 200);

  gallery.querySelectorAll('.gallery-item').forEach(el =>
    el.addEventListener('click', () => openLB(+el.dataset.i)));
}

/* Filters */
document.querySelectorAll('.filter-btn').forEach(b =>
  b.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    render(b.dataset.f);
  }));

/* Lightbox */
const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg');
function openLB(i){ currentIdx=i; lbImg.src=currentList[i].src; lbImg.onerror=()=>{lbImg.src=fallbackSVG(currentList[i].label, 260)}; lb.classList.add('open'); document.body.style.overflow='hidden'; }
function closeLB(){ lb.classList.remove('open'); document.body.style.overflow=''; }
if (lb) {
  document.getElementById('lbClose').onclick = closeLB;
  document.getElementById('lbPrev').onclick = () => { currentIdx=(currentIdx-1+currentList.length)%currentList.length; lbImg.src=currentList[currentIdx].src; };
  document.getElementById('lbNext').onclick = () => { currentIdx=(currentIdx+1)%currentList.length; lbImg.src=currentList[currentIdx].src; };
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
  });
}

render();