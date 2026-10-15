/* POST /api/auth/logout { all?: true } — all = đăng xuất mọi thiết bị */
import { json, readJson, clearCookie, SESSION_COOKIE } from "../../../server/lib.js";
export async function onRequestPost({ request, env, data }) {
  const b = await readJson(request, 1000).catch(() => ({}));
  if (data.user) {
    if (b.all) await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(data.user.id).run();
    else await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(data.sid).run();
  }
  return json({ ok: true }, 200, { "set-cookie": clearCookie(SESSION_COOKIE) });
}
