const FALLBACK_SITES = [
  { title:"IE Suite Portal", url:"https://ie-suite.vercel.app/", tag:"Web App",
    desc:"A full-stack productivity portal built for University Students.",
    accent:"linear-gradient(135deg,#FF0A2E,#A21CAF)" },
  { title:"ASF FOBIS", url:"https://asffobis.vercel.app/", tag:"Web App",
    desc:"A conversion-focused brand landing experience.",
    accent:"linear-gradient(135deg,#A21CAF,#1E40FF)" },
  { title:"Education Demo", url:"https://naijatertiarysummary.vercel.app/", tag:"Education",
    desc:"A tertiary-institution summary platform for students.",
    accent:"linear-gradient(135deg,#1E40FF,#FF0A2E)" }
];

async function loadLiveSites() {
  const grid = document.getElementById('liveSitesGrid');
  if (!grid) return;

  let sites = FALLBACK_SITES;
  try {
    const res = await fetch('data/websites.json');
    if (res.ok) sites = await res.json();
  } catch (_) { /* keep fallback */ }

  grid.innerHTML = sites.map((s, i) => {
    const accent = s.accent || FALLBACK_SITES[i % FALLBACK_SITES.length].accent;
    const glyph = (s.title || '?').trim().charAt(0).toUpperCase();
    const desc = s.desc || 'A live deployment by Envilinks.';
    return `
      <a href="${s.url}" target="_blank" rel="noopener" class="portal-card">
        <div class="portal-preview" style="--preview:${accent}">
          <span class="p-mark">${glyph}</span>
          <span class="p-tag">${(s.tag || 'LIVE').toUpperCase()}</span>
          <span class="p-glyph">${glyph}</span>
        </div>
        <div class="portal-body">
          <h4>${s.title}</h4>
          <p>${desc}</p>
          <div class="portal-actions">
            <span class="btn btn-grad">Open Live <i class="fas fa-external-link-alt"></i></span>
          </div>
        </div>
      </a>`;
  }).join('');
}
document.addEventListener('DOMContentLoaded', loadLiveSites);