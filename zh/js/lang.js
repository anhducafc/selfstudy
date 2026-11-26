/* Cấu hình trang tiếng Trung — chỉ ghi phần khác tiếng Anh (xem js/lang-base.js) */
window.LANG = {
  id: "zh",
  nameVi: "tiếng Trung",
  brand: "Chinese Path",
  logo: "中",
  storeKey: "chinesePath.v1",
  exportName: "chinese-path",
  tts: "zh-CN",
  ttsMatch: [/zh[-_]CN/i, /cmn/i, /^zh/i],
  cc: "zh-Hans",
  cjk: true,
  pinyin: true,
  testOrder: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5"],   // cấp PY (pinyin) không có trong test: người mới học bắt đầu từ Kế hoạch
  topLevel: "HSK6",
  testMore: "Muốn thi thật, xem lịch và đề mẫu HSK tại trung tâm khảo thí gần bạn.",
  hero: {
    eyebrow: "Tự học tiếng Trung từ số 0 · Pinyin → HSK 6",
    title: "Nói tiếng Trung<br>mỗi ngày một chút.",
    lead: "Mới bắt đầu? Theo kế hoạch 4 giai đoạn (pinyin & chữ Hán → HSK 1–2 → HSK 3–4 → chủ đề nâng cao), 3 buổi/tuần, có thi cuối kỳ. Đã biết chút ít thì làm bài test 20 câu để xếp trình độ. Học với video Everyday Chinese, Mandarin Corner, ShuoshuoChinese 说说中文, CCTV; từ vựng có chữ Hán, pinyin, câu ví dụ và phát âm chuẩn.",
    features: [
      ["📅", "Kế hoạch từ số 0", "4 giai đoạn, lịch Thứ 2 – 4 – 6, 90 phút/buổi; đánh dấu từng buổi, thi cuối kỳ để lên giai đoạn mới."],
      ["🗣️", "Giao tiếp thật", "Chào hỏi, mua sắm, xin WeChat, phỏng vấn đường phố — video người bản xứ, tự đánh dấu khi xem hết."],
      ["🀄", "Chữ Hán + pinyin", "Flashcard có pinyin, ẩn/hiện phiên âm, chép chính tả bằng chữ Hán hoặc pinyin."]
    ]
  },
  providerLogo: { "CCTV Learn Chinese": "CCTV", "Hua Zhong Wen": "画", "Mandarin Corner": "MC" },
  add: {
    title: "VD: Spoken Chinese Lesson 2",
    titleVi: "VD: Hỏi đường bằng tiếng Trung",
    provider: "VD: Everyday Chinese",
    vocab: "朋友 | péngyou | bạn bè | 他是我的好朋友。\n喜欢 | xǐhuan | thích | 我喜欢喝茶。"
  },
  voiceNote: "giọng phổ thông"
};
