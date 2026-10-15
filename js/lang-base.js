/* ==========================================================================
   Cấu hình theo NGÔN NGỮ HỌC. Lõi app (store/app/review/sync/game) đọc window.LANG.
   - Trang tiếng Anh (/): chỉ nạp file này → dùng giá trị mặc định bên dưới.
   - Trang ngôn ngữ khác (/zh/, /ja/…): nạp <thư mục>/js/lang.js TRƯỚC file này
     để đặt window.LANG = { … } — chỉ cần ghi những gì khác tiếng Anh.
   Thêm ngôn ngữ mới: thêm 1 dòng vào LANGS và tạo thư mục /<id>/ (xem README).
   ========================================================================== */
(function () {
  /* Danh sách ngôn ngữ hiện trên nút đổi ngôn ngữ ở trang chủ */
  const LANGS = [
    { id: "en", flag: "🇬🇧", name: "Tiếng Anh", native: "English", href: "/" },
    { id: "zh", flag: "🇨🇳", name: "Tiếng Trung", native: "中文", href: "/zh/" }
  ];

  const EN = {
    id: "en",
    nameVi: "tiếng Anh",
    brand: "English Path",
    logo: "E",
    storeKey: "englishPath.v1",
    exportName: "english-path",
    tts: "en-GB",
    ttsMatch: [/en-GB/i, /^en/i],
    cc: "en",
    cjk: false,                       // true: so khớp theo ký tự (Trung/Nhật), không theo từ cách nhau bởi dấu cách
    pinyin: false,                    // true: từ vựng có trường py (phiên âm) và exPy
    testOrder: ["A1", "A2", "B1", "B2"],   // các cấp xét lần lượt trong bài test
    topLevel: "C1",                   // đạt cấp cuối của testOrder + điểm cao → lên cấp này
    testMore: `Muốn kiểm tra kỹ hơn, thử <a href="https://learnenglish.britishcouncil.org/english-levels/online-english-level-test" target="_blank" rel="noopener">level test của British Council ↗</a>.`,
    hero: {
      eyebrow: "Tự học tiếng Anh · CEFR A1 → C1",
      title: "Học đúng trình độ.<br>Thấy rõ mình tiến bộ.",
      lead: "Làm bài test nhanh 20 câu để xếp lộ trình, rồi học với bài nghe từ British Council, BBC và video YouTube. Tiến độ, thời gian và chuỗi ngày học được lưu ngay trên trình duyệt của bạn.",
      features: [
        ["🎯", "Xếp trình độ", "20 câu ngữ pháp & từ vựng, xếp bạn vào A1–C1."],
        ["🎧", "Bài học có nguồn thật", "Bài nghe British Council, BBC, TED/TED-Ed. Video YouTube tự đánh dấu hoàn thành khi xem hết."],
        ["📈", "Theo dõi tiến độ", "Số bài đã xong, phút học mỗi ngày, chuỗi ngày liên tiếp, % theo kỹ năng."]
      ]
    },
    providerLogo: { "British Council": "BC", "BBC Learning English": "BBC" },
    add: {
      title: "VD: English at Work – Episode 1",
      titleVi: "VD: Tiếng Anh công sở – tập 1",
      provider: "VD: BBC Learning English",
      vocab: "deadline | hạn chót | The deadline is on Friday.\nmeeting | cuộc họp | The meeting starts at 9."
    },
    voiceNote: "giọng Anh-Anh"
  };

  const L = Object.assign({}, EN, window.LANG || {});
  L.hero = Object.assign({}, EN.hero, (window.LANG || {}).hero || {});
  L.add = Object.assign({}, EN.add, (window.LANG || {}).add || {});
  L.LANGS = LANGS;
  L.allStoreKeys = ["englishPath.v1", "chinesePath.v1"];   // đăng xuất → xoá tiến trình mọi ngôn ngữ trên máy
  /** Phần thêm vào URL API tiến trình: tiếng Anh giữ nguyên đường dẫn cũ */
  L.progressUrl = L.id === "en" ? "/api/progress" : `/api/progress?lang=${L.id}`;
  window.LANG = L;
})();
