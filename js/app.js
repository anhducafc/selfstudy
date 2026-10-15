/* ==========================================================================
   English Path — ứng dụng một trang (hash router), không cần build
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------- tiện ích ---------------------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const fmtMin = (m) => (m >= 60 ? `${Math.floor(m / 60)}g ${m % 60}p` : `${m} phút`);
  const levelIdx = (id) => LEVELS.findIndex((l) => l.id === id);
  const S = window.Store;
  const LANG = window.LANG;
  const app = $("#app");
  /* pinyin không dấu, viết liền: "Nǐ hǎo!" → "nihao" (dùng để chấm khi gõ pinyin thay vì chữ Hán) */
  const plain = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ü/g, "v").toLowerCase().replace(/[^a-z0-9]/g, "");
  const hanOnly = (s) => String(s || "").replace(/[^\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}a-zA-Z0-9]/gu, "");

  let cleanups = [];
  const onLeave = (fn) => cleanups.push(fn);

  function toast(msg, kind = "") {
    const t = document.createElement("div");
    t.className = `toast ${kind}`;
    t.textContent = msg;
    $("#toasts").appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 2800);
  }

  function speak(text, rate = 0.9) {
    if (!("speechSynthesis" in window)) return toast("Trình duyệt không hỗ trợ đọc phát âm.");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG.tts;
    u.rate = rate;
    const voices = speechSynthesis.getVoices();
    let v = null;
    for (const re of LANG.ttsMatch) { v = voices.find((x) => re.test(x.lang)); if (v) break; }
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }

  function youtubeId(url) {
    if (!url) return null;
    const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return m[1];
    return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
  }

  /* ---------------------------- theme ---------------------------- */
  function applyTheme() {
    const t = S.get().settings.theme;
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
    const isDark = t === "dark" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    $("#themeBtn").textContent = isDark ? "☀️" : "🌙";
    $("#themeBtn").title = isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối";
  }
  $("#themeBtn").addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.hasAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    S.setSetting("theme", isDark ? "light" : "dark");
    applyTheme();
  });

  /* ---------------------------- router ---------------------------- */
  const routes = { "": viewHome, test: viewTest, roadmap: viewRoadmap, lesson: viewLesson,
    dashboard: viewDashboard, add: viewAdd, settings: viewSettings };

  function router() {
    cleanups.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
    cleanups = [];
    const parts = (location.hash || "#/").replace(/^#\/?/, "").split("/");
    const name = parts[0] || "";
    const view = routes[name] || viewNotFound;
    const navName = { lesson: "roadmap", add: "roadmap", games: "review", test: "", account: "settings", login: "settings", reset: "settings" }[name] ?? name;
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === navName));
    app.innerHTML = "";
    app.className = "";
    view(decodeURIComponent(parts[1] || ""));
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", router);

  /* ---------- đổi ngôn ngữ học (hiện ở trang chủ & cài đặt) ---------- */
  function langSwitch() {
    return `<nav class="lang-switch" aria-label="Chọn ngôn ngữ học"><span class="small muted">Đang học:</span>
      ${LANG.LANGS.map((x) => `<a class="lang-opt ${x.id === LANG.id ? "active" : ""}" href="${x.href}" ${x.id === LANG.id ? 'aria-current="page"' : ""} lang="${x.id}">
        <span class="flag">${x.flag}</span><span><strong>${x.name}</strong><em>${x.native}</em></span></a>`).join("")}</nav>`;
  }

  /* ============================== HOME ============================== */
  function viewHome() {
    const st = S.get();
    const lv = st.profile.level;
    if (!lv) {
      app.innerHTML = `
        ${langSwitch()}
        <section class="hero">
          <p class="eyebrow">${LANG.hero.eyebrow}</p>
          <h1>${LANG.hero.title}</h1>
          <p class="lead">${LANG.hero.lead}</p>
          <div class="row">
            <a class="btn primary lg" href="#/test">Làm bài test xếp lớp (≈5 phút)</a>
            <a class="btn ghost lg" href="#/roadmap">Tự chọn trình độ</a>
          </div>
        </section>
        <section class="grid3">
          ${LANG.hero.features.map((f) => feature(...f)).join("")}
        </section>`;
      return;
    }

    const next = S.nextLesson();
    const daily = S.dailyLesson(lv);
    const dailyDone = daily && S.progress(daily.id).done;
    const today = S.minutesOn(S.dayKey());
    const goal = st.settings.dailyGoal;
    const pct = Math.min(100, Math.round((today / goal) * 100));
    const lvStats = S.statsBy((l) => l.level === lv);
    const lvInfo = LEVELS.find((l) => l.id === lv);
    const hello = st.profile.name ? `Chào ${esc(st.profile.name)}!` : "Chào bạn!";
    const pl = S.playerLevel();
    const cards = S.cardStats();
    const word = Daily.word(S.allLessons(), lv, S.dayKey());
    const streak = S.streak();
    const risk = streak > 0 && !S.studiedToday();
    const hour = new Date().getHours();

    app.innerHTML = `
      ${langSwitch()}
      <section class="home-head">
        <div>
          <p class="eyebrow">${hello}</p>
          <h1>Trình độ hiện tại: <span class="lv-badge lv-${lv}">${lv}</span> <small>${esc(lvInfo.name)}</small></h1>
          <div class="xp-line">
            <span class="xp-lv">Cấp ${pl.level}</span>
            <span class="bar xp"><span style="width:${pl.pct}%"></span></span>
            <span class="small muted">${st.xp.total} / ${pl.next} XP · hôm nay +${S.xpOn()} XP</span>
          </div>
        </div>
        <div class="goal-ring" style="--p:${pct}">
          <div><strong>${today}</strong><span>/ ${goal} phút</span><em>hôm nay</em></div>
        </div>
      </section>

      ${risk ? `<div class="banner risk"><span>🔥 Chuỗi <strong>${streak} ngày</strong> đang chờ bạn${hour >= 18 ? " — còn vài giờ nữa thôi" : ""}! 5 phút flashcard cũng giữ được chuỗi.</span>
        <a class="btn primary sm" href="#/review">Ôn nhanh 5 phút</a></div>` : ""}

      ${daily ? `
      <a class="next-card daily ${dailyDone ? "is-done" : ""}" href="#/lesson/${esc(daily.id)}">
        <div class="next-meta">
          <span class="chip">⭐ Bài của ngày · ×2 XP</span>
          <span class="lv-badge sm lv-${daily.level}">${daily.level}</span>
          <span class="muted">${SKILLS[daily.skill].icon} ${SKILLS[daily.skill].vi} · ${esc(daily.source.provider)} · ~${daily.minutes} phút</span>
        </div>
        <h2>${esc(daily.title)}</h2>
        <p class="muted">${esc(daily.titleVi || "")}</p>
        <span class="btn primary">${dailyDone ? "✓ Đã xong hôm nay — xem lại" : "Học ngay →"}</span>
      </a>` : ""}

      <section class="quick-row">
        <a class="quick card" href="#/review">
          <span class="q-icon">🃏</span>
          <span><strong>Flashcard</strong><span class="muted small">${cards.total ? (cards.due ? `${cards.due} thẻ cần ôn hôm nay` : "Đã ôn hết hôm nay ✓") : "Hoàn thành bài để có thẻ"}</span></span>
          ${cards.due ? `<span class="q-badge">${cards.due}</span>` : ""}
        </a>
        <a class="quick card" href="#/games">
          <span class="q-icon">🎮</span>
          <span><strong>Mini game</strong><span class="muted small">Ghép từ · Đoán nhanh · Chép chính tả</span></span>
        </a>
        ${word ? `<div class="quick card wotd">
          <span class="q-icon">💡</span>
          <span><span class="eyebrow">Từ của ngày</span><strong class="w">${esc(word.w)}</strong>${word.py ? ` <span class="py">${esc(word.py)}</span>` : ""} <span class="muted">— ${esc(word.vi)}</span>
          ${word.ex ? `<em class="small muted">${esc(word.ex)}</em>` : ""}</span>
          <button class="say" data-say="${esc(word.w)}" title="Nghe phát âm">🔊</button>
        </div>` : ""}
      </section>

      ${next && (!daily || next.id !== daily.id) ? `
      <a class="card next-mini" href="#/lesson/${esc(next.id)}">
        <span class="chip ghost">Bài tiếp theo trong lộ trình</span>
        <strong>${esc(next.title)}</strong>
        <span class="muted small"><span class="lv-badge sm lv-${next.level}">${next.level}</span> ${SKILLS[next.skill].icon} ${SKILLS[next.skill].vi} · ~${next.minutes} phút →</span>
      </a>` : ""}
      ${!next ? `<div class="card"><h2>🎉 Bạn đã hoàn thành toàn bộ bài học!</h2><p>Hãy thêm bài YouTube của riêng bạn ở mục <a href="#/add">Thêm bài</a>.</p></div>` : ""}

      <section class="stat-row">
        ${tile("🔥", streak, `ngày liên tiếp${st.game.freezes ? ` · 🧊×${st.game.freezes}` : ""}`)}
        ${tile("✅", `${lvStats.done}/${lvStats.total}`, `bài ${lv} đã xong`)}
        ${tile("🏅", Object.keys(st.badges).length, `/${Game.BADGES.length} huy hiệu`)}
      </section>

      <section class="card">
        <div class="card-head"><h3>Tiến độ theo trình độ</h3><a href="#/dashboard">Xem chi tiết →</a></div>
        ${levelBars()}
      </section>

      <p class="muted center small">Mỗi ngày: Bài của ngày + 5 phút flashcard là đủ giữ chuỗi. Mỗi mốc 7 ngày liên tiếp bạn nhận 1 🧊 streak freeze (tối đa 2) — tự cứu chuỗi nếu lỡ một ngày.</p>`;
    $$(".say", app).forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); speak(b.dataset.say); }));
  }

  const feature = (icon, h, p) => `<div class="card feature"><div class="f-icon">${icon}</div><h3>${h}</h3><p class="muted">${p}</p></div>`;
  const tile = (icon, val, label) => `<div class="tile"><span class="t-icon">${icon}</span><strong>${val}</strong><span class="muted">${label}</span></div>`;

  function levelBars() {
    const cur = S.get().profile.level;
    return `<div class="lv-bars">${LEVELS.map((l) => {
      const s = S.statsBy((x) => x.level === l.id);
      return `<a class="lv-bar ${l.id === cur ? "current" : ""}" href="#/roadmap/${l.id}">
        <span class="lv-badge sm lv-${l.id}">${l.id}</span>
        <span class="bar lv-${l.id}"><span style="width:${s.pct}%"></span></span>
        <span class="small muted">${s.done}/${s.total}</span></a>`;
    }).join("")}</div>`;
  }

  /* ============================== TEST ============================== */
  function viewTest() {
    const Q = PLACEMENT_TEST;
    const answers = new Array(Q.length).fill(null);       // lưu chỉ số đáp án GỐC trong q.options
    const orders = Q.map((q) => shuffle(q.options.map((_, k) => k)));   // xáo thứ tự hiển thị đáp án
    let i = 0;

    function draw() {
      const q = Q[i];
      app.innerHTML = `
        <section class="narrow">
          <p class="eyebrow">Bài test xếp trình độ</p>
          <div class="progress"><span style="width:${(i / Q.length) * 100}%"></span></div>
          <p class="muted small">Câu ${i + 1} / ${Q.length} · Không biết thì chọn "Tôi không biết" — đừng đoán để kết quả chính xác hơn.</p>
          <div class="card q-card">
            <h2 class="q-text">${esc(q.q).replace("___", '<span class="blank">_____</span>')}</h2>
            ${q.py ? `<p class="py q-py">${esc(q.py)}</p>` : ""}
            <div class="opts">
              ${orders[i].map((k) => `<button class="opt ${answers[i] === k ? "picked" : ""}" data-k="${k}">${esc(q.options[k])}</button>`).join("")}
              <button class="opt idk ${answers[i] === -1 ? "picked" : ""}" data-k="-1">Tôi không biết</button>
            </div>
          </div>
          <div class="row between">
            <button class="btn ghost" id="prev" ${i === 0 ? "disabled" : ""}>← Câu trước</button>
            <a class="btn ghost" href="#/">Thoát</a>
          </div>
        </section>`;
      $$(".opt", app).forEach((b) => b.addEventListener("click", () => {
        answers[i] = Number(b.dataset.k);
        if (i < Q.length - 1) { i++; draw(); } else finish();
      }));
      $("#prev").addEventListener("click", () => { if (i > 0) { i--; draw(); } });
    }

    function finish() {
      const perLevel = {};
      Q.forEach((q, k) => {
        perLevel[q.level] = perLevel[q.level] || { correct: 0, total: 0 };
        perLevel[q.level].total++;
        if (answers[k] === q.answer) perLevel[q.level].correct++;
      });
      // Trình độ = cấp cao nhất đạt ≥ 60% (phải đạt liên tiếp từ A1).
      // Đạt cả B2 và tổng ≥ 18/20 → gợi ý lên C1.
      const order = LANG.testOrder;
      let result = order[0];
      for (let k = 0; k < order.length; k++) {
        const p = perLevel[order[k]];
        if (p && p.correct / p.total >= 0.6) result = order[k]; else break;
      }
      const score = Object.values(perLevel).reduce((a, p) => a + p.correct, 0);
      if (result === order[order.length - 1] && score >= Math.round(Q.length * 0.9)) result = LANG.topLevel;
      S.setProfile({ level: result, test: { score, total: Q.length, perLevel, date: new Date().toISOString() } });
      const info = LEVELS.find((l) => l.id === result);

      app.innerHTML = `
        <section class="narrow center">
          <p class="eyebrow">Kết quả</p>
          <div class="result-badge lv-${result}">${result}</div>
          <h1>${esc(info.name)} · ${esc(info.vi)}</h1>
          <p class="lead">Bạn đúng <strong>${score}/${Q.length}</strong> câu. ${esc(info.desc)}</p>
          <div class="card">
            <table class="tbl">
              <thead><tr><th>Cấp</th><th>Đúng</th><th></th></tr></thead>
              <tbody>${order.map((l) => {
                const p = perLevel[l];
                const ok = p.correct / p.total >= 0.6;
                return `<tr><td><span class="lv-badge sm lv-${l}">${l}</span></td><td>${p.correct}/${p.total}</td><td>${ok ? "✅ đạt" : "—"}</td></tr>`;
              }).join("")}</tbody>
            </table>
          </div>
          <p class="muted small">Đây là bài test nhanh. ${LANG.testMore} Bạn có thể đổi trình độ bất cứ lúc nào trong Cài đặt.</p>
          <div class="row center">
            <a class="btn primary lg" href="#/roadmap/${result}">Xem lộ trình ${result} →</a>
            <a class="btn ghost" href="#/test" id="retry">Làm lại</a>
          </div>
        </section>`;
      $("#retry").addEventListener("click", (e) => { e.preventDefault(); viewTest(); });
    }

    draw();
  }

  /* ============================== ROADMAP ============================== */
  function viewRoadmap(levelArg) {
    const st = S.get();
    const lv = LEVELS.some((l) => l.id === levelArg) ? levelArg : (st.profile.level || LEVELS[0].id);
    const info = LEVELS.find((l) => l.id === lv);
    let filter = "all";
    let showAllAuto = false;

    function draw() {
      const match = (l) => l.level === lv && (filter === "all" || l.skill === filter);
      const list = [...LESSONS, ...st.custom].filter(match);
      const autoAll = (window.AUTO_LESSONS || []).filter(match)
        .sort((a, b) => (b.published || "").localeCompare(a.published || ""));
      const auto = showAllAuto ? autoAll : autoAll.slice(0, 8);
      const s = S.statsBy((l) => l.level === lv);
      const dailyId = (S.dailyLesson(lv) || {}).id;
      app.innerHTML = `
        <section>
          <p class="eyebrow">Lộ trình</p>
          <div class="lv-tabs" role="tablist" style="--nlv:${LEVELS.length}">
            ${LEVELS.map((l) => `<a role="tab" class="lv-tab lv-${l.id} ${l.id === lv ? "active" : ""}" href="#/roadmap/${l.id}">
              <strong>${l.id}</strong><span>${esc(l.vi)}</span>${l.id === st.profile.level ? '<em>bạn</em>' : ""}</a>`).join("")}
          </div>
          <div class="roadmap-head">
            <div>
              <h1>${lv} · ${esc(info.name)}</h1>
              <p class="muted">${esc(info.desc)}</p>
            </div>
            <div class="mini-progress"><strong>${s.pct}%</strong><span class="bar lv-${lv}"><span style="width:${s.pct}%"></span></span><span class="small muted">${s.done}/${s.total} bài</span></div>
          </div>
          <div class="chips">
            ${[["all", "Tất cả"], ...Object.entries(SKILLS).map(([k, v]) => [k, `${v.icon} ${v.vi}`])]
              .map(([k, label]) => `<button class="chip-btn ${filter === k ? "active" : ""}" data-f="${k}">${label}</button>`).join("")}
          </div>
          <ol class="lesson-list">
            ${list.map((l, n) => lessonRow(l, n, l.id === dailyId)).join("") || `<li class="muted">Chưa có bài nào cho bộ lọc này.</li>`}
          </ol>
          ${autoAll.length ? `
          <div class="card-head auto-head"><h3>📺 Video mới (tự động cập nhật)</h3><span class="small muted">${autoAll.length} video</span></div>
          <ol class="lesson-list">${auto.map((l, n) => lessonRow(l, n, l.id === dailyId)).join("")}</ol>
          ${autoAll.length > auto.length ? `<button class="btn ghost sm" id="moreAuto">Xem thêm ${autoAll.length - auto.length} video</button>` : ""}` : ""}
          <p class="row gap-s"><a class="btn ghost sm" href="#/add">➕ Thêm bài của bạn</a></p>
          ${st.profile.level !== lv ? `<p class="small muted">Đây không phải trình độ của bạn. <button class="linklike" id="setLv">Đặt ${lv} làm trình độ hiện tại</button></p>` : ""}
        </section>

        <section class="card">
          <h3>📖 Thư viện nguồn học thêm</h3>
          <ul class="res-list">
            ${RESOURCES.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)} ↗</a><span class="muted small">${esc(r.note)}</span></li>`).join("")}
          </ul>
        </section>`;
      $$(".chip-btn", app).forEach((b) => b.addEventListener("click", () => { filter = b.dataset.f; draw(); }));
      const more = $("#moreAuto");
      if (more) more.addEventListener("click", () => { showAllAuto = true; draw(); });
      const setLv = $("#setLv");
      if (setLv) setLv.addEventListener("click", () => { S.setProfile({ level: lv }); toast(`Đã đặt trình độ ${lv}`); draw(); });
    }
    draw();
  }

  const isNew = (l) => l.published && (Date.now() - new Date(l.published)) / 86400000 < 7;
  const lessonPills = (l) => [
    l.custom ? `<span class="pill accent">Tự thêm</span>` : "",
    l.auto && isNew(l) ? `<span class="pill new">Mới</span>` : "",
    l.ai ? `<span class="pill ai" title="Từ vựng & quiz do Claude soạn, đã qua duyệt PR">✨ AI soạn</span>` : ""
  ].join("");

  function lessonRow(l, n, isDaily = false) {
    const p = S.progress(l.id);
    const quiz = p.quizTotal ? `<span class="pill">Quiz ${p.quizBest}/${p.quizTotal}</span>` : "";
    const time = p.seconds ? `<span class="pill">${Math.round(p.seconds / 60)}p</span>` : "";
    const custom = (isDaily ? `<span class="pill daily">⭐ Hôm nay</span>` : "") + lessonPills(l);
    return `<li><a class="lesson-row ${p.done ? "done" : ""} ${isDaily ? "is-daily" : ""}" href="#/lesson/${esc(l.id)}">
      <span class="num">${p.done ? "✓" : n + 1}</span>
      <span class="l-main">
        <strong>${esc(l.title)}</strong>
        <span class="muted small">${esc(l.titleVi || "")}</span>
      </span>
      <span class="l-meta">
        <span class="pill">${SKILLS[l.skill].icon} ${SKILLS[l.skill].vi}</span>
        <span class="pill src">${l.source.type === "youtube" ? "▶ " : "↗ "}${esc(l.source.provider)}</span>
        ${custom}${quiz}${time}
      </span>
    </a></li>`;
  }

  /* ============================== LESSON ============================== */
  function viewLesson(id) {
    const l = S.findLesson(id);
    if (!l) return viewNotFound();
    const group = l.auto ? (window.AUTO_LESSONS || []) : [...LESSONS, ...S.get().custom];
    const all = group.filter((x) => x.level === l.level);
    const isDaily = S.isDaily(l.id);
    const idx = all.findIndex((x) => x.id === l.id);
    const prev = all[idx - 1], next = all[idx + 1];
    const p = S.progress(l.id);

    app.innerHTML = `
      <nav class="crumbs"><a href="#/roadmap/${l.level}">Lộ trình ${l.level}</a> / <span>${esc(l.title)}</span></nav>
      <header class="lesson-head">
        <div>
          <div class="row gap-s">
            <span class="lv-badge sm lv-${l.level}">${l.level}</span>
            <span class="pill">${SKILLS[l.skill].icon} ${SKILLS[l.skill].vi}</span>
            <span class="pill">~${l.minutes} phút</span>
            ${lessonPills(l)}
          </div>
          <h1>${esc(l.title)}</h1>
          ${l.titleVi ? `<p class="muted">${esc(l.titleVi)}</p>` : ""}
        </div>
        <button class="btn ${p.done ? "success" : "primary"}" id="doneBtn">${p.done ? "✓ Đã hoàn thành" : "Đánh dấu đã hoàn thành"}</button>
      </header>
      ${isDaily ? `<div class="banner daily-banner"><span>⭐ Đây là <strong>Bài của ngày</strong> — hoàn thành hôm nay để nhận <strong>×2 XP</strong> (${S.XP.lessonDone + S.XP.dailyBonus} XP).</span></div>` : ""}

      <div class="lesson-grid">
        <div class="lesson-main">
          <div id="player" class="player-wrap"></div>
          <div id="timeLog" class="card time-log"></div>
        </div>
        <aside class="lesson-side">
          ${l.goal ? `<div class="card"><h3>🎯 Mục tiêu</h3><p>${esc(l.goal)}</p></div>` : ""}
          ${l.desc && !l.goal ? `<div class="card"><h3>ℹ️ Giới thiệu</h3><p class="small desc">${esc(l.desc)}</p></div>` : ""}
          ${l.tasks && l.tasks.length ? `<div class="card"><h3>📝 Các bước</h3><ol class="steps">${l.tasks.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></div>` : ""}
        </aside>
      </div>

      ${l.vocab && l.vocab.length ? `
      <section class="card">
        <div class="card-head"><h3>📚 Từ vựng (${l.vocab.length})</h3>
          <span class="row gap-s"><button class="btn ghost sm" id="addCards">${S.hasCardsFor(l.id) ? "✓ Đã có trong flashcard" : "🃏 Thêm vào flashcard"}</button>
          ${LANG.pinyin ? `<button class="btn ghost sm" id="hidePy">Ẩn pinyin</button>` : ""}
          <button class="btn ghost sm" id="hideVi">Ẩn nghĩa để tự kiểm tra</button></span></div>
        <ul class="vocab">
          ${l.vocab.map((v) => `<li>
            <button class="say" data-say="${esc(v.w)}" title="Nghe phát âm">🔊</button>
            <div><strong class="w">${esc(v.w)}</strong>${v.py ? ` <span class="py">${esc(v.py)}</span>` : ""} <span class="vi">— ${esc(v.vi)}</span>
            ${v.ex ? `<div class="ex"><button class="say sm" data-say="${esc(v.ex)}" title="Nghe câu">▶</button> <em class="w">${esc(v.ex)}</em>
              ${v.exPy ? `<span class="py block">${esc(v.exPy)}</span>` : ""}${v.exVi ? `<span class="vi block">${esc(v.exVi)}</span>` : ""}</div>` : ""}</div>
          </li>`).join("")}
        </ul>
      </section>` : ""}

      <section class="card" id="quizBox"></section>

      <section class="card">
        <div class="card-head"><h3>🗒️ Ghi chú / chép chính tả</h3><span class="small muted" id="noteState"></span></div>
        <textarea id="notes" rows="5" placeholder="Ghi từ mới, câu hay, hoặc chép lại đoạn bạn nghe được…">${esc(p.notes || "")}</textarea>
      </section>

      <nav class="pager">
        ${prev ? `<a class="btn ghost" href="#/lesson/${esc(prev.id)}">← ${esc(prev.title)}</a>` : "<span></span>"}
        ${next ? `<a class="btn ghost" href="#/lesson/${esc(next.id)}">${esc(next.title)} →</a>` : `<a class="btn ghost" href="#/roadmap/${l.level}">Về lộ trình</a>`}
      </nav>`;

    // nút hoàn thành
    const doneBtn = $("#doneBtn");
    doneBtn.addEventListener("click", () => {
      const now = !S.progress(l.id).done;
      S.setDone(l.id, now);
      doneBtn.className = `btn ${now ? "success" : "primary"}`;
      doneBtn.textContent = now ? "✓ Đã hoàn thành" : "Đánh dấu đã hoàn thành";
      if (now) { Game.confetti(80); if (l.vocab && l.vocab.length) toast(`${l.vocab.length} từ đã vào flashcard 🃏`); }
      const ac = $("#addCards"); if (ac && S.hasCardsFor(l.id)) ac.textContent = "✓ Đã có trong flashcard";
    });
    const markDone = (why) => {
      if (S.progress(l.id).done) return;
      S.setDone(l.id, true);
      doneBtn.className = "btn success";
      doneBtn.textContent = "✓ Đã hoàn thành";
      Game.confetti(80);
      toast(why, "ok");
    };

    // phát âm & ẩn nghĩa
    $$(".say", app).forEach((b) => b.addEventListener("click", () => speak(b.dataset.say)));
    const addCards = $("#addCards");
    if (addCards) addCards.addEventListener("click", () => {
      const n = S.addCardsFor(l.id);
      addCards.textContent = "✓ Đã có trong flashcard";
      toast(n ? `Đã thêm ${n} thẻ — ôn ở mục Ôn tập 🃏` : "Các từ này đã có trong flashcard");
    });
    const hidePy = $("#hidePy");
    if (hidePy) hidePy.addEventListener("click", () => {
      const on = app.classList.toggle("hide-py");
      hidePy.textContent = on ? "Hiện pinyin" : "Ẩn pinyin";
    });
    const hideVi = $("#hideVi");
    if (hideVi) hideVi.addEventListener("click", () => {
      const on = app.classList.toggle("hide-vi");
      hideVi.textContent = on ? "Hiện nghĩa" : "Ẩn nghĩa để tự kiểm tra";
    });

    // ghi chú tự lưu
    const notes = $("#notes");
    let tNote;
    notes.addEventListener("input", () => {
      $("#noteState").textContent = "Đang lưu…";
      clearTimeout(tNote);
      tNote = setTimeout(() => { S.saveNotes(l.id, notes.value); $("#noteState").textContent = "Đã lưu ✓"; }, 600);
    });
    onLeave(() => { clearTimeout(tNote); if (notes.value !== (S.progress(l.id).notes || "")) S.saveNotes(l.id, notes.value); });

    // player / nguồn
    if (l.source.type === "youtube") mountYouTube(l, markDone);
    else mountExternal(l);
    drawTimeLog(l);

    // quiz
    mountQuiz(l, markDone);
  }

  function drawTimeLog(l) {
    const box = $("#timeLog");
    if (!box) return;
    const p = S.progress(l.id);
    box.innerHTML = `
      <div class="row between wrap">
        <span>⏱️ Đã học bài này: <strong>${Math.round((p.seconds || 0) / 60)} phút</strong> · Hôm nay: <strong>${S.minutesOn(S.dayKey())} phút</strong></span>
        <span class="row gap-s">
          <span class="small muted">Ghi thêm:</span>
          ${[5, 10, 15].map((m) => `<button class="btn ghost sm" data-add="${m}">+${m}p</button>`).join("")}
        </span>
      </div>`;
    $$("[data-add]", box).forEach((b) => b.addEventListener("click", () => {
      S.addTime(l.id, Number(b.dataset.add) * 60);
      toast(`Đã ghi ${b.dataset.add} phút`);
      drawTimeLog(l);
    }));
  }

  /* ---------- Nguồn ngoài (British Council, BBC…) + đo thời gian rời trang ---------- */
  const SESSION_KEY = "englishPath.extSession";

  function mountExternal(l) {
    const box = $("#player");
    const host = (() => { try { return new URL(l.source.url).hostname.replace(/^www\./, ""); } catch { return ""; } })();
    box.innerHTML = `
      <div class="ext-card">
        <div class="ext-logo">${esc(LANG.providerLogo[l.source.provider] || "↗")}</div>
        <div>
          <p class="eyebrow">${esc(l.source.provider)}</p>
          <h2>${esc(l.title)}</h2>
          <p class="muted small">Bài học mở ở tab mới trên ${esc(host)} (trang này không cho nhúng). Khi bạn quay lại, ${LANG.brand} sẽ hỏi để ghi lại thời gian đã học.</p>
          <a class="btn primary" id="openExt" href="${esc(l.source.url)}" target="_blank" rel="noopener">Mở bài học ↗</a>
        </div>
      </div>
      <div id="extBanner"></div>`;

    $("#openExt").addEventListener("click", () => {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: l.id, start: Date.now() }));
    });

    const check = () => {
      if (document.visibilityState !== "visible") return;
      let sess;
      try { sess = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { sess = null; }
      if (!sess || sess.id !== l.id) return;
      const mins = Math.min(60, Math.round((Date.now() - sess.start) / 60000));
      if (mins < 1) return;
      const banner = $("#extBanner");
      if (!banner) return;
      banner.innerHTML = `
        <div class="banner">
          <span>Bạn vừa rời trang khoảng <strong>${mins} phút</strong>. Ghi lại thời gian học?</span>
          <span class="row gap-s">
            <button class="btn primary sm" id="logYes">Ghi ${mins} phút</button>
            <button class="btn ghost sm" id="logNo">Bỏ qua</button>
          </span>
        </div>`;
      $("#logYes").addEventListener("click", () => {
        S.addTime(l.id, mins * 60);
        sessionStorage.removeItem(SESSION_KEY);
        banner.innerHTML = "";
        toast(`Đã ghi ${mins} phút học`, "ok");
        drawTimeLog(l);
      });
      $("#logNo").addEventListener("click", () => { sessionStorage.removeItem(SESSION_KEY); banner.innerHTML = ""; });
    };
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    onLeave(() => { document.removeEventListener("visibilitychange", check); window.removeEventListener("focus", check); });
  }

  /* ---------- YouTube IFrame API: đếm thời gian xem + tự hoàn thành ---------- */
  let ytReady = null;
  function loadYT() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (ytReady) return ytReady;
    ytReady = new Promise((resolve, reject) => {
      window.onYouTubeIframeAPIReady = () => resolve();
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.onerror = () => { ytReady = null; reject(new Error("Không tải được YouTube API")); };
      document.head.appendChild(s);
    });
    return ytReady;
  }

  function mountYouTube(l, markDone) {
    const vid = l.source.videoId;
    const box = $("#player");
    const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(vid)}`;

    if (location.protocol === "file:") {
      box.innerHTML = `<div class="ext-card"><div class="ext-logo yt">▶</div><div>
        <h2>Cần chạy qua http(s) để nhúng YouTube</h2>
        <p class="muted small">Bạn đang mở file trực tiếp (file://). Hãy đưa lên GitHub Pages, hoặc chạy <code>python3 -m http.server</code> trong thư mục dự án rồi mở <code>http://localhost:8000</code>.</p>
        <a class="btn primary" href="${watchUrl}" target="_blank" rel="noopener">Xem trên YouTube ↗</a></div></div>`;
      return;
    }

    box.innerHTML = `
      <div class="video"><div id="yt"></div></div>
      <div class="player-bar">
        <button class="btn ghost sm" data-act="back">⟲ 5s</button>
        <span class="seg">
          ${[0.75, 1, 1.25].map((r) => `<button class="seg-btn ${r === 1 ? "active" : ""}" data-rate="${r}">${r}x</button>`).join("")}
        </span>
        <button class="btn ghost sm" data-act="cc">CC: tắt</button>
        <span class="watch-pct small muted" id="watchPct"></span>
        <a class="small" href="${watchUrl}" target="_blank" rel="noopener">Mở trên YouTube ↗</a>
      </div>`;

    let player, tick, pending = 0, cc = false, alive = true;

    const flush = () => { if (pending > 0) { S.addTime(l.id, pending); pending = 0; drawTimeLog(l); } };
    const stopTick = () => { clearInterval(tick); tick = null; flush(); };

    function create(startAt = 0) {
      if (player) { try { player.destroy(); } catch {} }
      const holder = $(".video", box);
      holder.innerHTML = '<div id="yt"></div>';
      player = new YT.Player("yt", {
        videoId: vid,
        playerVars: {
          rel: 0, modestbranding: 1, playsinline: 1, start: Math.floor(startAt),
          cc_load_policy: cc ? 1 : 0, cc_lang_pref: LANG.cc, hl: LANG.cc,
          origin: location.origin
        },
        events: {
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              if (!tick) tick = setInterval(() => {
                pending += 1;
                if (pending >= 15) flush();
                try {
                  const d = player.getDuration(), c = player.getCurrentTime();
                  if (d) $("#watchPct").textContent = `Đã xem ${Math.round((c / d) * 100)}%`;
                } catch {}
              }, 1000);
            } else {
              stopTick();
            }
            if (e.data === YT.PlayerState.ENDED) markDone("Đã xem hết video — tự đánh dấu hoàn thành 🎉");
          },
          onError: (e) => {
            const msg = { 2: "ID video không hợp lệ", 5: "Lỗi trình phát HTML5", 100: "Video đã bị xoá hoặc ở chế độ riêng tư", 101: "Chủ video không cho phép nhúng", 150: "Chủ video không cho phép nhúng", 153: "Thiếu thông tin trang nhúng (hãy chạy qua http/https)" }[e.data] || "Không phát được video";
            holder.innerHTML = `<div class="ext-card"><div class="ext-logo yt">!</div><div><h2>${esc(msg)}</h2>
              <p class="muted small">Bạn vẫn có thể xem trực tiếp trên YouTube và ghi thời gian bằng nút +phút bên dưới.</p>
              <a class="btn primary" href="${watchUrl}" target="_blank" rel="noopener">Xem trên YouTube ↗</a></div></div>`;
          }
        }
      });
    }

    loadYT().then(() => { if (alive) create(); }).catch(() => {
      $(".video", box).innerHTML = `<div class="ext-card"><div class="ext-logo yt">▶</div><div><h2>Không tải được trình phát YouTube</h2>
        <a class="btn primary" href="${watchUrl}" target="_blank" rel="noopener">Xem trên YouTube ↗</a></div></div>`;
    });

    box.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || !player || !player.getCurrentTime) return;
      if (b.dataset.rate) {
        player.setPlaybackRate(Number(b.dataset.rate));
        $$(".seg-btn", box).forEach((x) => x.classList.toggle("active", x === b));
      } else if (b.dataset.act === "back") {
        player.seekTo(Math.max(0, player.getCurrentTime() - 5), true);
      } else if (b.dataset.act === "cc") {
        cc = !cc;
        b.textContent = `CC: ${cc ? "bật" : "tắt"}`;
        const t = player.getCurrentTime() || 0;
        stopTick();
        create(t);   // tạo lại player để áp dụng phụ đề
      }
    });

    onLeave(() => { alive = false; stopTick(); try { player && player.destroy(); } catch {} });
    window.addEventListener("beforeunload", flush, { once: true });
  }

  /* ---------- Quiz: câu hỏi soạn sẵn + tự sinh từ vocab ---------- */
  function buildQuiz(l) {
    const qs = [];
    (l.questions || []).forEach((q) => {
      const options = shuffle(q.options);                 // xáo đáp án để đáp án đúng không luôn ở cùng một vị trí
      qs.push({ type: "mc", q: q.q, options, answer: options.indexOf(q.options[q.answer]), explain: q.explain });
    });

    const vocab = l.vocab || [];
    if (vocab.length >= 3) {
      shuffle(vocab).slice(0, 4).forEach((v) => {
        const wrong = shuffle(vocab.filter((x) => x !== v)).slice(0, 3).map((x) => x.vi);
        const options = shuffle([v.vi, ...wrong]);
        const label = v.py ? `${v.w} (${v.py})` : v.w;
        qs.push({ type: "mc", q: `"${label}" nghĩa là gì?`, options, answer: options.indexOf(v.vi), explain: `${label} = ${v.vi}` });
      });
      shuffle(vocab.filter((v) => v.ex && hasWord(v.ex, v.w))).slice(0, 3).forEach((v) => {
        const blanked = LANG.cjk ? v.ex.replace(v.w, "_____") : v.ex.replace(new RegExp(`\\b${escapeRe(v.w)}\\b`, "i"), "_____");
        qs.push({ type: "fill", q: blanked, hint: v.vi, answer: v.w, py: v.py, explain: v.ex + (v.exVi ? ` — ${v.exVi}` : "") });
      });
    }
    return qs;
  }
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hasWord = (text, w) => LANG.cjk ? text.includes(w) : new RegExp(`\\b${escapeRe(w)}\\b`, "i").test(text);
  /** Chấm câu điền từ: tiếng Trung chấp nhận chữ Hán hoặc pinyin (không cần dấu thanh) */
  function fillOk(val, q) {
    if (!LANG.cjk) return val.trim().toLowerCase().replace(/\s+/g, " ") === q.answer.toLowerCase();
    if (hanOnly(val) && hanOnly(val) === hanOnly(q.answer)) return true;
    return !!q.py && plain(val) !== "" && plain(val) === plain(q.py);
  }

  function mountQuiz(l, markDone) {
    const box = $("#quizBox");
    let qs = buildQuiz(l);
    if (!qs.length) { box.remove(); return; }

    function draw() {
      const p = S.progress(l.id);
      box.innerHTML = `
        <div class="card-head"><h3>✍️ Quiz nhanh (${qs.length} câu)</h3>
          ${p.quizTotal ? `<span class="small muted">Điểm cao nhất: ${p.quizBest}/${p.quizTotal}</span>` : ""}</div>
        <form id="quiz" class="quiz">
          ${qs.map((q, i) => `
            <fieldset class="qz" data-i="${i}">
              <legend><span class="qn">${i + 1}</span> ${q.type === "fill" ? "Điền từ: " : ""}${esc(q.q).replace("_____", '<span class="blank">_____</span>')}</legend>
              ${q.type === "mc"
                ? `<div class="qz-opts">${q.options.map((o, k) => `<label><input type="radio" name="q${i}" value="${k}"> <span>${esc(o)}</span></label>`).join("")}</div>`
                : `<input class="fill" name="q${i}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="gợi ý: ${esc(q.hint)}${LANG.cjk ? " — gõ chữ Hán hoặc pinyin" : ""}">`}
              <p class="fb"></p>
            </fieldset>`).join("")}
          <div class="row gap-s">
            <button class="btn primary" type="submit">Nộp bài</button>
            <button class="btn ghost" type="button" id="newQuiz">Đổi câu hỏi</button>
          </div>
          <p id="quizResult" class="quiz-result"></p>
        </form>`;

      $("#newQuiz").addEventListener("click", () => { qs = buildQuiz(l); draw(); });
      $("#quiz").addEventListener("submit", (e) => {
        e.preventDefault();
        let score = 0;
        qs.forEach((q, i) => {
          const fs = $(`.qz[data-i="${i}"]`, box);
          let ok;
          if (q.type === "mc") {
            const picked = $(`input[name="q${i}"]:checked`, fs);
            ok = picked && Number(picked.value) === q.answer;
            $$("label", fs).forEach((lab, k) => {
              lab.classList.toggle("right", k === q.answer);
              lab.classList.toggle("wrong", picked && Number(picked.value) === k && k !== q.answer);
            });
          } else {
            ok = fillOk($(".fill", fs).value, q);
          }
          if (ok) score++;
          fs.classList.toggle("is-right", !!ok);
          fs.classList.toggle("is-wrong", !ok);
          $(".fb", fs).innerHTML = ok ? "✓ Chính xác" : `✗ Đáp án: <strong>${esc(q.type === "mc" ? q.options[q.answer] : q.answer + (q.py ? ` (${q.py})` : ""))}</strong>${q.explain ? ` — ${esc(q.explain)}` : ""}`;
        });
        S.saveQuiz(l.id, score, qs.length);
        const pct = Math.round((score / qs.length) * 100);
        const res = $("#quizResult");
        res.innerHTML = `Bạn được <strong>${score}/${qs.length}</strong> (${pct}%). ${pct >= 80 ? "Rất tốt! 🎉" : pct >= 60 ? "Khá ổn, ôn lại câu sai nhé." : "Nghe/đọc lại bài rồi thử lần nữa nhé."}`;
        res.className = `quiz-result ${pct >= 60 ? "good" : "bad"}`;
        if (pct >= 80) markDone("Quiz ≥ 80% — tự đánh dấu hoàn thành 🎉");
      });
    }
    draw();
  }

  /* ============================== DASHBOARD ============================== */
  function viewDashboard() {
    const st = S.get();
    const goal = st.settings.dailyGoal;
    const all = S.statsBy(() => true);
    const days = S.lastNDays(14);
    const today = S.minutesOn(S.dayKey());
    const week = days.slice(-7).reduce((a, d) => a + d.minutes, 0);
    const pl = S.playerLevel();
    const cs = S.cardStats();

    app.innerHTML = `
      <section>
        <p class="eyebrow">Tiến độ</p>
        <h1>Dashboard học tập</h1>
      </section>

      <section class="stat-row four">
        ${tile("✅", `${all.done}/${all.total}`, "bài đã hoàn thành")}
        ${tile("⏱️", `${today}/${goal}p`, "hôm nay / mục tiêu")}
        ${tile("🔥", S.streak(), `ngày liên tiếp · kỷ lục ${S.bestStreak()}${st.game.freezes ? ` · 🧊×${st.game.freezes}` : ""}`)}
        ${tile("📅", fmtMin(week), "7 ngày qua")}
      </section>

      <section class="card xp-card">
        <div class="xp-big"><span class="xp-lv big">Cấp ${pl.level}</span>
          <div class="xp-meta"><strong>${st.xp.total} XP</strong><span class="bar xp"><span style="width:${pl.pct}%"></span></span>
          <span class="small muted">Còn ${pl.next - st.xp.total} XP để lên cấp ${pl.level + 1} · 7 ngày qua +${days.slice(-7).reduce((a, d) => a + d.xp, 0)} XP</span></div></div>
        <div class="xp-rules small muted">Hoàn thành bài +${S.XP.lessonDone} · Bài của ngày ×2 · Mỗi câu quiz đúng +${S.XP.quizCorrect} · Mỗi phút học +${S.XP.perMinute} · Mỗi thẻ ôn +${S.XP.cardReview} · Đạt mục tiêu ngày +${S.XP.goalReached}</div>
      </section>

      <section class="card">
        <div class="card-head"><h3>🏅 Huy hiệu (${Object.keys(st.badges).length}/${Game.BADGES.length})</h3><span class="small muted">🃏 ${cs.total} thẻ · ${cs.mastered} đã thuộc</span></div>
        <ul class="badges">${Game.BADGES.map((b) => {
          const got = st.badges[b.id];
          return `<li class="${got ? "got" : ""}" title="${esc(b.desc)}"><span class="b-icon">${got ? b.icon : "🔒"}</span><strong>${esc(b.name)}</strong><span class="small muted">${got ? new Date(got).toLocaleDateString("vi-VN") : esc(b.desc)}</span></li>`;
        }).join("")}</ul>
      </section>

      <section class="card">
        <div class="card-head"><h3>Số phút học mỗi ngày (14 ngày)</h3><span class="small muted legend"><i class="lg-goal"></i> mục tiêu ${goal} phút</span></div>
        ${barChart(days, goal)}
      </section>

      <div class="grid2">
        <section class="card">
          <h3>Hoàn thành theo kỹ năng</h3>
          <div class="rings">
            ${Object.entries(SKILLS).map(([k, v]) => {
              const s = S.statsBy((l) => l.skill === k);
              return `<div class="ring-item"><div class="ring sk-${k}" style="--p:${s.pct}"><span>${s.pct}%</span></div>
                <strong>${v.icon} ${v.vi}</strong><span class="small muted">${s.done}/${s.total} bài</span></div>`;
            }).join("")}
          </div>
        </section>
        <section class="card">
          <h3>Theo trình độ</h3>
          ${levelBars()}
        </section>
      </div>

      <section class="card">
        <div class="card-head"><h3>Lịch học 16 tuần</h3>
          <span class="small muted legend">ít <i class="h h0"></i><i class="h h1"></i><i class="h h2"></i><i class="h h3"></i><i class="h h4"></i> nhiều</span></div>
        ${heatmap(goal)}
      </section>

      <section class="card">
        <h3>Hoàn thành gần đây</h3>
        ${recentList()}
        ${st.profile.test ? `<p class="small muted">Bài test xếp lớp: ${st.profile.test.score}/${st.profile.test.total} câu (${new Date(st.profile.test.date).toLocaleDateString("vi-VN")}). <a href="#/test">Làm lại</a></p>` : `<p class="small muted">Chưa làm bài test xếp lớp. <a href="#/test">Làm ngay</a></p>`}
      </section>`;
  }

  function barChart(days, goal) {
    const W = 700, H = 230, pl = 34, pr = 10, pt = 18, pb = 34;
    const max = Math.max(goal * 1.25, ...days.map((d) => d.minutes), 10);
    const step = Math.ceil(max / 4 / 5) * 5;
    const top = step * 4;
    const iw = W - pl - pr, ih = H - pt - pb;
    const bw = iw / days.length;
    const y = (v) => pt + ih - (v / top) * ih;
    const wd = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    let g = "";
    for (let k = 0; k <= 4; k++) {
      const v = step * k;
      g += `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${pl - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    }
    const bars = days.map((d, i) => {
      const x = pl + i * bw + bw * 0.18, w = bw * 0.64;
      const h = Math.max(d.minutes ? 2 : 0, (d.minutes / top) * ih);
      const isToday = i === days.length - 1;
      return `<g><title>${d.date.toLocaleDateString("vi-VN")}: ${d.minutes} phút</title>
        <rect class="col ${d.minutes >= goal ? "hit" : ""}" x="${x}" y="${pt + ih - h}" width="${w}" height="${h}" rx="4"/>
        ${d.minutes ? `<text class="val" x="${x + w / 2}" y="${pt + ih - h - 5}" text-anchor="middle">${d.minutes}</text>` : ""}
        <text class="ax ${isToday ? "today" : ""}" x="${x + w / 2}" y="${H - 18}" text-anchor="middle">${d.date.getDate()}</text>
        <text class="ax sm" x="${x + w / 2}" y="${H - 5}" text-anchor="middle">${isToday ? "nay" : wd[d.date.getDay()]}</text></g>`;
    }).join("");
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Biểu đồ số phút học 14 ngày gần nhất">
      ${g}${bars}
      <line class="goal" x1="${pl}" x2="${W - pr}" y1="${y(goal)}" y2="${y(goal)}"/></svg>`;
  }

  function heatmap(goal) {
    const st = S.get();
    const weeks = 16;
    const end = new Date(); end.setHours(12, 0, 0, 0);
    const start = new Date(end);
    const dow = (end.getDay() + 6) % 7;            // Thứ 2 = 0
    start.setDate(end.getDate() - dow - (weeks - 1) * 7);
    const cells = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const k = S.dayKey(d);
      const m = Math.round((st.days[k] || 0) / 60);
      const lvl = !(k in st.days) ? 0 : m < goal * 0.25 ? 1 : m < goal * 0.75 ? 2 : m < goal * 1.5 ? 3 : 4;
      cells.push(`<i class="h h${lvl}" title="${d.toLocaleDateString("vi-VN")}: ${m} phút"></i>`);
    }
    return `<div class="heat-wrap"><div class="heat-days small muted"><span>T2</span><span></span><span>T4</span><span></span><span>T6</span><span></span><span>CN</span></div>
      <div class="heat">${cells.join("")}</div></div>`;
  }

  function recentList() {
    const st = S.get();
    const items = Object.entries(st.lessons).filter(([, p]) => p.done && p.doneAt)
      .sort((a, b) => b[1].doneAt.localeCompare(a[1].doneAt)).slice(0, 6)
      .map(([id, p]) => ({ l: S.findLesson(id), p })).filter((x) => x.l);
    if (!items.length) return `<p class="muted">Chưa có bài nào. <a href="#/roadmap">Bắt đầu học →</a></p>`;
    return `<ul class="recent">${items.map(({ l, p }) => `<li><a href="#/lesson/${esc(l.id)}">
      <span class="lv-badge sm lv-${l.level}">${l.level}</span> ${esc(l.title)}</a>
      <span class="small muted">${new Date(p.doneAt).toLocaleDateString("vi-VN")}${p.quizTotal ? ` · quiz ${p.quizBest}/${p.quizTotal}` : ""}</span></li>`).join("")}</ul>`;
  }

  /* ============================== ADD LESSON ============================== */
  function viewAdd() {
    const custom = S.get().custom;
    app.innerHTML = `
      <section class="narrow">
        <p class="eyebrow">Thêm bài học</p>
        <h1>Thêm video YouTube hoặc link bất kỳ</h1>
        <p class="muted">Video YouTube sẽ được nhúng, tự đếm thời gian xem và tự hoàn thành khi xem hết. Link khác (British Council, podcast…) sẽ mở ở tab mới.</p>
        <form id="addForm" class="card form">
          <label>Link YouTube hoặc trang web *<input name="url" required placeholder="https://www.youtube.com/watch?v=..."></label>
          <label>Tiêu đề *<input name="title" required placeholder="${esc(LANG.add.title)}"></label>
          <label>Mô tả tiếng Việt<input name="titleVi" placeholder="${esc(LANG.add.titleVi)}"></label>
          <div class="grid3 tight">
            <label>Trình độ<select name="level">${LEVELS.map((l) => `<option ${l.id === (S.get().profile.level || LEVELS[0].id) ? "selected" : ""}>${l.id}</option>`).join("")}</select></label>
            <label>Kỹ năng<select name="skill">${Object.entries(SKILLS).map(([k, v]) => `<option value="${k}">${v.vi}</option>`).join("")}</select></label>
            <label>Thời lượng (phút)<input name="minutes" type="number" min="1" max="180" value="10"></label>
          </div>
          <label>Nguồn (tuỳ chọn)<input name="provider" placeholder="${esc(LANG.add.provider)}"></label>
          <label>Từ vựng — mỗi dòng: <code>${LANG.pinyin ? "từ | pinyin | nghĩa | câu ví dụ" : "từ | nghĩa | câu ví dụ"}</code>
            <textarea name="vocab" rows="5" placeholder="${esc(LANG.add.vocab)}"></textarea></label>
          <p class="small muted">Có từ 3 từ trở lên thì bài sẽ có quiz tự sinh.</p>
          <button class="btn primary" type="submit">Thêm vào lộ trình</button>
        </form>

        ${custom.length ? `
        <div class="card">
          <div class="card-head"><h3>Bài bạn đã thêm (${custom.length})</h3><button class="btn ghost sm" id="copyJson">Sao chép JSON</button></div>
          <ul class="custom-list">${custom.map((l) => `<li>
            <a href="#/lesson/${esc(l.id)}"><span class="lv-badge sm lv-${l.level}">${l.level}</span> ${esc(l.title)}</a>
            <button class="btn ghost sm danger" data-del="${esc(l.id)}">Xoá</button></li>`).join("")}</ul>
          <p class="small muted">Muốn chia sẻ bài cho mọi người? Sao chép JSON rồi dán vào mảng <code>LESSONS</code> trong <code>js/data.js</code> và push lên GitHub.</p>
        </div>` : ""}
      </section>`;

    $("#addForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      const vid = youtubeId(f.url);
      let source;
      if (vid) source = { type: "youtube", provider: f.provider || "YouTube", videoId: vid };
      else {
        try { const u = new URL(f.url); if (!/^https?:$/.test(u.protocol)) throw 0; }
        catch { return toast("Link không hợp lệ — cần bắt đầu bằng https://", "err"); }
        source = { type: "link", provider: f.provider || new URL(f.url).hostname.replace(/^www\./, ""), url: f.url };
      }
      const vocab = (f.vocab || "").split("\n").map((line) => line.split("|").map((s) => s.trim()))
        .filter((a) => a[0] && a[1])
        .map((a) => LANG.pinyin ? { w: a[0], py: a[1] || "", vi: a[2] || "", ex: a[3] || "" } : { w: a[0], vi: a[1], ex: a[2] || "" })
        .filter((v) => v.vi);
      const lesson = {
        id: `custom-${Date.now().toString(36)}`, custom: true,
        level: f.level, skill: f.skill, title: f.title.trim(), titleVi: (f.titleVi || "").trim(),
        source, minutes: Number(f.minutes) || 10,
        goal: "", tasks: vid ? ["Xem lần 1 không phụ đề", "Xem lần 2 bật phụ đề CC, ghi chú từ mới", "Làm quiz (nếu có)"] : ["Mở bài học và làm theo hướng dẫn trên trang", "Quay lại ghi chú và ghi thời gian"],
        vocab
      };
      S.addCustom(lesson);
      toast("Đã thêm bài học ✓", "ok");
      location.hash = `#/lesson/${lesson.id}`;
    });

    $$("[data-del]", app).forEach((b) => b.addEventListener("click", () => {
      if (!confirm("Xoá bài này và tiến độ của nó?")) return;
      S.removeCustom(b.dataset.del);
      viewAdd();
    }));
    const cp = $("#copyJson");
    if (cp) cp.addEventListener("click", async () => {
      const text = JSON.stringify(S.get().custom.map(({ custom, ...l }) => l), null, 2);
      try { await navigator.clipboard.writeText(text); toast("Đã sao chép JSON"); }
      catch { prompt("Sao chép đoạn JSON này:", text); }
    });
  }

  /* ============================== SETTINGS ============================== */
  function viewSettings() {
    const st = S.get();
    app.innerHTML = `
      <section class="narrow">
        <p class="eyebrow">Cài đặt</p>
        <h1>Hồ sơ & dữ liệu</h1>
        ${window.Sync && Sync.available ? `<a class="card account-link" href="${Sync.user ? "#/account" : "#/login"}">
          <span class="q-icon">☁️</span><span><strong>${Sync.user ? `Tài khoản: ${esc(Sync.user.email)}` : "Đăng nhập để lưu tiến trình"}</strong>
          <span class="small muted">${Sync.user ? "Đồng bộ, đổi mật khẩu, đăng xuất" : "Học tiếp trên mọi thiết bị — Google hoặc email"}</span></span><span>→</span></a>` : ""}
        <form id="setForm" class="card form">
          <label>Tên hiển thị<input name="name" value="${esc(st.profile.name)}" placeholder="VD: Tommy"></label>
          <div class="grid3 tight">
            <label>Trình độ hiện tại<select name="level">
              <option value="">— chưa chọn —</option>
              ${LEVELS.map((l) => `<option value="${l.id}" ${l.id === st.profile.level ? "selected" : ""}>${l.id} · ${l.vi}</option>`).join("")}</select></label>
            <label>Mục tiêu (phút/ngày)<input name="dailyGoal" type="number" min="5" max="240" value="${st.settings.dailyGoal}"></label>
            <label>Giao diện<select name="theme">
              ${[["auto", "Theo hệ thống"], ["light", "Sáng"], ["dark", "Tối"]].map(([v, t]) => `<option value="${v}" ${v === st.settings.theme ? "selected" : ""}>${t}</option>`).join("")}</select></label>
          </div>
          <div class="row gap-s"><button class="btn primary" type="submit">Lưu</button><a class="btn ghost" href="#/test">Làm lại bài test</a></div>
        </form>

        <div class="card">${langSwitch()}<p class="small muted">Mỗi ngôn ngữ có lộ trình, XP, flashcard và chuỗi ngày riêng; cùng một tài khoản đăng nhập.</p></div>

        <div class="card">
          <h3>Sao lưu tiến độ</h3>
          <p class="muted small">Dữ liệu chỉ nằm trong trình duyệt này. Xuất file để chuyển sang máy khác hoặc đề phòng xoá lịch sử duyệt web.</p>
          <div class="row gap-s wrap">
            <button class="btn ghost" id="exportBtn">⬇ Xuất file .json</button>
            <label class="btn ghost file-btn">⬆ Nhập file .json<input type="file" id="importFile" accept="application/json,.json" hidden></label>
            <button class="btn ghost danger" id="resetBtn">Xoá toàn bộ dữ liệu</button>
          </div>
        </div>
      </section>`;

    $("#setForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      S.setProfile({ name: f.name.trim(), level: f.level || null });
      S.setSetting("dailyGoal", Math.max(5, Number(f.dailyGoal) || 20));
      S.setSetting("theme", f.theme);
      applyTheme();
      toast("Đã lưu cài đặt ✓", "ok");
    });
    $("#exportBtn").addEventListener("click", () => {
      const blob = new Blob([S.exportJSON()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${LANG.exportName}-${S.dayKey()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    $("#importFile").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try { S.importJSON(await file.text()); applyTheme(); toast("Đã nhập dữ liệu ✓", "ok"); viewSettings(); }
      catch (err) { toast(err.message || "File không hợp lệ", "err"); }
    });
    $("#resetBtn").addEventListener("click", () => {
      if (!confirm("Xoá toàn bộ tiến độ, ghi chú và bài tự thêm? Không thể hoàn tác.")) return;
      S.reset(); applyTheme(); toast("Đã xoá dữ liệu"); location.hash = "#/";
    });
  }

  function viewNotFound() {
    app.innerHTML = `<section class="narrow center"><h1>Không tìm thấy trang</h1><a class="btn primary" href="#/">Về trang chủ</a></section>`;
  }

  /* ---------------------------- chia sẻ cho các module khác ---------------------------- */
  window.UI = { $, $$, esc, shuffle, toast, speak, fmtMin, tile, onLeave, routes, app,
    rerender: () => router() };

  /* ---------------------------- khởi động ---------------------------- */
  async function loadAutoLessons() {
    window.AUTO_LESSONS = [];
    if (location.protocol === "file:") return;
    try {
      const res = await fetch("data/auto-lessons.json", { cache: "no-cache" });
      if (!res.ok) return;
      const data = await res.json();
      const coreVideos = new Set(LESSONS.filter((l) => l.source.type === "youtube").map((l) => l.source.videoId));
      window.AUTO_LESSONS = (data.lessons || [])
        .filter((l) => l && l.id && l.level && l.source && !coreVideos.has(l.source.videoId))
        .map((l) => ({ ...l, auto: true, skill: SKILLS[l.skill] ? l.skill : "listening" }));
    } catch (e) { console.warn("Không tải được data/auto-lessons.json", e); }
  }

  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", applyTheme);
  applyTheme();
  const syncInit = () => window.Sync ? Promise.race([window.Sync.init(), new Promise((r) => setTimeout(r, 3000))]) : null;
  // chờ mọi script (review.js, sync.js…) nạp xong rồi mới khởi động
  const boot = () => Promise.allSettled([loadAutoLessons(), syncInit()]).finally(() => {
    S.applyFreezes();
    Game.updateXpChip();
    Game.checkBadges();
    router();
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot);
})();
