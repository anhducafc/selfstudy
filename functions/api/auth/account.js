/* DELETE /api/auth/account { confirm: "DELETE" } — xoá tài khoản và toàn bộ dữ liệu */
import { json, err, readJson, clearCookie, SESSION_COOKIE } from "../../../server/lib.js";
export async function onRequestDelete({ request, env, data }) {
  if (!data.user) return err("unauthorized", 401);
  const b = await readJson(request, 1000);
  if (b.confirm !== "DELETE") return err("confirm_required");
  const id = data.user.id;
  await env.DB.batch([
    env.DB.prepare("DELETE FROM progress WHERE user_id = ?").bind(id),
    env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id),
    env.DB.prepare("DELETE FROM email_tokens WHERE user_id = ?").bind(id),
    env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id)
  ]);
  return json({ ok: true }, 200, { "set-cookie": clearCookie(SESSION_COOKIE) });
}
