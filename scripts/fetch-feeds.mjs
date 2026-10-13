#!/usr/bin/env node
/* ==========================================================================
   Phần 2 — Lấy video mới từ RSS YouTube, gắn trình độ theo luật, ghi vào
   data/auto-lessons.json. Không cần API key, không cần thư viện ngoài (Node ≥ 20).

   Chạy:  node scripts/fetch-feeds.mjs
   Biến môi trường (tuỳ chọn):
     FEED_FIXTURE_DIR  thư mục chứa <handle>.xml để test offline (bỏ qua mạng)
     PR_BODY_FILE      file markdown để ghi tóm tắt (dùng làm nội dung Pull Request)
     DRY_RUN=1         chỉ in kết quả, không ghi file
   ========================================================================== */
import { readFile, writeFile, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = path.join(ROOT, "scripts/feeds.json");
const OUT = path.join(ROOT, "data/auto-lessons.json");
const FIXTURES = process.env.FEED_FIXTURE_DIR;
const UA = "Mozilla/5.0 (compatible; EnglishPathBot/1.0; +https://github.com)";

const log = (...a) => console.log("[feeds]", ...a);

/* ---------------- tiện ích XML (feed YouTube là Atom đơn giản) ---------------- */
const decode = (s = "") => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, "&");
const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`)); return m ? decode(m[1].trim()) : ""; };
const attr = (xml, name, a) => { const m = xml.match(new RegExp(`<${name}[^>]*\\s${a}="([^"]*)"`)); return m ? decode(m[1]) : ""; };

export function parseFeed(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    videoId: tag(e, "yt:videoId"),
    title: tag(e, "title"),
    link: attr(e, "link", "href"),
    published: tag(e, "published"),
    description: tag(e, "media:description"),
    channel: tag(e, "name")
  })).filter((v) => /^[\w-]{11}$/.test(v.videoId));
}

/* ---------------- mạng ---------------- */
async function get(url, { tries = 3, okStatuses = [200] } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA, "accept-language": "en" }, redirect: "follow" });
      if (okStatuses.includes(res.status) || res.status < 500) return res;
      last = new Error(`HTTP ${res.status}`);
    } catch (e) { last = e; }
    await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
  }
  throw last;
}

async function resolveChannelId(feed) {
  if (feed.channelId) return feed.channelId;
  const res = await get(`https://www.youtube.com/${feed.handle}`);
  const html = await res.text();
  const m = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/) ||
            html.match(/"externalId":"(UC[\w-]{22})"/) || html.match(/"channelId":"(UC[\w-]{22})"/);
  if (!m) throw new Error(`Không tìm được channelId cho ${feed.handle}`);
  return m[1];
}

async function loadFeedXml(feed) {
  if (FIXTURES) {
    const f = path.join(FIXTURES, `${feed.handle.replace(/^@/, "")}.xml`);
    return existsSync(f) ? readFile(f, "utf8") : "";
  }
  const id = await resolveChannelId(feed);
  const res = await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`);
  if (res.status !== 200) throw new Error(`RSS ${feed.handle}: HTTP ${res.status}`);
  return res.text();
}

/** YouTube oEmbed trả 401/403 nếu chủ video tắt nhúng, 404 nếu video riêng tư/bị xoá */
async function embeddable(videoId) {
  if (FIXTURES) return true;
  try {
    const res = await get(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`, { tries: 2 });
    return res.status === 200;
  } catch { return true; }   // lỗi mạng: không loại oan, trình phát trên web đã có xử lý lỗi
}

/* ---------------- phân loại ---------------- */
export function classify(feed, title) {
  for (const r of feed.rules || []) if (new RegExp(r.match, "i").test(title)) return r;
  return feed.default || null;
}

