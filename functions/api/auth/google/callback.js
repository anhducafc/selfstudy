/* GET /api/auth/google/callback — Google trả về code → đổi lấy thông tin người dùng → tạo phiên */
import { redirect, getCookie, clearCookie, createSession, cleanName, now, OAUTH_COOKIE } from "../../../../server/lib.js";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const fail = (code) => redirect(`/#/login/${code}`, [clearCookie(OAUTH_COOKIE)]);
  if (url.searchParams.get("error")) return fail("google_cancelled");

  const [state, verifier] = (getCookie(request, OAUTH_COOKIE) || "").split(".");
  if (!state || state !== url.searchParams.get("state")) return fail("google_state");

  // 1) đổi code lấy access token (gọi trực tiếp từ server → kèm client secret)
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: url.searchParams.get("code") || "",
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${url.origin}/api/auth/google/callback`,
      grant_type: "authorization_code",
      code_verifier: verifier
    })
  });
  if (!tokenRes.ok) { console.log("Google token lỗi", tokenRes.status, await tokenRes.text()); return fail("google_failed"); }
  const { access_token } = await tokenRes.json();

  // 2) lấy thông tin tài khoản
  const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { authorization: `Bearer ${access_token}` } });
  if (!infoRes.ok) return fail("google_failed");
  const g = await infoRes.json();
  if (!g.sub || !g.email || g.email_verified !== true) return fail("google_unverified");
  const email = String(g.email).toLowerCase();
  const avatar = /^https:\/\/[\w.-]+\.googleusercontent\.com\//.test(g.picture || "") ? g.picture : "";
  const t = now();

  // 3) tìm hoặc tạo tài khoản
  let user = await env.DB.prepare("SELECT * FROM users WHERE google_sub = ?").bind(g.sub).first();
  if (!user) {
    const byEmail = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    if (byEmail) {
      // Liên kết Google vào tài khoản email có sẵn. Nếu email đó CHƯA được xác nhận, có thể ai đó đã đăng ký
      // trước bằng email của bạn → xoá mật khẩu cũ và các phiên cũ để họ không chiếm được tài khoản.
      const stmts = [env.DB.prepare(
        `UPDATE users SET google_sub = ?, email_verified = 1, avatar = CASE WHEN avatar = '' THEN ? ELSE avatar END,
         password_hash = CASE WHEN email_verified = 1 THEN password_hash ELSE NULL END, updated_at = ? WHERE id = ?`
      ).bind(g.sub, avatar, t, byEmail.id)];
      if (!byEmail.email_verified) stmts.push(env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(byEmail.id));
      await env.DB.batch(stmts);
      user = { ...byEmail };
    } else {
      user = { id: crypto.randomUUID() };
      await env.DB.prepare(
        "INSERT INTO users (id, email, name, avatar, password_hash, email_verified, google_sub, created_at, updated_at) VALUES (?, ?, ?, ?, NULL, 1, ?, ?, ?)"
      ).bind(user.id, email, cleanName(g.name) || email.split("@")[0], avatar, g.sub, t, t).run();
    }
  }

  const session = await createSession(env, user.id, request);
  return redirect("/#/account/welcome", [clearCookie(OAUTH_COOKIE), session]);
}
