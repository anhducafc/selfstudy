#!/usr/bin/env node
/* ==========================================================================
   Phần 3 — Nhờ Claude soạn từ vựng (nghĩa tiếng Việt + câu ví dụ) và quiz
   cho các bài tự động còn trống (status: "new") trong data/auto-lessons.json.

   Claude không xem được video: nội dung được soạn từ tiêu đề + mô tả + chuỗi
   chương trình, nên bước duyệt Pull Request là để bạn kiểm tra trước khi lên web.

   Biến môi trường:
     ANTHROPIC_API_KEY   (bắt buộc)
     CLAUDE_MODEL        mặc định claude-sonnet-5-5 (rẻ hơn: claude-haiku-5-5)
     MAX_ENRICH          số bài tối đa mỗi lần chạy, mặc định 6
     ANTHROPIC_BASE_URL  mặc định https://api.anthropic.com (đổi để test)
     PR_BODY_FILE        file markdown để ghi phần xem trước cho Pull Request
     COURSE              en (mặc định) | zh — tiếng Trung: soạn thêm pinyin + nghĩa câu ví dụ
   ========================================================================== */
import { readFile, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ZH = process.env.COURSE === "zh";
const FILE = path.join(ROOT, ZH ? "zh/data/auto-lessons.json" : "data/auto-lessons.json");
const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
const MAX = Number(process.env.MAX_ENRICH) || 6;
const BASE = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/$/, "");
const log = (...a) => console.log("[enrich]", ...a);

const LEVEL_GUIDE = {
  A1: "very common everyday words; example sentences of 4–8 words, present simple",
  A2: "common words and short phrases; sentences of 5–10 words",
  B1: "useful topic words, phrasal verbs and collocations; natural sentences of 7–14 words",
  B2: "less common topic vocabulary, idioms and collocations; sentences of 8–16 words",
  C1: "advanced, precise or idiomatic language; sentences of 10–18 words"
};

const LEVEL_GUIDE_ZH = {
  HSK1: "HSK 1 words only; example sentences of 4–8 characters",
  HSK2: "HSK 1–2 words; sentences of 6–12 characters",
  HSK3: "HSK 3 words, result complements, 了/过; sentences of 8–15 characters",
  HSK4: "HSK 4 words and common connectors; sentences of 10–18 characters",
  HSK5: "HSK 5 vocabulary, formal verbs and set phrases; sentences of 12–22 characters",
  HSK6: "HSK 6 vocabulary, chengyu, colloquial/internet expressions; sentences of 12–25 characters"
};

const TOOL_EN = {
  name: "save_lesson",
  description: "Lưu bộ từ vựng và câu hỏi cho bài học tiếng Anh dành cho người Việt.",
  input_schema: {
    type: "object",
    properties: {
      titleVi: { type: "string", description: "Tiêu đề bài dịch sang tiếng Việt, ngắn gọn, tự nhiên" },
      goal: { type: "string", description: "1 câu tiếng Việt: người học sẽ luyện được gì qua video này" },
      vocab: {
        type: "array", minItems: 5, maxItems: 8,
        items: {
          type: "object",
          properties: {
            w: { type: "string", description: "Từ hoặc cụm từ tiếng Anh, viết thường trừ danh từ riêng" },
            vi: { type: "string", description: "Nghĩa tiếng Việt ngắn gọn (2–6 chữ), đúng nghĩa trong ngữ cảnh chủ đề" },
            ex: { type: "string", description: "Câu ví dụ tiếng Anh tự viết, PHẢI chứa đúng nguyên dạng chuỗi w" }
          },
          required: ["w", "vi", "ex"]
        }
      },
      questions: {
        type: "array", minItems: 3, maxItems: 4,
        items: {
          type: "object",
          properties: {
            q: { type: "string", description: "Câu hỏi tiếng Anh, dạng điền chỗ trống dùng ___ hoặc hỏi nghĩa/cách dùng" },
            options: { type: "array", minItems: 3, maxItems: 4, items: { type: "string" } },
            answer: { type: "integer", description: "Chỉ số (bắt đầu từ 0) của đáp án đúng trong options" },
            explain: { type: "string", description: "Giải thích ngắn bằng tiếng Việt" }
          },
          required: ["q", "options", "answer", "explain"]
        }
      }
    },
    required: ["titleVi", "goal", "vocab", "questions"]
  }
};

