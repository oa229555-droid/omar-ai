/* =========================================================
   أنمي فلكس — المنطق العام المشترك بين كل الصفحات
   يستخدم localStorage لتخزين: الثيم، المفضلة، قائمة المشاهدة،
   سجل المشاهدة، وحساب المستخدم (تجريبي بالكامل من جهة العميل).
========================================================= */

const STORAGE_KEYS = {
  theme: "af_theme",
  favorites: "af_favorites",
  watchlist: "af_watchlist",
  history: "af_history",
  user: "af_user",
};

/* ---------- أدوات تخزين عامة ---------- */
function getList(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function saveList(key, list) { localStorage.setItem(key, JSON.stringify(list)); }
function toggleInList(key, id) {
  const list = getList(key);
  const i = list.indexOf(id);
  if (i === -1) list.push(id); else list.splice(i, 1);
  saveList(key, list);
  return list.includes(id);
}
function isInList(key, id) { return getList(key).includes(id); }

function getUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.user)); }
  catch { return null; }
}
function setUser(user) { localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user)); }
function logout() { localStorage.removeItem(STORAGE_KEYS.user); location.href = "index.html"; }

function pushHistory(id) {
  let h = getList(STORAGE_KEYS.history).filter((x) => x !== id);
  h.unshift(id);
  saveList(STORAGE_KEYS.history, h.slice(0, 30));
}

/* ---------- الثيم (فاتح/ليلي) ---------- */
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || "dark";
  document.documentElement.setAttribute("data-theme", saved);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", cur);
  localStorage.setItem(STORAGE_KEYS.theme, cur);
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = cur === "light" ? "🌙" : "☀️";
}

/* ---------- تركيب واجهة بطاقة أنمي ---------- */
function animeCard(a) {
  const badge = a.status === "مستمر" ? "مستمر" : `${a.episodesCount} حلقة`;
  return `
    <a class="card" href="anime.html?id=${a.id}">
      <div class="card-cover">
        <img src="${a.cover}" alt="${a.title}" loading="lazy">
        <span class="card-badge">${badge}</span>
        <span class="card-rating">⭐ ${a.rating}</span>
      </div>
      <div class="card-body">
        <h4>${a.title}</h4>
        <div class="card-meta"><span>${a.year}</span><span>·</span><span>${a.genres[0]}</span></div>
      </div>
    </a>`;
}

function renderRow(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!list.length) {
    el.innerHTML = `<div class="empty-state"><div class="icon">🍥</div>لا توجد نتائج هنا الآن</div>`;
    return;
  }
  el.innerHTML = list.map(animeCard).join("");
}

/* ---------- شريط النقل الحي (العنصر المميز في الهوية) ---------- */
function renderTicker() {
  const el = document.getElementById("tickerTrack");
  if (!el) return;
  const today = getEpisodesToday();
  const items = (today.length ? today : ANIME_DB.slice(0, 5)).map(
    (a) => `<span><b>${a.title}</b> — الحلقة ${a.episodeList[0].num} الآن</span>`
  );
  el.innerHTML = items.concat(items).join(""); // تكرار للحركة المستمرة
}

/* ---------- البحث ---------- */
function runSearch(query, genre, year, studio) {
  query = (query || "").trim().toLowerCase();
  return ANIME_DB.filter((a) => {
    const matchesQuery = !query || a.title.toLowerCase().includes(query) || a.titleEn.toLowerCase().includes(query);
    const matchesGenre = !genre || genre === "الكل" || a.genres.includes(genre);
    const matchesYear = !year || year === "الكل" || String(a.year) === year;
    const matchesStudio = !studio || studio === "الكل" || a.studio === studio;
    return matchesQuery && matchesGenre && matchesYear && matchesStudio;
  });
}

/* ---------- زر اقترح لي أنمي ---------- */
function suggestRandom() {
  const pick = ANIME_DB[Math.floor(Math.random() * ANIME_DB.length)];
  location.href = `anime.html?id=${pick.id}`;
}

/* ---------- تحديث أيقونة الحساب في الناف بار ---------- */
function refreshAuthUI() {
  const el = document.getElementById("authArea");
  if (!el) return;
  const user = getUser();
  el.innerHTML = user
    ? `<a href="profile.html" class="icon-btn" title="${user.name}">👤</a>`
    : `<a href="login.html" class="btn btn-accent">تسجيل الدخول</a>`;
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.textContent = document.documentElement.getAttribute("data-theme") === "light" ? "🌙" : "☀️";
    themeBtn.addEventListener("click", toggleTheme);
  }
  refreshAuthUI();
  renderTicker();

  const suggestBtn = document.getElementById("suggestBtn");
  if (suggestBtn) suggestBtn.addEventListener("click", suggestRandom);

  const navSearch = document.getElementById("navSearchForm");
  if (navSearch) {
    navSearch.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = document.getElementById("navSearchInput").value;
      location.href = `search.html?q=${encodeURIComponent(q)}`;
    });
  }
});
