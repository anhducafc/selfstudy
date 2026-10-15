/* ==========================================================================
   Ôn tập: Flashcard (Leitner) + 3 mini game
   Route: #/review, #/games, #/games/match | speed | dictation
   ========================================================================== */
(function () {
  "use strict";
  const S = window.Store;
  const { $, $$, esc, shuffle, toast, speak, onLeave, routes, app } = window.UI;
  const LANG = window.LANG;

  /* Đo thời gian học thật trên trang ôn/game (dừng khi tab ẩn), tối đa 20 phút / lần */
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

  /* Kho từ cho game: từ trong flashcard + từ của các bài ở trình độ ≤ trình độ hiện tại */
  function wordPool() {
    const order = LEVELS.map((l) => l.id);
    const cur = S.get().profile.level ? order.indexOf(S.get().profile.level) : order.length - 1;
    const seenW = new Set(), seenVi = new Set(), out = [];
    const push = (v) => {
      const kw = v.w.toLowerCase(), kv = v.vi.toLowerCase();
      if (seenW.has(kw) || seenVi.has(kv)) return;
      seenW.add(kw); seenVi.add(kv); out.push(v);
    };
    Object.values(S.get().cards).forEach((c) => push({ w: c.w, vi: c.vi, ex: c.ex, py: c.py, exPy: c.exPy, exVi: c.exVi }));
    S.allLessons().filter((l) => order.indexOf(l.level) <= Math.max(cur, 0))
      .forEach((l) => (l.vocab || []).forEach((v) => push(v)));
    return out;
  }

  /* ============================== FLASHCARD ============================== */
  function viewReview() {
    const flush = trackTime();
    const stats = S.cardStats();
    let queue = S.dueCards().slice(0, 20);
    const again = new Set();
    let i = 0, flipped = false, reviewed = 0, xpStart = S.get().xp.total;
    let reverse = false;
    try { reverse = localStorage.getItem("ep.reverse") === "1"; } catch {}
    let autoSay = true;
    try { autoSay = localStorage.getItem("ep.autosay") !== "0"; } catch {}

    if (!stats.total) {
      const lv = S.get().profile.level || LEVELS[0].id;
      const starter = LESSONS.filter((l) => l.level === lv && l.vocab && l.vocab.length);
      app.innerHTML = `
        <section class="narrow center">
          <p class="eyebrow">Ôn tập</p>
          <h1>Chưa có flashcard nào</h1>
          <p class="lead">Từ vựng sẽ tự vào flashcard khi bạn hoàn thành một bài. Hoặc thêm ngay bộ từ khởi động của trình độ ${lv} (${starter.reduce((a, l) => a + l.vocab.length, 0)} từ).</p>
          <div class="row center">
            <button class="btn primary lg" id="starter">🃏 Thêm bộ từ ${lv}</button>
            <a class="btn ghost lg" href="#/games">🎮 Chơi mini game</a>
          </div>
        </section>`;
      $("#starter").addEventListener("click", () => {
        S.batch(() => starter.forEach((l) => S.addCardsFor(l.id, true)));
        toast("Đã thêm bộ từ khởi động 🃏", "ok");
        viewReview();
      });
      return;
    }

    function header() {
      const st = S.cardStats();
      return `
        <section class="review-head">
          <div><p class="eyebrow">Ôn tập ngắt quãng</p><h1>Flashcard</h1>
          <p class="muted small">Nhớ → thẻ lên hộp và hẹn ôn xa dần (1 → 2 → 4 → 9 → 21 ngày). Quên → về hộp 1.</p></div>
          <div class="boxes" title="Số thẻ theo hộp Leitner">
            ${[1, 2, 3, 4, 5].map((b) => `<div class="box b${b}"><span style="height:${st.total ? Math.max(6, (st.boxes[b] / st.total) * 100) : 6}%"></span><em>${st.boxes[b]}</em><small>H${b}</small></div>`).join("")}
          </div>
        </section>`;
    }

    function draw() {
      if (i >= queue.length) return done();
      const c = queue[i];
      const front = reverse ? c.vi : c.w;
      app.innerHTML = `
        ${header()}
        <section class="narrow">
          <div class="row between small muted"><span>Thẻ ${i + 1} / ${queue.length}${again.has(c.id) ? " · ôn lại" : ""}</span>
            <span class="row gap-s">
              <label class="toggle"><input type="checkbox" id="rev" ${reverse ? "checked" : ""}> Việt → ${LANG.id === "en" ? "Anh" : "Trung"}</label>
              <label class="toggle"><input type="checkbox" id="say" ${autoSay ? "checked" : ""}> Tự đọc</label>
            </span></div>
          <div class="progress"><span style="width:${(i / queue.length) * 100}%"></span></div>
          <button class="flash ${flipped ? "flipped" : ""}" id="card" aria-label="Lật thẻ">
            <span class="f-inner">
              <span class="f-face f-front"><span class="box-tag">Hộp ${c.box}</span><strong>${esc(front)}</strong><em class="muted small">Chạm hoặc nhấn Space để lật</em></span>
              <span class="f-face f-back">
                <strong>${esc(c.w)}</strong>${c.py ? `<span class="py">${esc(c.py)}</span>` : ""}<span class="f-vi">${esc(c.vi)}</span>
                ${c.ex ? `<em>“${esc(c.ex)}”</em>` : ""}${c.exVi ? `<span class="small muted">${esc(c.exVi)}</span>` : ""}
              </span>
            </span>
          </button>
          <div class="grades ${flipped ? "" : "hidden"}">
            <button class="btn grade g0" data-g="0"><b>1</b> 😕 Quên</button>
            <button class="btn grade g1" data-g="1"><b>2</b> 🙂 Nhớ</button>
            <button class="btn grade g2" data-g="2"><b>3</b> 😎 Dễ</button>
          </div>
          <div class="row center gap-s">
            <button class="btn ghost sm" id="sayW">🔊 Từ</button>
            ${c.ex ? `<button class="btn ghost sm" id="sayEx">🔊 Câu ví dụ</button>` : ""}
            ${S.findLesson(c.lessonId) ? `<a class="btn ghost sm" href="#/lesson/${esc(c.lessonId)}">Mở bài</a>` : ""}
          </div>
        </section>`;
      if (!flipped && autoSay && !reverse) speak(c.w);
      $("#card").addEventListener("click", flip);
      $("#sayW").addEventListener("click", () => speak(c.w));
      const se = $("#sayEx"); if (se) se.addEventListener("click", () => speak(c.ex));
      $$(".grade").forEach((b) => b.addEventListener("click", () => grade(Number(b.dataset.g))));
      $("#rev").addEventListener("change", (e) => { reverse = e.target.checked; try { localStorage.setItem("ep.reverse", reverse ? "1" : "0"); } catch {} flipped = false; draw(); });
      $("#say").addEventListener("change", (e) => { autoSay = e.target.checked; try { localStorage.setItem("ep.autosay", autoSay ? "1" : "0"); } catch {} });
    }

    function flip() {
      flipped = !flipped;
      $("#card").classList.toggle("flipped", flipped);
      $(".grades").classList.toggle("hidden", !flipped);
      if (flipped && autoSay && reverse) speak(queue[i].w);
    }

    function grade(g) {
      const c = queue[i];
      S.reviewCard(c.id, g);
      reviewed++;
      if (g === 0 && !again.has(c.id)) { again.add(c.id); queue.push({ ...c, box: 1 }); }
      i++; flipped = false; draw();
    }

    function done() {
      flush();
      const st = S.cardStats();
      const gained = S.get().xp.total - xpStart;
      if (reviewed) window.Game.confetti(90);
      app.innerHTML = `
        ${header()}
        <section class="narrow center">
          <div class="cel-icon">${reviewed ? "🎉" : "✅"}</div>
          <h1>${reviewed ? `Xong ${reviewed} lượt ôn!` : "Hôm nay không còn thẻ cần ôn"}</h1>
          <p class="lead">${reviewed ? `+${gained} XP. ` : ""}${st.total} thẻ · ${st.mastered} thẻ đã thuộc (hộp 5). ${st.due ? `Còn ${st.due} thẻ đến hạn.` : "Quay lại ngày mai nhé!"}</p>
          <div class="row center">
            ${st.due ? `<a class="btn primary" href="#/review" id="more">Ôn tiếp</a>` : ""}
            <a class="btn ${st.due ? "ghost" : "primary"}" href="#/games">🎮 Chơi mini game</a>
            <a class="btn ghost" href="#/">Về trang chủ</a>
          </div>
        </section>`;
      const more = $("#more");
      if (more) more.addEventListener("click", (e) => { e.preventDefault(); viewReview(); });
    }

    const key = (e) => {
      if (e.target.matches("input, textarea")) return;
      if (e.code === "Space") { e.preventDefault(); if ($("#card")) flip(); }
      if (flipped && ["Digit1", "Digit2", "Digit3"].includes(e.code)) grade(Number(e.code.slice(-1)) - 1);
    };
    document.addEventListener("keydown", key);
    onLeave(() => document.removeEventListener("keydown", key));
    draw();
  }

  /* ============================== GAMES ============================== */
  const GAMES = [
    { id: "match", icon: "🧩", name: "Ghép từ", desc: "Ghép 6 cặp từ – nghĩa nhanh nhất có thể. Ghép sai +3 giây.", best: (v) => `${v.toFixed(1)}s`, },
    { id: "speed", icon: "⚡", name: "Đoán nhanh 60s", desc: "Chọn đúng nghĩa càng nhiều càng tốt trong 60 giây.", best: (v) => `${v} điểm` },
    { id: "dictation", icon: "✍️", name: "Chép chính tả", desc: `Nghe 5 câu (${LANG.voiceNote}) rồi gõ lại. Luyện tai và chính tả.`, best: (v) => `${v}%` }
  ];

  function viewGames(id) {
    const pool = wordPool();
    if (id && pool.length < 6) id = "";
    if (id === "match") return gameMatch(pool);
    if (id === "speed") return gameSpeed(pool);
    if (id === "dictation") return gameDictation(pool);
    const best = S.get().game.best;
    const capLeft = S.XP.gameDailyCap - (S.get().game.gameXpByDay[S.dayKey()] || 0);
    app.innerHTML = `
      <section>
        <p class="eyebrow">Ôn tập</p>
        <h1>Mini game 2–3 phút</h1>
        <p class="muted">Dùng ${pool.length} từ trong flashcard và các bài ở trình độ của bạn. XP từ game hôm nay còn: <strong>${Math.max(0, capLeft)}</strong>/${S.XP.gameDailyCap}.</p>
      </section>
      ${pool.length < 6 ? `<div class="card"><p>Cần ít nhất 6 từ để chơi. Hãy <a href="#/test">chọn trình độ</a> hoặc hoàn thành vài bài.</p></div>` : ""}
      <section class="grid3">
        ${GAMES.map((g) => `<a class="card game-card" href="#/games/${g.id}">
          <span class="g-icon">${g.icon}</span><h3>${g.name}</h3><p class="muted small">${g.desc}</p>
          <span class="small">${best[g.id] != null ? `🏆 Kỷ lục: <strong>${g.best(best[g.id])}</strong>` : "Chưa chơi"}</span></a>`).join("")}
      </section>
      <section class="card review-cta">
        <div><h3>🃏 Flashcard</h3><p class="muted small">${S.cardStats().due} thẻ đến hạn hôm nay.</p></div>
        <a class="btn primary" href="#/review">Ôn flashcard</a>
      </section>`;
  }

  function gameShell(g, inner) {
    return `<nav class="crumbs"><a href="#/games">Mini game</a> / <span>${g.name}</span></nav>
      <section class="narrow game">${inner}</section>`;
  }

  function finishGame(g, score, xpWanted, lowerIsBetter, label, replay) {
    const r = S.gameResult(g.id, score, xpWanted, lowerIsBetter);
    if (r.isBest) window.Game.confetti(100);
    const box = $("#gameBox");
    box.innerHTML = `
      <div class="center">
        <div class="cel-icon">${r.isBest ? "🏆" : "👏"}</div>
        <h2>${label}</h2>
        <p class="lead">${r.isBest ? "Kỷ lục mới! " : `Kỷ lục: ${g.best(S.get().game.best[g.id])}. `}${r.xp ? `+${r.xp} XP` : r.capped ? "Đã đạt trần XP game hôm nay — chơi tiếp cho vui nhé!" : ""}</p>
        <div class="row center"><button class="btn primary" id="again">Chơi lại</button><a class="btn ghost" href="#/games">Game khác</a></div>
      </div>`;
    $("#again").addEventListener("click", replay);
  }

  /* ---------- Ghép từ ---------- */
  function gameMatch(pool) {
    const g = GAMES[0];
    trackTime();
    const pick = shuffle(pool).slice(0, 6);
    const tiles = shuffle([
      ...pick.map((v, k) => ({ k, t: v.w, side: "w" })),
      ...pick.map((v, k) => ({ k, t: v.vi, side: "vi" }))
    ]);
    let sel = null, matched = 0, penalty = 0, start = 0, timer = null;

    app.innerHTML = gameShell(g, `
      <div class="row between"><h1>${g.icon} ${g.name}</h1><span class="timer" id="t">0.0s</span></div>
      <div id="gameBox"><div class="match-grid">${tiles.map((x, n) => `<button class="tile-btn ${x.side}" data-n="${n}">${esc(x.t)}</button>`).join("")}</div>
      <p class="muted small center">Chạm một từ ${LANG.nameVi} rồi chạm nghĩa của nó. Đồng hồ chạy từ lần chạm đầu tiên.</p></div>`);

    const tick = () => { $("#t").textContent = `${((Date.now() - start) / 1000 + penalty).toFixed(1)}s`; };
    $$(".tile-btn").forEach((b) => b.addEventListener("click", () => {
      if (b.classList.contains("ok")) return;
      if (!start) { start = Date.now(); timer = setInterval(tick, 100); }
      const x = tiles[Number(b.dataset.n)];
      if (x.side === "w") speak(x.t);
      if (!sel) { sel = b; b.classList.add("sel"); return; }
      if (sel === b) { b.classList.remove("sel"); sel = null; return; }
      const y = tiles[Number(sel.dataset.n)];
      if (x.k === y.k && x.side !== y.side) {
        [b, sel].forEach((e) => { e.classList.remove("sel"); e.classList.add("ok"); });
        matched++;
        if (matched === pick.length) {
          clearInterval(timer);
          const time = Math.round(((Date.now() - start) / 1000 + penalty) * 10) / 10;
          setTimeout(() => finishGame(g, time, 15, true, `Hoàn thành trong ${time}s`, () => gameMatch(pool)), 350);
        }
      } else {
        penalty += 3;
        [b, sel].forEach((e) => { e.classList.remove("sel"); e.classList.add("bad"); setTimeout(() => e.classList.remove("bad"), 450); });
      }
      sel = null;
    }));
    onLeave(() => clearInterval(timer));
  }

  /* ---------- Đoán nhanh 60s ---------- */
  function gameSpeed(pool) {
    const g = GAMES[1];
    trackTime();
    let score = 0, combo = 0, left = 60, timer = null, cur = null, lock = false;
    const order = shuffle(pool);
    let idx = 0;

    app.innerHTML = gameShell(g, `
      <div class="row between"><h1>${g.icon} ${g.name}</h1><span class="timer" id="t">60s</span></div>
      <div id="gameBox">
        <div class="speed-top"><span>Điểm: <strong id="sc">0</strong></span><span id="combo" class="muted"></span></div>
        <div class="card q-card"><h2 class="q-text" id="qw"></h2><div class="opts" id="opts"></div></div>
      </div>`);

    function next() {
      cur = order[idx++ % order.length];
      const wrong = shuffle(pool.filter((v) => v !== cur)).slice(0, 3).map((v) => v.vi);
      const opts = shuffle([cur.vi, ...wrong]);
      $("#qw").innerHTML = esc(cur.w) + (cur.py ? `<span class="py block">${esc(cur.py)}</span>` : "");
      $("#opts").innerHTML = opts.map((o) => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join("");
      $$("#opts .opt").forEach((b) => b.addEventListener("click", () => answer(b)));
      lock = false;
    }
    function answer(b) {
      if (lock || left <= 0) return;
      lock = true;
      if (!timer) timer = setInterval(() => {
        left--; $("#t").textContent = `${left}s`;
        if (left <= 0) { clearInterval(timer); finishGame(g, score, Math.min(30, score * 2), false, `${score} điểm trong 60 giây`, () => gameSpeed(pool)); }
      }, 1000);
      const ok = b.dataset.v === cur.vi;
      if (ok) { score++; combo++; b.classList.add("picked-ok"); }
      else {
        combo = 0; b.classList.add("picked-bad");
        $$("#opts .opt").forEach((x) => { if (x.dataset.v === cur.vi) x.classList.add("picked-ok"); });
      }
      $("#sc").textContent = score;
      $("#combo").textContent = combo >= 3 ? `🔥 combo ×${combo}` : "";
      setTimeout(() => { if (left > 0) next(); }, ok ? 250 : 900);
    }
    $("#t").textContent = "60s · chạm để bắt đầu";
    next();
    onLeave(() => clearInterval(timer));
  }

  /* ---------- Chép chính tả ---------- */
  const normWords = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9'\s-]/g, " ").split(/\s+/).filter(Boolean);
  /* Trung/Nhật: so từng chữ (bỏ dấu câu); nếu người học gõ pinyin thì so từng âm tiết pinyin không dấu */
  const normChars = (s) => [...String(s).replace(/[^\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}0-9a-zA-Z]/gu, "")].map((c) => c.toLowerCase());
  const normPy = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const norm = (s) => (LANG.cjk ? normChars(s) : normWords(s));
  function lcsMarks(target, typed) {
    const n = target.length, m = typed.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
      dp[i][j] = target[i] === typed[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const ok = new Array(n).fill(false);
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (target[i] === typed[j]) { ok[i] = true; i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
    }
    return { ok, hits: dp[0][0], extra: Math.max(0, m - dp[0][0]) };
  }

  function gameDictation(pool) {
    const g = GAMES[2];
    trackTime();
    const sentences = shuffle(pool.filter((v) => v.ex && norm(v.ex).length >= (LANG.cjk ? 5 : 4) && norm(v.ex).length <= (LANG.cjk ? 22 : 99))).slice(0, 5);
    if (sentences.length < 3) { toast("Chưa đủ câu ví dụ — hoàn thành thêm vài bài nhé."); location.hash = "#/games"; return; }
    let i = 0;
    const scores = [];

    app.innerHTML = gameShell(g, `<div class="row between"><h1>${g.icon} ${g.name}</h1><span class="timer" id="t"></span></div><div id="gameBox"></div>`);

    function draw() {
      const s = sentences[i];
      $("#t").textContent = `Câu ${i + 1}/${sentences.length}`;
      $("#gameBox").innerHTML = `
        <div class="card">
          <div class="row gap-s"><button class="btn primary" id="play">🔊 Nghe</button><button class="btn ghost" id="slow">🐢 Nghe chậm</button>
            <span class="muted small">Gợi ý: có từ “${esc(s.w)}”${s.py ? ` (${esc(s.py)})` : ""}</span></div>
          <textarea id="typed" rows="2" placeholder="${LANG.cjk ? "Gõ lại câu bằng chữ Hán (bộ gõ pinyin)" + (s.exPy ? " hoặc gõ pinyin" : "") + "…" : "Gõ lại câu bạn nghe được…"}" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
          <div class="row gap-s"><button class="btn primary" id="check">Kiểm tra</button></div>
          <p id="res" class="dict-res"></p>
        </div>`;
      const play = (r) => speak(s.ex, r);
      $("#play").addEventListener("click", () => play(0.9));
      $("#slow").addEventListener("click", () => play(0.6));
      setTimeout(() => play(0.9), 300);
      const typed = $("#typed");
      typed.focus();
      typed.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#check").click(); } });
      $("#check").addEventListener("click", () => {
        if ($("#check").dataset.done) { i++; return i < sentences.length ? draw() : finish(); }
        const byPy = LANG.cjk && s.exPy && /[a-z]/i.test(typed.value) && !/\p{Script=Han}/u.test(typed.value);
        const tw = byPy ? normPy(s.exPy) : norm(s.ex), uw = byPy ? normPy(typed.value) : norm(typed.value);
        const { ok, hits, extra } = lcsMarks(tw, uw);
        const pct = Math.max(0, Math.round(((hits - extra * 0.5) / tw.length) * 100));
        scores.push(pct);
        const shown = byPy ? s.exPy : s.ex;
        const words = LANG.cjk && !byPy ? [...shown] : shown.split(/\s+/);
        let wi = 0;
        $("#res").innerHTML = `<strong>${pct}%</strong> · ` + words.map((w) => {
          const parts = byPy ? normPy(w) : norm(w);
          const good = parts.length ? parts.every(() => ok[wi++]) : true;
          return `<span class="${good ? "w-ok" : "w-bad"}">${esc(w)}</span>`;
        }).join(LANG.cjk && !byPy ? "" : " ") + (LANG.cjk ? `<br><span class="${byPy ? "w" : "py"}">${esc((byPy ? s.ex : s.exPy) || "")}</span>${s.exVi ? ` <span class="small muted">${esc(s.exVi)}</span>` : ""}` : "");
        $("#check").textContent = i + 1 < sentences.length ? "Câu tiếp →" : "Xem kết quả";
        $("#check").dataset.done = "1";
        typed.readOnly = true;
      });
    }
    function finish() {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      finishGame(g, avg, Math.round(avg / 4), false, `Chính xác trung bình ${avg}%`, () => gameDictation(pool));
    }
    draw();
  }

  routes.review = viewReview;
  routes.games = viewGames;
})();
