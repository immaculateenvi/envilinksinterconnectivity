document.addEventListener('DOMContentLoaded', () => {
  /* ═══════════ CODE LAB ═══════════ */
  const editors = {
    html: document.getElementById('editorHTML'),
    css:  document.getElementById('editorCSS'),
    js:   document.getElementById('editorJS')
  };
  const tabs = document.querySelectorAll('.lab-tab');
  const preview = document.getElementById('labPreview');

  function switchTab(name) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    Object.entries(editors).forEach(([k, el]) => el.classList.toggle('active', k === name));
  }
  tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  function runLab() {
    if (!preview) return;
    const html = editors.html?.value || '';
    const css  = editors.css?.value  || '';
    const js   = editors.js?.value   || '';
    const doc = `
      <!DOCTYPE html><html><head><meta charset="utf-8">
      <style>body{font-family:system-ui,sans-serif;padding:1rem;margin:0;color:#111}${css}</style>
      </head><body>${html}
      <script>try{${js}}catch(e){console.error(e)}<\/script>
      </body></html>`;
    preview.srcdoc = doc;
  }

  document.getElementById('labRun')?.addEventListener('click', runLab);
  document.getElementById('labClear')?.addEventListener('click', () => {
    editors.html.value = ''; editors.css.value = ''; editors.js.value = '';
    preview.srcdoc = '';
  });
  document.getElementById('labCopy')?.addEventListener('click', async () => {
    const txt = `HTML:\n${editors.html.value}\n\nCSS:\n${editors.css.value}\n\nJS:\n${editors.js.value}`;
    try { await navigator.clipboard.writeText(txt); window.toast?.('Copied to clipboard'); }
    catch { window.toast?.('Copy failed'); }
  });
  document.getElementById('labDownload')?.addEventListener('click', () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${editors.css.value}</style></head><body>${editors.html.value}<script>${editors.js.value}<\/script></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'envilinks-code-lab.html';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  runLab();

  /* ═══════════ NAME ART ═══════════ */
  const canvas = document.getElementById('artCanvas');
  const nameInput = document.getElementById('artName');
  const styleBtns = document.querySelectorAll('.art-style');
  const generateBtn = document.getElementById('artGenerate');
  const downloadBtn = document.getElementById('artDownload');

  let selectedStyle = 'gradient';
  let lastText = '';

  styleBtns.forEach(b => b.addEventListener('click', () => {
    styleBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    selectedStyle = b.dataset.style;
  }));

  function drawArt() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const name = (nameInput.value || 'Envilinks').trim().slice(0, 20);

    // background
    ctx.fillStyle = '#0A0A14';
    ctx.fillRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, 'rgba(255,10,46,.18)');
    grad.addColorStop(.5, 'rgba(162,28,175,.18)');
    grad.addColorStop(1, 'rgba(30,64,255,.18)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // fit text
    let size = 180;
    ctx.font = `700 ${size}px "Space Grotesk", sans-serif`;
    while (ctx.measureText(name).width > W - 80 && size > 40) {
      size -= 6;
      ctx.font = `700 ${size}px "Space Grotesk", sans-serif`;
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const cx = W / 2, cy = H / 2;

    // styles
    if (selectedStyle === 'gradient' || selectedStyle === 'elegant') {
      const g = ctx.createLinearGradient(0, cy - size / 2, W, cy + size / 2);
      if (selectedStyle === 'gradient') {
        g.addColorStop(0, '#FF0A2E');
        g.addColorStop(.5, '#A21CAF');
        g.addColorStop(1, '#1E40FF');
      } else {
        g.addColorStop(0, '#F4F4FA');
        g.addColorStop(1, '#C6A43F');
      }
      ctx.fillStyle = g;
      ctx.fillText(name, cx, cy);
    } else if (selectedStyle === 'neon') {
      ctx.shadowColor = '#A21CAF';
      ctx.shadowBlur = 40;
      ctx.fillStyle = '#F4F4FA';
      ctx.fillText(name, cx, cy);
      ctx.shadowBlur = 0;
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1E40FF';
      ctx.strokeText(name, cx, cy);
    } else if (selectedStyle === '3d') {
      ctx.fillStyle = '#C6A43F';
      ctx.fillText(name, cx + 8, cy + 8);
      ctx.fillStyle = '#FF0A2E';
      ctx.fillText(name, cx + 4, cy + 4);
      ctx.fillStyle = '#F4F4FA';
      ctx.fillText(name, cx, cy);
    } else if (selectedStyle === 'outline') {
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#F4F4FA';
      ctx.strokeText(name, cx, cy);
    }

    lastText = name;
    downloadBtn.disabled = false;
  }

  generateBtn?.addEventListener('click', drawArt);
  nameInput?.addEventListener('input', drawArt);
  styleBtns.forEach(b => b.addEventListener('click', drawArt));

  downloadBtn?.addEventListener('click', () => {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `envilinks-${(lastText || 'name').toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  });

  if (canvas) {
    // Initial draw
    if (document.fonts?.ready) {
      document.fonts.ready.then(drawArt);
    } else {
      setTimeout(drawArt, 300);
    }
  }
});