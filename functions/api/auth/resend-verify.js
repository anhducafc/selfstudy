/* POST /api/auth/resend-verify — gửi lại email xác nhận */
import { json, err, rateLimited, sendVerifyEmail, emailEnabled } from "../../../server/lib.js";
export async function onRequestPost({ request, env, data }) {
  if (!data.user) return err("unauthorized", 401);
  if (!emailEnabled(env)) return err("email_disabled", 501);
  if (await rateLimited(env, `verify:${data.user.id}`, 3, 3600)) return err("too_many", 429);
  return json({ sent: await sendVerifyEmail(env, data.user, new URL(request.url).origin) });
}
