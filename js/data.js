/* ==========================================================================
   English Path — dữ liệu bài học
   --------------------------------------------------------------------------
   Muốn thêm bài: copy một object trong LESSONS, đổi id (duy nhất), level,
   skill và source. Trang sẽ tự hiện bài mới, tự sinh quiz từ danh sách vocab.

   skill:  "listening" | "vocab" | "grammar"
   source: { type: "youtube", videoId: "...", provider: "TED-Ed" }
           { type: "link",    url: "https://...", provider: "British Council" }
   vocab:  { w: từ, vi: nghĩa, ex: câu ví dụ CÓ CHỨA đúng từ w (để sinh bài điền từ) }
   questions (tuỳ chọn): { q, options: [...], answer: index đúng, explain }
   ========================================================================== */

const BC = "https://learnenglish.britishcouncil.org/free-resources";

window.LEVELS = [
  { id: "A1", name: "Beginner", vi: "Mới bắt đầu",
    desc: "Từ vựng cơ bản, hội thoại ngắn, người nói chậm và rõ." },
  { id: "A2", name: "Elementary", vi: "Sơ cấp",
    desc: "Ngữ pháp nền tảng, tin nhắn, thông báo, hội thoại công việc đơn giản." },
  { id: "B1", name: "Intermediate", vi: "Trung cấp",
    desc: "Nắm ý chính của cuộc gọi, cuộc họp, phỏng vấn; video ngắn tốc độ thật." },
  { id: "B2", name: "Upper-Intermediate", vi: "Trung cao cấp",
    desc: "Podcast, bài thuyết trình, TED talk; theo dõi lập luận dài." },
  { id: "C1", name: "Advanced", vi: "Cao cấp",
    desc: "Bài giảng, chủ đề trừu tượng, tốc độ tự nhiên, nhiều thành ngữ." }
];

window.SKILLS = {
  listening: { vi: "Nghe", icon: "🎧" },
  vocab:     { vi: "Từ vựng", icon: "📚" },
  grammar:   { vi: "Ngữ pháp", icon: "🧩" }
};

