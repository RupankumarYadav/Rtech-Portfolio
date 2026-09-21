/* ============================================================
   sync.js — RTech Portfolio shared helpers
   (index.html aur admin.html dono isse use karte hain)

   1. fetchPortfolioRaw()  — backend se saara data laata hai
   2. applyApiData()       — backend ka data PORTFOLIO_DATA mein daalta hai
   3. buildSnapshotJs()    — latest data se naya data.js file text banata hai
   ============================================================ */

async function fetchJson(url, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    // Render jab sleep se uth raha hota hai to 502/503 deta hai — isse error maano
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchPortfolioRaw(api, timeoutMs = 15000) {
  const [projects, skills, achievements, education, profile] = await Promise.all([
    fetchJson(`${api}/portfolio/projects`,     timeoutMs),
    fetchJson(`${api}/portfolio/skills`,       timeoutMs),
    fetchJson(`${api}/portfolio/achievements`, timeoutMs),
    fetchJson(`${api}/portfolio/education`,    timeoutMs),
    fetchJson(`${api}/portfolio/profile`,      timeoutMs),
  ]);
  return { projects, skills, achievements, education, profile };
}

/* Backend ka raw data -> PORTFOLIO_DATA format.
   Agar backend ki list khaali aayi (DB reset / naya DB), to purana data
   (snapshot/cache) hi rehne dete hain — khaali data se overwrite nahi karte. */
function applyApiData(target, raw) {
  const { projects, skills, achievements, education, profile } = raw;

  if (Array.isArray(projects) && projects.length > 0) {
    target.projects = projects.map(p => ({
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

  if (Array.isArray(skills) && skills.length > 0) {
    target.skills = skills.map(s => ({
      icon:  s.icon || '⚡',
      name:  s.name,
      color: s.color || 'purple',
      tags:  s.tags ? s.tags.split(',').map(t => t.trim()) : [],
    }));
  }

  if (Array.isArray(achievements) && achievements.length > 0) {
    target.achievements = achievements.map(a => ({
      icon:   a.icon || '🏆',
      title:  a.title,
      issuer: a.issuer,
      date:   a.dateYear,
      color:  a.color || 'purple',
      link:   a.link || '#',
    }));
  }

  if (Array.isArray(education) && education.length > 0) {
    target.education = education.map(e => ({
      year:   e.yearRange,
      degree: e.degree,
      school: e.school,
    }));
  }

  if (profile && Object.keys(profile).length > 0) {
    const p = target.personal;
    const str = k => { if (profile[k] !== undefined) p[k] = profile[k] || ''; };
    ['name','brand','role','tagline','location','phone','email',
     'github','linkedin','degree','status','photo'].forEach(str);
    if (profile.available !== undefined) p.available = profile.available === 'true';

    if (profile.roles) { try { target.roles = JSON.parse(profile.roles); } catch (e) {} }
    if (profile.stats) { try { target.stats = JSON.parse(profile.stats); } catch (e) {} }
    if (profile.about) { try { target.about = JSON.parse(profile.about); } catch (e) {} }
  }
}

/* PORTFOLIO_DATA se naye data.js ka text banata hai (snapshot).
   meta.snapshotAt se pata chalta hai ki ye file kitni nayi hai —
   browser cache isse purana ho to ignore hota hai. */
function buildSnapshotJs(data) {
  const out = JSON.parse(JSON.stringify(data));
  out.meta = { snapshotAt: new Date().toISOString() };
  return (
`/* ============================================================
   data.js — RTech Portfolio SNAPSHOT (auto-generated)
   Generated: ${out.meta.snapshotAt}

   Ye file admin panel ke "Save Snapshot" button se banti hai.
   Backend/DB band ho tab bhi website isi latest data ko dikhayegi.
   ============================================================ */

const PORTFOLIO_DATA = ${JSON.stringify(out, null, 2)};
`);
}
