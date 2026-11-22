const KEY = 'envilinks_posts';
const listEl = document.getElementById('postsList');
const countEl = document.getElementById('postCount');

const getPosts = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
};

function escapeHTML(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function renderPosts() {
  if (!listEl) return;
  const posts = getPosts();
  if (countEl) countEl.textContent = posts.length;

  if (!posts.length) {
    listEl.innerHTML = `
      <div style="padding:3rem 1rem;text-align:center;border:1px dashed var(--line);border-radius:16px">
        <p style="font-family:var(--font-mono);color:var(--grad-magenta);letter-spacing:.15em;font-size:.7rem">01 / COMING SOON</p>
        <h3 style="margin:.8rem 0;font-family:var(--font-display)">No notes yet.</h3>
        <p style="color:var(--text-dim);font-size:.9rem">New entries will appear here soon.</p>
      </div>`;
    return;
  }

  listEl.innerHTML = posts.map(p => `
    <article class="journal-post">
      <span>${new Date(p.date).toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}</span>
      <h2>${escapeHTML(p.title)}</h2>
      <p>${escapeHTML(p.body)}</p>
    </article>`).join('');
}

renderPosts();