window.LESSONS = [
  /* ============================== A1 ============================== */
  {
    id: "a1-team-member", level: "A1", skill: "listening",
    title: "Meeting a new team member", titleVi: "Gặp đồng nghiệp mới",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/a1/meeting-new-team-member` },
    minutes: 10,
    goal: "Nghe hai đồng nghiệp mới làm quen: tên, phòng ban, công việc.",
    tasks: ["Làm phần Preparation trên trang British Council", "Nghe 1 lần không xem transcript", "Làm 2 bài Task, rồi nghe lại có transcript"],
    vocab: [
      { w: "colleague", vi: "đồng nghiệp", ex: "This is Anna, my new colleague." },
      { w: "department", vi: "phòng ban", ex: "I work in the sales department." },
      { w: "introduce", vi: "giới thiệu", ex: "Let me introduce myself." },
      { w: "office", vi: "văn phòng", ex: "Our office is on the third floor." },
      { w: "welcome", vi: "chào mừng", ex: "Welcome to the team!" }
    ]
  },
  {
    id: "a1-ordering-cafe", level: "A1", skill: "listening",
    title: "Ordering in a café", titleVi: "Gọi món ở quán cà phê",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/a1/ordering-cafe` },
    minutes: 10,
    goal: "Nghe người khác gọi đồ ăn, đồ uống; nhận ra món và giá tiền.",
    tasks: ["Nghe và ghi lại các món được gọi", "Làm Task 1 và Task 2", "Tự nói lại 1 câu gọi món của bạn"],
    vocab: [
      { w: "order", vi: "gọi món / đặt", ex: "Can I order a coffee, please?" },
      { w: "menu", vi: "thực đơn", ex: "Could we see the menu?" },
      { w: "sandwich", vi: "bánh mì kẹp", ex: "I'd like a cheese sandwich." },
      { w: "bill", vi: "hoá đơn (Anh-Anh)", ex: "Can we have the bill, please?" },
      { w: "takeaway", vi: "mang đi", ex: "Is that to eat in or takeaway?" }
    ]
  },
  {
    id: "a1-shopping-clothes", level: "A1", skill: "listening",
    title: "Shopping for clothes", titleVi: "Mua quần áo",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/a1/shopping-clothes` },
    minutes: 10,
    goal: "Hiểu hội thoại trong cửa hàng: cỡ, màu, giá, thử đồ.",
    tasks: ["Nghe và đánh dấu cỡ/màu được nhắc tới", "Làm Task 1–2", "Đọc transcript to thành tiếng 1 lần"],
    vocab: [
      { w: "size", vi: "kích cỡ", ex: "What size are you?" },
      { w: "try on", vi: "mặc thử", ex: "Can I try on this jacket?" },
      { w: "changing room", vi: "phòng thử đồ", ex: "The changing room is over there." },
      { w: "price", vi: "giá", ex: "What's the price of this shirt?" },
      { w: "cheap", vi: "rẻ", ex: "These shoes are really cheap." }
    ]
  },
  {
    id: "a1-voicemail", level: "A1", skill: "listening",
    title: "A voicemail message", titleVi: "Tin nhắn thoại",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/a1/voicemail-message` },
    minutes: 8,
    goal: "Nghe lời nhắn thoại và bắt các thông tin: ai gọi, khi nào, số điện thoại.",
    tasks: ["Ghi lại tên, thời gian, số điện thoại", "Làm Task 1–2", "Tập để lại 1 lời nhắn tương tự"],
    vocab: [
      { w: "message", vi: "lời nhắn", ex: "Please leave a message after the beep." },
      { w: "call back", vi: "gọi lại", ex: "Can you call back later?" },
      { w: "tomorrow", vi: "ngày mai", ex: "I'm free tomorrow afternoon." },
      { w: "number", vi: "số (điện thoại)", ex: "My number is 0912 345 678." },
      { w: "free", vi: "rảnh", ex: "Are you free on Friday?" }
    ]
  },
  {
    id: "a1-grammar-be", level: "A1", skill: "grammar",
    title: "Be & present simple", titleVi: "Động từ to be & thì hiện tại đơn",
    source: { type: "link", provider: "British Council", url: `${BC}/grammar/a1-a2` },
    minutes: 15,
    goal: "Dùng đúng am/is/are và động từ thêm -s với he/she/it.",
    tasks: ["Mở mục grammar A1–A2, chọn bài về 'be' hoặc 'present simple'", "Làm bài tập trên trang", "Quay lại đây làm quiz"],
    vocab: [
      { w: "usually", vi: "thường thường", ex: "I usually get up at 6." },
      { w: "every day", vi: "mỗi ngày", ex: "She walks to work every day." },
      { w: "never", vi: "không bao giờ", ex: "He never drinks coffee." }
    ],
    questions: [
      { q: "She ___ a teacher.", options: ["am", "is", "are"], answer: 1, explain: "He/She/It đi với is." },
      { q: "They ___ from Vietnam.", options: ["is", "am", "are"], answer: 2, explain: "We/You/They đi với are." },
      { q: "My brother ___ in Da Nang.", options: ["live", "lives", "living"], answer: 1, explain: "Ngôi thứ 3 số ít ở hiện tại đơn: thêm -s." },
      { q: "___ you like tea?", options: ["Does", "Is", "Do"], answer: 2, explain: "Câu hỏi với you: Do + S + V?" },
      { q: "He ___ work on Sundays.", options: ["don't", "doesn't", "isn't"], answer: 1, explain: "Phủ định ngôi 3 số ít: doesn't + V nguyên mẫu." }
    ]
  },
  {
    id: "a1-vocab-daily", level: "A1", skill: "vocab",
    title: "Everyday vocabulary", titleVi: "Từ vựng hằng ngày",
    source: { type: "link", provider: "British Council", url: `${BC}/vocabulary/a1-a2` },
    minutes: 12,
    goal: "Học từ vựng về thói quen hằng ngày, gia đình, đồ vật quen thuộc.",
    tasks: ["Chọn 1 bài vocabulary A1–A2 trên British Council", "Làm bài tập trên trang", "Ôn 6 từ dưới đây rồi làm quiz"],
    vocab: [
      { w: "breakfast", vi: "bữa sáng", ex: "I have breakfast at seven." },
      { w: "wake up", vi: "thức dậy", ex: "I wake up early on weekdays." },
      { w: "brush", vi: "chải / đánh (răng)", ex: "Don't forget to brush your teeth." },
      { w: "commute", vi: "đi lại (đi làm)", ex: "My commute takes 30 minutes." },
      { w: "weekend", vi: "cuối tuần", ex: "What do you do at the weekend?" },
      { w: "kitchen", vi: "nhà bếp", ex: "Mum is cooking in the kitchen." }
    ]
  },

  /* ============================== A2 ============================== */
  {
    id: "a2-meeting-time", level: "A2", skill: "listening",
    title: "Changing a meeting time", titleVi: "Đổi giờ họp",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/a2/changing-meeting-time` },
    minutes: 10,
    goal: "Nghe hai đồng nghiệp sắp xếp lại lịch họp: ngày, giờ, lý do.",
    tasks: ["Ghi lại giờ cũ và giờ mới", "Làm Task 1–2", "Viết 1 tin nhắn xin đổi giờ họp"],
    vocab: [
      { w: "reschedule", vi: "dời lịch", ex: "Can we reschedule the meeting?" },
      { w: "available", vi: "rảnh / có thể tham gia", ex: "Are you available on Thursday?" },
      { w: "instead", vi: "thay vào đó", ex: "Let's meet at three instead." },
      { w: "calendar", vi: "lịch", ex: "I'll check my calendar." },
      { w: "arrange", vi: "sắp xếp", ex: "Could you arrange a call with the client?" }
    ]
  },
  {
    id: "a2-transport", level: "A2", skill: "listening",
    title: "Transport announcements", titleVi: "Thông báo giao thông",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/a2/transport-announcements` },
    minutes: 10,
    goal: "Bắt thông tin trong thông báo ở ga/sân bay: sân ga, giờ, trễ chuyến.",
    tasks: ["Nghe và điền bảng: chuyến – sân ga – tình trạng", "Làm Task 1–2"],
    vocab: [
      { w: "platform", vi: "sân ga", ex: "The train leaves from platform 4." },
      { w: "delay", vi: "sự chậm trễ", ex: "There is a 20-minute delay." },
      { w: "departure", vi: "sự khởi hành", ex: "Check the departure board." },
      { w: "passenger", vi: "hành khách", ex: "Every passenger must show a ticket." },
      { w: "cancelled", vi: "bị huỷ", ex: "The 9:15 flight is cancelled." }
    ]
  },
  {
    id: "a2-whos-who", level: "A2", skill: "listening",
    title: "Who's who in the office", titleVi: "Ai là ai trong văn phòng",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/a2/whos-who-office` },
    minutes: 10,
    goal: "Hiểu mô tả về người và vai trò của họ trong công ty.",
    tasks: ["Vẽ sơ đồ nhỏ: tên → vai trò", "Làm Task 1–2"],
    vocab: [
      { w: "manager", vi: "quản lý", ex: "Our manager is very friendly." },
      { w: "in charge of", vi: "phụ trách", ex: "Tom is in charge of marketing." },
      { w: "assistant", vi: "trợ lý", ex: "Ask my assistant to book a room." },
      { w: "responsible for", vi: "chịu trách nhiệm về", ex: "She is responsible for the budget." },
      { w: "report to", vi: "báo cáo cho (cấp trên)", ex: "I report to the head of IT." }
    ]
  },
  {
    id: "a2-leaving-message", level: "A2", skill: "listening",
    title: "Leaving a message", titleVi: "Để lại lời nhắn",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/a2/leaving-message` },
    minutes: 8,
    goal: "Nghe và ghi chép lại lời nhắn qua điện thoại chính xác.",
    tasks: ["Ghi chú lời nhắn như một thư ký", "Làm Task 1–2"],
    vocab: [
      { w: "spell", vi: "đánh vần", ex: "Could you spell your name, please?" },
      { w: "urgent", vi: "khẩn cấp", ex: "It's urgent, please call me today." },
      { w: "pass on", vi: "chuyển lời", ex: "I'll pass on your message." },
      { w: "hold on", vi: "chờ máy", ex: "Hold on a moment, please." },
      { w: "available", vi: "có mặt / rảnh", ex: "Mr Brown isn't available right now." }
    ]
  },
  {
    id: "a2-grammar-past", level: "A2", skill: "grammar",
    title: "Past simple", titleVi: "Thì quá khứ đơn",
    source: { type: "link", provider: "British Council", url: `${BC}/grammar/a1-a2` },
    minutes: 15,
    goal: "Kể lại việc đã xảy ra: động từ có quy tắc (-ed) và bất quy tắc.",
    tasks: ["Mở grammar A1–A2, chọn bài 'Past simple'", "Làm bài tập trên trang", "Viết 3 câu về ngày hôm qua của bạn"],
    vocab: [
      { w: "yesterday", vi: "hôm qua", ex: "I called my mum yesterday." },
      { w: "ago", vi: "cách đây", ex: "We met two years ago." },
      { w: "last week", vi: "tuần trước", ex: "She visited Hue last week." }
    ],
    questions: [
      { q: "I ___ to the cinema last night.", options: ["go", "went", "gone"], answer: 1, explain: "go → went (bất quy tắc)." },
      { q: "She ___ her homework yesterday.", options: ["finished", "finish", "finishes"], answer: 0, explain: "Động từ có quy tắc thêm -ed." },
      { q: "___ you see the match?", options: ["Do", "Did", "Was"], answer: 1, explain: "Câu hỏi quá khứ: Did + S + V nguyên mẫu." },
      { q: "We didn't ___ the email.", options: ["got", "get", "getting"], answer: 1, explain: "Sau didn't dùng động từ nguyên mẫu." },
      { q: "They ___ in London in 2020.", options: ["were", "was", "are"], answer: 0, explain: "They + were." }
    ]
  },

  /* ============================== B1 ============================== */
  {
    id: "b1-30-days", level: "B1", skill: "listening",
    title: "Try something new for 30 days", titleVi: "Thử điều mới trong 30 ngày",
    source: { type: "youtube", provider: "TED-Ed", videoId: "UNP03fDSj1U" },
    minutes: 4,
    goal: "Video ngắn, tốc độ nói rõ: nghe ý chính về việc xây thói quen 30 ngày.",
    tasks: ["Xem lần 1 không phụ đề, tóm tắt 1 câu", "Xem lần 2 bật phụ đề (CC), ghi 3 cụm từ mới", "Làm quiz"],
    vocab: [
      { w: "challenge", vi: "thử thách", ex: "I set myself a 30-day challenge." },
      { w: "habit", vi: "thói quen", ex: "Reading every night is a good habit." },
      { w: "memorable", vi: "đáng nhớ", ex: "It was the most memorable month of my year." },
      { w: "sustainable", vi: "bền vững, duy trì được", ex: "Small changes are more sustainable." },
      { w: "confidence", vi: "sự tự tin", ex: "My confidence grew every week." }
    ]
  },
  {
    id: "b1-phone-customer", level: "B1", skill: "listening",
    title: "A phone call from a customer", titleVi: "Cuộc gọi từ khách hàng",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/b1/phone-call-customer` },
    minutes: 12,
    goal: "Theo dõi cuộc gọi xử lý vấn đề của khách: yêu cầu, giải pháp, bước tiếp theo.",
    tasks: ["Ghi lại: vấn đề – giải pháp – hạn chót", "Làm Task 1–2"],
    vocab: [
      { w: "complaint", vi: "lời phàn nàn", ex: "We received a complaint about the delivery." },
      { w: "order number", vi: "mã đơn hàng", ex: "Can I have your order number?" },
      { w: "refund", vi: "hoàn tiền", ex: "The customer asked for a refund." },
      { w: "apologise", vi: "xin lỗi", ex: "I apologise for the inconvenience." },
      { w: "follow up", vi: "theo dõi / liên hệ lại", ex: "I'll follow up by email tomorrow." }
    ]
  },
  {
    id: "b1-work-life", level: "B1", skill: "listening",
    title: "Work–life balance", titleVi: "Cân bằng công việc – cuộc sống",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/b1/work-life-balance` },
    minutes: 12,
    goal: "Nghe phỏng vấn radio, nắm các lời khuyên chính.",
    tasks: ["Liệt kê các lời khuyên bạn nghe được", "Làm Task 1–2", "Bạn đồng ý với lời khuyên nào nhất? Viết 2 câu"],
    vocab: [
      { w: "overtime", vi: "làm thêm giờ", ex: "I worked overtime every day last month." },
      { w: "stressed", vi: "căng thẳng", ex: "She feels stressed before deadlines." },
      { w: "switch off", vi: "ngắt kết nối, nghỉ ngơi", ex: "It's hard to switch off after work." },
      { w: "priority", vi: "ưu tiên", ex: "Family is my top priority." },
      { w: "flexible", vi: "linh hoạt", ex: "We have flexible working hours." }
    ]
  },
  {
    id: "b1-making-decision", level: "B1", skill: "listening",
    title: "Making a decision", titleVi: "Ra quyết định trong cuộc họp",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/b1/making-decision` },
    minutes: 12,
    goal: "Nghe cuộc họp: các lựa chọn, ưu/nhược điểm, quyết định cuối cùng.",
    tasks: ["Ghi bảng 2 cột: phương án – ý kiến", "Làm Task 1–2"],
    vocab: [
      { w: "option", vi: "lựa chọn", ex: "The cheaper option is better for us." },
      { w: "pros and cons", vi: "ưu và nhược điểm", ex: "Let's list the pros and cons." },
      { w: "budget", vi: "ngân sách", ex: "It's over our budget." },
      { w: "agree", vi: "đồng ý", ex: "I agree with Sarah on this." },
      { w: "go with", vi: "chọn (phương án)", ex: "Let's go with the cheaper option." }
    ]
  },
  {
    id: "b1-6-minute-english", level: "B1", skill: "listening",
    title: "6 Minute English", titleVi: "BBC 6 Minute English",
    source: { type: "link", provider: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" },
    minutes: 10,
    goal: "Mỗi tập 6 phút, hai người dẫn trò chuyện về một chủ đề và giải thích từ mới. Có transcript PDF.",
    tasks: ["Chọn 1 tập bạn thích", "Nghe 1 lần, trả lời câu đố mở đầu", "Nghe lần 2 với transcript, chép lại phần vocabulary", "Quay lại đây, ghi chú từ mới vào ô Ghi chú"],
    vocab: [
      { w: "topic", vi: "chủ đề", ex: "Today's topic is sleep." },
      { w: "presenter", vi: "người dẫn chương trình", ex: "The presenter explains every new word." },
      { w: "expression", vi: "cách diễn đạt", ex: "That's a useful expression." },
      { w: "episode", vi: "tập (chương trình)", ex: "I listen to one episode every morning." }
    ]
  },
  {
    id: "b1-grammar-present-perfect", level: "B1", skill: "grammar",
    title: "Present perfect", titleVi: "Thì hiện tại hoàn thành",
    source: { type: "link", provider: "British Council", url: `${BC}/grammar/b1-b2` },
    minutes: 15,
    goal: "Phân biệt present perfect và past simple; dùng for/since/already/yet.",
    tasks: ["Mở grammar B1–B2, chọn bài 'Present perfect'", "Làm bài tập trên trang", "Làm quiz dưới đây"],
    vocab: [
      { w: "already", vi: "đã ... rồi", ex: "I've already sent the report." },
      { w: "yet", vi: "chưa (phủ định/hỏi)", ex: "Have you finished yet?" },
      { w: "since", vi: "kể từ", ex: "I've lived here since 2019." }
    ],
    questions: [
      { q: "I ___ here for five years.", options: ["work", "have worked", "worked"], answer: 1, explain: "Hành động kéo dài tới hiện tại + for → present perfect." },
      { q: "She ___ to Japan in 2018.", options: ["has been", "went", "has gone"], answer: 1, explain: "Mốc thời gian xác định trong quá khứ → past simple." },
      { q: "Have you ever ___ sushi?", options: ["ate", "eat", "eaten"], answer: 2, explain: "have + V3 (eat → eaten)." },
      { q: "We've known each other ___ university.", options: ["for", "since", "from"], answer: 1, explain: "since + mốc thời gian." },
      { q: "He hasn't replied ___.", options: ["already", "yet", "ever"], answer: 1, explain: "yet dùng cuối câu phủ định." }
    ]
  },

  /* ============================== B2 ============================== */
  {
    id: "b2-ken-robinson", level: "B2", skill: "listening",
    title: "Do schools kill creativity?", titleVi: "Trường học có giết chết sự sáng tạo?",
    source: { type: "youtube", provider: "TED", videoId: "iG9CE55wbtY" },
    minutes: 20,
    goal: "TED talk kinh điển, nhiều câu đùa kiểu Anh. Theo dõi lập luận chính và cách kể chuyện.",
    tasks: ["Xem với phụ đề tiếng Anh, tốc độ 0.75x nếu cần", "Viết 3 câu tóm tắt lập luận", "Ghi 5 cụm từ hay vào ô Ghi chú"],
    vocab: [
      { w: "creativity", vi: "sự sáng tạo", ex: "Creativity is as important as literacy." },
      { w: "literacy", vi: "khả năng đọc viết", ex: "Literacy rates have improved a lot." },
      { w: "capacity", vi: "năng lực, khả năng", ex: "Children have an extraordinary capacity for innovation." },
      { w: "stigmatise", vi: "kỳ thị, coi là xấu", ex: "Schools often stigmatise mistakes." },
      { w: "rethink", vi: "suy nghĩ lại", ex: "We need to rethink how we educate children." }
    ]
  },
  {
    id: "b2-digital-detox", level: "B2", skill: "listening",
    title: "A digital detox podcast", titleVi: "Podcast 'cai' thiết bị số",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/b2/digital-detox-podcast` },
    minutes: 15,
    goal: "Nghe podcast dài, nắm trải nghiệm và kết luận của người nói.",
    tasks: ["Ghi lại 3 thay đổi người nói nhận thấy", "Làm Task 1–2"],
    vocab: [
      { w: "detox", vi: "thải độc / tạm ngưng", ex: "I did a one-week digital detox." },
      { w: "notification", vi: "thông báo (điện thoại)", ex: "I turned off every notification on my phone." },
      { w: "addictive", vi: "gây nghiện", ex: "Social media can be addictive." },
      { w: "withdrawal", vi: "cảm giác thiếu thốn khi cai", ex: "I had withdrawal symptoms on day one." },
      { w: "mindful", vi: "tỉnh thức, có ý thức", ex: "I'm more mindful of my screen time now." }
    ]
  },
  {
    id: "b2-business-interview", level: "B2", skill: "listening",
    title: "A business interview", titleVi: "Phỏng vấn kinh doanh",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/b2/business-interview` },
    minutes: 15,
    goal: "Theo dõi cuộc phỏng vấn với nhiều chi tiết số liệu và quan điểm.",
    tasks: ["Ghi lại số liệu và ý kiến chính", "Làm Task 1–2"],
    vocab: [
      { w: "launch", vi: "ra mắt", ex: "We will launch the product in March." },
      { w: "revenue", vi: "doanh thu", ex: "Revenue grew by 12% last year." },
      { w: "competitor", vi: "đối thủ cạnh tranh", ex: "Our main competitor lowered its prices." },
      { w: "expand", vi: "mở rộng", ex: "They plan to expand into Asia." },
      { w: "invest", vi: "đầu tư", ex: "We need to invest in training." }
    ]
  },
  {
    id: "b2-motivation", level: "B2", skill: "listening",
    title: "A talk about motivation", titleVi: "Bài nói về động lực",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/b2/talk-about-motivation` },
    minutes: 15,
    goal: "Nghe bài nói, phân biệt ý chính và ví dụ minh hoạ.",
    tasks: ["Ghi dàn ý: ý chính → ví dụ", "Làm Task 1–2"],
    vocab: [
      { w: "intrinsic", vi: "nội tại, từ bên trong", ex: "Intrinsic motivation lasts longer." },
      { w: "reward", vi: "phần thưởng", ex: "Money is an external reward." },
      { w: "autonomy", vi: "quyền tự chủ", ex: "People want autonomy at work." },
      { w: "purpose", vi: "mục đích", ex: "A clear purpose keeps the team going." },
      { w: "boost", vi: "thúc đẩy, tăng", ex: "Praise can boost motivation." }
    ]
  },
  {
    id: "b2-design-presentation", level: "B2", skill: "listening",
    title: "A design presentation", titleVi: "Thuyết trình thiết kế sản phẩm",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/b2/design-presentation` },
    minutes: 15,
    goal: "Nghe bài thuyết trình, nhận ra cấu trúc và ngôn ngữ chuyển ý.",
    tasks: ["Ghi lại các cụm chuyển ý (signposting) người nói dùng", "Làm Task 1–2"],
    vocab: [
      { w: "feature", vi: "tính năng", ex: "The main feature is the folding screen." },
      { w: "prototype", vi: "nguyên mẫu", ex: "We tested the prototype with users." },
      { w: "feedback", vi: "phản hồi", ex: "User feedback was very positive." },
      { w: "durable", vi: "bền", ex: "The case is light but durable." },
      { w: "to sum up", vi: "tóm lại", ex: "To sum up, the design is ready for production." }
    ]
  },
  {
    id: "b2-grammar-conditionals", level: "B2", skill: "grammar",
    title: "Conditionals", titleVi: "Câu điều kiện",
    source: { type: "link", provider: "British Council", url: `${BC}/grammar/b1-b2` },
    minutes: 15,
    goal: "Dùng chắc câu điều kiện loại 1, 2, 3 và điều kiện hỗn hợp.",
    tasks: ["Mở grammar B1–B2, chọn bài về Conditionals", "Làm bài tập trên trang", "Làm quiz dưới đây"],
    vocab: [
      { w: "unless", vi: "trừ khi", ex: "We'll be late unless we leave now." },
      { w: "provided that", vi: "miễn là", ex: "You can go provided that you finish first." },
      { w: "otherwise", vi: "nếu không thì", ex: "Hurry, otherwise we'll miss the bus." }
    ],
    questions: [
      { q: "If it rains tomorrow, we ___ at home.", options: ["stay", "will stay", "would stay"], answer: 1, explain: "Loại 1: If + hiện tại đơn, will + V." },
      { q: "If I ___ rich, I would travel the world.", options: ["am", "were", "had been"], answer: 1, explain: "Loại 2: If + quá khứ (were cho mọi ngôi)." },
      { q: "If she had studied, she ___ the exam.", options: ["would pass", "will pass", "would have passed"], answer: 2, explain: "Loại 3: would have + V3." },
      { q: "If I had taken the job, I ___ in Singapore now.", options: ["would live", "would have lived", "will live"], answer: 0, explain: "Hỗn hợp: điều kiện quá khứ → kết quả hiện tại." },
      { q: "___ you hurry, you'll miss the train.", options: ["If", "Unless", "Provided"], answer: 1, explain: "Unless = If ... not." }
    ]
  },

  /* ============================== C1 ============================== */
  {
    id: "c1-introverts", level: "C1", skill: "listening",
    title: "Introverts – redressing the balance", titleVi: "Người hướng nội – lấy lại cân bằng",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/c1/introverts-redressing-balance` },
    minutes: 18,
    goal: "Nghe bài nói học thuật về tâm lý xã hội, nắm lập luận và phản biện.",
    tasks: ["Ghi lập luận chính và bằng chứng", "Làm Task 1–2", "Viết đoạn 80 từ nêu quan điểm của bạn"],
    vocab: [
      { w: "introvert", vi: "người hướng nội", ex: "As an introvert, I recharge by being alone." },
      { w: "redress", vi: "điều chỉnh lại, bù đắp", ex: "We need to redress the balance." },
      { w: "assertive", vi: "quyết đoán", ex: "Being assertive isn't the same as being loud." },
      { w: "undervalue", vi: "đánh giá thấp", ex: "We often undervalue quiet people." },
      { w: "solitude", vi: "sự đơn độc (tích cực)", ex: "Solitude helps me think clearly." }
    ]
  },
  {
    id: "c1-innovation", level: "C1", skill: "listening",
    title: "Innovation in business", titleVi: "Đổi mới trong kinh doanh",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/c1/innovation-business` },
    minutes: 18,
    goal: "Podcast kinh doanh tốc độ tự nhiên, nhiều ý trừu tượng.",
    tasks: ["Ghi lại định nghĩa 'innovation' theo người nói", "Làm Task 1–2"],
    vocab: [
      { w: "disruptive", vi: "mang tính phá vỡ", ex: "Streaming was a disruptive technology." },
      { w: "incremental", vi: "từng bước, tăng dần", ex: "Most progress is incremental." },
      { w: "risk-averse", vi: "ngại rủi ro", ex: "Large firms tend to be risk-averse." },
      { w: "iterate", vi: "lặp lại để cải tiến", ex: "We iterate on the design every week." },
      { w: "stakeholder", vi: "bên liên quan", ex: "Every stakeholder must agree." }
    ]
  },
  {
    id: "c1-job-interview", level: "C1", skill: "listening",
    title: "A job interview", titleVi: "Buổi phỏng vấn xin việc",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/c1/job-interview` },
    minutes: 18,
    goal: "Phân tích câu hỏi và câu trả lời trong phỏng vấn cấp cao.",
    tasks: ["Ghi lại các câu hỏi phỏng vấn", "Làm Task 1–2", "Tự trả lời 1 câu hỏi, ghi âm bằng điện thoại"],
    vocab: [
      { w: "track record", vi: "thành tích đã có", ex: "She has a strong track record in sales." },
      { w: "transferable", vi: "có thể chuyển đổi (kỹ năng)", ex: "Communication is a transferable skill." },
      { w: "candidate", vi: "ứng viên", ex: "Each candidate had a 30-minute interview." },
      { w: "drawback", vi: "điểm hạn chế", ex: "The main drawback is the long commute." },
      { w: "elaborate", vi: "nói chi tiết hơn", ex: "Could you elaborate on that?" }
    ]
  },
  {
    id: "c1-tech-addiction", level: "C1", skill: "listening",
    title: "Tech addiction", titleVi: "Nghiện công nghệ",
    source: { type: "link", provider: "British Council", url: `${BC}/listening/c1/tech-addiction` },
    minutes: 18,
    goal: "Chương trình radio nhiều giọng nói, đan xen quan điểm trái chiều.",
    tasks: ["Phân loại ý kiến: đồng tình / phản đối", "Làm Task 1–2"],
    vocab: [
      { w: "compulsive", vi: "không kiểm soát được", ex: "Compulsive checking of phones is common." },
      { w: "dopamine", vi: "dopamine (chất dẫn truyền)", ex: "Likes give us a small dopamine hit." },
      { w: "regulate", vi: "điều tiết, quản lý", ex: "Should governments regulate apps?" },
      { w: "exploit", vi: "khai thác, lợi dụng", ex: "Some apps exploit our need for approval." },
      { w: "curb", vi: "kiềm chế", ex: "I'm trying to curb my screen time." }
    ]
  },
  {
    id: "c1-grammar-inversion", level: "C1", skill: "grammar",
    title: "Inversion & emphasis", titleVi: "Đảo ngữ & nhấn mạnh",
    source: { type: "link", provider: "British Council", url: `${BC}/grammar/c1` },
    minutes: 15,
    goal: "Dùng đảo ngữ (Never have I..., Not only...) và câu chẻ để nhấn mạnh.",
    tasks: ["Mở grammar C1, chọn bài về inversion/emphasis", "Làm bài tập trên trang", "Làm quiz dưới đây"],
    vocab: [
      { w: "seldom", vi: "hiếm khi", ex: "Seldom have I seen such talent." },
      { w: "hardly", vi: "hầu như không", ex: "Hardly had we arrived when it started to rain." },
      { w: "rarely", vi: "ít khi", ex: "Rarely does he make mistakes." }
    ],
    questions: [
      { q: "Never ___ such a beautiful view.", options: ["I have seen", "have I seen", "I saw"], answer: 1, explain: "Never đứng đầu → đảo trợ động từ lên trước chủ ngữ." },
      { q: "Not only ___ late, but he also forgot the slides.", options: ["he was", "was he", "he is"], answer: 1, explain: "Not only + đảo ngữ." },
      { q: "Hardly had I sat down ___ the phone rang.", options: ["than", "when", "then"], answer: 1, explain: "Hardly ... when; No sooner ... than." },
      { q: "___ I known, I would have helped.", options: ["If", "Had", "Should"], answer: 1, explain: "Đảo ngữ điều kiện loại 3: Had + S + V3." },
      { q: "What I need ___ a long holiday.", options: ["is", "are", "be"], answer: 0, explain: "Câu chẻ với What ... is." }
    ]
  }
];

