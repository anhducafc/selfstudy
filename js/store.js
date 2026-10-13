/* ==========================================================================
   Store — lưu tiến độ trong localStorage (không cần server, không cần login)
   Gồm: tiến độ bài, thời gian học, XP, huy hiệu, flashcard (Leitner), streak freeze.
   ========================================================================== */
(function () {
  const KEY = "englishPath.v1";

  /* Luật XP — sửa ở đây nếu muốn cân bằng lại */
  const XP = {
    lessonDone: 50,        // hoàn thành 1 bài
    dailyBonus: 50,        // cộng thêm nếu là Bài của ngày (= x2)
    quizCorrect: 5,        // mỗi câu đúng VƯỢT điểm cao nhất cũ
    quizPerfect: 20,       // lần đầu đạt 100%
    perMinute: 1,          // mỗi phút học
    goalReached: 20,       // đạt mục tiêu phút/ngày
    cardReview: 2,         // mỗi thẻ flashcard đã ôn
    gameDailyCap: 60       // trần XP từ mini game mỗi ngày
  };
  /* Khoảng cách ôn (ngày) theo hộp Leitner 1..5 */
  const BOX_DAYS = [0, 1, 2, 4, 9, 21];
  const MAX_FREEZES = 2;

  const empty = () => ({
    version: 2,
    profile: { name: "", level: null, test: null },
    lessons: {},          // id -> { done, doneAt, quizBest, quizTotal, notes, seconds, daily }
    days: {},             // "YYYY-MM-DD" -> giây đã học (có key = ngày có học)
    custom: [],           // bài học tự thêm
    settings: { theme: "auto", dailyGoal: 20 },
    xp: { total: 0, byDay: {}, secRemainder: 0 },
    badges: {},           // id -> ISO date
    cards: {},            // "lessonId::word" -> { w, vi, ex, lessonId, box, due, reviews, lapses, added }
    game: {
      freezes: 0, frozenDays: [], freezeAwardedAt: [], lastFreezeCheck: null,
      goalBonusDays: [], gameXpByDay: {}, best: {}, plays: 0, cardReviews: 0, dailyDone: 0
    }
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      const s = JSON.parse(raw);
      const base = empty();
      return {
        ...base, ...s,
        profile: { ...base.profile, ...(s.profile || {}) },
        settings: { ...base.settings, ...(s.settings || {}) },
        xp: { ...base.xp, ...(s.xp || {}) },
        game: { ...base.game, ...(s.game || {}) },
        lessons: s.lessons || {}, days: s.days || {}, custom: s.custom || [],
        badges: s.badges || {}, cards: s.cards || {}
      };
    } catch (e) {
      console.warn("Không đọc được dữ liệu, dùng dữ liệu trống.", e);
      return empty();
    }
  }

  let batching = false;
  function save() {
    if (batching) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn("Không lưu được (trình duyệt chặn localStorage?)", e); }
    document.dispatchEvent(new CustomEvent("store:change"));
  }
  const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

  const pad = (n) => String(n).padStart(2, "0");
  function dayKey(d = new Date()) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function addDays(key, n) {
    const d = new Date(key + "T12:00:00");
    d.setDate(d.getDate() + n);
    return dayKey(d);
  }

  function lesson(id) {
    if (!state.lessons[id]) state.lessons[id] = { done: false, seconds: 0, notes: "" };
    return state.lessons[id];
  }
  function markActive(k = dayKey()) { if (!(k in state.days)) state.days[k] = 0; }

  function gainXP(amount, reason, quiet = false) {
    amount = Math.round(amount);
    if (amount <= 0) return 0;
    const k = dayKey();
    const before = Store.playerLevel().level;
    state.xp.total += amount;
    state.xp.byDay[k] = (state.xp.byDay[k] || 0) + amount;
    emit("ep:xp", { amount, reason, quiet });
    const after = Store.playerLevel().level;
    if (after > before) emit("ep:levelup", { level: after });
    return amount;
  }

  const isActive = (k) => k in state.days || state.game.frozenDays.includes(k);

  const Store = {
    XP, BOX_DAYS,
    get: () => state,
    dayKey, addDays,

    allLessons() {
      return [...window.LESSONS, ...(window.AUTO_LESSONS || []), ...state.custom];
    },
    findLesson(id) { return this.allLessons().find((l) => l.id === id); },
    progress(id) { return state.lessons[id] || { done: false, seconds: 0, notes: "" }; },

    setProfile(patch) { Object.assign(state.profile, patch); save(); },
    setSetting(key, value) { state.settings[key] = value; save(); },

    /* ---------------- Bài của ngày ---------------- */
    dailyLesson(level = state.profile.level || "A1", key = dayKey()) {
      return window.Daily.lesson(this.allLessons(), level, key);
    },
    isDaily(id) {
      const d = this.dailyLesson();
      return !!d && d.id === id;
    },

    /* ---------------- Thời gian ---------------- */
    addTime(id, seconds) {
      if (!seconds || seconds < 0) return;
      const k = dayKey();
      const goalMin = state.settings.dailyGoal;
      const beforeMin = (state.days[k] || 0) / 60;
      state.days[k] = (state.days[k] || 0) + seconds;
      if (id) lesson(id).seconds = (lesson(id).seconds || 0) + seconds;

      // XP theo phút (giữ phần lẻ giây)
      const secs = state.xp.secRemainder + seconds;
      const mins = Math.floor(secs / 60);
      state.xp.secRemainder = secs % 60;
      if (mins) gainXP(mins * XP.perMinute, "Thời gian học", true);

      if (beforeMin < goalMin && state.days[k] / 60 >= goalMin && !state.game.goalBonusDays.includes(k)) {
        state.game.goalBonusDays.push(k);
        gainXP(XP.goalReached, "Đạt mục tiêu hôm nay 🎯");
      }
      save();
    },

    /* ---------------- Bài học ---------------- */
    setDone(id, done = true) {
      const p = lesson(id);
      const wasDone = p.done;
      p.done = done;
      p.doneAt = done ? new Date().toISOString() : null;
      if (done) {
        markActive();
        if (!p.xpAwarded) {                       // chỉ cộng XP lần đầu hoàn thành
          p.xpAwarded = true;
          const daily = this.isDaily(id);
          gainXP(XP.lessonDone + (daily ? XP.dailyBonus : 0), daily ? "Bài của ngày ×2 ⭐" : "Hoàn thành bài");
          if (daily) { p.daily = dayKey(); state.game.dailyDone++; }
          p.doneHour = new Date().getHours();
        }
        if (!wasDone) this.addCardsFor(id, true);
      }
      save();
    },

    saveQuiz(id, score, total) {
      const p = lesson(id);
      const oldBest = p.quizTotal === total ? (p.quizBest || 0) : 0;
      p.quizTotal = total;
      p.quizBest = Math.max(oldBest, score);
      p.quizLast = score;
      markActive();
      if (score > oldBest) gainXP((score - oldBest) * XP.quizCorrect, "Quiz");
      if (score === total && !p.perfect) { p.perfect = true; gainXP(XP.quizPerfect, "Quiz 100% 💯"); }
      save();
    },

    saveNotes(id, text) { lesson(id).notes = text; save(); },

    addCustom(l) { state.custom.push(l); save(); },
    removeCustom(id) {
      state.custom = state.custom.filter((l) => l.id !== id);
      delete state.lessons[id];
      Object.keys(state.cards).forEach((k) => { if (k.startsWith(id + "::")) delete state.cards[k]; });
      save();
    },

    /* ---------------- Flashcard (Leitner) ---------------- */
    addCardsFor(id, quiet = false) {
      const l = this.findLesson(id);
      if (!l || !l.vocab) return 0;
      let n = 0;
      l.vocab.forEach((v) => {
        const cid = `${id}::${v.w}`;
        if (state.cards[cid]) return;
        state.cards[cid] = { w: v.w, vi: v.vi, ex: v.ex || "", lessonId: id, box: 1, due: dayKey(), reviews: 0, lapses: 0, added: dayKey() };
        n++;
      });
      if (n && !quiet) save();
      if (n) emit("ep:cards", { added: n });
      return n;
    },
    hasCardsFor(id) { return Object.keys(state.cards).some((k) => k.startsWith(id + "::")); },
    dueCards(key = dayKey()) {
      return Object.entries(state.cards).filter(([, c]) => c.due <= key)
        .sort((a, b) => a[1].due.localeCompare(b[1].due) || a[1].box - b[1].box)
        .map(([id, c]) => ({ id, ...c }));
    },
    /** grade: 0 = quên, 1 = nhớ, 2 = dễ */
    reviewCard(cid, grade) {
      const c = state.cards[cid];
      if (!c) return;
      c.reviews++;
      if (grade === 0) { c.box = 1; c.lapses++; }
      else c.box = Math.min(5, c.box + grade);
      c.due = addDays(dayKey(), BOX_DAYS[c.box]);
      c.last = dayKey();
      state.game.cardReviews++;
      markActive();
      gainXP(XP.cardReview, "Flashcard", true);
      save();
    },
    cardStats() {
      const all = Object.values(state.cards);
      const boxes = [0, 0, 0, 0, 0, 0];
      all.forEach((c) => boxes[c.box]++);
      return { total: all.length, due: this.dueCards().length, mastered: boxes[5], boxes };
    },

    /* ---------------- Mini game ---------------- */
    gameResult(game, score, xpWanted, lowerIsBetter = false) {
      const k = dayKey();
      const best = state.game.best[game];
      const isBest = best == null || (lowerIsBetter ? score < best : score > best);
      if (isBest) state.game.best[game] = score;
      state.game.plays++;
      markActive();
      const used = state.game.gameXpByDay[k] || 0;
      const give = Math.max(0, Math.min(xpWanted, XP.gameDailyCap - used));
      state.game.gameXpByDay[k] = used + give;
      if (give) gainXP(give, "Mini game 🎮");
      save();
      return { isBest, xp: give, capped: give < xpWanted };
    },

    /* ---------------- XP & cấp độ người chơi ---------------- */
    /** Cấp n cần tổng 50·n·(n−1) XP: Cấp 2 = 100, Cấp 3 = 300, Cấp 4 = 600… */
    playerLevel(total = state.xp.total) {
      let n = 1;
      while (50 * (n + 1) * n <= total) n++;
      const floor = 50 * n * (n - 1), next = 50 * (n + 1) * n;
      return { level: n, floor, next, into: total - floor, need: next - floor, pct: Math.round(((total - floor) / (next - floor)) * 100) };
    },
    xpOn(k = dayKey()) { return state.xp.byDay[k] || 0; },

    unlockBadge(id) {
      if (state.badges[id]) return false;
      state.badges[id] = new Date().toISOString();
      save();
      return true;
    },

    /* ---------------- Streak & freeze ---------------- */
    /** Gọi khi mở trang: dùng streak freeze để lấp những ngày bị lỡ (tối đa số freeze đang có) */
    applyFreezes() {
      const today = dayKey();
      const g = state.game;
      if (g.lastFreezeCheck === today) return [];
      g.lastFreezeCheck = today;
      const used = [];
      const yesterday = addDays(today, -1);
      if (!isActive(yesterday)) {
        // tìm ngày học gần nhất trong 30 ngày
        let k = yesterday, gap = [];
        for (let i = 0; i < 30 && !isActive(k); i++) { gap.push(k); k = addDays(k, -1); }
        if (isActive(k) && gap.length <= g.freezes) {
          gap.forEach((d) => g.frozenDays.push(d));
          g.freezes -= gap.length;
          used.push(...gap);
        }
      }
      save();
      if (used.length) emit("ep:freeze", { days: used });
      return used;
    },
    /** Mỗi mốc 7 ngày liên tiếp được tặng 1 freeze (tối đa 2) */
    awardFreezes() {
      const s = this.streak();
      const g = state.game;
      if (s > 0 && s % 7 === 0 && !g.freezeAwardedAt.includes(dayKey()) && g.freezes < MAX_FREEZES && dayKey() in state.days) {
        g.freezeAwardedAt.push(dayKey());
        g.freezes++;
        save();
        emit("ep:freezeEarned", { freezes: g.freezes });
      }
    },

    /* ---------------- Thống kê ---------------- */
    minutesOn(key) { return Math.round((state.days[key] || 0) / 60); },

    lastNDays(n) {
      const out = [];
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      for (let i = n - 1; i >= 0; i--) {
        const x = new Date(d);
        x.setDate(d.getDate() - i);
        const k = dayKey(x);
        out.push({ key: k, date: x, minutes: Math.round((state.days[k] || 0) / 60), xp: state.xp.byDay[k] || 0, frozen: state.game.frozenDays.includes(k) });
      }
      return out;
    },

    isActive,
    studiedToday() { return dayKey() in state.days; },

    /** Chuỗi ngày học liên tiếp (tính cả ngày được freeze). Hôm nay chưa học vẫn giữ chuỗi tới hôm qua. */
    streak() {
      let k = dayKey();
      let count = 0;
      if (!isActive(k)) k = addDays(k, -1);
      while (isActive(k)) { count++; k = addDays(k, -1); }
      return count;
    },

    bestStreak() {
      const keys = [...new Set([...Object.keys(state.days), ...state.game.frozenDays])].sort();
      let best = 0, run = 0, prev = null;
      for (const k of keys) {
        if (prev && addDays(prev, 1) === k) run++; else run = 1;
        best = Math.max(best, run);
        prev = k;
      }
      return best;
    },

    totalMinutes() {
      return Math.round(Object.values(state.days).reduce((a, b) => a + b, 0) / 60);
    },

    statsBy(filterFn) {
      const list = this.allLessons().filter(filterFn);
      const done = list.filter((l) => this.progress(l.id).done).length;
      return { total: list.length, done, pct: list.length ? Math.round((done / list.length) * 100) : 0 };
    },

    /** Bài tiếp theo nên học: bài chưa xong đầu tiên từ trình độ hiện tại trở lên (ưu tiên bài soạn sẵn) */
    nextLesson() {
      const order = window.LEVELS.map((l) => l.id);
      const start = Math.max(0, order.indexOf(state.profile.level || "A1"));
      const core = [...window.LESSONS, ...state.custom];
      for (const lv of order.slice(start)) {
        const l = core.find((x) => x.level === lv && !this.progress(x.id).done);
        if (l) return l;
      }
      return this.allLessons().find((x) => !this.progress(x.id).done) || null;
    },

    /** Batch nhiều thay đổi rồi lưu 1 lần */
    batch(fn) { batching = true; try { fn(); } finally { batching = false; save(); } },

    /* ---------------- Sao lưu ---------------- */
    exportJSON() { return JSON.stringify({ app: "english-path", exportedAt: new Date().toISOString(), ...state }, null, 2); },
    importJSON(text) {
      const data = JSON.parse(text);
      if (!data || typeof data !== "object" || !("lessons" in data)) throw new Error("File không đúng định dạng English Path.");
      delete data.app; delete data.exportedAt;
      localStorage.setItem(KEY, JSON.stringify(data));
      state = load();
      save();
    },
    reset() { state = empty(); save(); }
  };

  window.Store = Store;
})();
