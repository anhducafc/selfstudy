/* POST /api/auth/password { current?, password } — đổi mật khẩu, hoặc đặt mật khẩu cho tài khoản Google */
import { json, err, readJson, passwordProblem, verifyPassword, hashPassword, rateLimited, now } from "../../../server/lib.js";
export async function onRequestPost({ request, env, data }) {
  if (!data.user) return err("unauthorized", 401);
  const b = await readJson(request, 2000);
  const p = passwordProblem(b.password);
  if (p) return err(p);
  if (await rateLimited(env, `pw:${data.user.id}`, 8, 900)) return err("too_many", 429);
  if (data.user.password_hash && !(await verifyPassword(String(b.current || ""), data.user.password_hash))) return err("invalid_credentials", 401);
  await env.DB.batch([
    env.DB.prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?").bind(await hashPassword(b.password), now(), data.user.id),
    env.DB.prepare("DELETE FROM sessions WHERE user_id = ? AND id != ?").bind(data.user.id, data.sid)   // đăng xuất thiết bị khác
  ]);
  return json({ ok: true });
}
