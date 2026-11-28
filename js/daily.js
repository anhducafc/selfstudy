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

  /** Collocation của ngày: xoay vòng các chủ đề của trình độ (thứ tự cố định theo hash),
   *  mỗi ngày 1 chủ đề — đi hết vòng rồi mới lặp lại. topics = window.COLLOCATIONS */
  function colloc(topics, level, dateKey) {
    const p = (topics || []).filter((t) => t.level === level)
      .sort((a, b) => hash(`${a.id}|colloc`) - hash(`${b.id}|colloc`) || (a.id < b.id ? -1 : 1));
    if (!p.length) return null;
    const [y, m, d] = String(dateKey).split("-").map(Number);
    const dayNo = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
    return p[(dayNo + (hash(level) % p.length)) % p.length];
  }

  root.Daily = { hash, lesson, word, colloc };
})(typeof window !== "undefined" ? window : globalThis);
