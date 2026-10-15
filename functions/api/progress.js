/* GET  /api/progress[?lang=zh]  → { data, version, updatedAt }
   PUT  /api/progress[?lang=zh]  { data, baseVersion } → { version }  |  409 { error:"conflict", data, version }
   Mỗi ngôn ngữ học có một bản tiến trình riêng: en → bảng progress, ngôn ngữ khác → bảng progress_lang. */
import { json, err, readJson, now, langOf, ensureLangTable } from "../../server/lib.js";

const MAX = 1_000_000;   // 1 MB JSON mỗi người / ngôn ngữ

async function table(env, request) {
  const lang = langOf(new URL(request.url).searchParams.get("lang"));
  if (lang === "en") {
    return {
      get: (uid) => env.DB.prepare("SELECT data, version, updated_at FROM progress WHERE user_id = ?").bind(uid),
      insert: (uid, text, t) => env.DB.prepare("INSERT INTO progress (user_id, data, version, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(user_id) DO NOTHING").bind(uid, text, t),
      update: (uid, text, t, base) => env.DB.prepare("UPDATE progress SET data = ?, version = version + 1, updated_at = ? WHERE user_id = ? AND version = ?").bind(text, t, uid, base)
    };
  }
  await ensureLangTable(env);
  return {
    get: (uid) => env.DB.prepare("SELECT data, version, updated_at FROM progress_lang WHERE user_id = ? AND lang = ?").bind(uid, lang),
    insert: (uid, text, t) => env.DB.prepare("INSERT INTO progress_lang (user_id, lang, data, version, updated_at) VALUES (?, ?, ?, 1, ?) ON CONFLICT(user_id, lang) DO NOTHING").bind(uid, lang, text, t),
    update: (uid, text, t, base) => env.DB.prepare("UPDATE progress_lang SET data = ?, version = version + 1, updated_at = ? WHERE user_id = ? AND lang = ? AND version = ?").bind(text, t, uid, lang, base)
  };
}

export async function onRequestGet({ request, env, data }) {
  if (!data.user) return err("unauthorized", 401);
  const T = await table(env, request);
  const row = await T.get(data.user.id).first();
  if (!row) return json({ data: null, version: 0, updatedAt: null });
  return json({ data: JSON.parse(row.data), version: row.version, updatedAt: row.updated_at });
}

export async function onRequestPut({ request, env, data }) {
  if (!data.user) return err("unauthorized", 401);
  const T = await table(env, request);
  const body = await readJson(request, MAX + 1000);
  if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) return err("bad_data");
  const text = JSON.stringify(body.data);
  if (text.length > MAX) return err("too_large", 413);
  const base = Number(body.baseVersion) || 0;
  const t = now();

  const r = await (base === 0 ? T.insert(data.user.id, text, t) : T.update(data.user.id, text, t, base)).run();
  if (!r.meta.changes) {   // thiết bị khác đã lưu trước → trả bản mới nhất để client gộp rồi gửi lại
    const row = await T.get(data.user.id).first();
    return err("conflict", 409, { data: row ? JSON.parse(row.data) : null, version: row ? row.version : 0 });
  }
  return json({ version: base + 1, updatedAt: t });
}
