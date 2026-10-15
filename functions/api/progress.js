/* GET  /api/progress  → { data, version, updatedAt }
   PUT  /api/progress  { data, baseVersion } → { version }  |  409 { error:"conflict", data, version } */
import { json, err, readJson, now } from "../../server/lib.js";

const MAX = 1_000_000;   // 1 MB JSON mỗi người

export async function onRequestGet({ env, data }) {
  if (!data.user) return err("unauthorized", 401);
  const row = await env.DB.prepare("SELECT data, version, updated_at FROM progress WHERE user_id = ?").bind(data.user.id).first();
  if (!row) return json({ data: null, version: 0, updatedAt: null });
  return json({ data: JSON.parse(row.data), version: row.version, updatedAt: row.updated_at });
}

export async function onRequestPut({ request, env, data }) {
  if (!data.user) return err("unauthorized", 401);
  const body = await readJson(request, MAX + 1000);
  if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) return err("bad_data");
  const text = JSON.stringify(body.data);
  if (text.length > MAX) return err("too_large", 413);
  const base = Number(body.baseVersion) || 0;
  const t = now();

  let changes;
  if (base === 0) {
    const r = await env.DB.prepare("INSERT INTO progress (user_id, data, version, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(user_id) DO NOTHING")
      .bind(data.user.id, text, t).run();
    changes = r.meta.changes;
  } else {
    const r = await env.DB.prepare("UPDATE progress SET data = ?, version = version + 1, updated_at = ? WHERE user_id = ? AND version = ?")
      .bind(text, t, data.user.id, base).run();
    changes = r.meta.changes;
  }
  if (!changes) {          // thiết bị khác đã lưu trước → trả bản mới nhất để client gộp rồi gửi lại
    const row = await env.DB.prepare("SELECT data, version FROM progress WHERE user_id = ?").bind(data.user.id).first();
    return err("conflict", 409, { data: row ? JSON.parse(row.data) : null, version: row ? row.version : 0 });
  }
  return json({ version: base + 1, updatedAt: t });
}