const cleanTitle = (t) => t.replace(/[⏲️⏱️🎧📺]/gu, "").replace(/\s*\|\s*BBC Learning English\s*$/i, "").replace(/\s{2,}/g, " ").trim();
const shortDesc = (d) => d.split(/\n/).map((s) => s.trim())
  .filter((s) => s && !/^(https?:|#|subscribe|follow us|find (us|more)|for more|visit|👉|✔️|►)/i.test(s) && !/patreon|merch|sponsor|newsletter|support (us|our)/i.test(s))
  .join("\n").slice(0, 600);

function defaultTasks(skill) {
  if (skill === "vocab") return ["Xem video, dừng lại ở mỗi từ/cụm từ mới", "Ghi 3 cụm từ và tự đặt câu vào ô Ghi chú", "Ôn lại bằng flashcard (nếu bài có từ vựng)"];
  if (skill === "grammar") return ["Xem video, chú ý cấu trúc được giải thích", "Viết 3 câu của riêng bạn dùng cấu trúc đó", "Làm quiz (nếu có)"];
  return ["Xem lần 1 không phụ đề, tóm tắt ý chính bằng 1 câu", "Xem lần 2 bật phụ đề CC, ghi 3 cụm từ mới", "Làm quiz (nếu có)"];
}

/* ---------------- chính ---------------- */
async function main() {
  const cfg = JSON.parse(await readFile(CONFIG, "utf8"));
  const data = existsSync(OUT) ? JSON.parse(await readFile(OUT, "utf8")) : { lessons: [] };
  const lessons = data.lessons || [];
  const known = new Set(lessons.map((l) => l.source?.videoId));

  // không trùng video đã có trong bài soạn sẵn (js/data.js)
  const coreSrc = await readFile(path.join(ROOT, "js/data.js"), "utf8");
  for (const m of coreSrc.matchAll(/videoId:\s*"([\w-]{11})"/g)) known.add(m[1]);

  const exclude = cfg.excludeTitle ? new RegExp(cfg.excludeTitle, "i") : null;
  const added = [];
  const errors = [];

  for (const feed of cfg.feeds) {
    let entries = [];
    try { entries = parseFeed(await loadFeedXml(feed)); }
    catch (e) { errors.push(`${feed.handle}: ${e.message}`); log("LỖI", feed.handle, e.message); continue; }
    log(feed.handle, `${entries.length} video trong RSS`);

    // cũ → mới để bài mới nhất được thêm cuối cùng (và không vượt quota)
    for (const v of entries.sort((a, b) => a.published.localeCompare(b.published))) {
      if (added.length >= cfg.maxNewPerRun) break;
      if (known.has(v.videoId)) continue;
      if (/\/shorts\//.test(v.link) || (exclude && exclude.test(v.title))) continue;
      const rule = classify(feed, v.title);
      if (!rule) continue;
      if (!(await embeddable(v.videoId))) { log("bỏ qua (không cho nhúng)", v.videoId, v.title); known.add(v.videoId); continue; }

      const lesson = {
        id: `yt-${v.videoId}`,
        level: rule.level,
        skill: rule.skill || "listening",
        title: cleanTitle(v.title),
        titleVi: "",
        source: { type: "youtube", provider: feed.provider, videoId: v.videoId },
        minutes: rule.minutes || 8,
        published: v.published,
        series: rule.series || feed.provider,
        desc: shortDesc(v.description),
        tasks: defaultTasks(rule.skill),
        vocab: [],
        questions: [],
        status: "new"
      };
      lessons.push(lesson);
      known.add(v.videoId);
      added.push(lesson);
      log("+", lesson.level, lesson.title);
    }
  }

  // giữ tối đa maxKeepPerFeed bài mới nhất mỗi nguồn (bài cũ hơn bị loại khỏi danh sách)
  const byProvider = {};
  lessons.sort((a, b) => (b.published || "").localeCompare(a.published || ""));
  const kept = lessons.filter((l) => {
    const k = l.source.provider;
    byProvider[k] = (byProvider[k] || 0) + 1;
    return byProvider[k] <= cfg.maxKeepPerFeed;
  });

  const out = { updated: new Date().toISOString(), lessons: kept };
  if (process.env.DRY_RUN) { log("DRY_RUN", JSON.stringify(added, null, 2)); return; }
  if (added.length || kept.length !== (data.lessons || []).length) {
    await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
  }
  log(`Thêm ${added.length} bài, tổng ${kept.length} bài tự động.`);

  if (process.env.PR_BODY_FILE) {
    const lines = [
      `## 📺 ${added.length} video mới từ RSS`,
      "",
      ...(added.length ? ["| Trình độ | Kỹ năng | Bài | Nguồn |", "|---|---|---|---|",
        ...added.map((l) => `| ${l.level} | ${l.skill} | [${l.title.replace(/\|/g, "/")}](https://www.youtube.com/watch?v=${l.source.videoId}) | ${l.source.provider} |`)] : ["Không có video mới."]),
      ...(errors.length ? ["", "⚠️ Lỗi khi đọc feed:", ...errors.map((e) => `- ${e}`)] : []),
      ""
    ];
    await appendFile(process.env.PR_BODY_FILE, lines.join("\n") + "\n");
  }
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `added=${added.length}\n`);
  if (errors.length === cfg.feeds.length) process.exitCode = 1;   // mọi feed đều lỗi → báo đỏ
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
