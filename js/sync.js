/* ==========================================================================
   Tài khoản & đồng bộ tiến trình (Cloudflare Pages Functions + D1)
   - Trang chạy trên GitHub Pages (không có /api) → tự ẩn, học như cũ bằng localStorage.
   - Đăng nhập → gộp tiến trình trên máy với tiến trình trên tài khoản, rồi tự lưu mỗi khi có thay đổi.
   Route: #/login[/mã-lỗi|register], #/reset/<token>, #/account[/welcome|verified|verify-failed]
   ========================================================================== */
(function () {
  "use strict";
  const S = window.Store;

  /* ---------------- gộp 2 bản tiến trình (thuần, không phụ thuộc DOM) ---------------- */
  const maxNum = (a, b) => Math.max(Number(a) || 0, Number(b) || 0);
  const union = (a, b) => [...new Set([...(a || []), ...(b || [])])];
  const minDate = (a, b) => (!a ? b : !b ? a : a < b ? a : b);
  const perKeyMax = (a = {}, b = {}) => {
    const o = { ...a };
    for (const [k, v] of Object.entries(b)) o[k] = maxNum(o[k], v);
    return o;
  };

  function mergeLesson(a = {}, b = {}) {
    const done = !!(a.done || b.done);
    const notes = (a.notes || "").length >= (b.notes || "").length ? a.notes || "" : b.notes || "";
    const sameQuiz = a.quizTotal && a.quizTotal === b.quizTotal;
    const quizSrc = (b.quizBest || 0) > (a.quizBest || 0) ? b : a;
    return {
      ...a, ...b,
      done,
      doneAt: done ? minDate(a.done && a.doneAt, b.done && b.doneAt) : null,
      seconds: maxNum(a.seconds, b.seconds),
      notes,
      quizTotal: sameQuiz ? a.quizTotal : quizSrc.quizTotal,
      quizBest: sameQuiz ? maxNum(a.quizBest, b.quizBest) : quizSrc.quizBest,
      xpAwarded: !!(a.xpAwarded || b.xpAwarded),
      perfect: !!(a.perfect || b.perfect),
      daily: a.daily || b.daily,
      doneHour: a.doneHour ?? b.doneHour
    };
  }

  function mergeCards(a = {}, b = {}) {
    const o = { ...a };
    for (const [k, c] of Object.entries(b)) {
      const x = o[k];
      // giữ thẻ được ôn nhiều hơn (gần đây hơn nếu bằng nhau)
      if (!x || (c.reviews || 0) > (x.reviews || 0) || ((c.reviews || 0) === (x.reviews || 0) && (c.last || "") > (x.last || ""))) o[k] = c;
    }
    return o;
  }

  function mergeBest(a = {}, b = {}) {
    const o = { ...a };
    for (const [k, v] of Object.entries(b)) {
      if (o[k] == null) o[k] = v;
      else o[k] = k === "match" ? Math.min(o[k], v) : Math.max(o[k], v);   // Ghép từ: thời gian thấp là tốt
    }
    return o;
  }

  /** local = máy này, remote = tài khoản. Không bao giờ làm mất tiến trình của bên nào. */
  function merge(local, remote) {
    if (!remote) return local;
    if (!local) return remote;
    const L = local, R = remote;
    const lessons = {};
    for (const id of union(Object.keys(L.lessons || {}), Object.keys(R.lessons || {}))) lessons[id] = mergeLesson((L.lessons || {})[id], (R.lessons || {})[id]);
    const byDay = perKeyMax(L.xp?.byDay, R.xp?.byDay);
    const sumDays = Object.values(byDay).reduce((a, b) => a + b, 0);
    const badges = { ...(R.badges || {}) };
    for (const [k, d] of Object.entries(L.badges || {})) badges[k] = minDate(badges[k], d);
    const customIds = new Set();
    const custom = [...(R.custom || []), ...(L.custom || [])].filter((c) => c && c.id && !customIds.has(c.id) && customIds.add(c.id));
    const gl = L.game || {}, gr = R.game || {};

    return {
      ...R, ...L,
      version: Math.max(L.version || 0, R.version || 0),
      profile: {
        name: R.profile?.name || L.profile?.name || "",
        level: L.profile?.level || R.profile?.level || null,
        test: [L.profile?.test, R.profile?.test].filter(Boolean).sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0] || null
      },
      settings: { ...(R.settings || {}), ...(L.settings || {}) },       // cài đặt giao diện theo máy đang dùng
      lessons,
      days: perKeyMax(L.days, R.days),
      custom,
      xp: { total: Math.max(L.xp?.total || 0, R.xp?.total || 0, sumDays), byDay, secRemainder: L.xp?.secRemainder || 0 },
      badges,
      cards: mergeCards(L.cards, R.cards),
      game: {
        ...gr, ...gl,
        freezes: maxNum(gl.freezes, gr.freezes),
        frozenDays: union(gl.frozenDays, gr.frozenDays).sort(),
        freezeAwardedAt: union(gl.freezeAwardedAt, gr.freezeAwardedAt).sort(),
        goalBonusDays: union(gl.goalBonusDays, gr.goalBonusDays).sort(),
        lastFreezeCheck: [gl.lastFreezeCheck, gr.lastFreezeCheck].filter(Boolean).sort().pop() || null,
        gameXpByDay: perKeyMax(gl.gameXpByDay, gr.gameXpByDay),
        best: mergeBest(gl.best, gr.best),
        plays: maxNum(gl.plays, gr.plays),
        cardReviews: maxNum(gl.cardReviews, gr.cardReviews),
        dailyDone: maxNum(gl.dailyDone, gr.dailyDone)
      }
    };
  }

  /* ---------------- gọi API ---------------- */
  async function api(path, opts = {}) {
    const res = await fetch(path, {
      method: opts.method || "GET",
      credentials: "same-origin",
      headers: opts.body ? { "content-type": "application/json" } : {},
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      keepalive: !!opts.keepalive
    });
    let data = null;
    try { data = await res.json(); } catch {}
    return { ok: res.ok, status: res.status, data: data || {} };
  }

  const Sync = {
    available: false, user: null, google: false, email: false,
    status: "off", version: 0, lastSync: null, error: null,
    merge,
    applying: false, timer: null, inflight: null, dirty: false,

    async init() {
      if (location.protocol === "file:") return;
      try {
        const r = await api("/api/auth/me");
        if (!r.ok || !("user" in r.data)) return;          // GitHub Pages / chưa cấu hình D1
        this.available = true;
        this.google = !!r.data.google; this.email = !!r.data.email;
        this.user = r.data.user;
        document.body.classList.add("has-account");
        if (this.user) await this.pull();
      } catch { /* mạng lỗi: học offline */ }
      this.paint();
    },

    async pull() {
      this.setStatus("saving");
      const r = await api("/api/progress");
      if (r.status === 401) return this.signedOut();
      if (!r.ok) return this.setStatus("error");
      this.version = r.data.version || 0;
      const local = S.snapshot();
      const merged = merge(local, r.data.data);
      if (JSON.stringify(merged) !== JSON.stringify(local)) this.apply(merged);
      if (!r.data.data || JSON.stringify(merged) !== JSON.stringify(r.data.data)) await this.push();
      else this.done();
    },

    apply(data) {
      this.applying = true;
      try { S.replaceAll(data); } finally { this.applying = false; }
    },

    schedule() {
      if (!this.user || this.applying) return;
      this.dirty = true;
      this.setStatus("pending");
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.push(), 2500);
    },

    async push(attempt = 0) {
      if (!this.user) return;
      clearTimeout(this.timer);
      if (this.inflight) { this.dirty = true; return this.inflight; }
      this.dirty = false;
      this.setStatus("saving");
      this.inflight = (async () => {
        try {
          const r = await api("/api/progress", { method: "PUT", body: { data: S.snapshot(), baseVersion: this.version } });
          if (r.ok) { this.version = r.data.version; this.done(); }
          else if (r.status === 409 && attempt < 3) {
            this.version = r.data.version || 0;
            this.apply(merge(S.snapshot(), r.data.data));
            this.inflight = null;
            return this.push(attempt + 1);
          } else if (r.status === 401) this.signedOut();
          else { this.error = r.data.error; this.setStatus("error"); }
        } catch { this.setStatus("offline"); this.dirty = true; }
        finally { this.inflight = null; }
        if (this.dirty && this.status !== "offline") this.schedule();
      })();
      return this.inflight;
    },

    /** Gửi nốt khi đóng tab (giới hạn keepalive ~64KB) */
    flushOnExit() {
      if (!this.user || !this.dirty) return;
      const body = { data: S.snapshot(), baseVersion: this.version };
      if (JSON.stringify(body).length < 60000) api("/api/progress", { method: "PUT", body, keepalive: true }).catch(() => {});
    },

    done() { this.lastSync = new Date(); this.setStatus("synced"); },
    setStatus(s) { this.status = s; this.paint(); },
    signedOut() { this.user = null; this.setStatus("off"); },

    async onLogin(user) {
      this.user = user;
      this.version = 0;
      await this.pull();
    },

    async logout(all = false) {
      if (this.dirty) await this.push();
      await api("/api/auth/logout", { method: "POST", body: { all } });
      this.user = null;
      this.applying = true;        // xoá tiến trình trên máy (an toàn với máy dùng chung)
      try { S.reset(); } finally { this.applying = false; }
      this.setStatus("off");
    },

    paint() {
      const btn = document.getElementById("accountBtn");
      if (!btn) return;
      btn.hidden = !this.available;
      if (!this.available) return;
      const u = this.user;
      btn.href = u ? "#/account" : "#/login";
      btn.title = u ? `${u.name || u.email} · ${STATUS[this.status] || ""}` : "Đăng nhập để lưu tiến trình";
      btn.className = `account-btn st-${this.status}`;
      btn.innerHTML = u
        ? (u.avatar ? `<img src="${esc(u.avatar)}" alt="" referrerpolicy="no-referrer">` : `<span>${esc((u.name || u.email)[0].toUpperCase())}</span>`) + `<i class="sync-dot"></i>`
        : `<span class="login-txt">Đăng nhập</span>`;
      const st = document.getElementById("syncStatus");
      if (st) st.innerHTML = statusText();
    }
  };

  const STATUS = { synced: "Đã đồng bộ ✓", saving: "Đang lưu…", pending: "Chờ lưu…", offline: "Mất mạng — sẽ lưu lại khi có mạng", error: "Lỗi đồng bộ", off: "" };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function statusText() {
    const t = Sync.lastSync ? ` · lần cuối ${Sync.lastSync.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : "";
    return `<span class="sync-pill st-${Sync.status}">${STATUS[Sync.status] || "—"}</span><span class="small muted">${t}</span>`;
  }

  document.addEventListener("store:change", () => Sync.schedule());
  window.addEventListener("online", () => { if (Sync.user && Sync.status === "offline") Sync.push(); });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") Sync.flushOnExit(); });
  window.addEventListener("pagehide", () => Sync.flushOnExit());

  window.Sync = Sync;

  /* ============================== GIAO DIỆN ============================== */
  if (!window.UI) return;            // chạy trong Node để test hàm merge
  const { $, $$, toast, routes, app } = window.UI;

  const ERR = {
    bad_email: "Email không hợp lệ.",
    password_short: "Mật khẩu cần ít nhất 8 ký tự.",
    password_long: "Mật khẩu tối đa 128 ký tự.",
    email_taken: "Email này đã có tài khoản — hãy đăng nhập.",
    use_google: "Email này đã đăng ký bằng Google — hãy bấm “Tiếp tục với Google”.",
    invalid_credentials: "Email hoặc mật khẩu không đúng. Nếu bạn từng dùng Google, hãy bấm “Tiếp tục với Google”.",
    too_many: "Thử quá nhiều lần. Vui lòng đợi 15 phút rồi thử lại.",
    email_disabled: "Trang chưa bật gửi email nên chưa thể đặt lại mật khẩu. Hãy liên hệ quản trị viên.",
    bad_token: "Link đã hết hạn hoặc đã dùng. Hãy yêu cầu link mới.",
    bad_origin: "Yêu cầu không hợp lệ. Hãy tải lại trang.",
    not_configured: "Máy chủ chưa cấu hình cơ sở dữ liệu.",
    google_not_configured: "Đăng nhập Google chưa được cấu hình.",
    google_cancelled: "Bạn đã huỷ đăng nhập Google.",
    google_state: "Phiên đăng nhập Google hết hạn, hãy thử lại.",
    google_failed: "Không đăng nhập được bằng Google, hãy thử lại.",
    google_unverified: "Tài khoản Google chưa xác minh email.",
    server_error: "Máy chủ gặp lỗi, hãy thử lại sau."
  };
  const errMsg = (code) => ERR[code] || "Có lỗi xảy ra, hãy thử lại.";

  function notAvailable() {
    app.innerHTML = `<section class="narrow center"><h1>Chưa bật tài khoản</h1>
      <p class="lead">Trang này đang chạy ở chế độ tĩnh (GitHub Pages) — tiến trình được lưu trên trình duyệt. Dùng <a href="#/settings">Cài đặt → Xuất file</a> để sao lưu.</p></section>`;
  }

  /* ---------------- #/login ---------------- */
  function viewLogin(param) {
    if (!Sync.available) return notAvailable();
    if (Sync.user) { location.hash = "#/account"; return; }
    let mode = param === "register" ? "register" : param === "forgot" ? "forgot" : "login";
    const initialErr = ERR[param] ? param : null;

    let keep = {};          // giữ lại email/tên khi báo lỗi để không phải gõ lại
    function draw(msg, kind = "err") {
      app.innerHTML = `
        <section class="auth-wrap">
          <div class="auth-card card">
            <div class="auth-head"><span class="logo">E</span>
              <h1>${mode === "register" ? "Tạo tài khoản" : mode === "forgot" ? "Quên mật khẩu" : "Đăng nhập"}</h1>
              <p class="muted small">Lưu tiến trình, XP và flashcard lên tài khoản — học tiếp trên mọi thiết bị.</p></div>
            ${msg ? `<div class="auth-msg ${kind}" role="alert">${msg}</div>` : ""}
            ${mode !== "forgot" && Sync.google ? `
              <a class="btn google-btn" href="/api/auth/google">${GOOGLE_ICON}<span>Tiếp tục với Google</span></a>
              <div class="or"><span>hoặc dùng email</span></div>` : ""}
            ${mode === "forgot" ? `
              <form id="authForm" class="form" novalidate>
                <label>Email<input name="email" type="email" autocomplete="email" required></label>
                <button class="btn primary" type="submit">Gửi link đặt lại mật khẩu</button>
              </form>
              <p class="small center"><a href="#/login" data-mode="login">← Quay lại đăng nhập</a></p>` : `
              <form id="authForm" class="form" novalidate>
                ${mode === "register" ? `<label>Tên hiển thị<input name="name" autocomplete="nickname" maxlength="60" placeholder="VD: Tommy"></label>` : ""}
                <label>Email<input name="email" type="email" autocomplete="${mode === "register" ? "email" : "username"}" required></label>
                <label>Mật khẩu
                  <span class="pw-wrap"><input name="password" type="password" minlength="8" maxlength="128"
                    autocomplete="${mode === "register" ? "new-password" : "current-password"}" required>
                  <button type="button" class="pw-eye" aria-label="Hiện mật khẩu">👁</button></span></label>
                ${mode === "register" ? `<p class="small muted">Ít nhất 8 ký tự. Nên dùng cụm từ dễ nhớ, khó đoán.</p>` : ""}
                <button class="btn primary" type="submit">${mode === "register" ? "Tạo tài khoản" : "Đăng nhập"}</button>
              </form>
              <p class="small center auth-switch">
                ${mode === "register" ? `Đã có tài khoản? <a href="#/login" data-mode="login">Đăng nhập</a>`
                  : `Chưa có tài khoản? <a href="#/login/register" data-mode="register">Tạo tài khoản</a>
                     ${Sync.email ? ` · <a href="#/login/forgot" data-mode="forgot">Quên mật khẩu?</a>` : ""}`}
              </p>`}
            <p class="small muted center">Chưa muốn đăng nhập? Bạn vẫn học được bình thường — tiến trình lưu trên trình duyệt này và sẽ được gộp vào tài khoản khi bạn đăng nhập.</p>
          </div>
        </section>`;

      $$("[data-mode]", app).forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); mode = a.dataset.mode; draw(); }));
      const eye = $(".pw-eye", app);
      if (eye) eye.addEventListener("click", () => { const i = $("input[name=password]", app); i.type = i.type === "password" ? "text" : "password"; });
      const form = $("#authForm");
      for (const [k, v] of Object.entries(keep)) { const i = form.elements[k]; if (i && k !== "password") i.value = v; }
      const focusEl = keep.email ? form.elements.password || form.elements.email : $("input", form);
      if (focusEl) focusEl.focus();
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(form));
        keep = { name: f.name, email: f.email };
        const btn = $("button[type=submit]", form);
        btn.disabled = true; btn.textContent = "Đang xử lý…";
        try {
          if (mode === "forgot") {
            const r = await api("/api/auth/forgot", { method: "POST", body: { email: f.email } });
            if (r.ok) { mode = "login"; return draw("Nếu email có tài khoản, bạn sẽ nhận được link đặt lại mật khẩu trong vài phút. Kiểm tra cả thư mục Spam.", "ok"); }
            return draw(errMsg(r.data.error));
          }
          const r = await api(`/api/auth/${mode === "register" ? "register" : "login"}`, { method: "POST", body: f });
          if (!r.ok) return draw(errMsg(r.data.error));
          await Sync.onLogin(r.data.user);
          location.hash = mode === "register" ? "#/account/welcome" : "#/";
          toast(`Xin chào ${r.data.user.name || ""}! Tiến trình đã được đồng bộ ✓`, "ok");
        } catch { draw("Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại."); }
      });
    }
    draw(initialErr ? errMsg(initialErr) : "");
  }

  /* ---------------- #/reset/<token> ---------------- */
  function viewReset(token) {
    if (!Sync.available) return notAvailable();
    app.innerHTML = `
      <section class="auth-wrap"><div class="auth-card card">
        <div class="auth-head"><span class="logo">E</span><h1>Đặt mật khẩu mới</h1></div>
        <div id="msg"></div>
        <form id="resetForm" class="form" novalidate>
          <label>Mật khẩu mới<input name="password" type="password" minlength="8" maxlength="128" autocomplete="new-password" required></label>
          <label>Nhập lại<input name="password2" type="password" autocomplete="new-password" required></label>
          <button class="btn primary" type="submit">Lưu mật khẩu</button>
        </form></div></section>`;
    $("#resetForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      const show = (m) => { $("#msg").innerHTML = `<div class="auth-msg err" role="alert">${m}</div>`; };
      if (f.password !== f.password2) return show("Hai mật khẩu không khớp.");
      const r = await api("/api/auth/reset", { method: "POST", body: { token, password: f.password } });
      if (!r.ok) return show(errMsg(r.data.error));
      history.replaceState(null, "", "#/account");          // xoá token khỏi lịch sử trình duyệt
      await Sync.onLogin(r.data.user);
      toast("Đã đặt mật khẩu mới ✓", "ok");
      UI.rerender();
    });
  }

  /* ---------------- #/account ---------------- */
  function viewAccount(param) {
    if (!Sync.available) return notAvailable();
    const u = Sync.user;
    if (!u) { location.hash = "#/login"; return; }
    const banner = {
      welcome: ["ok", "🎉 Đăng nhập thành công! Tiến trình trên máy này đã được gộp vào tài khoản."],
      verified: ["ok", "✅ Email đã được xác nhận."],
      "verify-failed": ["err", "Link xác nhận đã hết hạn hoặc đã dùng."]
    }[param];

    app.innerHTML = `
      <section class="narrow">
        <p class="eyebrow">Tài khoản</p>
        ${banner ? `<div class="auth-msg ${banner[0]}">${banner[1]}</div>` : ""}
        <div class="card account-card">
          <div class="acc-avatar">${u.avatar ? `<img src="${UI.esc(u.avatar)}" alt="" referrerpolicy="no-referrer">` : UI.esc((u.name || u.email)[0].toUpperCase())}</div>
          <div class="acc-info">
            <h1>${UI.esc(u.name || "Bạn")}</h1>
            <p class="muted">${UI.esc(u.email)} ${u.emailVerified ? `<span class="pill new">Đã xác nhận</span>` : `<span class="pill">Chưa xác nhận</span>`}
              ${u.google ? `<span class="pill">Google</span>` : ""}</p>
            ${!u.emailVerified && Sync.email ? `<button class="linklike small" id="resendVerify">Gửi lại email xác nhận</button>` : ""}
          </div>
        </div>

        <div class="card">
          <div class="card-head"><h3>☁️ Đồng bộ tiến trình</h3><button class="btn ghost sm" id="syncNow">Đồng bộ ngay</button></div>
          <p id="syncStatus">${statusText()}</p>
          <p class="small muted">XP, huy hiệu, flashcard, bài đã học, ghi chú và chuỗi ngày được lưu lên tài khoản và tự gộp giữa các thiết bị. Giao diện sáng/tối và mục tiêu phút lưu theo từng máy.</p>
        </div>

        <div class="card">
          <h3>🔑 ${u.hasPassword ? "Đổi mật khẩu" : "Đặt mật khẩu (để đăng nhập bằng email)"}</h3>
          <form id="pwForm" class="form" novalidate>
            ${u.hasPassword ? `<label>Mật khẩu hiện tại<input name="current" type="password" autocomplete="current-password" required></label>` : ""}
            <label>Mật khẩu mới<input name="password" type="password" minlength="8" maxlength="128" autocomplete="new-password" required></label>
            <div class="row gap-s"><button class="btn primary" type="submit">Lưu</button><span id="pwMsg" class="small"></span></div>
          </form>
        </div>

        <div class="card">
          <h3>Phiên đăng nhập</h3>
          <div class="row gap-s wrap">
            <button class="btn ghost" id="logout">Đăng xuất</button>
            <button class="btn ghost" id="logoutAll">Đăng xuất mọi thiết bị</button>
          </div>
          <p class="small muted">Khi đăng xuất, tiến trình trên trình duyệt này được xoá (vẫn còn trên tài khoản) — an toàn khi dùng máy chung.</p>
        </div>

        <div class="card danger-zone">
          <h3>Xoá tài khoản</h3>
          <p class="small muted">Xoá vĩnh viễn tài khoản và toàn bộ tiến trình trên máy chủ. Không thể hoàn tác.</p>
          <button class="btn ghost danger" id="deleteAcc">Xoá tài khoản</button>
        </div>
      </section>`;

    $("#syncNow").addEventListener("click", () => Sync.pull());
    const rv = $("#resendVerify");
    if (rv) rv.addEventListener("click", async () => {
      const r = await api("/api/auth/resend-verify", { method: "POST", body: {} });
      toast(r.ok ? "Đã gửi email xác nhận — kiểm tra hộp thư (cả Spam)" : errMsg(r.data.error), r.ok ? "ok" : "err");
    });
    $("#pwForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      const r = await api("/api/auth/password", { method: "POST", body: f });
      $("#pwMsg").textContent = r.ok ? "Đã lưu ✓ (các thiết bị khác đã bị đăng xuất)" : errMsg(r.data.error);
      $("#pwMsg").className = `small ${r.ok ? "ok-text" : "err-text"}`;
      if (r.ok) { e.target.reset(); u.hasPassword = true; }
    });
    const out = (all) => async () => {
      if (!confirm(all ? "Đăng xuất khỏi mọi thiết bị?" : "Đăng xuất khỏi trình duyệt này?")) return;
      await Sync.logout(all);
      toast("Đã đăng xuất");
      location.hash = "#/";
    };
    $("#logout").addEventListener("click", out(false));
    $("#logoutAll").addEventListener("click", out(true));
    $("#deleteAcc").addEventListener("click", async () => {
      const typed = prompt('Gõ chữ XOA để xác nhận xoá vĩnh viễn tài khoản:');
      if ((typed || "").trim().toUpperCase() !== "XOA") return;
      const r = await api("/api/auth/account", { method: "DELETE", body: { confirm: "DELETE" } });
      if (!r.ok) return toast(errMsg(r.data.error), "err");
      Sync.user = null; Sync.applying = true; S.reset(); Sync.applying = false; Sync.setStatus("off");
      toast("Đã xoá tài khoản");
      location.hash = "#/";
    });
  }

  const GOOGLE_ICON = `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`;

  routes.login = viewLogin;
  routes.reset = viewReset;
  routes.account = viewAccount;
})();
