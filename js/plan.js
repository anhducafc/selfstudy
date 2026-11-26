/* ==========================================================================
   Kế hoạch học theo giai đoạn + thi cuối kỳ
   --------------------------------------------------------------------------
   Chỉ bật khi trang ngôn ngữ có window.STUDY_PLAN (vd zh/js/plan-data.js).
   Trang:  #/plan[/<giai đoạn>]   lịch học theo tuần, buổi học, tự đánh giá
           #/exam/<giai đoạn>     bài thi cuối kỳ (câu soạn sẵn + câu tự sinh từ từ vựng)
   Lịch tự tính từ ngày bắt đầu; tuần “nghỉ” làm toàn bộ lịch phía sau lùi 1 tuần.
   ========================================================================== */
(function () {
  "use strict";
  const PLAN = window.STUDY_PLAN;
  if (!PLAN || !window.UI || !window.Store) return;
  const { $, $$, esc, shuffle, toast, speak, routes, app } = window.UI;
  const S = window.Store;
  const LANG = window.LANG;

  /* ---------------------------- ngày tháng ---------------------------- */
  const pad = (n) => String(n).padStart(2, "0");
  const parse = (k) => new Date(k + "T12:00:00");
  const mondayOf = (d = new Date()) => { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return S.dayKey(x); };
  const defaultStart = () => { const t = new Date(); return t.getDay() === 1 ? S.dayKey(t) : S.addDays(mondayOf(t), 7); };
  const dm = (k) => { const d = parse(k); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
  const dmy = (k) => `${dm(k)}/${parse(k).getFullYear()}`;
  const OFFS = PLAN.days.map((d) => (d + 6) % 7);           // Thứ 2 = 0, Thứ 4 = 2, Thứ 6 = 4
  const isExamSession = (s) => /^📝/.test(s.t);

  /* ---------------------------- dựng lịch ---------------------------- */
  function build() {
    const st = S.plan();
    const start = st.start || defaultStart();
    const pauses = new Set(st.pauses || []);
    let cal = mondayOf(parse(start));
    const all = [];
    const phases = PLAN.phases.map((ph, pi) => {
      const out = { ...ph, idx: pi, rows: [] };
      ph.weeks.forEach((w, wi) => {
        while (pauses.has(cal)) { out.rows.push({ pause: true, monday: cal }); cal = S.addDays(cal, 7); }
        const row = { ...w, n: wi + 1, monday: cal, id: `${ph.id}-w${wi + 1}` };
        row.sessions = w.sessions.map((s, si) => ({ ...s, id: `${ph.id}-w${wi + 1}-${si + 1}`, date: S.addDays(cal, OFFS[si] ?? si * 2), day: PLAN.dayNames[si] || "", phase: out, week: row }));
        row.sessions.forEach((s) => { s.n = all.push(s); });
        out.rows.push(row);
        cal = S.addDays(cal, 7);
      });
      const real = out.rows.filter((r) => !r.pause);
      out.from = real[0].sessions[0].date;
      out.to = real[real.length - 1].sessions[real[real.length - 1].sessions.length - 1].date;
      out.total = real.reduce((a, r) => a + r.sessions.length, 0);
      out.done = real.reduce((a, r) => a + r.sessions.filter((s) => st.sessions[s.id]).length, 0);
      out.exam = { ...ph.exam, state: (st.exams || {})[ph.id] || null };
      out.passed = !!(out.exam.state && out.exam.state.passedAt);
      return out;
    });
    const today = S.dayKey();
    const next = all.find((s) => !st.sessions[s.id]) || null;
    const todays = all.find((s) => s.date === today) || null;
    const due = all.filter((s) => s.date <= today);
    const behind = due.filter((s) => !st.sessions[s.id]).length;
    const current = phases.find((p) => !p.passed) || phases[phases.length - 1];
    return { st, start, started: !!st.start, phases, all, next, todays, today, behind, current,
      doneCount: all.filter((s) => st.sessions[s.id]).length };
  }

  /* ---------------------------- thẻ trang chủ ---------------------------- */
  function homeCard() {
    const b = build();
    if (!b.started) {
      return `<a class="card plan-home" href="#/plan">
        <span class="q-icon">📅</span>
        <span><strong>Kế hoạch học từ số 0 · 4 giai đoạn</strong>
        <span class="muted small">${esc(PLAN.dayNames.join(" – "))} · ${PLAN.minutes} phút/buổi · có thi cuối kỳ. Chọn ngày bắt đầu →</span></span></a>`;
    }
    const s = b.todays && !b.st.sessions[b.todays.id] ? b.todays : b.next;
    if (!s) return `<a class="card plan-home" href="#/plan"><span class="q-icon">🎓</span><span><strong>Bạn đã đi hết kế hoạch!</strong><span class="muted small">Xem lại kết quả các bài thi →</span></span></a>`;
    const isToday = s.date === b.today;
    return `<a class="card plan-home ${isToday ? "is-today" : ""}" href="#/plan/${s.phase.id}">
      <span class="q-icon">${isExamSession(s) ? "📝" : "📅"}</span>
      <span><span class="eyebrow">${isToday ? "Buổi học hôm nay" : "Buổi tiếp theo"} · ${esc(s.phase.short)} · Tuần ${s.week.n}</span>
      <strong>Buổi ${s.n}: ${esc(s.t)}</strong>
      <span class="muted small">${esc(s.day)} ${dm(s.date)} · ${PLAN.minutes} phút${b.behind > 0 ? ` · đang chậm ${b.behind} buổi so với lịch` : ""}</span></span>
      <span class="btn primary sm">Mở kế hoạch →</span></a>`;
  }

  /* ============================== TRANG KẾ HOẠCH ============================== */
  function viewPlan(arg) {
    const openWeeks = new Set();
    let firstDraw = true;

    function draw() {
      const b = build();
      const ph = b.phases.find((p) => p.id === arg) || b.current;
      if (firstDraw) {
        const focus = (b.todays && b.todays.phase === ph && b.todays) || (b.next && b.next.phase === ph && b.next) || null;
        if (focus) openWeeks.add(focus.week.id);
        else { const r = ph.rows.find((x) => !x.pause); if (r) openWeeks.add(r.id); }
        firstDraw = false;
      }
      const showSess = b.todays && !b.st.sessions[b.todays.id] ? b.todays : b.next;
      const passedN = b.phases.filter((p) => p.passed).length;

      app.innerHTML = `
        <section class="plan-head">
          <p class="eyebrow">Kế hoạch học</p>
          <h1>${esc(PLAN.title)}</h1>
          <p class="muted">${esc(PLAN.intro)}</p>
          <div class="plan-meta">
            <span class="pill">📅 ${esc(PLAN.dayNames.join(" – "))}</span>
            <span class="pill">⏱️ ${PLAN.minutes} phút/buổi</span>
            <label class="start-pick">Ngày bắt đầu <input type="date" id="planStart" value="${b.start}"></label>
          </div>
        </section>

        ${!b.started ? `
        <section class="card plan-start">
          <h2>Bắt đầu kế hoạch</h2>
          <p class="muted">Chọn ngày học buổi đầu tiên (nên là một ngày Thứ 2) — lịch ${b.all.length} buổi sẽ tự xếp theo ${esc(PLAN.dayNames.join(", "))}. Bạn có thể đổi ngày hoặc cho nghỉ một tuần bất cứ lúc nào.</p>
          <button class="btn primary" id="startPlan">Bắt đầu từ ${esc(dmy(b.start))}</button>
        </section>` : ""}

        ${showSess ? sessionHero(showSess, b) : `<section class="card"><h2>🎓 Đã hoàn thành mọi buổi trong kế hoạch</h2><p class="muted">Ôn lại bằng flashcard, xem video mới mỗi ngày và thử thi lại để giữ phong độ.</p></section>`}

        <section class="stat-row four">
          ${UI.tile("✅", `${b.doneCount}/${b.all.length}`, "buổi đã học")}
          ${UI.tile("🧭", esc(b.current.short), esc(b.current.name))}
          ${UI.tile("🎓", `${passedN}/${b.phases.length}`, "bài thi cuối kỳ đã đạt")}
          ${UI.tile(b.behind > 0 ? "⏳" : "👍", b.behind > 0 ? b.behind : "Đúng lịch", b.behind > 0 ? "buổi đang chậm so với lịch" : "theo ngày bắt đầu")}
        </section>

        <nav class="ph-steps" aria-label="Các giai đoạn">
          ${b.phases.map((p) => `<a class="ph-step ${p.id === ph.id ? "active" : ""} ${p.passed ? "passed" : ""}" href="#/plan/${p.id}">
            <span class="ph-n">${p.passed ? "✓" : p.idx + 1}</span>
            <span class="ph-t"><strong>${esc(p.name)}</strong><span class="small muted">${dm(p.from)} → ${dmy(p.to)}</span>
            <span class="bar"><span style="width:${Math.round((p.done / p.total) * 100)}%"></span></span></span></a>`).join("")}
        </nav>

        ${phaseDetail(ph, b)}
        <p class="muted small center">${esc(PLAN.offDays)}</p>`;

      bind(b);
    }

    function sessionHero(s, b) {
      const isToday = s.date === b.today;
      const late = s.date < b.today;
      return `<section class="card plan-next ${isToday ? "is-today" : ""}">
        <div class="row between wrap">
          <span class="eyebrow">${isToday ? "⭐ Buổi học hôm nay" : late ? "Buổi cần học tiếp (đã qua ngày dự kiến)" : "Buổi tiếp theo"} · ${esc(s.phase.short)} · Tuần ${s.week.n}</span>
          <span class="small muted">${esc(s.day)} ${dmy(s.date)}</span>
        </div>
        <h2>Buổi ${s.n}: ${esc(s.t)}</h2>
        ${sessionBody(s, true)}
        <div class="row gap-s wrap">
          ${isExamSession(s) ? `<a class="btn primary" href="#/exam/${s.phase.id}">📝 Vào thi</a>` : ""}
          <button class="btn ${isExamSession(s) ? "ghost" : "primary"}" data-done="${esc(s.id)}">✓ Xong buổi này (+${S.XP.planSession} XP)</button>
        </div>
      </section>`;
    }

    function sessionBody(s, big = false) {
      const lessons = s.lessons.map((id) => S.findLesson(id)).filter(Boolean);
      return `
        ${lessons.length ? `<div class="sess-lessons">${lessons.map((l) => {
          const done = S.progress(l.id).done;
          return `<a class="sess-lesson ${done ? "done" : ""}" href="#/lesson/${esc(l.id)}"><span>${done ? "✓" : l.source.type === "youtube" ? "▶" : "↗"}</span>
            <span><strong>${esc(l.titleVi || l.title)}</strong><em class="small muted">${esc(l.source.provider)} · ~${l.minutes} phút</em></span></a>`;
        }).join("")}</div>` : ""}
        ${s.tasks.length ? `<ul class="sess-tasks ${big ? "" : "small"}">${s.tasks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}`;
    }

    function phaseDetail(ph, b) {
      const st = b.st;
      const ex = ph.exam, es = ex.state;
      const qn = ex.questions.length + (ex.auto || 0);
      return `
        <section class="card ph-detail">
          <div class="card-head"><h2>${esc(ph.short)} · ${esc(ph.name)}</h2><span class="pill">${esc(ph.range)}</span></div>
          <p class="small muted">📆 ${dmy(ph.from)} → ${dmy(ph.to)} · ${ph.done}/${ph.total} buổi · cấp trong lộ trình: ${ph.levels.map((l) => `<a class="lv-badge sm lv-${l}" href="#/roadmap/${l}">${l}</a>`).join(" ")}</p>
          <p>${esc(ph.goal)}</p>
          <div class="grid2 ph-grid">
            <div><h3>🎯 Đầu ra cần đạt</h3><ul class="ticks">${ph.outcomes.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>
            <div><h3>📚 Sách vở & công cụ</h3><ul class="ticks">${ph.books.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>
          </div>
          <h3>⏱️ Một buổi ${PLAN.minutes} phút</h3>
          <div class="tmpl">${ph.template.map(([m, t], i) => `<div class="tmpl-seg s${i}" style="flex:${m}"><strong>${m}′</strong><span>${esc(t)}</span></div>`).join("")}</div>
        </section>

        <section class="weeks">
          ${ph.rows.map((r) => r.pause ? `
            <div class="wk paused"><span>⏸ Tuần nghỉ ${dm(r.monday)} – ${dm(S.addDays(r.monday, 6))}</span>
              <button class="btn ghost sm" data-pause="${r.monday}">Bỏ nghỉ</button></div>` : weekRow(r, b)).join("")}
        </section>

        <section class="card exam-card ${ph.passed ? "passed" : ""}" id="exam">
          <div class="card-head"><h2>📝 ${esc(ex.title)}</h2>
            <span class="pill ${ph.passed ? "ok" : ""}">${ph.passed ? `✓ Đạt ${dm(es.passedAt.slice(0, 10))}` : `Đạt khi ≥ ${Math.round(ex.pass * 100)}%`}</span></div>
          <p class="muted">${qn} câu · khoảng ${ex.minutes} phút. ${esc(ex.note || "")}</p>
          ${es ? `<p>Điểm cao nhất: <strong>${es.best}/${es.total}</strong> (${Math.round((es.best / es.total) * 100)}%) · đã thi ${es.attempts} lần.</p>` : ""}
          <a class="btn primary" href="#/exam/${ph.id}">${es ? "Thi lại" : "Làm bài thi"}</a>
          <h3>✅ Tự đánh giá (nói & viết — tự chấm, đánh dấu khi làm được)</h3>
          <ul class="checklist">${ex.checklist.map((c, i) => {
            const id = `${ph.id}-c${i}`;
            return `<li><label><input type="checkbox" data-check="${id}" ${st.checks[id] ? "checked" : ""}> <span>${esc(c)}</span></label></li>`;
          }).join("")}</ul>
        </section>`;
    }

    function weekRow(r, b) {
      const st = b.st;
      const done = r.sessions.filter((s) => st.sessions[s.id]).length;
      const isNow = b.today >= r.monday && b.today <= S.addDays(r.monday, 6);
      return `<details class="wk ${done === r.sessions.length ? "complete" : ""} ${isNow ? "now" : ""}" data-week="${r.id}" ${openWeeks.has(r.id) ? "open" : ""}>
        <summary><span class="wk-n">T${r.n}</span><span class="wk-t"><strong>${esc(r.title.replace(/^Tuần \d+ · /, ""))}</strong>
          <span class="small muted">${dm(r.monday)} – ${dm(S.addDays(r.monday, 4))}${isNow ? " · tuần này" : ""}</span></span>
          <span class="wk-c">${done}/${r.sessions.length}</span></summary>
        ${r.note ? `<p class="banner small">${esc(r.note)}</p>` : ""}
        ${r.phrases ? `<div class="phrases"><span class="eyebrow">Từ khoá chủ đề</span><ul>${r.phrases.map((p) => `<li><button class="say sm" data-say="${esc(p.w)}" title="Nghe">🔊</button> <strong class="w">${esc(p.w)}</strong> <span class="py">${esc(p.py)}</span> <span class="muted">— ${esc(p.vi)}</span></li>`).join("")}</ul></div>` : ""}
        <ol class="sess-list">${r.sessions.map((s) => {
          const ok = !!st.sessions[s.id];
          return `<li class="sess ${ok ? "done" : ""} ${s.date === b.today ? "today" : ""}">
            <label class="chk" title="Đánh dấu đã học buổi này"><input type="checkbox" data-sess="${esc(s.id)}" ${ok ? "checked" : ""}><span></span></label>
            <div class="sess-main">
              <div class="sess-top"><strong>Buổi ${s.n} · ${esc(s.day)} ${dm(s.date)}</strong> <span>${esc(s.t)}</span>${s.date === b.today ? ' <span class="pill daily">Hôm nay</span>' : ""}</div>
              ${sessionBody(s)}
              ${isExamSession(s) ? `<a class="btn primary sm" href="#/exam/${s.phase.id}">📝 Vào thi</a>` : ""}
            </div></li>`;
        }).join("")}</ol>
        <p class="wk-foot"><button class="btn ghost sm" data-pause="${r.monday}" title="Lùi toàn bộ lịch từ tuần này về sau 1 tuần">⏸ Nghỉ tuần ${dm(r.monday)} (lùi lịch 1 tuần)</button></p>
      </details>`;
    }

    function bind(b) {
      const start = $("#planStart");
      start.addEventListener("change", () => {
        if (!start.value) return;
        S.setPlanStart(start.value);
        toast(`Lịch bắt đầu từ ${dmy(start.value)}`);
        draw();
      });
      const go = $("#startPlan");
      if (go) go.addEventListener("click", () => {
        S.setPlanStart(b.start);
        if (!S.get().profile.level) S.setProfile({ level: PLAN.phases[0].levels[0] });
        toast("Bắt đầu thôi! 加油 jiāyóu 💪", "ok");
        draw();
      });
      $$("[data-sess]", app).forEach((c) => c.addEventListener("change", () => {
        if (!S.plan().start) S.setPlanStart(b.start);
        S.setSession(c.dataset.sess, c.checked);
        draw();
      }));
      $$("[data-done]", app).forEach((x) => x.addEventListener("click", () => {
        if (!S.plan().start) S.setPlanStart(b.start);
        S.setSession(x.dataset.done, true);
        if (window.Game) Game.confetti(60);
        toast("Xong một buổi — giỏi lắm! 🎉", "ok");
        draw();
      }));
      $$("[data-check]", app).forEach((c) => c.addEventListener("change", () => { S.setCheck(c.dataset.check, c.checked); }));
      $$("[data-pause]", app).forEach((x) => x.addEventListener("click", () => {
        if (!S.plan().start) S.setPlanStart(b.start);
        const was = (S.plan().pauses || []).includes(x.dataset.pause);
        S.togglePause(x.dataset.pause);
        toast(was ? "Đã bỏ tuần nghỉ" : `Nghỉ tuần ${dm(x.dataset.pause)} — lịch phía sau lùi 1 tuần`);
        draw();
      }));
      $$("details.wk", app).forEach((d) => d.addEventListener("toggle", () => { d.open ? openWeeks.add(d.dataset.week) : openWeeks.delete(d.dataset.week); }));
      $$(".say", app).forEach((x) => x.addEventListener("click", (e) => { e.preventDefault(); speak(x.dataset.say); }));
    }

    draw();
  }

  /* ============================== BÀI THI CUỐI KỲ ============================== */
  const plain = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ü/g, "v").toLowerCase().replace(/[^a-z0-9]/g, "");
  const hanOnly = (s) => String(s || "").replace(/[^\p{Script=Han}a-zA-Z0-9]/gu, "");
  function fillOk(val, q) {
    if (hanOnly(val) && hanOnly(val) === hanOnly(q.answer)) return true;
    return !!q.py && plain(val) !== "" && plain(val) === plain(q.py);
  }

  function buildExam(ph) {
    const ex = ph.exam;
    const qs = ex.questions.map((q) => {
      if (q.type === "fill") return { ...q };
      const options = shuffle(q.options);
      return { ...q, type: "mc", options, answer: options.indexOf(q.options[q.answer]) };
    });
    const n = ex.auto || 0;
    if (n) {
      const pool = [];
      const seen = new Set();
      window.LESSONS.filter((l) => ph.levels.includes(l.level)).forEach((l) => (l.vocab || []).forEach((v) => {
        if (!seen.has(v.w) && v.vi) { seen.add(v.w); pool.push(v); }
      }));
      const pick = shuffle(pool).slice(0, n);
      pick.forEach((v, i) => {
        if (i % 2 === 0) {
          const wrong = shuffle(pool.filter((x) => x !== v && x.vi !== v.vi)).slice(0, 3).map((x) => x.vi);
          const options = shuffle([v.vi, ...wrong]);
          qs.push({ type: "mc", q: `“${v.w}” (${v.py}) nghĩa là gì?`, options, answer: options.indexOf(v.vi), auto: true });
        } else if (v.ex && v.ex.includes(v.w)) {
          qs.push({ type: "fill", q: v.ex.replace(v.w, "_____"), answer: v.w, py: v.py, hint: v.vi, explain: v.ex + (v.exVi ? ` — ${v.exVi}` : ""), auto: true });
        } else {
          qs.push({ type: "fill", q: `Viết từ “${v.vi}”`, answer: v.w, py: v.py, hint: v.vi, auto: true });
        }
      });
    }
    return qs;
  }

  function viewExam(id) {
    const b = build();
    const ph = b.phases.find((p) => p.id === id);
    if (!ph) { location.hash = "#/plan"; return; }
    const ex = ph.exam;
    let qs = buildExam(ph);
    const t0 = Date.now();

    function draw() {
      app.innerHTML = `
        <nav class="crumbs"><a href="#/plan/${ph.id}">Kế hoạch · ${esc(ph.short)}</a> / <span>Thi cuối kỳ</span></nav>
        <section class="narrow">
          <p class="eyebrow">📝 Thi cuối kỳ · ${esc(ph.short)}</p>
          <h1>${esc(ex.title)}</h1>
          <p class="muted">${qs.length} câu · khoảng ${ex.minutes} phút · đạt khi ≥ ${Math.round(ex.pass * 100)}%. ${esc(ex.note || "")}</p>
          <form id="examForm" class="card quiz exam">
            ${qs.map((q, i) => `
              <fieldset class="qz" data-i="${i}">
                <legend><span class="qn">${i + 1}</span> ${q.say ? `<button type="button" class="say ex-say" data-say="${esc(q.say)}" title="Nghe (bấm lại để nghe lần nữa)">🔊</button> ` : ""}${q.type === "fill" && q.q.includes("_____") ? "Điền từ: " : ""}${esc(q.q).replace("_____", '<span class="blank">_____</span>')}</legend>
                ${q.py && q.type === "mc" ? `<p class="py">${esc(q.py)}</p>` : ""}
                ${q.type === "mc"
                  ? `<div class="qz-opts">${q.options.map((o, k) => `<label><input type="radio" name="q${i}" value="${k}"> <span>${esc(o)}</span></label>`).join("")}</div>`
                  : `<input class="fill" name="q${i}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="gợi ý: ${esc(q.hint || "")} — gõ chữ Hán hoặc pinyin">`}
                <p class="fb"></p>
              </fieldset>`).join("")}
            <div class="row gap-s"><button class="btn primary lg" type="submit">Nộp bài</button><a class="btn ghost" href="#/plan/${ph.id}">Thoát</a></div>
            <div id="examResult"></div>
          </form>
        </section>`;

      $$(".ex-say", app).forEach((x) => x.addEventListener("click", () => speak(x.dataset.say, 0.85)));
      $("#examForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const blank = qs.filter((q, i) => q.type === "mc" ? !$(`input[name="q${i}"]:checked`, app) : !$(`input[name="q${i}"]`, app).value.trim()).length;
        if (blank && !confirm(`Còn ${blank} câu chưa làm. Vẫn nộp bài?`)) return;
        grade();
      });
    }

    function grade() {
      let score = 0;
      qs.forEach((q, i) => {
        const fs = $(`.qz[data-i="${i}"]`, app);
        let ok;
        if (q.type === "mc") {
          const picked = $(`input[name="q${i}"]:checked`, fs);
          ok = picked && Number(picked.value) === q.answer;
          $$("label", fs).forEach((lab, k) => {
            lab.classList.toggle("right", k === q.answer);
            lab.classList.toggle("wrong", !!picked && Number(picked.value) === k && k !== q.answer);
          });
        } else ok = fillOk($(".fill", fs).value, q);
        if (ok) score++;
        fs.classList.toggle("is-right", !!ok);
        fs.classList.toggle("is-wrong", !ok);
        const ans = q.type === "mc" ? q.options[q.answer] : `${q.answer}${q.py ? ` (${q.py})` : ""}`;
        $(".fb", fs).innerHTML = ok ? "✓ Chính xác" : `✗ Đáp án: <strong>${esc(ans)}</strong>${q.explain ? ` — ${esc(q.explain)}` : ""}${q.say ? ` · Câu đọc: <span class="w">${esc(q.say)}</span>` : ""}`;
      });
      $$("input", $("#examForm")).forEach((x) => { x.disabled = true; });
      const total = qs.length;
      const pct = Math.round((score / total) * 100);
      const passed = score / total >= ex.pass;
      const wasPassed = ph.passed;
      const rec = S.saveExam(ph.id, score, total, passed);
      let lvMsg = "";
      if (passed && ph.nextLevel) {
        const order = window.LEVELS.map((l) => l.id);
        const cur = S.get().profile.level;
        if (order.indexOf(cur) < order.indexOf(ph.nextLevel)) { S.setProfile({ level: ph.nextLevel }); lvMsg = ` Trình độ hiện tại đã chuyển sang <strong>${ph.nextLevel}</strong>.`; }
      }
      const nextPh = PLAN.phases[ph.idx + 1];
      const mins = Math.max(1, Math.round((Date.now() - t0) / 60000));
      if (passed && window.Game) Game.confetti(140);
      const res = $("#examResult");
      res.innerHTML = `
        <div class="exam-result ${passed ? "good" : "bad"}">
          <div class="big">${score}/${total} <small>(${pct}%)</small></div>
          <div><strong>${passed ? (wasPassed ? "Đạt ✓ (bạn đã đạt giai đoạn này trước đó)" : "🎓 Chúc mừng! Bạn đã qua giai đoạn này.") : `Chưa đạt — cần ≥ ${Math.round(ex.pass * 100)}%.`}</strong>
          <p class="small">Làm trong ${mins} phút · điểm cao nhất ${rec.best}/${rec.total} · lần thi thứ ${rec.attempts}.${lvMsg}</p>
          <p class="small">${passed ? (nextPh ? `Tiếp theo: ${esc(nextPh.name)}. Đừng quên phần <a href="#/plan/${ph.id}">Tự đánh giá</a> nói & viết.` : "Bạn đã hoàn thành cả 4 giai đoạn — học lại vòng chủ đề mới với tài liệu khó hơn nhé!") : "Xem lại các câu sai bên trên, mở lại bài tương ứng trong lộ trình, ôn 2–3 buổi rồi thi lại (đề sẽ xáo và đổi câu từ vựng)."}</p>
          <div class="row gap-s wrap">${passed && nextPh ? `<a class="btn primary" href="#/plan/${nextPh.id}">Sang ${esc(nextPh.short)} →</a>` : ""}<button class="btn ghost" type="button" id="retake">Thi lại đề mới</button><a class="btn ghost" href="#/plan/${ph.id}">Về kế hoạch</a></div></div>
        </div>`;
      $("#retake").addEventListener("click", () => { qs = buildExam(ph); draw(); window.scrollTo(0, 0); });
      res.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    draw();
  }

  routes.plan = viewPlan;
  routes.exam = viewExam;
  window.Plan = { homeCard, build };
})();
