/* GET /api/auth/verify?token=... — link trong email xác nhận */
import { redirect, consumeEmailToken, now } from "../../../server/lib.js";
export async function onRequestGet({ request, env }) {
  const token = new URL(request.url).searchParams.get("token");
  const userId = await consumeEmailToken(env, token, "verify");
  if (!userId) return redirect("/#/account/verify-failed");
  await env.DB.prepare("UPDATE users SET email_verified = 1, updated_at = ? WHERE id = ?").bind(now(), userId).run();
  return redirect("/#/account/verified");
}
