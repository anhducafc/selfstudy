#!/usr/bin/env node
/* ==========================================================================
   Phần 4 — Bot Telegram nhắc học hằng ngày.
   Dùng CHUNG thuật toán "Bài của ngày" với trang web (js/daily.js) nên link
   trong tin nhắn trùng đúng bài người học thấy trên trang chủ.

   node scripts/telegram-daily.mjs morning   # sáng: bài của ngày + từ của ngày
   node scripts/telegram-daily.mjs evening   # tối: nhắc giữ chuỗi

   Biến môi trường:
     TELEGRAM_BOT_TOKEN   token từ @BotFather (bắt buộc, trừ khi DRY_RUN=1)
     TELEGRAM_CHAT_ID     id chat/nhóm/kênh; nhiều id cách nhau bằng dấu phẩy
     SITE_URL             vd https://<user>.github.io/english-path/
     TELEGRAM_LEVELS      các trình độ tiếng Anh gửi bài, mặc định "A2,B1,B2" ("none" = không gửi)
     TELEGRAM_ZH_LEVELS   các trình độ tiếng Trung, mặc định "HSK1,HSK2" ("none" = không gửi)
     DRY_RUN=1            chỉ in tin nhắn ra màn hình
   ========================================================================== */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] === "evening" ? "evening" : "morning";
const TZ = "Asia/Ho_Chi_Minh";
const SITE = (process.env.SITE_URL || "").replace(/\/?$/, "/");
const levelsOf = (v, def) => ((v || def).trim().toLowerCase() === "none" ? [] : (v || def).split(",").map((s) => s.trim().toUpperCase()).filter(Boolean));
const LEVELS = levelsOf(process.env.TELEGRAM_LEVELS, "A2,B1,B2");
const ZH_LEVELS = levelsOf(process.env.TELEGRAM_ZH_LEVELS, "HSK1,HSK2");
const DRY = !!process.env.DRY_RUN;

/* ---------- nạp dữ liệu giống hệt trình duyệt ---------- */
async function loadSite(dir = "") {
  const ctx = { window: {}, console };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of [`${dir}js/data.js`, "js/daily.js"]) vm.runInContext(await readFile(path.join(ROOT, f), "utf8"), ctx, { filename: f });
  const w = ctx.window;
  let auto = [];
  const autoFile = path.join(ROOT, `${dir}data/auto-lessons.json`);
  if (existsSync(autoFile)) {
    const core = new Set(w.LESSONS.filter((l) => l.source.type === "youtube").map((l) => l.source.videoId));
    auto = (JSON.parse(await readFile(autoFile, "utf8")).lessons || []).filter((l) => l && l.id && l.level && !core.has(l.source?.videoId));
  }
  return { LESSONS: [...w.LESSONS, ...auto], LEVELS: w.LEVELS, SKILLS: w.SKILLS, Daily: w.Daily || ctx.Daily };
}

const todayKey = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const prettyDate = () => new Intl.DateTimeFormat("vi-VN", { timeZone: TZ, weekday: "long", day: "2-digit", month: "2-digit" }).format(new Date());
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const link = (hash, dir = "") => (SITE ? `${SITE}${dir}#/${hash}` : "");

