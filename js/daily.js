/* ==========================================================================
   Bài của ngày — dùng chung cho trang web và bot Telegram (Node).
   Cùng ngày + cùng trình độ → cùng một bài cho mọi người.
   ========================================================================== */
(function (root) {
  function hash(str) {                     // FNV-1a 32-bit
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

  function pool(lessons, level) {
    return lessons.filter((l) => l.level === level && !l.custom)
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  }

  function lesson(lessons, level, dateKey) {
    const p = pool(lessons, level);
    if (!p.length) return null;
    return p[hash(`${dateKey}|${level}|lesson`) % p.length];
  }

  /** Từ của ngày: lấy từ vựng của các bài ở trình độ đó */
  function word(lessons, level, dateKey) {
    const words = [];
    pool(lessons, level).forEach((l) => (l.vocab || []).forEach((v) => words.push({ ...v, lessonId: l.id })));
    if (!words.length) return null;
    return words[hash(`${dateKey}|${level}|word`) % words.length];
  }

  root.Daily = { hash, lesson, word };
})(typeof window !== "undefined" ? window : globalThis);
