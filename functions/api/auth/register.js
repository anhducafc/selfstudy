/* POST /api/auth/register { email, password, name } */
import { json, err, readJson, normEmail, validEmail, passwordProblem, cleanName, hashPassword,
  createSession, publicUser, rateLimited, clientIp, now, sendVerifyEmail } from "../../../server/lib.js";

export async function onRequestPost({ request, env }) {
  const b = await readJson(request, 4000);
  const email = normEmail(b.email);
  if (!validEmail(email)) return err("bad_email");
  const p = passwordProblem(b.password);
  if (p) return err(p);
  if (await rateLimited(env, `register:${clientIp(request)}`, 10, 3600)) return err("too_many", 429);

  const existing = await env.DB.prepare("SELECT password_hash FROM users WHERE email = ?").bind(email).first();
  if (existing) return err(existing.password_hash ? "email_taken" : "use_google", 409);

  const t = now();
  const user = {
    id: crypto.randomUUID(), email, name: cleanName(b.name) || email.split("@")[0], avatar: "",
    password_hash: await hashPassword(b.password), email_verified: 0, google_sub: null
  };
  await env.DB.prepare(
    "INSERT INTO users (id, email, name, avatar, password_hash, email_verified, created_at, updated_at) VALUES (?, ?, ?, '', ?, 0, ?, ?)"
  ).bind(user.id, email, user.name, user.password_hash, t, t).run();

  const setCookie = await createSession(env, user.id, request);
  const sent = await sendVerifyEmail(env, user, new URL(request.url).origin).catch(() => false);
  return json({ user: publicUser(user), verifySent: sent }, 201, { "set-cookie": setCookie });
}
