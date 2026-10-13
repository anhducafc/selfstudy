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
     TELEGRAM_LEVELS      các trình độ gửi bài, mặc định "A2,B1,B2"
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
const LEVELS = (process.env.TELEGRAM_LEVELS || "A2,B1,B2").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
const DRY = !!process.env.DRY_RUN;

/* ---------- nạp dữ liệu giống hệt trình duyệt ---------- */
async function loadSite() {
  const ctx = { window: {}, console };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of ["js/data.js", "js/daily.js"]) vm.runInContext(await readFile(path.join(ROOT, f), "utf8"), ctx, { filename: f });
  const w = ctx.window;
  let auto = [];
  const autoFile = path.join(ROOT, "data/auto-lessons.json");
  if (existsSync(autoFile)) {
    const core = new Set(w.LESSONS.filter((l) => l.source.type === "youtube").map((l) => l.source.videoId));
    auto = (JSON.parse(await readFile(autoFile, "utf8")).lessons || []).filter((l) => l && l.id && l.level && !core.has(l.source?.videoId));
  }
  return { LESSONS: [...w.LESSONS, ...auto], LEVELS: w.LEVELS, SKILLS: w.SKILLS, Daily: w.Daily || ctx.Daily };
}

const todayKey = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const prettyDate = () => new Intl.DateTimeFormat("vi-VN", { timeZone: TZ, weekday: "long", day: "2-digit", month: "2-digit" }).format(new Date());
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const link = (hash) => (SITE ? `${SITE}#/${hash}` : "");

function buildMorning(site) {
  const key = todayKey();
  const lines = [`☀️ <b>English Path · ${esc(prettyDate())}</b>`, "", "⭐ <b>Bài của ngày</b> (×2 XP):"];
  const buttons = [];
  for (const lv of LEVELS) {
    const l = site.Daily.lesson(site.LESSONS, lv, key);
    if (!l) continue;
    const sk = site.SKILLS[l.skill] || { icon: "🎧", vi: "" };
    const title = esc(l.title) + (l.titleVi ? ` — <i>${esc(l.titleVi)}</i>` : "");
    lines.push(`• <b>${lv}</b> ${sk.icon} ${SITE ? `<a href="${link(`lesson/${encodeURIComponent(l.id)}`)}">${title}</a>` : title} · ~${l.minutes}′ · ${esc(l.source.provider)}`);
    if (SITE) buttons.push({ text: `${lv} ▶ Học ngay`, url: link(`lesson/${encodeURIComponent(l.id)}`) });
  }
  const mid = LEVELS[Math.floor(LEVELS.length / 2)] || "B1";
  const w = site.Daily.word(site.LESSONS, mid, key);
  if (w) lines.push("", `💡 <b>Từ của ngày</b> (${mid}): <b>${esc(w.w)}</b> — ${esc(w.vi)}`, w.ex ? `<i>“${esc(w.ex)}”</i>` : "");
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
  const msg = mode === "evening" ? buildEvening(site) : buildMorning(site);
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
