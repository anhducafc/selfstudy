/* POST /api/auth/reset { token, password } — đặt mật khẩu mới, đăng xuất mọi thiết bị cũ */
import { json, err, readJson, passwordProblem, hashPassword, consumeEmailToken, createSession, publicUser, now } from "../../../server/lib.js";

export async function onRequestPost({ request, env }) {
  const b = await readJson(request, 2000);
  const p = passwordProblem(b.password);
  if (p) return err(p);
  const userId = await consumeEmailToken(env, String(b.token || ""), "reset");
  if (!userId) return err("bad_token");
  await env.DB.batch([
    env.DB.prepare("UPDATE users SET password_hash = ?, email_verified = 1, updated_at = ? WHERE id = ?").bind(await hashPassword(b.password), now(), userId),
    env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId)
  ]);
  const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
  const setCookie = await createSession(env, userId, request);
  return json({ user: publicUser(user) }, 200, { "set-cookie": setCookie });
}
