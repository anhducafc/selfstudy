/* Chạy trước mọi request /api/*: chặn CSRF, gắn user từ cookie phiên, bắt lỗi. */
import { err, getSession } from "../../server/lib.js";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  try {
    if (!env.DB) return err("not_configured", 503, { hint: "Chưa gắn D1 binding tên DB cho Pages project" });

    // Chống CSRF: mọi request thay đổi dữ liệu phải đến từ chính trang này
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      const origin = request.headers.get("origin");
      if (origin !== url.origin) return err("bad_origin", 403);
    }

    const s = await getSession(env, request);
    context.data.user = s ? s.user : null;
    context.data.sid = s ? s.sid : null;

    const res = await context.next();
    if (s && s.refreshCookie) {
      const r = new Response(res.body, res);
      r.headers.append("set-cookie", s.refreshCookie);
      return r;
    }
    return res;
  } catch (e) {
    if (e.status) return err(e.message, e.status);
    console.log("API error", url.pathname, e && e.stack);
    return err("server_error", 500);
  }
}
