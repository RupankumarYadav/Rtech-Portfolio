/* ============================================================
   RTech Portfolio — script.js
   Author: Rupan Kumar Yadav
   ============================================================ */

const API = 'https://rtech-portfolio.onrender.com/api';

/* ═══════════════════════════════════════════════════════════
   OFFLINE DATA CACHE
   — Jab backend ONLINE ho aur data fetch ho jaye, hum use
     localStorage mein save kar dete hain.
   — Jab backend OFFLINE ho, hum PEHLE isi cache ko load karte
     hain (data.js ke hardcoded values ki jagah), taki hamesha
     "latest saved" data hi dikhe, purana/default data nahi.
═══════════════════════════════════════════════════════════ */
const CACHE_KEY = 'rtech_data_cache_v1';
const PHOTO_CACHE_KEY = 'rtech_photo_b64_v1';

function saveDataCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(PORTFOLIO_DATA));
  } catch (e) { /* storage full ya blocked — ignore */ }
}

function loadDataCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      Object.assign(PORTFOLIO_DATA, parsed);
      return true;
    }
  } catch (e) { /* corrupt cache — ignore, data.js defaults chalenge */ }
  return false;
}

/* Photo */
function cachePhotoFromUrl(url) {
  if (!url || url.startsWith('data:')) return;
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.onload = () => {
        try { localStorage.setItem(PHOTO_CACHE_KEY, reader.result); } catch (e) {}
      };
      reader.readAsDataURL(blob);
    })
    .catch(() => { /* backend offline — cache attempt fail, no issue */ });
}

function getCachedPhoto() {
  try { return localStorage.getItem(PHOTO_CACHE_KEY) || ''; } catch (e) { return ''; }
}

/* ═══════════════════════════════════════════════════════════
   RENDER — data.js se data lekar HTML mein inject karta hai
═══════════════════════════════════════════════════════════ */

function renderHero() {
  const p = PORTFOLIO_DATA.personal;

  // Name
  document.getElementById('hero-name-1').textContent = p.name.split(' ').slice(0, 2).join(' ');
  document.getElementById('hero-name-2').textContent = p.name.split(' ').slice(2).join(' ');

  // Description
  document.getElementById('hero-desc').textContent = p.tagline;

  // Stats
  const statsEl = document.getElementById('hero-stats');
  statsEl.innerHTML = PORTFOLIO_DATA.stats.map(s => `
    <div class="stat-item">
      <div class="stat-num">${s.number.replace('+', '')}<span>+</span></div>
      <div class="stat-lbl">${s.label}</div>
    </div>
  `).join('');

  // Photo — agar data.js/backend se photo path mila ho, warna cached base64 try karo
  const box = document.getElementById('photo-inner');
  const ph  = document.getElementById('photo-ph');
  const photoSrc = p.photo || '';

  if (photoSrc) {
    ph.style.display = 'none';
    const img = document.createElement('img');
    img.alt = p.name;
    img.src = photoSrc;

    // Agar actual URL load fail ho (backend offline), cached base64 par fallback karo
    img.onerror = () => {
      const cached = getCachedPhoto();
      if (cached && img.src !== cached) img.src = cached;
      else { ph.style.display = 'flex'; img.remove(); }
    };
    // Agar successfully load ho gaya, isko base64 mein cache kar lo agle offline session ke liye
    img.onload = () => cachePhotoFromUrl(photoSrc);

    box.appendChild(img);
  } else {
    // Data.js mein photo empty hai — try cached photo (last known good)
    const cached = getCachedPhoto();
    if (cached) {
      ph.style.display = 'none';
      const img = document.createElement('img');
      img.alt = p.name;
      img.src = cached;
      box.appendChild(img);
    }
  }

  // Available badge
  const badge = document.getElementById('avail-badge');
  if (!p.available) badge.style.display = 'none';
}