function buildMorning(site, zh) {
  const key = todayKey();
  const lines = [`☀️ <b>${LEVELS.length || !zh ? "English Path" : "Chinese Path"} · ${esc(prettyDate())}</b>`];
  const buttons = [];
  if (LEVELS.length) lines.push("", "⭐ <b>Bài của ngày</b> (×2 XP):");
  for (const lv of LEVELS) {
    const l = site.Daily.lesson(site.LESSONS, lv, key);
    if (!l) continue;
    const sk = site.SKILLS[l.skill] || { icon: "🎧", vi: "" };
    const title = esc(l.title) + (l.titleVi ? ` — <i>${esc(l.titleVi)}</i>` : "");
    lines.push(`• <b>${lv}</b> ${sk.icon} ${SITE ? `<a href="${link(`lesson/${encodeURIComponent(l.id)}`)}">${title}</a>` : title} · ~${l.minutes}′ · ${esc(l.source.provider)}`);
    if (SITE) buttons.push({ text: `${lv} ▶ Học ngay`, url: link(`lesson/${encodeURIComponent(l.id)}`) });
  }
  const mid = LEVELS[Math.floor(LEVELS.length / 2)];
  const w = mid && site.Daily.word(site.LESSONS, mid, key);
  if (w) lines.push("", `💡 <b>Từ của ngày</b> (${mid}): <b>${esc(w.w)}</b> — ${esc(w.vi)}`, w.ex ? `<i>“${esc(w.ex)}”</i>` : "");

  // 🇨🇳 tiếng Trung: cùng thuật toán với trang /zh/
  if (zh && ZH_LEVELS.length) {
    lines.push("", "🇨🇳 <b>Tiếng Trung — Bài của ngày</b>:");
    for (const lv of ZH_LEVELS) {
      const l = zh.Daily.lesson(zh.LESSONS, lv, key);
      if (!l) continue;
      const sk = zh.SKILLS[l.skill] || { icon: "🎧" };
      const title = esc(l.title) + (l.titleVi ? ` — <i>${esc(l.titleVi)}</i>` : "");
      const url = link(`lesson/${encodeURIComponent(l.id)}`, "zh/");
      lines.push(`• <b>${lv}</b> ${sk.icon} ${SITE ? `<a href="${url}">${title}</a>` : title} · ~${l.minutes}′`);
      if (SITE) buttons.push({ text: `🇨🇳 ${lv} ▶ Học`, url });
    }
    const zmid = ZH_LEVELS[0];
    const zw = zh.Daily.word(zh.LESSONS, zmid, key);
    if (zw) lines.push(`💡 <b>${esc(zw.w)}</b> <i>${esc(zw.py || "")}</i> — ${esc(zw.vi)}`, zw.ex ? `<i>“${esc(zw.ex)}”</i>${zw.exVi ? ` (${esc(zw.exVi)})` : ""}` : "");
  }
  lines.push("", "🔥 Học 1 bài hoặc ôn 5 phút flashcard để giữ chuỗi hôm nay!");
  if (SITE) buttons.push({ text: "🃏 Ôn flashcard", url: link("review") });
  return { text: lines.filter((x) => x !== undefined).join("\n"), buttons };
}

function buildEvening(site) {
  const key = todayKey();
  const tips = [
    "Chỉ cần 5 phút flashcard là chuỗi 🔥 được giữ.",
    "Thử Chép chính tả 5 câu — luyện tai cực nhanh ✍️",
    "Đoán nhanh 60 giây: bạn được bao nhiêu điểm hôm nay? ⚡",
    "Xem lại Bài của ngày với phụ đề CC, ghi 3 cụm từ hay 🎧",
    "Mỗi mốc 7 ngày liên tiếp bạn nhận 1 🧊 streak freeze."
  ];
  const tip = tips[site.Daily.hash(key + "|tip") % tips.length];
  const lines = [`🌙 <b>Hôm nay bạn đã học chưa?</b>`, "", tip, "", "Còn vài giờ nữa là hết ngày — đừng để chuỗi bị đứt nhé!"];
  const buttons = SITE ? [{ text: "🃏 Ôn 5 phút", url: link("review") }, { text: "🎮 Mini game", url: link("games") }] : [];
  return { text: lines.join("\n"), buttons };
}

async function send(chatId, { text, buttons }) {
  const body = {
    chat_id: chatId, text, parse_mode: "HTML", link_preview_options: { is_disabled: true },
    ...(buttons.length ? { reply_markup: { inline_keyboard: buttons.reduce((rows, b, i) => { if (i % 2 === 0) rows.push([]); rows[rows.length - 1].push(b); return rows; }, []) } } : {})
  };
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(`Telegram ${res.status}: ${data.description || "lỗi không rõ"}`);
}

async function main() {
  const site = await loadSite();
  const zh = ZH_LEVELS.length && existsSync(path.join(ROOT, "zh/js/data.js")) ? await loadSite("zh/") : null;
  const msg = mode === "evening" ? buildEvening(site) : buildMorning(site, zh);
  if (DRY) { console.log(msg.text); console.log("\n[buttons]", JSON.stringify(msg.buttons)); return; }
  const token = process.env.TELEGRAM_BOT_TOKEN, chats = (process.env.TELEGRAM_CHAT_ID || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!token || !chats.length) { console.log("Chưa cấu hình TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID — bỏ qua."); return; }
  if (!SITE) console.warn("⚠️ Chưa có SITE_URL — tin nhắn sẽ không có link.");
  let failed = 0;
  for (const id of chats) {
    try { await send(id, msg); console.log("Đã gửi tới", id); }
    catch (e) { failed++; console.error("Lỗi gửi tới", id, e.message); }
  }
  if (failed === chats.length) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
