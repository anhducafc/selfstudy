/* POST /api/auth/login { email, password } */
import { json, err, readJson, normEmail, verifyPassword, createSession, publicUser, rateLimited, clientIp } from "../../../server/lib.js";

export async function onRequestPost({ request, env }) {
  const b = await readJson(request, 4000);
  const email = normEmail(b.email);
  const ip = clientIp(request);
  if (await rateLimited(env, `login:ip:${ip}`, 30, 900) || await rateLimited(env, `login:email:${email}`, 8, 900)) {
    return err("too_many", 429);
  }
  const user = email ? await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first() : null;
  const ok = await verifyPassword(String(b.password || ""), user && user.password_hash);
  if (!user || !ok) return err("invalid_credentials", 401);   // không tiết lộ email có tồn tại hay không
  const setCookie = await createSession(env, user.id, request);
  return json({ user: publicUser(user) }, 200, { "set-cookie": setCookie });
}