const TOOL_ZH = {
  name: "save_lesson",
  description: "Lưu bộ từ vựng và câu hỏi cho bài học tiếng Trung (giản thể) dành cho người Việt.",
  input_schema: {
    type: "object",
    properties: {
      titleVi: { type: "string", description: "Tiêu đề bài dịch sang tiếng Việt, ngắn gọn, tự nhiên" },
      goal: { type: "string", description: "1 câu tiếng Việt: người học sẽ luyện được gì qua video này" },
      vocab: {
        type: "array", minItems: 5, maxItems: 8,
        items: {
          type: "object",
          properties: {
            w: { type: "string", description: "Từ hoặc cụm từ tiếng Trung GIẢN THỂ (chữ Hán)" },
            py: { type: "string", description: "Pinyin có dấu thanh của w, vd: nǐ hǎo" },
            vi: { type: "string", description: "Nghĩa tiếng Việt ngắn gọn (2–6 chữ)" },
            ex: { type: "string", description: "Câu ví dụ tiếng Trung giản thể tự viết, PHẢI chứa nguyên văn chuỗi w" },
            exPy: { type: "string", description: "Pinyin có dấu thanh của cả câu ví dụ" },
            exVi: { type: "string", description: "Nghĩa tiếng Việt của câu ví dụ" }
          },
          required: ["w", "py", "vi", "ex", "exPy", "exVi"]
        }
      },
      questions: TOOL_EN.input_schema.properties.questions
    },
    required: ["titleVi", "goal", "vocab", "questions"]
  }
};
const TOOL = ZH ? TOOL_ZH : TOOL_EN;

const SYSTEM_ZH = `Bạn là giáo viên tiếng Trung giàu kinh nghiệm, soạn tài liệu tự học tiếng Trung giao tiếp cho người Việt Nam.
Bạn chỉ được cung cấp tiêu đề, mô tả và tên chương trình của một video YouTube — bạn KHÔNG xem được video.
Vì vậy:
- Chọn từ vựng chắc chắn liên quan tới chủ đề của tiêu đề/mô tả, đúng trình độ HSK được yêu cầu, viết bằng chữ Hán GIẢN THỂ.
- Không khẳng định chi tiết nội dung video mà mô tả không nói tới. Câu hỏi kiểm tra từ vựng/ngữ pháp liên quan chủ đề, không hỏi "trong video người nói đã nói gì".
- Câu ví dụ do bạn tự viết, tự nhiên như người bản xứ nói, và phải chứa đúng nguyên văn chuỗi "w".
- Pinyin có dấu thanh chuẩn (theo cách viết sách giáo khoa: biến điệu của 一/不 ghi theo cách đọc), tách theo từ.
- Câu hỏi viết bằng tiếng Trung (điền chỗ trống dùng ___) hoặc tiếng Việt; đáp án sai hợp lý nhưng rõ ràng là sai; chỉ có MỘT đáp án đúng.
Luôn trả lời bằng cách gọi công cụ save_lesson.`;

const SYSTEM_EN = `Bạn là giáo viên tiếng Anh giàu kinh nghiệm, soạn tài liệu tự học cho người Việt Nam.
Bạn chỉ được cung cấp tiêu đề, mô tả và tên chương trình của một video YouTube — bạn KHÔNG xem được video.
Vì vậy:
- Chọn từ vựng chắc chắn liên quan tới chủ đề của tiêu đề/mô tả, hữu ích ở trình độ CEFR được yêu cầu.
- Không khẳng định chi tiết nội dung video mà mô tả không nói tới. Câu hỏi kiểm tra từ vựng/ngữ pháp liên quan chủ đề, không hỏi "trong video người nói đã nói gì".
- Câu ví dụ do bạn tự viết, tự nhiên, theo tiếng Anh-Anh, và phải chứa đúng nguyên văn chuỗi "w".
- Nghĩa tiếng Việt chính xác, ngắn gọn, không dịch word-by-word.
- Các đáp án sai phải hợp lý nhưng rõ ràng là sai; chỉ có MỘT đáp án đúng.
Luôn trả lời bằng cách gọi công cụ save_lesson.`;
const SYSTEM = ZH ? SYSTEM_ZH : SYSTEM_EN;

