/* ==========================================================================
   Thư viện dùng chung cho Cloudflare Pages Functions (thư mục functions/)
   Chạy trên Workers runtime: chỉ dùng Web Crypto + fetch, không cần npm.
   ========================================================================== */

export const SESSION_COOKIE = "__Host-ep_session";
export const OAUTH_COOKIE = "__Host-ep_oauth";
export const SESSION_DAYS = 30;
const PBKDF2_ITER = 100000;               // giới hạn tối đa của Workers
const enc = new TextEncoder();

export const now = () => Math.floor(Date.now() / 1000);

/* ---------------- response ---------------- */
export function json(data, status = 200, headers = {}) {
  const h = new Headers({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  for (const [k, v] of Object.entries(headers)) {
    if (Array.isArray(v)) v.forEach((x) => h.append(k, x)); else h.set(k, v);
  }
  return new Response(JSON.stringify(data), { status, headers: h });
}
export const err = (code, status = 400, extra = {}) => json({ error: code, ...extra }, status);

export function redirect(location, cookies = []) {
  const h = new Headers({ location, "cache-control": "no-store" });
  cookies.forEach((c) => h.append("set-cookie", c));
  return new Response(null, { status: 302, headers: h });
}

export async function readJson(request, maxBytes = 1_100_000) {
  const len = Number(request.headers.get("content-length") || 0);
  if (len > maxBytes) throw Object.assign(new Error("too_large"), { status: 413 });
  const text = await request.text();
  if (text.length > maxBytes) throw Object.assign(new Error("too_large"), { status: 413 });
  try { return JSON.parse(text || "{}"); } catch { throw Object.assign(new Error("bad_json"), { status: 400 }); }
}

/* ---------------- cookie ---------------- */
export function getCookie(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}
export function cookie(name, value, maxAge) {
  // __Host-: bắt buộc Secure, Path=/, không Domain → không bị subdomain khác ghi đè
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
export const clearCookie = (name) => cookie(name, "", 0);

/* ---------------- crypto ---------------- */
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export function newToken(bytes = 32) {
  return b64url(crypto.getRandomValues(new Uint8Array(bytes)));
}
export async function sha256(text) {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export async function sha256b64url(text) {
  return b64url(await crypto.subtle.digest("SHA-256", enc.encode(text)));
}

async function pbkdf2(password, salt, iter) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password.normalize("NFKC")), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: iter }, key, 256));
}
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITER);
  return `pbkdf2$${PBKDF2_ITER}$${b64(salt)}$${b64(hash)}`;
}
export async function verifyPassword(password, stored) {
  // luôn chạy PBKDF2 kể cả khi không có tài khoản → thời gian phản hồi như nhau
  const parts = (stored || "pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=").split("$");
  const iter = Number(parts[1]) || PBKDF2_ITER;
  const hash = await pbkdf2(password, unb64(parts[2]), iter);
  const expect = unb64(parts[3]);
  let diff = hash.length ^ expect.length;
  for (let i = 0; i < Math.min(hash.length, expect.length); i++) diff |= hash[i] ^ expect[i];
  return !!stored && diff === 0;
}

/* ---------------- validate ---------------- */
export const normEmail = (e) => String(e || "").trim().toLowerCase();
export const validEmail = (e) => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
export function passwordProblem(p) {
  if (typeof p !== "string" || p.length < 8) return "password_short";
  if (p.length > 128) return "password_long";
  return null;
}
export const cleanName = (n) => String(n || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 60);

export function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name, avatar: u.avatar, emailVerified: !!u.email_verified,
    hasPassword: !!u.password_hash, google: !!u.google_sub };
}

/* ---------------- session ---------------- */
export async function createSession(env, userId, request) {
  const token = newToken();
  const t = now();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM sessions WHERE user_id = ? AND expires_at < ?").bind(userId, t),
    env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at, created_at, user_agent) VALUES (?, ?, ?, ?, ?)")
      .bind(await sha256(token), userId, t + SESSION_DAYS * 86400, t, (request.headers.get("user-agent") || "").slice(0, 200))
  ]);
  return cookie(SESSION_COOKIE, token, SESSION_DAYS * 86400);
}

