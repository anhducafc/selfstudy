/* ==========================================================================
   Chinese Path — KẾ HOẠCH HỌC TỪ SỐ 0 (4 giai đoạn, có thi cuối kỳ)
   --------------------------------------------------------------------------
   Lịch: 3 buổi/tuần (Thứ 2 – Thứ 4 – Thứ 6), mỗi buổi 90 phút.
   Mỗi tuần có đúng 3 buổi theo thứ tự T2, T4, T6. Buổi có `lessons` = id bài trong data.js.
   Bài thi: câu soạn tay { q, options, answer, explain, say? } hoặc { type: "fill", q, answer, py, hint }
            (`say` = câu được đọc bằng giọng máy để luyện nghe) + `auto` câu tự sinh từ từ vựng các cấp của giai đoạn.
   Mốc từ vựng theo HSK 3.0 (thi chính thức từ 13/12/2026): HSK1 300 · HSK2 500 · HSK3 1.000 · HSK4 2.000 từ.
   ========================================================================== */
(function () {
  const S = (t, lessons, tasks) => ({ t, lessons: lessons || [], tasks: tasks || [] });
  const W = (title, sessions, extra) => Object.assign({ title, sessions }, extra || {});
  const P = (w, py, vi) => ({ w, py, vi });

  /* ---------- Giai đoạn 2–3: khung 3 buổi/tuần ---------- */
  const wk = (title, main, o) => W(title, [
    S("Học mới", main, [
      "Xem video bài chính: lần 1 không phụ đề, lần 2 bật CC và nhại theo",
      "Học từ vựng của bài (🔊 nghe – đọc theo), làm quiz đến khi ≥ 80%",
      ...(o.mon || [])
    ]),
    S("Sách & ngữ pháp", o.wedLessons, [
      o.book,
      o.write,
      ...(o.wed || [])
    ]),
    S("Ôn tập & nói", o.friLessons, [
      "Flashcard (mục Ôn tập) + mini game Chép chính tả 10 phút",
      o.speak,
      ...(o.fri || [])
    ])
  ], o.extra);

  /* ---------- Giai đoạn 4: mỗi chủ đề 2 tuần ---------- */
  const topic = (n, name, zh, lessons, phrases, task) => [
    W(`Chủ đề ${n}/12 · ${name} (${zh}) — tuần 1`, [
      S("Nghe & từ khoá", lessons.slice(0, 1), ["Học 6 từ khoá bên dưới (🔊 đọc theo, chép vào vở)", "Nghe/xem tài liệu chủ đề 30 phút (video trong lộ trình hoặc mục “Video mới” HSK5–6), ghi lại 10 cụm từ hay"]),
      S("Đọc & ghi chép", [], ["Đọc 1–2 bài báo/đoạn văn về chủ đề (giáo trình, trang tin tiếng Trung đơn giản)", "Tóm tắt bằng 5 câu tiếng Trung"]),
      S("Nói: nhập vai", [], [`Nhập vai: ${task}`, "Ghi âm 2 phút, nghe lại và sửa 3 lỗi"])
    ], { phrases }),
    W(`Chủ đề ${n}/12 · ${name} (${zh}) — tuần 2`, [
      S("Nghe sâu", lessons.slice(1), ["Nghe thêm 1 tài liệu cùng chủ đề, lần này không phụ đề", "Shadowing 5 phút một đoạn bạn thích"]),
      S("Viết", [], ["Viết 250–300 chữ về chủ đề (email, bài đăng, nhật ký)", "Tự soát bằng từ điển Pleco; đọc to bài viết"]),
      S("Thuyết trình & tự chấm", [], ["Thuyết trình 2–3 phút về chủ đề, ghi âm", "Tự chấm: trôi chảy · dùng đúng từ khoá · phát âm/thanh điệu (mỗi mục 1–5 điểm), ghi vào ô Ghi chú"])
    ], { phrases })
  ];

  window.STUDY_PLAN = {
    title: "Kế hoạch học tiếng Trung từ số 0",
    intro: "4 giai đoạn: Pinyin & chữ Hán → HSK 1–2 → HSK 3–4 → giao tiếp nâng cao theo chủ đề. Học 3 buổi/tuần (T2 – T4 – T6), mỗi buổi 90 phút; cuối mỗi giai đoạn có bài thi để biết đã đủ vững sang giai đoạn sau chưa.",
    days: [1, 3, 5],                 // getDay(): Thứ 2, Thứ 4, Thứ 6
    dayNames: ["Thứ 2", "Thứ 4", "Thứ 6"],
    minutes: 90,
    offDays: "Ngày không có buổi học: 10 phút flashcard để giữ chuỗi 🔥 (không bắt buộc).",

    phases: [
      /* =========================== GIAI ĐOẠN 1 =========================== */
      {
        id: "p1", short: "GĐ 1", name: "Ngữ âm Pinyin & chữ Hán", range: "2–4 tuần · chọn 4 tuần", levels: ["PY"], nextLevel: "HSK1",
        goal: "Đọc đúng mọi âm tiết pinyin với thanh điệu chuẩn, nghe phân biệt 4 thanh; viết đúng nét, đúng bút thuận và nhận ra các bộ thủ thường gặp.",
        outcomes: ["Đọc trơn cả bảng pinyin: thanh mẫu, vận mẫu, âm tiết", "Nghe đoán đúng thanh điệu ≥ 80%", "Nắm 3 quy tắc biến điệu (3+3, 不, 一)", "Viết đúng bút thuận ~30 chữ cơ bản, biết 20 bộ thủ", "Gõ tiếng Trung bằng bộ gõ pinyin"],
        template: [[10, "Khởi động: flashcard + đọc to 4 thanh"], [30, "Video bài mới, dừng lại nhại theo"], [20, "Luyện phát âm: đọc to, ghi âm, so sánh"], [25, "Luyện viết: vở ô vuông, đúng bút thuận"], [5, "Ghi chú & đánh dấu hoàn thành"]],
        books: ["Vở tập viết chữ Hán ô 田字格/米字格 (vở tô chữ cho người mới)", "App Pleco (từ điển, bút thuận) hoặc trang Hanzi Writer", "Bảng pinyin có âm thanh của Everyday Chinese (trong bài “Bảng pinyin”)"],
        weeks: [
          W("Tuần 1 · Thanh điệu & âm cơ bản", [
            S("Tổng quan pinyin & 4 thanh", ["py-overview"], ["Đọc to mā má mǎ mà ma 10 lần, vừa đọc vừa vẽ thanh bằng tay", "Vở luyện chữ: tô 1 trang nét ngang 一 và nét sổ 丨"]),
            S("6 vận mẫu đơn", ["py-finals"], ["Ghi âm a o e i u ü × 4 thanh, nghe lại", "Viết 一 二 三 十 (mỗi chữ 1 dòng)"]),
            S("Thanh mẫu b p m f · d t n l · g k h", ["py-initials1"], ["Luyện cặp bật hơi: bā–pā, dā–tā, gē–kē (tờ giấy trước miệng)", "Viết 人 大 小 (mỗi chữ 1 dòng)"])
          ]),
          W("Tuần 2 · Thanh mẫu khó & vận mẫu kép", [
            S("j q x", ["py-jqx"], ["Đọc chuỗi jī qī xī – jiā qiā xiā – jù qù xù", "Viết 七 八 九 家 (chữ 家 nhìn Hanzi Writer)"]),
            S("z c s · zh ch sh r", ["py-zhchshr"], ["Câu luyện 四是四，十是十 — 10 lần, nhanh dần, ghi âm", "Viết 四 五 六 中"]),
            S("Vận mẫu kép & vận mẫu mũi", ["py-compound"], ["Đọc cặp -n/-ng: fàn–fàng, mén–méng, xīn–xīng", "Ôn flashcard tất cả từ đã học"])
          ]),
          W("Tuần 3 · Biến điệu & viết chữ", [
            S("Biến điệu 3+3, 不, 一", ["py-sandhi"], ["Đọc to: 你好 很好 不是 不对 一起 一样 一个", "Tự đặt 3 câu với 不 và đọc đúng biến điệu"]),
            S("Các nét cơ bản", ["py-strokes"], ["Vở luyện chữ: mỗi nét cơ bản 1 dòng", "Viết 口 山 中 (mỗi chữ 1 dòng)"]),
            S("Quy tắc bút thuận", ["py-stroke-order"], ["Viết 日 月 水 火 木 本 vừa viết vừa đọc to tên quy tắc", "Kiểm tra bút thuận bằng Pleco/Hanzi Writer"])
          ]),
          W("Tuần 4 · Bộ thủ, tổng ôn & thi", [
            S("Cấu tạo chữ Hán & 20 bộ thủ", ["py-building", "py-radicals"], ["Lập bảng bộ thủ – nghĩa – 2 chữ ví dụ", "Viết 好 明 休 妈 他 说"]),
            S("Tổng ôn phát âm", ["py-syllables", "py-review", "py-chart"], ["Cài bộ gõ pinyin (Tiếng Trung giản thể) trên điện thoại/máy tính, gõ thử 10 từ đã học", "Tự đánh dấu các mục Tự đánh giá của giai đoạn 1"]),
            S("📝 Thi cuối kỳ Giai đoạn 1", [], ["Làm bài thi (≈30 phút) — đạt ≥ 80% là qua", "Câu sai: mở lại bài tương ứng ôn 20 phút rồi thi lại"])
          ])
        ],
        exam: {
          title: "Thi cuối kỳ Giai đoạn 1 · Pinyin & chữ Hán", minutes: 30, pass: 0.8, auto: 0,
          note: "Bật loa: các câu 🔊 sẽ đọc bằng giọng phổ thông của trình duyệt. Câu điền: gõ chữ Hán hoặc pinyin không dấu đều được.",
          questions: [
            { say: "妈", q: "Nghe và chọn pinyin đúng", options: ["mā", "má", "mǎ", "mà"], answer: 0 },
            { say: "马", q: "Nghe và chọn pinyin đúng", options: ["mǎ", "mā", "má", "mà"], answer: 0 },
            { say: "骂", q: "Nghe và chọn pinyin đúng", options: ["mà", "mā", "má", "mǎ"], answer: 0 },
            { say: "谢谢", q: "Nghe và chọn pinyin đúng", options: ["xièxie", "jièjie", "shèshe", "qièqie"], answer: 0 },
            { say: "去", q: "Nghe và chọn pinyin đúng", options: ["qù", "jù", "xù", "cù"], answer: 0 },
            { say: "是", q: "Nghe và chọn pinyin đúng", options: ["shì", "sì", "xì", "rì"], answer: 0 },
            { say: "七", q: "Nghe và chọn pinyin đúng", options: ["qī", "jī", "chī", "xī"], answer: 0 },
            { say: "中国", q: "Nghe và chọn pinyin đúng", options: ["Zhōngguó", "Zōngguó", "Zhōnggó", "Jōngguó"], answer: 0 },
            { q: "你好 (nǐ hǎo) khi nói thực tế đọc là:", options: ["ní hǎo", "nǐ hǎo (giữ hai thanh 3)", "nǐ háo", "nī hǎo"], answer: 0, explain: "3 + 3 → 2 + 3." },
            { q: "不 trong 不是 đọc là:", options: ["bú", "bù", "bǔ", "bū"], answer: 0, explain: "不 + thanh 4 → bú." },
            { q: "一 trong 一起 (cùng nhau) đọc là:", options: ["yì", "yí", "yī", "yǐ"], answer: 0, explain: "一 + thanh 1/2/3 → yì." },
            { q: "一 trong 一样 (giống nhau) đọc là:", options: ["yí", "yì", "yī", "yǐ"], answer: 0, explain: "一 + thanh 4 → yí." },
            { q: "Âm nào là âm bật hơi?", options: ["p", "b", "d", "g"], answer: 0, explain: "p, t, k, q, ch, c là âm bật hơi." },
            { q: "Sau j, q, x, chữ ü viết thế nào?", options: ["ju, qu, xu (bỏ hai chấm)", "jü, qü, xü", "jv, qv, xv", "jiu, qiu, xiu"], answer: 0 },
            { q: "Âm tiết nào viết SAI quy tắc pinyin?", options: ["iu (đứng một mình)", "you", "wo", "yu"], answer: 0, explain: "Khi không có thanh mẫu, iu phải viết là you." },
            { q: "Chữ 十 viết theo thứ tự:", options: ["Ngang trước, sổ sau", "Sổ trước, ngang sau", "Hai nét cùng lúc", "Tuỳ ý"], answer: 0 },
            { q: "Chữ 口 có mấy nét?", options: ["3", "2", "4", "5"], answer: 0 },
            { q: "Bộ 氵 liên quan đến:", options: ["nước", "lửa", "người", "cây"], answer: 0 },
            { q: "Bộ 亻 liên quan đến:", options: ["người", "tay", "miệng", "lời nói"], answer: 0 },
            { q: "Chữ 明 (sáng) ghép từ:", options: ["日 + 月", "目 + 月", "日 + 木", "口 + 月"], answer: 0 },
            { q: "Chữ 妈 (mā): phần 马 (mǎ) giúp ta biết:", options: ["cách đọc", "nghĩa", "số nét", "không gì cả"], answer: 0 },
            { type: "fill", q: "Viết từ “cảm ơn”", answer: "谢谢", py: "xièxie", hint: "cảm ơn" },
            { type: "fill", q: "Viết từ “xin chào”", answer: "你好", py: "nǐ hǎo", hint: "xin chào" },
            { type: "fill", q: "Viết số “tám”", answer: "八", py: "bā", hint: "tám" },
            { type: "fill", q: "Viết chữ “người”", answer: "人", py: "rén", hint: "người" }
          ],
          checklist: [
            "Đọc to cả bảng pinyin không cần nhìn hướng dẫn, ghi âm lại và so với bảng có âm thanh",
            "Nghe 20 ô ngẫu nhiên trong bảng pinyin, đoán đúng thanh điệu ít nhất 16 ô",
            "Viết đúng bút thuận khoảng 30 chữ cơ bản (一 → 十, 人 大 小 口 日 月 山 水 火 木 中…)",
            "Gõ được tiếng Trung bằng bộ gõ pinyin trên điện thoại hoặc máy tính"
          ]
        }
      },

      /* =========================== GIAI ĐOẠN 2 =========================== */
      {
        id: "p2", short: "GĐ 2", name: "Nền tảng sơ cấp HSK 1–2", range: "2–3 tháng · chọn 12 tuần", levels: ["HSK1", "HSK2"], nextLevel: "HSK3",
        goal: "Nắm khoảng 500 từ HSK 1–2 (chuẩn HSK 3.0) và ngữ pháp cơ bản (是, 有, 在, 了, 过, 比, 还是…); giao tiếp được các tình huống quen thuộc: chào hỏi, gia đình, mua sắm, giờ giấc, ăn uống.",
        outcomes: ["≈ 500 từ, ≈ 370 chữ Hán đọc được", "Tự giới thiệu 1 phút trôi chảy", "Hỏi giá, mặc cả, gọi món, hỏi đường đơn giản", "Viết tay ~200 chữ thông dụng", "Sẵn sàng thi HSK 2"],
        template: [[15, "Flashcard ôn tập (Leitner)"], [30, "Bài mới: video + từ vựng + quiz"], [20, "Giáo trình / ngữ pháp"], [20, "Viết chữ: 10–15 chữ mới"], [5, "Nói: shadowing, tự nói 5 câu"]],
        books: ["Một bộ giáo trình chính: “HSK Standard Course 1–2” (HSK标准教程) hoặc “Giáo trình Hán ngữ” quyển 1–2 — nếu mua mới, ưu tiên bản theo HSK 3.0", "Vở luyện viết chữ Hán HSK 1–2", "Đề thi thử HSK 1, HSK 2 chính thức (bản HSK 3.0)"],
        weeks: [
          wk("Tuần 1 · Chào hỏi & giới thiệu bản thân", ["zh1-greetings"], { book: "Giáo trình: bài 1–2 (chào hỏi, tên, quốc tịch)", write: "Viết chữ: 你 好 我 是 叫 什么 名字", speak: "Tự giới thiệu 5 câu (tên, quốc tịch, nghề, tuổi, sở thích), ghi âm" }),
          wk("Tuần 2 · Gia đình", ["zh1-family"], { book: "Giáo trình: bài 3 (gia đình, 有/没有)", write: "Viết chữ: 爸 妈 哥 姐 弟 妹 家 口", speak: "Giới thiệu gia đình: 我家有…口人，…" }),
          wk("Tuần 3 · Quốc gia & ngôn ngữ", ["zh1-countries"], { book: "Giáo trình: bài 4 (哪国人, 会说…)", write: "Viết chữ: 国 中 越 南 人 会 说 汉 语", speak: "Hỏi – đáp: 你是哪国人？你会说什么语言？" }),
          wk("Tuần 4 · Mẫu câu mở đầu hội thoại", ["zh1-starters"], { book: "Giáo trình: bài 5 (câu hỏi 吗, 呢, 吧)", write: "Viết chữ: 吗 呢 吧 去 来 想 要", speak: "Shadowing 10 câu trong video, mỗi câu 3 lần" }),
          wk("Tuần 5 · Số đếm, giờ giấc, ngày tháng", ["zh1-cctv"], { book: "Giáo trình: bài 6–7 (几点, 星期, 号)", write: "Viết chữ: 点 分 半 天 年 月 日 星期", speak: "Kể lịch một ngày của bạn: 我七点起床…", mon: ["Bài CCTV mở ở tab mới: xem 2–3 tập ngắn"] }),
          wk("Tuần 6 · Tổng ôn HSK 1", ["zh1-vocab150", "zh1-100conv"], { book: "Giáo trình: ôn tập + làm 1 đề thi thử HSK 1", write: "Chép chính tả 30 từ HSK 1 hay sai", speak: "Đóng vai 3 đoạn hội thoại trong video 100 hội thoại", fri: ["Mốc kiểm tra: quiz mọi bài HSK 1 đạt ≥ 80%, đặt trình độ hiện tại = HSK1 xong"] }),
          wk("Tuần 7 · Mua sắm & mặc cả", ["zh2-shopping"], { book: "Giáo trình HSK 2: bài mua sắm (多少钱, 太…了, 便宜一点)", write: "Viết chữ: 买 卖 钱 块 贵 便宜 颜色 衣服", speak: "Nhập vai người bán – người mua, mặc cả 1 món đồ" }),
          wk("Tuần 8 · Xin số điện thoại, kết bạn WeChat", ["zh2-wechat"], { book: "Giáo trình: bài điện thoại, số đếm lớn", write: "Viết chữ: 电话 号码 手机 朋友 加 微信", speak: "Hỏi – đáp số điện thoại, xin WeChat một người bạn mới", extra: { note: "Nếu tuần này trùng kỳ nghỉ (Tết, du lịch…), bấm “Nghỉ tuần này” — cả lộ trình tự lùi 1 tuần." } }),
          wk("Tuần 9 · Nói “có / được” tự nhiên · 了", ["zh2-say-yes"], { book: "Giáo trình: bài có 了 (đã xảy ra) và 过 (từng)", write: "Viết chữ: 了 过 对 行 可以 没", speak: "Kể 5 việc bạn đã làm hôm qua với 了", wedLessons: ["zh2-le"] }),
          wk("Tuần 10 · 350 cụm từ thông dụng", ["zh2-350phrases"], { book: "Giáo trình: câu so sánh 比, 还是 / 或者", write: "Viết chữ: 比 更 还是 或者 一起 觉得", speak: "So sánh 2 thành phố/2 món ăn bằng 比 (5 câu)" }),
          wk("Tuần 11 · Trọn bộ từ HSK 2", ["zh2-mc-hsk2"], { book: "Giáo trình: ôn tập + 1 đề thi thử HSK 2", write: "Chép chính tả 30 từ HSK 2 hay sai", speak: "Nói 1 phút về cuối tuần của bạn" }),
          W("Tuần 12 · Tổng ôn & thi cuối kỳ", [
            S("Ôn tập theo lỗi sai", [], ["Ôn flashcard đến hết thẻ đến hạn", "Mở lại 3 bài có điểm quiz thấp nhất, làm lại quiz", "Tự giới thiệu 1 phút — ghi âm bản “thi thử”"]),
            S("Đề thi thử HSK 2", [], ["Làm 1 đề HSK 2 chính thức (bản HSK 3.0) bấm giờ", "Đánh dấu các mục Tự đánh giá của giai đoạn 2"]),
            S("📝 Thi cuối kỳ Giai đoạn 2", [], ["Làm bài thi (≈40 phút) — đạt ≥ 80% là qua", "Ghi lại điểm thi thử HSK 2 vào ô ghi chú"])
          ])
        ],
        exam: {
          title: "Thi cuối kỳ Giai đoạn 2 · HSK 1–2", minutes: 40, pass: 0.8, auto: 8,
          note: "22 câu soạn sẵn (nghe, ngữ pháp, viết) + 8 câu từ vựng rút ngẫu nhiên từ các bài HSK 1–2.",
          questions: [
            { say: "你叫什么名字？", q: "Câu này hỏi gì?", options: ["Tên", "Tuổi", "Quốc tịch", "Nghề nghiệp"], answer: 0 },
            { say: "我家有四口人。", q: "Nhà người nói có mấy người?", options: ["4 người", "10 người", "3 người", "5 người"], answer: 0 },
            { say: "现在八点半。", q: "Bây giờ là mấy giờ?", options: ["8:30", "8:00", "9:30", "8:15"], answer: 0 },
            { say: "这件衣服多少钱？", q: "Người nói đang hỏi gì?", options: ["Giá tiền", "Màu sắc", "Kích cỡ", "Chỗ mua"], answer: 0 },
            { say: "我明天不去上班。", q: "Ngày mai người nói thế nào?", options: ["Không đi làm", "Đi làm", "Đi học", "Đi du lịch"], answer: 0 },
            { q: "她___老师。", py: "Tā ___ lǎoshī.", options: ["是", "在", "有", "去"], answer: 0 },
            { q: "你家___几口人？", py: "Nǐ jiā ___ jǐ kǒu rén?", options: ["有", "是", "在", "叫"], answer: 0 },
            { q: "他___家吗？——不在。", py: "Tā ___ jiā ma? — Bú zài.", options: ["在", "是", "有", "去"], answer: 0 },
            { q: "你喝茶___喝咖啡？", py: "Nǐ hē chá ___ hē kāfēi?", options: ["还是", "或者", "和", "也"], answer: 0, explain: "Câu hỏi lựa chọn dùng 还是; 或者 dùng trong câu trần thuật." },
            { q: "我___去过中国。", py: "Wǒ ___ qù guo Zhōngguó.", options: ["没", "不", "别", "很"], answer: 0, explain: "Phủ định của 过 dùng 没." },
            { q: "今天比昨天___。", py: "Jīntiān bǐ zuótiān ___.", options: ["热", "很热", "非常热", "太热了"], answer: 0, explain: "Câu so sánh 比 không dùng 很/非常/太." },
            { q: "我们一起去吃饭___！", py: "Wǒmen yìqǐ qù chīfàn ___!", options: ["吧", "过", "着", "得"], answer: 0 },
            { q: "他说汉语说___很好。", py: "Tā shuō Hànyǔ shuō ___ hěn hǎo.", options: ["得", "的", "地", "了"], answer: 0, explain: "Bổ ngữ trạng thái: động từ + 得 + đánh giá." },
            { q: "Từ trái nghĩa với 大 là:", options: ["小", "多", "少", "长"], answer: 0 },
            { q: "“Rất vui được làm quen” là:", options: ["认识你很高兴", "你好吗", "没关系", "不客气"], answer: 0 },
            { q: "Người ta nói 谢谢, đáp lại tự nhiên nhất là:", options: ["不客气", "对不起", "你好吗", "再见吧"], answer: 0 },
            { q: "Đi taxi, muốn nói “Cho tôi đến sân bay”:", options: ["请去机场。", "我是机场。", "机场有我。", "我在机场吗？"], answer: 0 },
            { type: "fill", q: "Viết từ “bạn bè”", answer: "朋友", py: "péngyou", hint: "bạn bè" },
            { type: "fill", q: "Viết từ “hôm nay”", answer: "今天", py: "jīntiān", hint: "hôm nay" },
            { type: "fill", q: "Hỏi giá: 多少_____？", answer: "钱", py: "qián", hint: "tiền" },
            { type: "fill", q: "Viết từ “đi làm”", answer: "上班", py: "shàngbān", hint: "đi làm" },
            { type: "fill", q: "Viết từ “thích”", answer: "喜欢", py: "xǐhuan", hint: "thích" }
          ],
          checklist: [
            "Tự giới thiệu 1 phút (tên, nghề, gia đình, sở thích) không nhìn giấy — có ghi âm",
            "Nhập vai được: hỏi giá & mặc cả, gọi món, hỏi đường, hẹn giờ gặp",
            "Flashcard: phần lớn thẻ HSK 1–2 đã lên hộp 3 trở lên",
            "Viết tay được khoảng 200 chữ Hán thường gặp",
            "(Nên làm) Đề thi thử HSK 2 chính thức đạt từ 60% trở lên"
          ]
        }
      },

      /* =========================== GIAI ĐOẠN 3 =========================== */
      {
        id: "p3", short: "GĐ 3", name: "Giao tiếp & đọc hiểu HSK 3–4", range: "3–6 tháng · chọn 24 tuần", levels: ["HSK3", "HSK4"], nextLevel: "HSK5",
        goal: "Lên khoảng 2.000 từ (HSK 4 chuẩn 3.0); nói chuyện liền mạch về đời sống, công việc, sở thích; đọc hiểu đoạn văn 300–500 chữ và nghe hiểu video người bản xứ nói chậm.",
        outcomes: ["≈ 2.000 từ, ≈ 1.100 chữ", "Nói liên tục 3 phút về một chủ đề quen thuộc", "Đọc truyện phân cấp không cần tra từ liên tục", "Viết đoạn văn 200 chữ nêu ý kiến", "Sẵn sàng thi HSK 3 rồi HSK 4"],
        template: [[15, "Flashcard"], [30, "Nghe: video chính, 2 lượt (không/có phụ đề)"], [20, "Đọc hiểu: giáo trình hoặc truyện phân cấp"], [15, "Ngữ pháp & bài tập"], [10, "Nói/viết: kể lại bằng lời của mình"]],
        books: ["Giáo trình “HSK Standard Course 3–4” hoặc “Giáo trình Hán ngữ” quyển 3–4 (ưu tiên bản HSK 3.0 nếu mua mới)", "Truyện phân cấp: Mandarin Companion, Chinese Breeze 汉语风 (cấp 300–750 từ)", "Sách luyện đề + đề thi thử HSK 3, HSK 4 chính thức"],
        weeks: [
          wk("Tuần 1 · Hỏi han hằng ngày như người bản xứ", ["zh3-questions"], { book: "Giáo trình HSK 3: bài 1–2", write: "Viết 10 câu hỏi thăm hỏi bạn hay dùng", speak: "Hỏi – đáp 10 câu trong video với chính mình (đổi vai)" }),
          wk("Tuần 2 · Vị trí của 了", ["zh3-le2"], { book: "Giáo trình: bài có 了 cuối câu / sau động từ", write: "Viết nhật ký 8 câu có 了", speak: "Kể lại cuối tuần vừa rồi (1 phút)" }),
          wk("Tuần 3 · Dạo quanh khu phố — tả nơi ở", ["zh3-walk"], { book: "Giáo trình: phương vị từ (旁边, 对面, 附近)", write: "Viết 100 chữ tả khu phố nhà bạn", speak: "Dẫn đường bằng lời: từ nhà bạn tới quán cà phê gần nhất" }),
          wk("Tuần 4 · Bổ ngữ kết quả", ["zh3-result"], { book: "Giáo trình: 完, 到, 懂, 好, 错 sau động từ", write: "Viết 10 câu với bổ ngữ kết quả", speak: "Kể lại 1 đoạn phim bằng 5 câu" }),
          wk("Tuần 5 · Từ vựng HSK 3 (phần 1)", ["zh3-mc-hsk3"], { book: "Giáo trình: bài 5–6", write: "Chép 30 từ mới vào vở, mỗi từ 1 câu ví dụ", speak: "Dùng 10 từ mới nói về công việc của bạn", mon: ["Video dài: xem 30 phút đầu, các buổi khác xem tiếp"] }),
          wk("Tuần 6 · Từ vựng HSK 3 (phần 2) & nhớ từ bằng hình", ["zh3-mc-hsk3"], { book: "Giáo trình: bài 7–8", write: "Chép 30 từ mới, đặt câu", speak: "Kể 1 kỷ niệm du lịch (2 phút)", friLessons: ["zh3-huazhongwen"] }),
          wk("Tuần 7 · Đọc truyện phân cấp", [], { book: "Đọc 1 truyện phân cấp (≈ 300–500 từ): mỗi buổi 2–3 chương", write: "Tóm tắt mỗi chương 3 câu", speak: "Kể lại câu chuyện cho người khác nghe (hoặc ghi âm)", mon: ["Thay video chính bằng 1 video trong mục “Video mới” cấp HSK3"] }),
          wk("Tuần 8 · Bổ ngữ xu hướng & bổ ngữ khả năng", [], { book: "Giáo trình: 上来/下去/回来…, 听得懂/听不懂", write: "Viết 10 câu có 得/不 + bổ ngữ", speak: "Nói về điều bạn làm được/không làm được bằng tiếng Trung", mon: ["Video chính: 1 video “Video mới” HSK3 có chủ đề bạn thích"] }),
          wk("Tuần 9 · Câu chữ 把 và 被", [], { book: "Giáo trình: câu 把 / câu 被", write: "Viết 10 câu 把 + 5 câu 被 về việc nhà, công việc", speak: "Hướng dẫn nấu một món ăn bằng câu 把", mon: ["Video chính: 1 video “Video mới” HSK3"] }),
          wk("Tuần 10 · Kể chuyện & viết đoạn văn", [], { book: "Giáo trình: bài đọc dài + từ nối (然后, 后来, 最后)", write: "Viết 150 chữ: “Một ngày đáng nhớ”", speak: "Kể lại bài viết không nhìn giấy", mon: ["Video chính: Mandarin Corner HSK3 (mục Video mới)"] }),
          W("Tuần 11 · Ôn HSK 3 & thi thử", [
            S("Ôn theo lỗi sai", [], ["Flashcard đến hết thẻ đến hạn", "Làm lại quiz các bài HSK 3 dưới 80%"]),
            S("Đề thi thử HSK 3", [], ["Làm 1 đề HSK 3 chính thức (bản HSK 3.0) bấm giờ", "Ghi điểm từng phần nghe – đọc – viết vào ô ghi chú"]),
            S("Chữa đề & chuyển cấp", [], ["Chữa câu sai, chép lại câu đúng", "Mốc: đặt trình độ hiện tại = HSK4 trong Cài đặt nếu thi thử ≥ 60%"])
          ]),
          wk("Tuần 12 · Ngữ pháp HSK 4: 刚/刚才, 从来/一直, 不仅…而且, 即使…也", ["zh4-grammar"], { book: "Giáo trình HSK 4: bài 1–2", write: "Mỗi cấu trúc 3 câu", speak: "Nói 1 phút về thói quen của bạn dùng 从来/一直" }),
          wk("Tuần 13 · Các cách nói “nếu…”", ["zh4-if"], { book: "Giáo trình: câu điều kiện, giả thiết", write: "Viết 8 câu “nếu…” về kế hoạch tương lai", speak: "Trả lời: Nếu có một năm nghỉ, bạn sẽ làm gì? (2 phút)" }),
          wk("Tuần 14 · Người nước ngoài trong mắt người Trung Quốc", ["zh4-foreigners"], { book: "Giáo trình: bài 3–4", write: "Viết 150 chữ: ấn tượng của bạn về người Trung Quốc", speak: "Phỏng vấn giả: trả lời 5 câu hỏi về Việt Nam" }),
          wk("Tuần 15 · Đừng dịch từng chữ", ["zh4-translate"], { book: "Giáo trình: bài 5–6", write: "Sửa 10 câu “dịch thẳng” từ tiếng Việt sang tiếng Trung tự nhiên", speak: "Shadowing 2 phút trong video" }),
          wk("Tuần 16 · Khác biệt văn hoá", ["zh4-culture"], { book: "Giáo trình: bài 7–8", write: "Viết 200 chữ so sánh văn hoá Việt – Trung", speak: "Trình bày 2 phút bài vừa viết" }),
          wk("Tuần 17 · Từ vựng HSK 4 (phần 1)", ["zh4-mc-hsk4"], { book: "Giáo trình: bài 9–10", write: "Chép 30 từ mới + câu ví dụ", speak: "Dùng 10 từ mới nói về công việc" }),
          wk("Tuần 18 · Từ vựng HSK 4 (phần 2)", ["zh4-mc-hsk4"], { book: "Giáo trình: bài 11–12", write: "Chép 30 từ mới + câu ví dụ", speak: "Dùng 10 từ mới nói về sức khoẻ, thể thao" }),
          wk("Tuần 19 · Từ vựng HSK 4 (phần 3)", ["zh4-mc-hsk4"], { book: "Giáo trình: bài 13–14", write: "Chép 30 từ mới + câu ví dụ", speak: "Dùng 10 từ mới nói về kế hoạch năm tới" }),
          wk("Tuần 20 · Đọc hiểu đoạn văn dài", [], { book: "Đọc 1 truyện phân cấp cấp 750–1.000 từ, mỗi buổi 2–3 chương", write: "Tóm tắt mỗi chương 3–5 câu", speak: "Kể lại câu chuyện 3 phút", mon: ["Video chính: 1 video “Video mới” HSK4"] }),
          wk("Tuần 21 · Viết nêu ý kiến", [], { book: "Giáo trình: từ nối lập luận (首先, 其次, 另外, 总之)", write: "Viết 200 chữ: “Nên học ngoại ngữ từ nhỏ không?”", speak: "Tranh luận 2 phía, mỗi phía 1 phút", mon: ["Video chính: 1 video “Video mới” HSK4"] }),
          wk("Tuần 22 · Nghe phỏng vấn đường phố", [], { book: "Sách luyện đề HSK 4: phần nghe", write: "Chép chính tả 1 đoạn 1 phút trong video", speak: "Trả lời lại câu hỏi phỏng vấn theo ý bạn", mon: ["Video chính: Mandarin Corner HSK4 interview (mục Video mới)"] }),
          W("Tuần 23 · Thi thử HSK 4", [
            S("Đề thi thử HSK 4", [], ["Làm 1 đề HSK 4 chính thức (bản HSK 3.0) bấm giờ", "Ghi điểm từng phần vào ô ghi chú"]),
            S("Chữa đề", [], ["Chữa câu sai, chép câu đúng", "Ôn ngữ pháp còn yếu"]),
            S("Ôn nói & viết", [], ["Nói 3 phút về công việc/gia đình/sở thích (ghi âm)", "Viết 200 chữ theo đề viết trong đề thi thử"])
          ]),
          W("Tuần 24 · Tổng ôn & thi cuối kỳ", [
            S("Ôn theo lỗi sai", [], ["Flashcard đến hết thẻ đến hạn", "Làm lại quiz các bài HSK 3–4 dưới 80%"]),
            S("Tự đánh giá", [], ["Đánh dấu các mục Tự đánh giá của giai đoạn 3", "Nghe 1 video Mandarin Corner HSK4 không phụ đề, viết tóm tắt"]),
            S("📝 Thi cuối kỳ Giai đoạn 3", [], ["Làm bài thi (≈45 phút) — đạt ≥ 75% là qua"])
          ])
        ],
        exam: {
          title: "Thi cuối kỳ Giai đoạn 3 · HSK 3–4", minutes: 45, pass: 0.75, auto: 10,
          note: "20 câu soạn sẵn (nghe, đọc hiểu, ngữ pháp, viết) + 10 câu từ vựng rút ngẫu nhiên từ các bài HSK 3–4.",
          questions: [
            { say: "不好意思，我来晚了，路上堵车。", q: "Vì sao người nói đến muộn?", options: ["Tắc đường", "Ngủ quên", "Lạc đường", "Xe hỏng"], answer: 0 },
            { say: "这家饭馆的菜又便宜又好吃。", q: "Người nói nhận xét quán ăn thế nào?", options: ["Rẻ và ngon", "Đắt nhưng ngon", "Rẻ nhưng không ngon", "Đắt và dở"], answer: 0 },
            { say: "我打算明年去中国留学。", q: "Kế hoạch của người nói là gì?", options: ["Năm sau đi du học Trung Quốc", "Năm nay đi du lịch Trung Quốc", "Năm sau sang Trung Quốc làm việc", "Đã từng du học Trung Quốc"], answer: 0 },
            { q: "我把作业写___了。", options: ["完", "过", "着", "在"], answer: 0 },
            { q: "这个问题太难了，我听___懂。", options: ["不", "没", "得", "很"], answer: 0, explain: "Bổ ngữ khả năng phủ định: 听不懂." },
            { q: "我的钱包___小偷偷走了。", options: ["被", "把", "向", "对"], answer: 0 },
            { q: "___明天下雨，比赛___照常进行。", options: ["即使…也", "因为…所以", "只要…就", "虽然…就"], answer: 0 },
            { q: "他不仅会说汉语，___会说日语。", options: ["而且", "但是", "所以", "或者"], answer: 0 },
            { q: "我___来了一个月，还不太习惯这里的生活。", options: ["刚", "刚才", "正在", "曾经"], answer: 0, explain: "刚 + động từ + thời lượng; 刚才 không đi với thời lượng." },
            { q: "外面太吵了，我___睡不着。", options: ["根本", "非常", "很", "一点"], answer: 0 },
            { q: "Đọc: 小王每天坐地铁上班。今天地铁出了问题，他只好打车，结果还是迟到了。— 小王今天怎么去上班的？", options: ["打车", "坐地铁", "骑车", "走路"], answer: 0 },
            { q: "Đọc (đoạn trên): 小王今天迟到了吗？", options: ["迟到了", "没迟到", "早到了", "没去上班"], answer: 0 },
            { q: "Câu nào đúng?", options: ["我把那本书看完了。", "我把那本书看。", "我把看完那本书了。", "我看完把那本书了。"], answer: 0 },
            { q: "“Càng ngày càng” là:", options: ["越来越", "一边…一边", "又…又", "或者…或者"], answer: 0 },
            { q: "他说话太快了，我___听不清楚。", options: ["有点儿", "一点儿", "一下", "一些"], answer: 0 },
            { q: "Từ gần nghĩa nhất với 马上:", options: ["立刻", "慢慢", "刚才", "以前"], answer: 0 },
            { type: "fill", q: "Viết từ “kinh nghiệm”", answer: "经验", py: "jīngyàn", hint: "kinh nghiệm" },
            { type: "fill", q: "Viết từ “chuẩn bị”", answer: "准备", py: "zhǔnbèi", hint: "chuẩn bị" },
            { type: "fill", q: "Viết từ “quyết định”", answer: "决定", py: "juédìng", hint: "quyết định" },
            { type: "fill", q: "Viết từ “cơ hội”", answer: "机会", py: "jīhuì", hint: "cơ hội" }
          ],
          checklist: [
            "Nói liên tục 3 phút về một chủ đề quen thuộc (công việc, chuyến đi, sở thích) — có ghi âm",
            "Nghe hiểu ý chính video Mandarin Corner HSK 3–4 khi tắt phụ đề tiếng Anh",
            "Đọc xong một truyện phân cấp, tra từ không quá 5 lần mỗi trang",
            "Viết đoạn văn 200 chữ nêu quan điểm có mở – thân – kết",
            "(Nên làm) Đề thi thử HSK 4 chính thức đạt từ 60% trở lên"
          ]
        }
      },

      /* =========================== GIAI ĐOẠN 4 =========================== */
      {
        id: "p4", short: "GĐ 4", name: "Nâng cao: giao tiếp theo chủ đề đời sống", range: "Mở · 12 chủ đề × 2 tuần (≈ 6 tháng)", levels: ["HSK5", "HSK6"], nextLevel: "HSK6",
        goal: "Dùng tiếng Trung tự tin trong 12 chủ đề đời sống – công việc; nghe hiểu phỏng vấn, phim ở tốc độ tự nhiên; trình bày và bảo vệ quan điểm.",
        outcomes: ["Mỗi chủ đề: 1 bài thuyết trình 2–3 phút + 1 bài viết 250–300 chữ", "Nhập vai các tình huống thật: phỏng vấn, khám bệnh, thuê nhà, khiếu nại", "Xem vlog/phim không phụ đề hiểu ý chính", "Hướng tới HSK 5 (3.600 từ) + HSKK trung cấp"],
        template: [[10, "Flashcard từ khoá chủ đề"], [30, "Nghe/xem tài liệu theo chủ đề"], [20, "Đọc & ghi chép cụm từ hay"], [25, "Nói: nhập vai/thuyết trình, ghi âm"], [5, "Tự đánh giá & nhật ký học"]],
        books: ["Giáo trình HSK 5 hoặc giáo trình khẩu ngữ trung – cao cấp", "Tin tức/bài đọc ngắn tiếng Trung theo chủ đề", "Phim, vlog, podcast có phụ đề chữ Hán (mục HSK5–6 trong lộ trình)"],
        weeks: [
          ...topic(1, "Công việc & văn phòng", "职场", ["zh5-opinions"], [P("开会", "kāihuì", "họp"), P("加班", "jiābān", "tăng ca"), P("请假", "qǐngjià", "xin nghỉ"), P("同事", "tóngshì", "đồng nghiệp"), P("截止日期", "jiézhǐ rìqī", "hạn chót"), P("汇报", "huìbào", "báo cáo (cấp trên)")], "xin sếp nghỉ phép 2 ngày và bàn giao việc"),
          ...topic(2, "Du lịch & giao thông", "旅行", ["zh5-passport"], [P("订机票", "dìng jīpiào", "đặt vé máy bay"), P("登机牌", "dēngjīpái", "thẻ lên máy bay"), P("行李", "xíngli", "hành lý"), P("酒店", "jiǔdiàn", "khách sạn"), P("地铁站", "dìtiězhàn", "ga tàu điện ngầm"), P("打车", "dǎchē", "gọi taxi")], "làm thủ tục ở sân bay và nhận phòng khách sạn"),
          ...topic(3, "Ăn uống & nhà hàng", "饮食", [], [P("点菜", "diǎncài", "gọi món"), P("服务员", "fúwùyuán", "nhân viên phục vụ"), P("买单", "mǎidān", "tính tiền"), P("辣", "là", "cay"), P("打包", "dǎbāo", "gói mang về"), P("推荐", "tuījiàn", "giới thiệu, gợi ý")], "đặt bàn qua điện thoại, gọi món, nhờ gói đồ ăn thừa"),
          ...topic(4, "Sức khoẻ & đi khám", "健康", [], [P("挂号", "guàhào", "lấy số khám"), P("发烧", "fāshāo", "sốt"), P("咳嗽", "késou", "ho"), P("药店", "yàodiàn", "hiệu thuốc"), P("过敏", "guòmǐn", "dị ứng"), P("锻炼", "duànliàn", "rèn luyện")], "đi khám, mô tả triệu chứng và hỏi cách uống thuốc"),
          ...topic(5, "Nhà ở & thuê nhà", "租房", [], [P("房租", "fángzū", "tiền thuê nhà"), P("房东", "fángdōng", "chủ nhà"), P("押金", "yājīn", "tiền cọc"), P("合同", "hétong", "hợp đồng"), P("搬家", "bānjiā", "chuyển nhà"), P("水电费", "shuǐdiànfèi", "tiền điện nước")], "đi xem nhà, hỏi giá thuê, tiền cọc và điều khoản hợp đồng"),
          ...topic(6, "Mua sắm online & thanh toán", "网购", [], [P("下单", "xiàdān", "đặt hàng"), P("快递", "kuàidì", "chuyển phát nhanh"), P("退货", "tuìhuò", "trả hàng"), P("打折", "dǎzhé", "giảm giá"), P("扫码", "sǎomǎ", "quét mã"), P("付款", "fùkuǎn", "thanh toán")], "gọi chăm sóc khách hàng để đổi/trả một món hàng lỗi"),
          ...topic(7, "Công nghệ & mạng xã hội", "科技", ["zh6-4words"], [P("充电", "chōngdiàn", "sạc pin"), P("密码", "mìmǎ", "mật khẩu"), P("下载", "xiàzài", "tải xuống"), P("点赞", "diǎnzàn", "bấm thích"), P("朋友圈", "péngyouquān", "Khoảnh khắc (WeChat)"), P("网红", "wǎnghóng", "người nổi tiếng trên mạng")], "giới thiệu một ứng dụng bạn dùng hằng ngày cho bạn bè"),
          ...topic(8, "Văn hoá & lễ Tết", "文化", ["zh5-mulan", "zh4-culture"], [P("春节", "Chūnjié", "Tết Nguyên đán"), P("拜年", "bàinián", "chúc Tết"), P("红包", "hóngbāo", "lì xì"), P("团圆", "tuányuán", "đoàn tụ"), P("中秋节", "Zhōngqiūjié", "Tết Trung thu"), P("传统", "chuántǒng", "truyền thống")], "giới thiệu Tết Việt Nam cho một người bạn Trung Quốc"),
          ...topic(9, "Phim ảnh & giải trí", "娱乐", ["zh5-tv"], [P("电视剧", "diànshìjù", "phim truyền hình"), P("演员", "yǎnyuán", "diễn viên"), P("剧情", "jùqíng", "cốt truyện"), P("字幕", "zìmù", "phụ đề"), P("综艺节目", "zōngyì jiémù", "chương trình tạp kỹ"), P("追剧", "zhuījù", "cày phim")], "rủ bạn đi xem phim và kể lại nội dung một bộ phim bạn thích"),
          ...topic(10, "Xã hội & con người", "社会", ["zh5-stereotypes", "zh6-annoying"], [P("压力", "yālì", "áp lực"), P("竞争", "jìngzhēng", "cạnh tranh"), P("习惯", "xíguàn", "thói quen"), P("年轻人", "niánqīngrén", "người trẻ"), P("偏见", "piānjiàn", "định kiến"), P("礼貌", "lǐmào", "lịch sự")], "trả lời phỏng vấn đường phố: “Áp lực lớn nhất của người trẻ là gì?”"),
          ...topic(11, "Tin tức & thời sự", "新闻", ["zh6-18clips"], [P("新闻", "xīnwén", "tin tức"), P("经济", "jīngjì", "kinh tế"), P("环境", "huánjìng", "môi trường"), P("政策", "zhèngcè", "chính sách"), P("发展", "fāzhǎn", "phát triển"), P("报道", "bàodào", "đưa tin")], "tóm tắt một bản tin trong 1 phút như phát thanh viên"),
          ...topic(12, "Tranh luận & thuyết trình", "表达观点", ["zh5-mc-hsk5", "zh6-mc-hsk6"], [P("我认为", "wǒ rènwéi", "tôi cho rằng"), P("首先", "shǒuxiān", "trước hết"), P("另外", "lìngwài", "ngoài ra"), P("总之", "zǒngzhī", "tóm lại"), P("举个例子", "jǔ ge lìzi", "lấy ví dụ"), P("我不太同意", "wǒ bú tài tóngyì", "tôi không đồng ý lắm")], "tranh luận “Làm việc từ xa tốt hơn đi văn phòng?” — nói cả hai phía")
        ],
        exam: {
          title: "Thi cuối kỳ Giai đoạn 4 · Giao tiếp nâng cao", minutes: 45, pass: 0.75, auto: 10,
          note: "20 câu theo 12 chủ đề (nghe, từ vựng, ngữ pháp, viết) + 10 câu từ vựng rút ngẫu nhiên từ các bài HSK 5–6. Thi xong có thể học lại vòng mới với tài liệu khó hơn.",
          questions: [
            { say: "我们公司下个月要开一个新的分公司。", q: "Công ty của người nói sắp làm gì?", options: ["Mở chi nhánh mới", "Đóng cửa", "Tuyển giám đốc", "Chuyển văn phòng"], answer: 0 },
            { say: "医生说我得多休息，少喝咖啡。", q: "Bác sĩ khuyên gì?", options: ["Nghỉ ngơi nhiều, bớt cà phê", "Uống nhiều cà phê", "Tập thể dục nhiều hơn", "Uống thuốc mỗi ngày"], answer: 0 },
            { say: "这次旅行虽然很累，但是很值得。", q: "Người nói thấy chuyến đi thế nào?", options: ["Mệt nhưng đáng", "Không đáng", "Không mệt", "Rẻ và vui"], answer: 0 },
            { q: "我想请两天假，___家里有点事。", options: ["因为", "所以", "但是", "而且"], answer: 0 },
            { q: "这个项目下周五___完成。", options: ["必须", "必要", "毕竟", "何必"], answer: 0 },
            { q: "我头疼，还有点儿发烧，可能是___了。", options: ["感冒", "感动", "感觉", "感谢"], answer: 0 },
            { q: "这套房子一个月的___是三千块。", options: ["房租", "房间", "房东", "房子"], answer: 0 },
            { q: "这件衣服不合适，我想___。", options: ["退货", "退休", "退步", "后退"], answer: 0 },
            { q: "可以用微信___吗？", options: ["支付", "支持", "付出", "支出"], answer: 0 },
            { q: "因为天气不好，我的航班___了两个小时。", options: ["延误", "延长", "误会", "错误"], answer: 0 },
            { q: "我___同意你的看法，不过有一点想补充。", options: ["基本上", "基础", "根据", "本来的"], answer: 0 },
            { q: "春节的时候，长辈会给孩子发___。", options: ["红包", "红色", "红茶", "红灯"], answer: 0 },
            { q: "这个视频在网上特别___，很多人都看过。", options: ["火", "热情", "红色", "发火"], answer: 0, explain: "火 (khẩu ngữ) = rất nổi, rất hot." },
            { q: "学外语不能___，要坚持下去。", options: ["半途而废", "一举两得", "画蛇添足", "入乡随俗"], answer: 0 },
            { q: "Để nêu ý thứ nhất khi trình bày quan điểm, dùng:", options: ["首先", "总之", "然后呢", "结果"], answer: 0 },
            { type: "fill", q: "Viết từ “phỏng vấn (xin việc)”", answer: "面试", py: "miànshì", hint: "phỏng vấn" },
            { type: "fill", q: "Viết từ “đặt trước (phòng, vé)”", answer: "预订", py: "yùdìng", hint: "đặt trước" },
            { type: "fill", q: "Viết từ “môi trường”", answer: "环境", py: "huánjìng", hint: "môi trường" },
            { type: "fill", q: "Viết từ “thảo luận”", answer: "讨论", py: "tǎolùn", hint: "thảo luận" },
            { type: "fill", q: "Viết từ “kinh tế”", answer: "经济", py: "jīngjì", hint: "kinh tế" }
          ],
          checklist: [
            "Đủ 12 bài thuyết trình 2–3 phút có ghi âm (mỗi chủ đề một bài)",
            "Nhập vai trôi chảy: phỏng vấn xin việc, đi khám bệnh, khiếu nại dịch vụ",
            "Xem một tập phim/vlog tiếng Trung không phụ đề và kể lại được nội dung",
            "Viết email công việc khoảng 300 chữ đúng văn phong",
            "(Tuỳ chọn) Thi HSK 5 và HSKK trung cấp"
          ]
        }
      }
    ]
  };
})();