async function callClaude(lesson) {
  const user = [
    ZH ? `Trình độ: ${lesson.level} (${LEVEL_GUIDE_ZH[lesson.level] || ""})` : `Trình độ CEFR: ${lesson.level} (${LEVEL_GUIDE[lesson.level] || ""})`,
    `Kỹ năng chính: ${lesson.skill}`,
    `Kênh / chương trình: ${lesson.source.provider}${lesson.series ? ` — ${lesson.series}` : ""}`,
    `Tiêu đề video: ${lesson.title}`,
    `Mô tả video:\n${(lesson.desc || "(không có)").slice(0, 1500)}`
  ].join("\n");

  const body = {
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM,
    tools: [TOOL],
    tool_choice: { type: "tool", name: TOOL.name },
    messages: [{ role: "user", content: user }]
  };

  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`${BASE}/v1/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const data = await res.json();
      const block = (data.content || []).find((b) => b.type === "tool_use" && b.name === TOOL.name);
      if (!block) throw new Error("Claude không trả về tool_use");
      return { input: block.input, usage: data.usage || {} };
    }
    const text = await res.text();
    if ([429, 500, 502, 503, 529].includes(res.status) && attempt < 4) {
      const wait = Number(res.headers.get("retry-after")) * 1000 || 2000 * 2 ** attempt;
      log(`HTTP ${res.status}, thử lại sau ${Math.round(wait / 1000)}s`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Kiểm tra & làm sạch kết quả. Trả null nếu không đủ chất lượng. */
export function validate(out, zh = ZH) {
  const problems = [];
  const str = (x) => (typeof x === "string" ? x.trim() : "");
  const seen = new Set();
  const vocab = (Array.isArray(out.vocab) ? out.vocab : []).map((v) => (zh
    ? { w: str(v.w), py: str(v.py), vi: str(v.vi), ex: str(v.ex), exPy: str(v.exPy), exVi: str(v.exVi) }
    : { w: str(v.w), vi: str(v.vi), ex: str(v.ex) }))
    .filter((v) => {
      if (!v.w || !v.vi || !v.ex || (zh && (!v.py || !v.exPy))) { problems.push(`thiếu trường: ${v.w || "?"}`); return false; }
      if (seen.has(v.w.toLowerCase())) return false;
      if (zh && !/\p{Script=Han}/u.test(v.w)) { problems.push(`"${v.w}" không phải chữ Hán`); return false; }
      if (zh ? !v.ex.includes(v.w) : !new RegExp(`(^|[^A-Za-z])${escapeRe(v.w)}([^A-Za-z]|$)`, "i").test(v.ex)) { problems.push(`câu ví dụ không chứa "${v.w}"`); return false; }
      seen.add(v.w.toLowerCase());
      return true;
    });
  const questions = (Array.isArray(out.questions) ? out.questions : []).map((q) => ({
    q: str(q.q), options: (Array.isArray(q.options) ? q.options : []).map(str).filter(Boolean),
    answer: Number.isInteger(q.answer) ? q.answer : -1, explain: str(q.explain)
  })).filter((q) => {
    const ok = q.q && q.options.length >= 3 && q.answer >= 0 && q.answer < q.options.length && new Set(q.options).size === q.options.length;
    if (!ok) problems.push(`câu hỏi lỗi: ${q.q.slice(0, 40)}`);
    return ok;
  });
  if (vocab.length < 4) return { ok: false, problems: [...problems, `chỉ còn ${vocab.length} từ hợp lệ`] };
  return { ok: true, problems, titleVi: str(out.titleVi), goal: str(out.goal), vocab: vocab.slice(0, 8), questions: questions.slice(0, 4) };
}

async function main() {
  if (!KEY) { log("Không có ANTHROPIC_API_KEY — bỏ qua Phần 3."); return; }
  const data = JSON.parse(await readFile(FILE, "utf8"));
  const todo = data.lessons.filter((l) => l.status === "new").slice(0, MAX);
  log(`${todo.length} bài cần soạn (model ${MODEL}).`);
  const report = [];
  let tokensIn = 0, tokensOut = 0;

  for (const l of todo) {
    try {
      const { input, usage } = await callClaude(l);
      tokensIn += usage.input_tokens || 0; tokensOut += usage.output_tokens || 0;
      const v = validate(input);
      if (!v.ok) {
        l.status = "failed"; l.aiError = v.problems.join("; ");
        report.push({ l, error: l.aiError });
        log("✗", l.title, l.aiError);
        continue;
      }
      Object.assign(l, {
        titleVi: v.titleVi, goal: v.goal || l.goal, vocab: v.vocab, questions: v.questions,
        status: "enriched", ai: { model: MODEL, at: new Date().toISOString() }
      });
      delete l.aiError;
      report.push({ l, warn: v.problems });
      log("✓", l.level, l.title, `${v.vocab.length} từ, ${v.questions.length} câu hỏi`);
    } catch (e) {
      report.push({ l, error: e.message });
      log("LỖI", l.title, e.message);      // giữ status "new" để lần sau thử lại
    }
  }

  await writeFile(FILE, JSON.stringify(data, null, 2) + "\n");

  if (process.env.PR_BODY_FILE && report.length) {
    const md = [`## ✨ ${ZH ? "🇨🇳 Tiếng Trung" : "🇬🇧 Tiếng Anh"} · Claude đã soạn ${report.filter((r) => !r.error).length}/${report.length} bài`, "",
      `Model: \`${MODEL}\` · token: ${tokensIn} vào / ${tokensOut} ra.`,
      "> Claude soạn từ **tiêu đề + mô tả**, không xem video. Hãy lướt qua nghĩa tiếng Việt và đáp án rồi bấm **Merge**. Muốn sửa: mở tab *Files changed* → sửa trực tiếp `" + path.relative(ROOT, FILE) + "`.", ""];
    for (const r of report) {
      const l = r.l;
      md.push(`<details${r.error ? "" : " open"}><summary><b>${l.level}</b> · ${l.title.replace(/</g, "&lt;")}${l.titleVi ? ` — <i>${l.titleVi}</i>` : ""}${r.error ? " ⚠️" : ""}</summary>`, "");
      if (r.error) { md.push(`⚠️ ${r.error}`, "", "</details>", ""); continue; }
      md.push(`[▶ Xem video](https://www.youtube.com/watch?v=${l.source.videoId}) · 🎯 ${l.goal}`, "",
        "| Từ | Nghĩa | Ví dụ |", "|---|---|---|",
        ...l.vocab.map((v) => `| **${v.w}**${v.py ? ` ${v.py}` : ""} | ${v.vi} | ${v.ex.replace(/\|/g, "/")}${v.exVi ? ` — ${v.exVi.replace(/\|/g, "/")}` : ""} |`), "");
      l.questions.forEach((q, i) => md.push(`${i + 1}. ${q.q} — ${q.options.map((o, k) => (k === q.answer ? `**✅ ${o}**` : o)).join(" · ")}`));
      if (r.warn && r.warn.length) md.push("", `<sub>Đã tự loại: ${r.warn.join("; ")}</sub>`);
      md.push("", "</details>", "");
    }
    await appendFile(process.env.PR_BODY_FILE, md.join("\n") + "\n");
  }
  if (report.length && report.every((r) => r.error && !/chỉ còn|thiếu/.test(r.error))) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
