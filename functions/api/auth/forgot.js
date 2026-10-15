/* POST /api/auth/forgot { email } — gửi link đặt lại mật khẩu (cần cấu hình Resend) */
import { json, err, readJson, normEmail, validEmail, rateLimited, clientIp, emailEnabled,
  createEmailToken, sendEmail, emailLayout } from "../../../server/lib.js";

export async function onRequestPost({ request, env }) {
  if (!emailEnabled(env)) return err("email_disabled", 501);
  const b = await readJson(request, 2000);
  const email = normEmail(b.email);
  if (!validEmail(email)) return err("bad_email");
  if (await rateLimited(env, `forgot:ip:${clientIp(request)}`, 10, 3600) || await rateLimited(env, `forgot:${email}`, 3, 3600)) {
    return err("too_many", 429);
  }
  const user = await env.DB.prepare("SELECT id, email FROM users WHERE email = ?").bind(email).first();
  if (user) {
    const token = await createEmailToken(env, user.id, "reset", 3600);
    const url = `${new URL(request.url).origin}/#/reset/${token}`;
    await sendEmail(env, user.email, "Đặt lại mật khẩu · English Path",
      emailLayout("Đặt lại mật khẩu", "Có yêu cầu đặt lại mật khẩu cho tài khoản English Path của bạn. Link có hiệu lực trong 1 giờ.", "Đặt mật khẩu mới", url));
  }
  return json({ ok: true });   // luôn trả ok, không tiết lộ email có tồn tại
}