/* Nguồn tham khảo thêm — hiển thị ở trang Thư viện */
window.RESOURCES = [
  { name: "British Council – LearnEnglish (Listening A1→C1)", url: `${BC}/listening`, note: "Bài nghe có transcript và bài tập theo trình độ." },
  { name: "British Council – Grammar", url: `${BC}/grammar`, note: "Giải thích ngữ pháp + bài tập A1→C1." },
  { name: "British Council – Level test chính thức", url: "https://learnenglish.britishcouncil.org/english-levels/online-english-level-test", note: "Bài test đầy đủ hơn để đối chiếu với bài test nhanh ở đây." },
  { name: "British Council English (YouTube)", url: "https://www.youtube.com/@BritishCouncilEnglish", note: "Video ngắn về từ vựng, phát âm." },
  { name: "BBC Learning English (YouTube)", url: "https://www.youtube.com/@bbclearningenglish", note: "6 Minute English, Real Easy English, English at Work…" },
  { name: "TED-Ed (YouTube)", url: "https://www.youtube.com/@TEDEd", note: "Video hoạt hình 4–6 phút, hợp với B1–C1." }
];

/* Bài test xếp trình độ: 5 câu mỗi cấp A1 → B2. Qua ≥ 3/5 thì lên cấp tiếp. */
window.PLACEMENT_TEST = [
  // A1
  { level: "A1", q: "Hello, my name ___ Linh.", options: ["am", "is", "are", "be"], answer: 1 },
  { level: "A1", q: "I ___ two brothers.", options: ["has", "have", "am", "having"], answer: 1 },
  { level: "A1", q: "Where ___ you from?", options: ["is", "do", "are", "does"], answer: 2 },
  { level: "A1", q: "There ___ a book on the table.", options: ["are", "is", "be", "am"], answer: 1 },
  { level: "A1", q: "She ___ coffee every morning.", options: ["drink", "drinks", "drinking", "is drink"], answer: 1 },
  // A2
  { level: "A2", q: "Last summer we ___ to Phu Quoc.", options: ["go", "goes", "went", "have go"], answer: 2 },
  { level: "A2", q: "Look! It ___ outside.", options: ["rains", "is raining", "rain", "rained"], answer: 1 },
  { level: "A2", q: "This bag is ___ than that one.", options: ["cheap", "more cheap", "cheaper", "cheapest"], answer: 2 },
  { level: "A2", q: "I'm ___ to visit my grandparents next weekend.", options: ["go", "going", "will", "went"], answer: 1 },
  { level: "A2", q: "You ___ wear a helmet on a motorbike. It's the law.", options: ["must", "can", "might", "would"], answer: 0 },
  // B1
  { level: "B1", q: "I ___ in this company since 2021.", options: ["work", "worked", "have worked", "am working"], answer: 2 },
  { level: "B1", q: "If I ___ more time, I would learn Japanese.", options: ["have", "had", "will have", "would have"], answer: 1 },
  { level: "B1", q: "The report ___ by the manager yesterday.", options: ["wrote", "was written", "is writing", "has write"], answer: 1 },
  { level: "B1", q: "She asked me where I ___.", options: ["live", "lived", "do live", "am living"], answer: 1 },
  { level: "B1", q: "I'm not used to ___ up so early.", options: ["get", "got", "getting", "be get"], answer: 2 },
  // B2
  { level: "B2", q: "If she had left earlier, she ___ the flight.", options: ["wouldn't miss", "won't miss", "wouldn't have missed", "didn't miss"], answer: 2 },
  { level: "B2", q: "I wish I ___ that email — it caused so many problems.", options: ["didn't send", "hadn't sent", "wouldn't send", "don't send"], answer: 1 },
  { level: "B2", q: "By the time we arrived, the meeting ___.", options: ["already started", "has already started", "had already started", "was already start"], answer: 2 },
  { level: "B2", q: "The new policy will ___ a big impact on small businesses.", options: ["make", "do", "have", "take"], answer: 2 },
  { level: "B2", q: "Rarely ___ such a well-organised event.", options: ["I have seen", "have I seen", "I saw", "did I saw"], answer: 1 }
];
