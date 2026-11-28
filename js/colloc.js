/* ==========================================================================
   Collocation mỗi ngày — cụm từ đi kèm theo trình độ & chủ đề
   --------------------------------------------------------------------------
   Chỉ bật khi trang có window.COLLOCATIONS (js/colloc-data.js — trang tiếng Anh).
   Route:  #/colloc[/<cấp>]        tổng quan: chủ đề hôm nay + mọi chủ đề của cấp
           #/colloc/<id chủ đề>    bài học: xem 8 cụm → luyện 8 câu (4 dạng) → kết quả
   Mỗi ngày mỗi cấp có 1 chủ đề (Daily.colloc — dùng chung với bot Telegram).
   Làm xong: +XP, 8 cụm tự vào flashcard (id thẻ "colloc-<chủ đề>::<cụm>").
   ========================================================================== */
(function () {
  "use strict";
  const TOPICS = window.COLLOCATIONS;
  if (!Array.isArray(TOPICS) || !window.UI || !window.Store) return;
  const { $, $$, esc, shuffle, toast, speak, onLeave, routes, app } = window.UI;
  const S = window.Store;
  const LV_IDS = LEVELS.map((l) => l.id);
  const byId = (id) => TOPICS.find((t) => t.id === id);
  const topicsOf = (lv) => TOPICS.filter((t) => t.level === lv);
  const userLevel = () => (LV_IDS.includes(S.get().profile.level) ? S.get().profile.level : LV_IDS[0]);
  const todayTopic = (lv = userLevel()) => Daily.colloc(TOPICS, lv, S.dayKey());
  const tstate = (id) => (S.collocState().topics || {})[id] || null;

  /** "[make] a decision" → HTML có từ được luyện tô đậm (hoặc thay bằng chỗ trống) */
  const mark = (s, blank) => esc(s).replace(/\[([^\]]+)\]/, (_, w) => (blank ? '<span class="blank">_____</span>' : `<mark class="co-key">${w}</mark>`));
  const sayBtn = (text) => `<button type="button" class="say" data-say="${esc(text)}" title="Nghe phát âm">🔊</button>`;
  function bindSay(root = app) {
    $$("[data-say]", root).forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); speak(b.dataset.say); }));
  }

  /* Đo thời gian học thật trên trang (dừng khi tab ẩn), tối đa 20 phút / lần */
  function trackTime() {
    let acc = 0, since = document.visibilityState === "visible" ? Date.now() : null;
    const vis = () => {
      if (document.visibilityState === "visible") since = Date.now();
      else if (since) { acc += Date.now() - since; since = null; }
    };
    document.addEventListener("visibilitychange", vis);
    const flush = () => {
      if (since) { acc += Date.now() - since; since = Date.now(); }
      const secs = Math.min(1200, Math.round(acc / 1000));
      acc = 0;
      if (secs >= 10) S.addTime(null, secs);
    };
    onLeave(() => { document.removeEventListener("visibilitychange", vis); flush(); });
    return flush;
  }

  /* ---------------------------- thẻ trang chủ ---------------------------- */
  function homeCard() {
    const t = todayTopic();
    if (!t) return "";
    const done = (S.collocState().days || {})[S.dayKey()];
    const ts = tstate(t.id);
    return `<a class="card plan-home colloc-home ${done ? "is-done" : ""}" href="#/colloc/${esc(t.id)}">
      <span class="q-icon">🧩</span>
      <span><span class="eyebrow">Collocation của ngày · ${esc(t.level)} · +${S.XP.collocDaily + S.XP.collocTopic} XP</span>
      <strong>${t.icon} ${esc(t.en)} — ${esc(t.vi)}</strong>
      <span class="muted small">${t.items.slice(0, 3).map((i) => esc(i.text)).join(" · ")} …${ts && ts.total ? ` · tốt nhất ${ts.best}/${ts.total}` : ""}</span></span>
      <span class="btn ${done ? "ghost" : "primary"} sm">${done ? "✓ Đã làm hôm nay" : "Luyện 8 cụm →"}</span></a>`;
  }

  /* ============================== TỔNG QUAN ============================== */
  function viewOverview(lv) {
    if (!LV_IDS.includes(lv)) lv = userLevel();
    const list = topicsOf(lv);
    const today = todayTopic(lv);
    const cs = S.collocState();
    const doneLv = list.filter((t) => tstate(t.id) && tstate(t.id).done).length;
    const allDone = TOPICS.filter((t) => tstate(t.id) && tstate(t.id).done);
    const learned = allDone.reduce((a, t) => a + t.items.length, 0);
    const days = Object.keys(cs.days || {}).length;
    const todayState = today && tstate(today.id);
    const todayDone = !!(cs.days || {})[S.dayKey()];

    app.innerHTML = `
      <section class="colloc-head">
        <p class="eyebrow">Collocation · cụm từ đi kèm</p>
        <h1>🧩 Luyện collocation mỗi ngày</h1>
        <p class="lead">Người bản xứ nói <strong>make a decision</strong>, <strong>heavy rain</strong> — không nói <s>do a decision</s>, <s>strong rain</s>.
          Mỗi ngày 1 chủ đề theo trình độ: xem 8 cụm → luyện 8 câu → cụm tự vào flashcard để ôn lại.</p>
      </section>

      <div class="lv-tabs" role="tablist" style="--nlv:${LEVELS.length}">
        ${LEVELS.map((l) => `<a role="tab" class="lv-tab lv-${l.id} ${l.id === lv ? "active" : ""}" href="#/colloc/${l.id}">
          <strong>${l.id}</strong><span>${topicsOf(l.id).filter((t) => tstate(t.id) && tstate(t.id).done).length}/${topicsOf(l.id).length} chủ đề</span>${l.id === S.get().profile.level ? "<em>bạn</em>" : ""}</a>`).join("")}
      </div>

      ${today ? `
      <a class="next-card daily colloc-today ${todayState && todayState.last === S.dayKey() ? "is-done" : ""}" href="#/colloc/${esc(today.id)}">
        <div class="next-meta">
          <span class="chip">⭐ Chủ đề hôm nay · ${lv}</span>
          <span class="muted">8 cụm · ~8 phút${todayDone ? " · bạn đã nhận thưởng hôm nay" : ` · +${S.XP.collocDaily} XP thưởng`}</span>
        </div>
        <h2>${today.icon} ${esc(today.en)}</h2>
        <p class="muted">${esc(today.vi)} — ${today.items.slice(0, 4).map((i) => esc(i.text)).join(", ")}…</p>
        <span class="btn primary">${todayState && todayState.last === S.dayKey() ? `✓ ${todayState.best}/${todayState.total} — làm lại` : "Bắt đầu →"}</span>
      </a>` : ""}

      <section class="stat-row">
        ${window.UI.tile("🧩", `${doneLv}/${list.length}`, `chủ đề ${lv} đã xong`)}
        ${window.UI.tile("🔗", learned, "cụm đã học (mọi cấp)")}
        ${window.UI.tile("📅", days, "ngày đã làm Collocation của ngày")}
      </section>

      <h2 class="co-h2">Tất cả chủ đề ${lv}</h2>
      <section class="co-grid">
        ${list.map((t) => {
          const s = tstate(t.id);
          return `<a class="card co-topic ${s && s.done ? "done" : ""} ${today && t.id === today.id ? "today" : ""}" href="#/colloc/${esc(t.id)}">
            <span class="co-icon">${t.icon}</span>
            <span class="co-body"><strong>${esc(t.en)}</strong><span class="muted small">${esc(t.vi)}</span>
              <span class="small co-sample">${t.items.slice(0, 3).map((i) => esc(i.text)).join(" · ")}</span></span>
            <span class="co-score">${s && s.total ? `${s.best === s.total ? "🏆" : "✓"} ${s.best}/${s.total}` : today && t.id === today.id ? "⭐ hôm nay" : "Chưa học"}</span>
          </a>`;
        }).join("")}
      </section>
      <p class="small muted">Mẹo: học theo cụm chứ không học từ lẻ. Khi gặp một danh từ mới, hỏi luôn “động từ / tính từ nào hay đi với nó?”.
        Từ điển collocation miễn phí: <a href="https://www.freecollocation.com" target="_blank" rel="noopener">freecollocation.com ↗</a> (Oxford Collocations Dictionary).</p>`;
  }

  /* ============================== BÀI HỌC ============================== */
  function viewTopic(t) {
    const flush = trackTime();
    const isDaily = (() => { const d = todayTopic(t.level); return !!d && d.id === t.id; })();
    const levelPool = topicsOf(t.level).flatMap((x) => x.items);
    const crumbs = `<nav class="crumbs"><a href="#/colloc/${t.level}">Collocation</a> / <a href="#/colloc/${t.level}">${t.level}</a> / <span>${esc(t.en)}</span></nav>`;
    const head = (sub) => `${crumbs}
      <div class="lesson-head"><div>
        ${isDaily ? `<span class="chip">⭐ Collocation của ngày</span> ` : ""}<span class="lv-badge sm lv-${t.level}">${t.level}</span>
        <h1>${t.icon} ${esc(t.en)} <small class="muted">— ${esc(t.vi)}</small></h1>${sub || ""}</div></div>`;

    /* ---------- bước 1: xem 8 cụm ---------- */
    function learn() {
      const s = tstate(t.id);
      app.innerHTML = `
        ${head(`<p class="muted">Đọc to từng cụm, chú ý từ được tô màu — đó là từ bạn sẽ phải tự điền.${s && s.total ? ` Điểm tốt nhất: <strong>${s.best}/${s.total}</strong>.` : ""}</p>`)}
        <ol class="co-list">
          ${t.items.map((i) => `<li class="card co-item">
            <div class="co-row"><span class="co-phrase">${mark(i.c)}</span>${sayBtn(i.text)}</div>
            <div class="co-vi">${esc(i.vi)}</div>
            <div class="co-ex"><em>${mark(i.ex)}</em> ${sayBtn(i.exText)}</div>
            ${i.note ? `<div class="co-note small">💡 ${esc(i.note)}</div>` : ""}
            ${i.wrong.length ? `<div class="co-wrong small muted">Không nói: ${i.wrong.map((w) => `<s>${esc(i.c.replace(/\[[^\]]+\]/, w))}</s>`).join(", ")}</div>` : ""}
          </li>`).join("")}
        </ol>
        <div class="row center sticky-cta"><button class="btn primary lg" id="go">Bắt đầu luyện tập (8 câu) →</button></div>`;
      bindSay();
      $("#go").addEventListener("click", practice);
    }

    /* ---------- bước 2: luyện 8 câu, 4 dạng ---------- */
    function buildQuestion(item, type) {
      if (type === "choose" && item.wrong.length) {
        return { item, type, prompt: "Chọn từ đúng để hoàn thành cụm",
          html: `${mark(item.c, true)}<span class="q-sub">${esc(item.vi)}</span>`,
          opts: shuffle([item.key, ...item.wrong.slice(0, 3)]), answer: item.key };
      }
      if (type === "tf" && item.wrong.length) {
        const real = Math.random() < 0.5;
        const shown = real ? item.text : item.c.replace(/\[[^\]]+\]/, shuffle(item.wrong)[0]);
        return { item, type, prompt: "Cụm này người bản xứ có nói không?",
          html: `${esc(shown)}<span class="q-sub">(${esc(item.vi)})</span>`,
          opts: ["✓ Tự nhiên", "✗ Không tự nhiên"], answer: real ? "✓ Tự nhiên" : "✗ Không tự nhiên" };
      }
      if (type === "type" && item.exKey) {
        return { item, type, prompt: "Gõ từ còn thiếu trong câu",
          html: `${mark(item.ex, true)}<span class="q-sub">${esc(item.vi)} · bắt đầu bằng “${esc(item.exKey[0])}”, ${item.exKey.length} chữ cái</span>`,
          input: true, answer: item.exKey };
      }
      // meaning (mặc định)
      const others = shuffle([...new Set([...t.items, ...levelPool].filter((x) => x.vi !== item.vi).map((x) => x.vi))]).slice(0, 3);
      return { item, type: "meaning", prompt: "Cụm này nghĩa là gì?",
        html: `${esc(item.text)} ${sayBtn(item.text)}`, opts: shuffle([item.vi, ...others]), answer: item.vi };
    }

    function practice() {
      const types = shuffle(["choose", "choose", "choose", "meaning", "meaning", "type", "type", "tf"]);
      const queue = shuffle(t.items).map((item, i) => buildQuestion(item, types[i]));
      const firstTry = new Map();           // item.id -> đúng ngay lần đầu?
      const total = t.items.length;
      let qi = 0, locked = false;

      function draw() {
        const q = queue[qi];
        const retry = firstTry.has(q.item.id);
        locked = false;
        app.innerHTML = `
          ${head()}
          <div class="row between small muted"><span>${retry ? "🔁 Làm lại câu sai" : `Câu ${Math.min(qi + 1, total)}/${total}`}</span><span>Đúng ngay lần đầu: <strong>${[...firstTry.values()].filter(Boolean).length}</strong></span></div>
          <div class="progress"><span style="width:${Math.round((qi / queue.length) * 100)}%"></span></div>
          <div class="card q-card co-q">
            <p class="eyebrow">${q.prompt}</p>
            <h2 class="q-text">${q.html}</h2>
            ${q.input ? `<form id="typeForm" class="co-type" autocomplete="off">
                <input id="typed" type="text" autocapitalize="none" spellcheck="false" aria-label="Từ còn thiếu" placeholder="Gõ từ…" required>
                <button class="btn primary">Kiểm tra</button>
                <button class="btn ghost" type="button" id="skip">Không biết</button></form>`
              : `<div class="opts">${q.opts.map((o) => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div>`}
            <div id="fb"></div>
          </div>`;
        bindSay();
        if (q.input) {
          const inp = $("#typed");
          inp.focus();
          $("#typeForm").addEventListener("submit", (e) => { e.preventDefault(); answer(inp.value); });
          $("#skip").addEventListener("click", () => answer(""));
        } else {
          $$(".opts .opt").forEach((b) => b.addEventListener("click", () => answer(b.dataset.v, b)));
        }
      }

      const norm = (s) => String(s).toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
      function answer(v, btn) {
        if (locked) return;
        locked = true;
        const q = queue[qi];
        const ok = norm(v) === norm(q.answer);
        if (!firstTry.has(q.item.id)) {
          firstTry.set(q.item.id, ok);
          if (!ok) {                        // câu sai → cuối bài làm lại bằng dạng khác
            const again = q.type === "choose" ? (q.item.exKey ? "type" : "meaning") : (q.item.wrong.length ? "choose" : "meaning");
            queue.push(buildQuestion(q.item, again));
          }
        } else if (!ok) {
          queue.push(buildQuestion(q.item, "meaning"));
        }
        if (q.input) {
          const inp = $("#typed");
          inp.disabled = true;
          inp.classList.add(ok ? "ok" : "bad");
          $$("#typeForm button").forEach((b) => (b.disabled = true));
        } else {
          $$(".opts .opt").forEach((b) => {
            b.disabled = true;
            if (b.dataset.v === q.answer) b.classList.add("picked-ok");
            else if (b === btn) b.classList.add("picked-bad");
          });
        }
        const i = q.item;
        $("#fb").innerHTML = `<div class="co-fb ${ok ? "good" : "bad"}">
            <strong>${ok ? "✓ Chính xác!" : "✗ Chưa đúng."}</strong>
            <span class="co-line"><span class="co-phrase">${mark(i.c)}</span> ${sayBtn(i.text)} <span class="muted">— ${esc(i.vi)}</span></span>
            <em class="small">${mark(i.ex)}</em>
            ${i.note ? `<span class="small">💡 ${esc(i.note)}</span>` : ""}
          </div>
          <div class="row end"><button class="btn primary" id="next">${qi + 1 < queue.length ? "Tiếp →" : "Xem kết quả"}</button></div>`;
        bindSay($("#fb"));
        const nx = $("#next");
        nx.focus();
        nx.addEventListener("click", () => { qi++; if (qi < queue.length) draw(); else finish(firstTry); });
      }
      draw();
    }

    /* ---------- bước 3: kết quả ---------- */
    function finish(firstTry) {
      const total = t.items.length;
      const score = t.items.filter((i) => firstTry.get(i.id)).length;
      const before = tstate(t.id);
      const wasBest = before ? before.best || 0 : 0;
      const xp = S.saveColloc(t.id, score, total, isDaily);
      const added = S.addWordCards(`colloc-${t.id}`, t.items.map((i) => ({ w: i.text, vi: i.vi, ex: i.exText })));
      flush();
      if (window.Game) { Game.checkBadges(); if (score === total) Game.confetti(120); }
      const list = topicsOf(t.level);
      const next = list.find((x) => x.id !== t.id && !(tstate(x.id) && tstate(x.id).done)) || null;
      app.innerHTML = `
        ${head()}
        <section class="narrow center">
          <div class="cel-icon">${score === total ? "🏆" : score >= total * 0.75 ? "🎉" : "💪"}</div>
          <h2>${score}/${total} câu đúng ngay lần đầu</h2>
          <p class="lead">${xp ? `+${xp} XP. ` : ""}${score > wasBest && before ? "Kỷ lục mới cho chủ đề này! " : ""}${added ? `Đã thêm ${added} cụm vào flashcard 🃏.` : "Các cụm đã có sẵn trong flashcard."}</p>
        </section>
        <ul class="co-res">
          ${t.items.map((i) => `<li class="${firstTry.get(i.id) ? "ok" : "bad"}"><span>${firstTry.get(i.id) ? "✅" : "🔁"}</span>
            <span><strong>${esc(i.text)}</strong> <span class="muted">— ${esc(i.vi)}</span></span>${sayBtn(i.text)}</li>`).join("")}
        </ul>
        <div class="row center wrap gap-s">
          <button class="btn ghost" id="again">Làm lại</button>
          <a class="btn ghost" href="#/review">🃏 Ôn flashcard</a>
          ${next ? `<a class="btn primary" href="#/colloc/${esc(next.id)}">Chủ đề tiếp: ${next.icon} ${esc(next.en)} →</a>` : `<a class="btn primary" href="#/colloc/${t.level}">Tất cả chủ đề ${t.level}</a>`}
        </div>`;
      bindSay();
      $("#again").addEventListener("click", () => { window.scrollTo(0, 0); learn(); });
    }

    learn();
  }

  function viewColloc(arg) {
    const t = byId(arg);
    if (t) return viewTopic(t);
    viewOverview(String(arg || "").toUpperCase());
  }

  routes.colloc = viewColloc;
  window.Colloc = { homeCard, todayTopic, byId };
})();
