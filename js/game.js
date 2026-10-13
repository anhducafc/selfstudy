/* ==========================================================================
   Game hoá: huy hiệu, pháo giấy, thông báo XP / lên cấp
   ========================================================================== */
(function () {
  const S = window.Store;

  const doneList = () => S.allLessons().filter((l) => S.progress(l.id).done);
  const doneLessonsProg = () => Object.values(S.get().lessons).filter((p) => p.done);

  /* Danh sách huy hiệu — thêm huy hiệu mới chỉ cần thêm 1 dòng */
  const BADGES = [
    { id: "first-lesson", icon: "🌱", name: "Bước đầu tiên", desc: "Hoàn thành bài học đầu tiên", test: () => doneList().length >= 1 },
    { id: "lessons-10", icon: "📗", name: "Mười bài", desc: "Hoàn thành 10 bài", test: () => doneList().length >= 10 },
    { id: "lessons-25", icon: "📚", name: "Mọt sách", desc: "Hoàn thành 25 bài", test: () => doneList().length >= 25 },
    { id: "lessons-50", icon: "🏛️", name: "Thư viện sống", desc: "Hoàn thành 50 bài", test: () => doneList().length >= 50 },
    { id: "streak-3", icon: "🔥", name: "Bén lửa", desc: "Học 3 ngày liên tiếp", test: () => S.bestStreak() >= 3 },
    { id: "streak-7", icon: "🗓️", name: "Một tuần bền bỉ", desc: "Học 7 ngày liên tiếp", test: () => S.bestStreak() >= 7 },
    { id: "streak-30", icon: "🏅", name: "Thói quen thép", desc: "Học 30 ngày liên tiếp", test: () => S.bestStreak() >= 30 },
    { id: "streak-100", icon: "👑", name: "Trăm ngày", desc: "Học 100 ngày liên tiếp", test: () => S.bestStreak() >= 100 },
    { id: "daily-1", icon: "⭐", name: "Bài của ngày", desc: "Hoàn thành một Bài của ngày", test: () => S.get().game.dailyDone >= 1 },
    { id: "daily-10", icon: "🌟", name: "Đúng hẹn", desc: "Hoàn thành 10 Bài của ngày", test: () => S.get().game.dailyDone >= 10 },
    { id: "perfect", icon: "💯", name: "Tuyệt đối", desc: "Đạt 100% một bài quiz", test: () => Object.values(S.get().lessons).some((p) => p.perfect) },
    { id: "goal-1", icon: "🎯", name: "Trúng đích", desc: "Đạt mục tiêu phút/ngày", test: () => S.get().game.goalBonusDays.length >= 1 },
    { id: "hours-10", icon: "⏳", name: "Mười giờ vàng", desc: "Tổng 10 giờ học", test: () => S.totalMinutes() >= 600 },
    { id: "cards-50", icon: "🃏", name: "Lật thẻ", desc: "Ôn 50 lượt flashcard", test: () => S.get().game.cardReviews >= 50 },
    { id: "cards-300", icon: "🧠", name: "Trí nhớ voi", desc: "Ôn 300 lượt flashcard", test: () => S.get().game.cardReviews >= 300 },
    { id: "mastered-20", icon: "💎", name: "Thuộc lòng", desc: "20 từ lên hộp 5 (đã thuộc)", test: () => S.cardStats().mastered >= 20 },
    { id: "game-1", icon: "🎮", name: "Khởi động", desc: "Chơi mini game đầu tiên", test: () => S.get().game.plays >= 1 },
    { id: "speed-15", icon: "⚡", name: "Phản xạ nhanh", desc: "Đạt 15 điểm Đoán nhanh 60s", test: () => (S.get().game.best.speed || 0) >= 15 },
    { id: "dictation-90", icon: "✍️", name: "Tai thính", desc: "Chép chính tả đúng ≥ 90%", test: () => (S.get().game.best.dictation || 0) >= 90 },
    { id: "level-clear", icon: "🏆", name: "Phá đảo", desc: "Hoàn thành mọi bài soạn sẵn của một cấp", test: () => window.LEVELS.some((lv) => { const c = window.LESSONS.filter((l) => l.level === lv.id); return c.length && c.every((l) => S.progress(l.id).done); }) },
    { id: "c1-first", icon: "🎓", name: "Chạm C1", desc: "Hoàn thành một bài C1", test: () => doneList().some((l) => l.level === "C1") },
    { id: "early-bird", icon: "🐦", name: "Chim sớm", desc: "Hoàn thành bài trước 7 giờ sáng", test: () => doneLessonsProg().some((p) => p.doneHour != null && p.doneHour < 7) },
    { id: "night-owl", icon: "🦉", name: "Cú đêm", desc: "Hoàn thành bài sau 22 giờ", test: () => doneLessonsProg().some((p) => p.doneHour != null && p.doneHour >= 22) },
    { id: "freeze-used", icon: "🧊", name: "Cứu chuỗi", desc: "Streak freeze tự cứu chuỗi của bạn", test: () => S.get().game.frozenDays.length >= 1 },
    { id: "level-5", icon: "🚀", name: "Cấp 5", desc: "Đạt cấp người chơi 5", test: () => S.playerLevel().level >= 5 },
    { id: "level-10", icon: "🪐", name: "Cấp 10", desc: "Đạt cấp người chơi 10", test: () => S.playerLevel().level >= 10 }
  ];

  let checking = false;
  function checkBadges() {
    if (checking) return [];
    checking = true;
    const unlocked = [];
    try {
      BADGES.forEach((b) => {
        if (S.get().badges[b.id]) return;
        let ok = false;
        try { ok = b.test(); } catch (e) { console.warn("badge", b.id, e); }
        if (ok && S.unlockBadge(b.id)) unlocked.push(b);
      });
      S.awardFreezes();
    } finally { checking = false; }
    if (unlocked.length) setTimeout(() => unlocked.forEach(celebrateBadge), 300);
    return unlocked;
  }

  /* ---------------- pháo giấy (không dùng thư viện) ---------------- */
  function confetti(n = 120) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas");
    c.className = "confetti";
    const dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    const colors = ["#f6c453", "#2f9e6b", "#3366cc", "#7b4fc9", "#c25a1b", "#e45d8c"];
    const ps = Array.from({ length: n }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 13 - 4,
      r: Math.random() * 6 + 4, a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 0.3,
      c: colors[(Math.random() * colors.length) | 0]
    }));
    let t = 0;
    (function frame() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach((p) => {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore();
      });
      if (++t < 140) requestAnimationFrame(frame); else c.remove();
    })();
  }

  /* popup chạy lần lượt (hàng đợi) để không chồng lên nhau */
  const queue = [];
  let showing = false;
  function popup(html, ms = 2600, onShow) {
    queue.push({ html, ms, onShow });
    if (!showing) nextPopup();
  }
  function nextPopup() {
    const item = queue.shift();
    if (!item) { showing = false; return; }
    showing = true;
    const el = document.createElement("div");
    el.className = "celebrate";
    el.innerHTML = item.html + '<p class="small muted cel-hint">chạm để đóng</p>';
    document.body.appendChild(el);
    if (item.onShow) item.onShow();
    requestAnimationFrame(() => el.classList.add("show"));
    let closed = false;
    const close = () => {
      if (closed) return; closed = true;
      el.classList.remove("show");
      setTimeout(() => { el.remove(); nextPopup(); }, 280);
    };
    el.addEventListener("click", close);
    setTimeout(close, item.ms);
  }

  function celebrateBadge(b) {
    popup(`<div class="cel-icon">${b.icon}</div><p class="eyebrow">Huy hiệu mới</p><h2>${b.name}</h2><p class="muted">${b.desc}</p>`, 3000, () => confetti());
  }

  /* ---------------- lắng nghe sự kiện từ Store ---------------- */
  function xpFloat(amount) {
    const el = document.createElement("div");
    el.className = "xp-float";
    el.textContent = `+${amount} XP`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }

  document.addEventListener("ep:xp", (e) => {
    const { amount, reason, quiet } = e.detail;
    updateXpChip();
    if (!quiet) xpFloat(amount);
    if (!quiet && reason && window.UI) window.UI.toast(`${reason} · +${amount} XP`, "xp");
  });
  document.addEventListener("ep:levelup", (e) => {
    popup(`<div class="cel-icon">🚀</div><p class="eyebrow">Lên cấp!</p><h2>Cấp ${e.detail.level}</h2><p class="muted">Tiếp tục giữ nhịp nhé.</p>`, 3000, () => confetti(160));
  });
  document.addEventListener("ep:freeze", (e) => {
    setTimeout(() => popup(`<div class="cel-icon">🧊</div><p class="eyebrow">Streak freeze</p><h2>Chuỗi đã được cứu!</h2><p class="muted">Đã dùng ${e.detail.days.length} freeze cho ngày bạn lỡ học. Học hôm nay để tiếp tục chuỗi.</p>`, 4200), 600);
  });
  document.addEventListener("ep:freezeEarned", () => {
    window.UI && window.UI.toast("Chuỗi 7 ngày! Bạn nhận 1 streak freeze 🧊", "xp");
  });
  document.addEventListener("store:change", () => { checkBadges(); updateXpChip(); });

  function updateXpChip() {
    const chip = document.getElementById("xpChip");
    if (!chip) return;
    const lv = S.playerLevel();
    chip.innerHTML = `<span class="xc-lv">Cấp ${lv.level}</span><span class="xc-bar"><span style="width:${lv.pct}%"></span></span><span class="xc-xp">${S.get().xp.total} XP</span>`;
    chip.title = `Còn ${lv.next - S.get().xp.total} XP để lên cấp ${lv.level + 1}`;
    const due = S.cardStats().due;
    const dot = document.getElementById("reviewDot");
    if (dot) { dot.textContent = due > 99 ? "99+" : due; dot.hidden = !due; }
  }

  window.Game = { BADGES, checkBadges, confetti, popup, updateXpChip };
})();