function renderAbout() {
  const p = PORTFOLIO_DATA.personal;

  // About paragraphs
  const aboutEl = document.getElementById('about-text');
  aboutEl.innerHTML = PORTFOLIO_DATA.about.map(para => `<p>${para}</p>`).join('');

  // Info grid
  const infoEl = document.getElementById('info-grid');
  infoEl.innerHTML = `
    <div class="info-item"><span class="ii">📍</span><div><strong>Location</strong><span>${p.location}</span></div></div>
    <div class="info-item"><span class="ii">💼</span><div><strong>Brand</strong><span>${p.brand}</span></div></div>
    <div class="info-item"><span class="ii">🎓</span><div><strong>Degree</strong><span>${p.degree}</span></div></div>
    <div class="info-item"><span class="ii">📧</span><div><strong>Email</strong><a href="mailto:${p.email}" style="color:inherit;text-decoration:none">${p.email}</a></div></div>
    <div class="info-item"><span class="ii">🔗</span><div><strong>GitHub</strong><a href="https://${p.github}" target="_blank" style="color:inherit;text-decoration:none">${p.github}</a></div></div>
    <div class="info-item"><span class="ii">🟢</span><div><strong>Status</strong><span>${p.status}</span></div></div>
  `;

  // Education timeline
  const eduEl = document.getElementById('edu-timeline');
  eduEl.innerHTML = PORTFOLIO_DATA.education.map(e => `
    <div class="edu-item">
      <div class="edu-yr">${e.year}</div>
      <div class="edu-deg">${e.degree}</div>
      <div class="edu-sch">${e.school}</div>
    </div>
  `).join('');
}