/** Trả về { user, session, refreshCookie } hoặc null */
export async function getSession(env, request) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token || token.length > 100) return null;
  const sid = await sha256(token);
  const row = await env.DB.prepare(
    "SELECT s.id AS sid, s.expires_at, u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ?"
  ).bind(sid).first();
  if (!row) return null;
  const t = now();
  if (row.expires_at < t) {
    await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sid).run();
    return null;
  }
  let refreshCookie = null;
  if (row.expires_at - t < (SESSION_DAYS - 7) * 86400) {        // gia hạn trượt: dùng thường xuyên thì không bị đăng xuất
    await env.DB.prepare("UPDATE sessions SET expires_at = ? WHERE id = ?").bind(t + SESSION_DAYS * 86400, sid).run();
    refreshCookie = cookie(SESSION_COOKIE, token, SESSION_DAYS * 86400);
  }
  return { user: row, sid, refreshCookie };
}

/* ---------------- rate limit (cửa sổ cố định, lưu D1) ---------------- */
export async function rateLimited(env, key, limit, windowSec) {
  const t = now();
  const row = await env.DB.prepare(
    `INSERT INTO rate_limits (key, count, reset_at) VALUES (?1, 1, ?2)
     ON CONFLICT(key) DO UPDATE SET
       count = CASE WHEN reset_at < ?3 THEN 1 ELSE count + 1 END,
       reset_at = CASE WHEN reset_at < ?3 THEN ?2 ELSE reset_at END
     RETURNING count`
  ).bind(key, t + windowSec, t).first();
  return row.count > limit;
}
export const clientIp = (request) => request.headers.get("cf-connecting-ip") || "local";

/* ---------------- email (tuỳ chọn, qua Resend) ---------------- */
export const emailEnabled = (env) => !!(env.RESEND_API_KEY && env.MAIL_FROM);
export async function sendEmail(env, to, subject, html) {
  if (!emailEnabled(env)) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject, html })
  });
  if (!res.ok) console.log("Resend lỗi", res.status, await res.text());
  return res.ok;
}
export function emailLayout(title, body, buttonText, url) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#1c2433">
    <h2 style="margin:0 0 12px">${esc(title)}</h2><p style="line-height:1.6">${body}</p>
    <p style="margin:24px 0"><a href="${esc(url)}" style="background:#1f3a5f;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:bold">${esc(buttonText)}</a></p>
    <p style="font-size:12px;color:#5d6677">Nếu bạn không yêu cầu, hãy bỏ qua email này.<br>${esc(url)}</p></div>`;
}

export async function createEmailToken(env, userId, purpose, ttlSec) {
  const token = newToken();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM email_tokens WHERE user_id = ? AND purpose = ?").bind(userId, purpose),
    env.DB.prepare("INSERT INTO email_tokens (id, user_id, purpose, expires_at) VALUES (?, ?, ?, ?)")
      .bind(await sha256(token), userId, purpose, now() + ttlSec)
  ]);
  return token;
}
export async function consumeEmailToken(env, token, purpose) {
  if (!token || token.length > 100) return null;
  const id = await sha256(token);
  const row = await env.DB.prepare("DELETE FROM email_tokens WHERE id = ? AND purpose = ? RETURNING user_id, expires_at")
    .bind(id, purpose).first();
  if (!row || row.expires_at < now()) return null;
  return row.user_id;
}

export async function sendVerifyEmail(env, user, origin) {
  if (!emailEnabled(env) || user.email_verified) return false;
  const token = await createEmailToken(env, user.id, "verify", 3 * 86400);
  const url = `${origin}/api/auth/verify?token=${token}`;
  return sendEmail(env, user.email, "Xác nhận email · English Path",
    emailLayout("Xác nhận email của bạn", "Bấm nút bên dưới để xác nhận email và bảo vệ tài khoản English Path.", "Xác nhận email", url));
}

/* ---------------- tiến trình theo ngôn ngữ ----------------
   Tiếng Anh dùng bảng progress (có từ đầu). Ngôn ngữ khác dùng progress_lang (user_id, lang).
   Bảng được tự tạo ở request đầu tiên → không cần chạy thêm SQL trong D1 Console. */
export const LANG_IDS = ["en", "zh"];
export const langOf = (v) => (LANG_IDS.includes(v) ? v : "en");
/** Đường dẫn trang của ngôn ngữ: en → "/", zh → "/zh/" */
export const langBase = (lang) => (langOf(lang) === "en" ? "/" : `/${langOf(lang)}/`);
let langTableReady = false;
export async function ensureLangTable(env) {
  if (langTableReady) return;
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS progress_lang (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, lang TEXT NOT NULL, data TEXT NOT NULL, version INTEGER NOT NULL, updated_at INTEGER NOT NULL, PRIMARY KEY (user_id, lang))").run();
  langTableReady = true;
}