function renderSkills() {
  const colorMap = {
    purple: 't-purple',
    cyan:   't-cyan',
    green:  't-green',
    orange: 't-orange',
  };

  const container = document.getElementById('skills-container');
  container.innerHTML = PORTFOLIO_DATA.skills.map((skill, i) => `
    <div class="skill-card fade ${i % 3 === 1 ? 'd1' : i % 3 === 2 ? 'd2' : ''}">
      <div class="sk-head">
        <div class="sk-ico">${skill.icon}</div>
        <div class="sk-name">${skill.name}</div>
      </div>
      <div class="sk-tags">
        ${skill.tags.map(tag => `<span class="sk-tag ${colorMap[skill.color] || 't-purple'}">${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');

  // Re-observe new fade elements
  observeFade();
}

function renderProjects() {
  const bannerMap = {
    blue:   'b-blue',
    teal:   'b-teal',
    purple: 'b-purple',
    red:    'b-red',
    green:  'b-green',
    orange: 'b-orange',
  };

  const liked = JSON.parse(localStorage.getItem('rtech_liked') || '{}');

  const container = document.getElementById('projects-container');
  container.innerHTML = PORTFOLIO_DATA.projects.map((proj, i) => {
    const isLiked = liked[proj.id] || false;
    return `
      <div class="proj-card fade ${i % 3 === 1 ? 'd1' : i % 3 === 2 ? 'd2' : ''}" data-project="${proj.title}">
        <div class="proj-banner ${bannerMap[proj.banner] || 'b-blue'}">${proj.emoji}</div>
        <div class="proj-body">
          <div class="proj-top">
            <div class="proj-title">${proj.title}</div>
            <div class="proj-icon-links">
              <a href="${proj.github}" target="_blank" class="pil" title="GitHub">⌥</a>
              <a href="${proj.demo}"   target="_blank" class="pil" title="Live Demo">↗</a>
            </div>
          </div>
          <div class="proj-stats">
            <span>👁 <span class="view-count">0</span> views</span>
            <span>❤ <span class="like-count">0</span> likes</span>
          </div>
          <p class="proj-desc">${proj.description}</p>
          <div class="proj-tech">
            ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          <div class="proj-footer">
            <div class="proj-action-btns">
              <a href="${proj.github}" target="_blank" class="pa-btn">GitHub</a>
              <a href="${proj.demo}"   target="_blank" class="pa-btn primary">Live Demo</a>
            </div>
            <button class="like-btn ${isLiked ? 'liked' : ''}"
              onclick="toggleLike(this, '${proj.title}')">
              ${isLiked ? '❤ Liked' : '🤍 Like'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-observe new fade elements
  observeFade();
  initProjectViewTracking();
}

function renderAchievements() {
  const colorMap = {
    purple: { bg: 'rgba(99,102,241,.1)',  color: '#a5b4fc', border: 'rgba(99,102,241,.2)'  },
    cyan:   { bg: 'rgba(6,182,212,.1)',   color: '#67e8f9', border: 'rgba(6,182,212,.2)'   },
    green:  { bg: 'rgba(16,185,129,.1)',  color: '#6ee7b7', border: 'rgba(16,185,129,.2)'  },
    orange: { bg: 'rgba(245,158,11,.1)',  color: '#fcd34d', border: 'rgba(245,158,11,.2)'  },
  };

  const container = document.getElementById('achievements-container');
  if (!container) return;

  container.innerHTML = PORTFOLIO_DATA.achievements.map((a, i) => {
    const c = colorMap[a.color] || colorMap.purple;
    return `
      <div class="achieve-card fade ${i % 3 === 1 ? 'd1' : i % 3 === 2 ? 'd2' : ''}">
        <div class="achieve-icon" style="background:${c.bg};border:1px solid ${c.border};color:${c.color}">
          ${a.icon}
        </div>
        <div class="achieve-body">
          <div class="achieve-title">${a.title}</div>
          <div class="achieve-issuer">${a.issuer}</div>
          <div class="achieve-date">${a.date}</div>
        </div>
        <a href="${a.link}" target="_blank" class="achieve-link" style="color:${c.color};border-color:${c.border}">
          View ↗
        </a>
      </div>
    `;
  }).join('');

  observeFade();
}

function renderContact() {
  const p = PORTFOLIO_DATA.personal;

  const linksEl = document.getElementById('contact-links');
  linksEl.innerHTML = `
    <a href="mailto:${p.email}" class="cli">
      <div class="cli-ico">📧</div>
      <div><div class="cli-lbl">Email</div><div class="cli-val">${p.email}</div></div>
    </a>
    <a href="https://${p.linkedin}" target="_blank" class="cli">
      <div class="cli-ico">💼</div>
      <div><div class="cli-lbl">LinkedIn</div><div class="cli-val">${p.linkedin}</div></div>
    </a>
    <a href="https://${p.github}" target="_blank" class="cli">
      <div class="cli-ico">🐙</div>
      <div><div class="cli-lbl">GitHub</div><div class="cli-val">${p.github}</div></div>
    </a>
    <a href="tel:${p.phone}" class="cli">
      <div class="cli-ico">📞</div>
      <div><div class="cli-lbl">Phone</div><div class="cli-val">${p.phone}</div></div>
    </a>
  `;
}

/* ═══════════════════════════════════════════════════════════
   TYPING ANIMATION
═══════════════════════════════════════════════════════════ */
function initTyping() {
  const roles    = PORTFOLIO_DATA.roles;
  const el       = document.getElementById('typed-role');
  let roleIdx    = 0;
  let charIdx    = 0;
  let deleting   = false;

  function type() {
    const role = roles[roleIdx];
    el.textContent = deleting
      ? role.substring(0, charIdx - 1)
      : role.substring(0, charIdx + 1);

    deleting ? charIdx-- : charIdx++;

    let speed = deleting ? 55 : 95;

    if (!deleting && charIdx === role.length) {
      speed    = 2000;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx  = (roleIdx + 1) % roles.length;
      speed    = 350;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ═══════════════════════════════════════════════════════════
   PHOTO UPLOAD (hero section — local preview only)
═══════════════════════════════════════════════════════════ */
function initPhotoUpload() {
  const input = document.getElementById('photo-input');
  const box   = document.getElementById('photo-inner');
  const ph    = document.getElementById('photo-ph');

  box.addEventListener('click', () => input.click());

  input.addEventListener('change', function () {
    if (!this.files || !this.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => {
      ph.style.display = 'none';
      const oldImg = box.querySelector('img');
      if (oldImg) oldImg.remove();
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = PORTFOLIO_DATA.personal.name;
      box.appendChild(img);
    };
    reader.readAsDataURL(this.files[0]);
  });
}

/* ═══════════════════════════════════════════════════════════
   PROJECT VIEWS TRACKING
═══════════════════════════════════════════════════════════ */
const viewed = new Set();

function initProjectViewTracking() {
  document.querySelectorAll('.proj-card[data-project]').forEach(card => {
    card.addEventListener('mouseenter', async () => {
      const name = card.dataset.project;
      if (viewed.has(name)) return;
      viewed.add(name);
      try {
        const res  = await fetch(`${API}/analytics/projects/${name}/view`, { method: 'POST' });
        const data = await res.json();
        const el   = card.querySelector('.view-count');
        if (el) el.textContent = data.viewCount || 0;
      } catch (e) { /* Backend offline */ }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   LIKE BUTTON
═══════════════════════════════════════════════════════════ */
async function toggleLike(btn, projectName) {
  const liked = JSON.parse(localStorage.getItem('rtech_liked') || '{}');
  const isLiked = liked[projectName];

  liked[projectName] = !isLiked;
  localStorage.setItem('rtech_liked', JSON.stringify(liked));

  btn.classList.toggle('liked', !isLiked);
  btn.innerHTML = !isLiked ? '❤ Liked' : '🤍 Like';

  try {
    const res  = await fetch(`${API}/analytics/projects/${projectName}/like?liked=${!isLiked}`, { method: 'POST' });
    const data = await res.json();
    const card = btn.closest('.proj-card');
    const el   = card.querySelector('.like-count');
    if (el) el.textContent = data.likeCount || 0;
  } catch (e) { /* Backend offline */ }
}

/* ═══════════════════════════════════════════════════════════
   LOAD PROJECT STATS FROM BACKEND
═══════════════════════════════════════════════════════════ */
async function loadProjectStats() {
  try {
    const res   = await fetch(`${API}/analytics/projects`);
    const stats = await res.json();
    stats.forEach(stat => {
      const card = document.querySelector(`[data-project="${stat.projectName}"]`);
      if (!card) return;
      const views = card.querySelector('.view-count');
      const likes = card.querySelector('.like-count');
      if (views) views.textContent = stat.viewCount || 0;
      if (likes) likes.textContent = stat.likeCount || 0;
    });
  } catch (e) { /* Backend offline */ }
}

/* ═══════════════════════════════════════════════════════════
   CHECK BACKEND STATUS
═══════════════════════════════════════════════════════════ */
async function checkBackend() {
  const badge = document.getElementById('api-badge');
  try {
    await fetch(`${API}/contact`, { signal: AbortSignal.timeout(3000) });
    badge.className = 'api-badge online';
    badge.innerHTML = '<span class="dot"></span> Backend Online ✅';
    loadProjectStats();
  } catch (e) {
    badge.className = 'api-badge offline';
    badge.innerHTML = '<span class="dot"></span> Backend Offline';
  }
}

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════════ */
function initContactForm() {
  emailjs.init('wMviTifTJ5CRSpBZ2');
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('submit-btn');
  const msg  = document.getElementById('form-msg');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    btn.textContent = '⏳ Sending...';
    btn.disabled = true;
    msg.className = '';
    msg.textContent = '';

    const payload = {
      name:    document.getElementById('f-name').value.trim(),
      email:   document.getElementById('f-email').value.trim(),
      subject: document.getElementById('f-subject').value.trim(),
      message: document.getElementById('f-message').value.trim(),
    };

    try {
      await emailjs.send('service_kq7jxu2', 'template_5levg3s', payload);

      // Backend mein bhi save karo
      try {
        await fetch(`${API}/contact`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        });
      } catch(e) {}

      msg.className = 'ok';
      msg.textContent = '✅ Message sent! I will reply within 24 hours.';
      form.reset();
    } catch(err) {
      msg.className = 'err';
      msg.textContent = `❌ Failed to send. Email directly: ${PORTFOLIO_DATA.personal.email}`;
    }

    btn.textContent = 'Send Message ✉';
    btn.disabled = false;
    setTimeout(() => { msg.textContent = ''; msg.className = ''; }, 6000);
  });
}

/* ═══════════════════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mob-menu');
  hamburger.addEventListener('click', () => {
    menu.classList.toggle('open');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll', menu.classList.contains('open'));
  });
  document.querySelectorAll('#mob-menu a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS + ACTIVE NAV
═══════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  // Progress bar
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';

  // Active nav link
  document.querySelectorAll('section[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 110) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
      });
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   FADE IN OBSERVER
═══════════════════════════════════════════════════════════ */
let fadeObserver;

function observeFade() {
  if (fadeObserver) fadeObserver.disconnect();
  fadeObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.07 }
  );
  document.querySelectorAll('.fade').forEach(el => fadeObserver.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   INIT — page load hone pe sab kuch start hota hai
═══════════════════════════════════════════════════════════ */
async function loadFromAPI() {
  try {
    const [projRes, skillRes, achRes, eduRes, profRes] = await Promise.all([
      fetch(`${API}/portfolio/projects`),
      fetch(`${API}/portfolio/skills`),
      fetch(`${API}/portfolio/achievements`),
      fetch(`${API}/portfolio/education`),
      fetch(`${API}/portfolio/profile`)
    ]);

    const projects     = await projRes.json();
    const skills       = await skillRes.json();
    const achievements = await achRes.json();
    const education    = await eduRes.json();
    const profile      = await profRes.json();

    // Projects update
    if (projects.length > 0) {
      PORTFOLIO_DATA.projects = projects.map(p => ({
        id:          p.id,
        emoji:       p.emoji || '🚀',
        banner:      p.banner || 'blue',
        title:       p.title,
        description: p.description,
        tech:        p.techStack ? p.techStack.split(',').map(t => t.trim()) : [],
        github:      p.githubUrl || '#',
        demo:        p.demoUrl || '#',
      }));
    }

    // Skills update
    if (skills.length > 0) {
      PORTFOLIO_DATA.skills = skills.map(s => ({
        icon:  s.icon || '⚡',
        name:  s.name,
        color: s.color || 'purple',
        tags:  s.tags ? s.tags.split(',').map(t => t.trim()) : [],
      }));
    }

    // Achievements update
    if (achievements.length > 0) {
      PORTFOLIO_DATA.achievements = achievements.map(a => ({
        icon:   a.icon || '🏆',
        title:  a.title,
        issuer: a.issuer,
        date:   a.dateYear,
        color:  a.color || 'purple',
        link:   a.link || '#',
      }));
    }

    // Education update
    if (education.length > 0) {
      PORTFOLIO_DATA.education = education.map(e => ({
        year:   e.yearRange,
        degree: e.degree,
        school: e.school,
      }));
    }

    // Profile / Personal Info update
    if (profile && Object.keys(profile).length > 0) {
      const p = PORTFOLIO_DATA.personal;
      if (profile.name     !== undefined) p.name     = profile.name     || '';
      if (profile.brand    !== undefined) p.brand    = profile.brand    || '';
      if (profile.role     !== undefined) p.role     = profile.role     || '';
      if (profile.tagline  !== undefined) p.tagline  = profile.tagline  || '';
      if (profile.location !== undefined) p.location = profile.location || '';
      if (profile.phone    !== undefined) p.phone    = profile.phone    || '';
      if (profile.email    !== undefined) p.email    = profile.email    || '';
      if (profile.github   !== undefined) p.github   = profile.github   || '';
      if (profile.linkedin !== undefined) p.linkedin = profile.linkedin || '';
      if (profile.degree   !== undefined) p.degree   = profile.degree   || '';
      if (profile.status   !== undefined) p.status   = profile.status   || '';
      if (profile.available !== undefined) p.available = profile.available === 'true';
      if (profile.photo    !== undefined) p.photo    = profile.photo    || '';

      if (profile.roles) {
        try { PORTFOLIO_DATA.roles = JSON.parse(profile.roles); } catch(e) {}
      }
      if (profile.stats) {
        try { PORTFOLIO_DATA.stats = JSON.parse(profile.stats); } catch(e) {}
      }
      if (profile.about) {
        try { PORTFOLIO_DATA.about = JSON.parse(profile.about); } catch(e) {}
      }
    }

    // ✅ Backend se fresh data mil gaya — isko cache kar lo taaki
    //    agli baar backend offline hone par yahi latest data dikhe
    saveDataCache();

  } catch(e) {
    // ❌ Backend offline — hardcoded data.js par mat jao,
    //    localStorage mein jo pichla saved (real) data hai wahi use hoga
    //    (ye already loadDataCache() se DOMContentLoaded mein load ho chuka hai)
    console.log('API offline — using last cached data (or data.js as first-time fallback)');
  }
}



document.addEventListener('DOMContentLoaded', async () => {
  // Sabse pehle: agar pehle kabhi backend se real data cache hua hai,
  // usko load karo — taki offline hone par bhi PURANA DEFAULT nahi,
  // LATEST SAVED data hi dikhe.
  loadDataCache();

  // Fir backend se fresh data lene ki koshish karo (agar online hai to update ho jayega + cache bhi update hoga)
  await loadFromAPI();

  renderHero();
  renderAbout();
  renderSkills();
  renderProjects();
  renderAchievements();
  renderContact();

  initTyping();
  initPhotoUpload();
  initMobileMenu();
  initContactForm();
  observeFade();
  checkBackend();
});

/* ═══════════════════════════════════════════════════════════
   DARK / LIGHT MODE TOGGLE
═══════════════════════════════════════════════════════════ */
function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const body = document.body;

  // Load saved preference
  const saved = localStorage.getItem('rtech_theme');
  if (saved === 'dark') {
    body.classList.add('dark');
    btn.textContent = '☀️';
  }

  btn.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    btn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('rtech_theme', isDark ? 'dark' : 'light');
  });
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
});

/* ═══════════════════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after 1.4 seconds
  setTimeout(() => {
    loader.classList.add('hide');
  }, 1400);
}

/* ═══════════════════════════════════════════════════════════
   BACK TO TOP BUTTON
═══════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  // Show button when scrolled 400px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  // Scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════════
   VISITOR COUNTER — Backend se load karo
═══════════════════════════════════════════════════════════ */
async function loadVisitorCount() {
  try {
    const res  = await fetch(`${API}/analytics/visitors`);
    const data = await res.json();

    const totalEl = document.getElementById('v-total');
    if (totalEl && data.total) {
      // Animated counter
      animateCount(totalEl, data.total);
    }

    // Total likes from projects
    const projRes  = await fetch(`${API}/analytics/projects`);
    const projects = await projRes.json();
    const totalLikes = projects.reduce((sum, p) => sum + (p.likeCount || 0), 0);

    const likesEl = document.getElementById('v-likes');
    if (likesEl) animateCount(likesEl, totalLikes);

  } catch (e) {
    // Backend offline — keep default values
  }
}

function animateCount(el, target) {
  const duration = 1500;
  const step     = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.textContent = Math.floor(progress * target) + '+';
    if (progress < 1) requestAnimationFrame(step);
  };
  let startTime = null;
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════════
   ADD TO EXISTING DOMContentLoaded
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initBackToTop();
  loadVisitorCount();
});
