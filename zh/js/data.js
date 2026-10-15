/* ==========================================================================
   Chinese Path — dữ liệu bài học tiếng Trung giao tiếp (HSK 1 → 6)
   --------------------------------------------------------------------------
   Cấu trúc giống js/data.js (tiếng Anh), thêm phiên âm cho từ vựng:
   vocab: { w: chữ Hán, py: pinyin, vi: nghĩa, ex: câu ví dụ CÓ CHỨA đúng w,
            exPy: pinyin của câu ví dụ, exVi: nghĩa câu ví dụ }
   Mọi video ID đã được kiểm tra (oEmbed: đúng kênh, còn tồn tại) ngày 15/10/2026.
   Từ vựng & câu ví dụ do người soạn tự viết theo chủ đề video, không chép từ video.
   ========================================================================== */
(function () {
  const yt = (provider, videoId) => ({ type: "youtube", provider, videoId });
  const EC = "Everyday Chinese", MC = "Mandarin Corner", SS = "ShuoshuoChinese 说说中文";
  const v = (w, py, vi, ex, exPy, exVi) => ({ w, py, vi, ex, exPy, exVi });
  const T_VIDEO = ["Xem lần 1 không phụ đề, đoán ý chính", "Xem lần 2 bật phụ đề (CC), dừng lại nhại theo từng câu", "Học từ vựng bên dưới, bấm 🔊 nghe rồi đọc theo", "Làm quiz"];
  const T_COURSE = ["Video dài — mỗi ngày xem 15–20 phút rồi bấm +phút để ghi thời gian", "Đọc to từng câu ví dụ theo giáo viên", "Ôn bộ từ tiêu biểu bên dưới bằng flashcard"];
  const T_GRAMMAR = ["Xem video, ghi lại công thức vào ô Ghi chú", "Tự đặt 3 câu với cấu trúc vừa học", "Làm quiz — câu sai thì xem lại đoạn giải thích"];

  window.LEVELS = [
    { id: "HSK1", name: "入门 Rùmén", vi: "Nhập môn", desc: "Chào hỏi, giới thiệu bản thân, gia đình, số đếm, giờ giấc — khoảng 150 từ." },
    { id: "HSK2", name: "初级 Chūjí", vi: "Sơ cấp", desc: "Mua sắm, xin WeChat, nói “có/được” tự nhiên; ngữ pháp 了, 过, 比 — khoảng 300 từ." },
    { id: "HSK3", name: "进阶 Jìnjiē", vi: "Tiền trung cấp", desc: "Kể chuyện, hỏi han hằng ngày như người bản xứ; bổ ngữ kết quả, vị trí của 了 — khoảng 600 từ." },
    { id: "HSK4", name: "中级 Zhōngjí", vi: "Trung cấp", desc: "Nói về văn hoá, cảm nhận; câu phức 即使…也, 不仅…而且, các cách nói “nếu” — khoảng 1.200 từ." },
    { id: "HSK5", name: "中高级 Zhōnggāojí", vi: "Trung cao cấp", desc: "Nghe phỏng vấn, chuyện kể, phim; trình bày quan điểm mạch lạc — khoảng 2.500 từ." },
    { id: "HSK6", name: "高级 Gāojí", vi: "Cao cấp", desc: "Phỏng vấn đường phố tốc độ tự nhiên, tiếng lóng mạng, thành ngữ — 5.000+ từ." }
  ];

  window.SKILLS = {
    listening: { vi: "Nghe – nói", icon: "🎧" },
    vocab: { vi: "Từ vựng", icon: "📚" },
    grammar: { vi: "Ngữ pháp", icon: "🧩" }
  };

  window.LESSONS = [
    /* ============================== HSK 1 ============================== */
    {
      id: "zh1-greetings", level: "HSK1", skill: "listening",
      title: "Greet People Like a Native Chinese Speaker", titleVi: "Chào hỏi như người bản xứ (đừng chỉ nói 你好吗)",
      source: yt(EC, "vtrH_O71dJg"), minutes: 12,
      goal: "Biết 5–6 cách chào hỏi người Trung Quốc dùng thật hằng ngày, thay cho “你好吗？我很好”.",
      tasks: T_VIDEO,
      vocab: [
        v("你好", "nǐ hǎo", "xin chào", "你好，我叫小明。", "Nǐ hǎo, wǒ jiào Xiǎomíng.", "Xin chào, tôi tên là Tiểu Minh."),
        v("早上好", "zǎoshang hǎo", "chào buổi sáng", "老师，早上好！", "Lǎoshī, zǎoshang hǎo!", "Chào buổi sáng thầy/cô!"),
        v("吃了吗", "chī le ma", "ăn cơm chưa (câu chào)", "你吃了吗？我们一起吃饭吧。", "Nǐ chī le ma? Wǒmen yìqǐ chīfàn ba.", "Bạn ăn chưa? Mình cùng đi ăn nhé."),
        v("好久不见", "hǎojiǔ bú jiàn", "lâu rồi không gặp", "好久不见，你最近怎么样？", "Hǎojiǔ bú jiàn, nǐ zuìjìn zěnmeyàng?", "Lâu rồi không gặp, dạo này bạn thế nào?"),
        v("最近", "zuìjìn", "dạo này, gần đây", "我最近很忙。", "Wǒ zuìjìn hěn máng.", "Dạo này tôi rất bận."),
        v("再见", "zàijiàn", "tạm biệt", "明天见，再见！", "Míngtiān jiàn, zàijiàn!", "Mai gặp nhé, tạm biệt!")
      ],
      questions: [
        { q: "Gặp lại bạn cũ sau nhiều năm, câu chào tự nhiên nhất là:", options: ["好久不见！", "你好吗？我很好。", "对不起！", "不客气！"], answer: 0, explain: "好久不见 (hǎojiǔ bú jiàn) = lâu rồi không gặp." }
      ]
    },
    {
      id: "zh1-family", level: "HSK1", skill: "vocab",
      title: "Family in Chinese: A Complete Guide to Chinese Family Members", titleVi: "Cách gọi các thành viên trong gia đình",
      source: yt(EC, "8XP78O8w_sc"), minutes: 12,
      goal: "Gọi đúng bố mẹ, anh chị em, ông bà nội/ngoại; phân biệt họ nội (爷爷, 奶奶) và họ ngoại (外公, 外婆).",
      tasks: ["Xem video, vẽ sơ đồ gia đình bạn vào ô Ghi chú bằng chữ Hán", "Giới thiệu gia đình: 我家有…口人", "Làm quiz"],
      vocab: [
        v("爸爸", "bàba", "bố", "我爸爸是医生。", "Wǒ bàba shì yīshēng.", "Bố tôi là bác sĩ."),
        v("妈妈", "māma", "mẹ", "妈妈在家做饭。", "Māma zài jiā zuò fàn.", "Mẹ đang nấu cơm ở nhà."),
        v("哥哥", "gēge", "anh trai", "我哥哥二十五岁。", "Wǒ gēge èrshíwǔ suì.", "Anh trai tôi 25 tuổi."),
        v("姐姐", "jiějie", "chị gái", "姐姐喜欢看书。", "Jiějie xǐhuan kàn shū.", "Chị gái thích đọc sách."),
        v("弟弟", "dìdi", "em trai", "我弟弟是中学生。", "Wǒ dìdi shì zhōngxuéshēng.", "Em trai tôi là học sinh trung học."),
        v("妹妹", "mèimei", "em gái", "你有妹妹吗？", "Nǐ yǒu mèimei ma?", "Bạn có em gái không?"),
        v("爷爷", "yéye", "ông nội", "爷爷每天早上喝茶。", "Yéye měi tiān zǎoshang hē chá.", "Sáng nào ông nội cũng uống trà."),
        v("奶奶", "nǎinai", "bà nội", "奶奶住在北京。", "Nǎinai zhù zài Běijīng.", "Bà nội sống ở Bắc Kinh.")
      ],
      questions: [
        { q: "外婆 (wàipó) là ai?", options: ["Bà ngoại", "Bà nội", "Mẹ", "Cô (em gái bố)"], answer: 0, explain: "外公/外婆 = ông/bà ngoại (bên mẹ); 爷爷/奶奶 = ông/bà nội." }
      ]
    },
    {
      id: "zh1-countries", level: "HSK1", skill: "vocab",
      title: "Country Names in Mandarin Chinese – Name Your Country", titleVi: "Tên các nước & hỏi “Bạn là người nước nào?”",
      source: yt(EC, "leguKsWVi8s"), minutes: 10,
      goal: "Nói được mình là người nước nào và tên các nước quen thuộc.",
      tasks: T_VIDEO,
      vocab: [
        v("中国", "Zhōngguó", "Trung Quốc", "我想去中国旅游。", "Wǒ xiǎng qù Zhōngguó lǚyóu.", "Tôi muốn đi du lịch Trung Quốc."),
        v("越南", "Yuènán", "Việt Nam", "我是越南人。", "Wǒ shì Yuènán rén.", "Tôi là người Việt Nam."),
        v("美国", "Měiguó", "nước Mỹ", "他在美国工作。", "Tā zài Měiguó gōngzuò.", "Anh ấy làm việc ở Mỹ."),
        v("英国", "Yīngguó", "nước Anh", "英国的天气怎么样？", "Yīngguó de tiānqì zěnmeyàng?", "Thời tiết ở Anh thế nào?"),
        v("日本", "Rìběn", "Nhật Bản", "日本菜很好吃。", "Rìběn cài hěn hǎochī.", "Món Nhật rất ngon."),
        v("韩国", "Hánguó", "Hàn Quốc", "她会说韩国话。", "Tā huì shuō Hánguó huà.", "Cô ấy biết nói tiếng Hàn."),
        v("哪国人", "nǎ guó rén", "người nước nào", "你是哪国人？", "Nǐ shì nǎ guó rén?", "Bạn là người nước nào?")
      ],
      questions: [
        { q: "Hỏi “Bạn là người nước nào?”:", options: ["你是哪国人？", "你叫什么名字？", "你几岁？", "你去哪儿？"], answer: 0, explain: "Trả lời: 我是越南人。(Wǒ shì Yuènán rén.)" }
      ]
    },
    {
      id: "zh1-starters", level: "HSK1", skill: "listening",
      title: "Beginner Chinese Conversation With 100 Sentence Starters", titleVi: "100 mẫu câu mở đầu cho hội thoại cơ bản",
      source: yt(MC, "6rBdlcV3Ank"), minutes: 20,
      goal: "Có sẵn “khung câu” (我想…, 我喜欢…, 可以…吗？) để tự ghép thành câu nói hằng ngày.",
      tasks: ["Xem 15–20 phút đầu, dừng lại đọc theo từng câu", "Chọn 5 mẫu câu, tự thay từ để nói về bản thân", "Làm quiz"],
      vocab: [
        v("我想", "wǒ xiǎng", "tôi muốn", "我想喝一杯咖啡。", "Wǒ xiǎng hē yì bēi kāfēi.", "Tôi muốn uống một cốc cà phê."),
        v("我喜欢", "wǒ xǐhuan", "tôi thích", "我喜欢吃中国菜。", "Wǒ xǐhuan chī Zhōngguó cài.", "Tôi thích ăn món Trung Quốc."),
        v("我觉得", "wǒ juéde", "tôi thấy (rằng)", "我觉得这个很好。", "Wǒ juéde zhège hěn hǎo.", "Tôi thấy cái này rất tốt."),
        v("你会", "nǐ huì", "bạn biết (làm gì)", "你会说汉语吗？", "Nǐ huì shuō Hànyǔ ma?", "Bạn biết nói tiếng Trung không?"),
        v("可以", "kěyǐ", "có thể, được phép", "我可以坐这儿吗？", "Wǒ kěyǐ zuò zhèr ma?", "Tôi ngồi đây được không?"),
        v("请问", "qǐngwèn", "xin hỏi", "请问，洗手间在哪儿？", "Qǐngwèn, xǐshǒujiān zài nǎr?", "Xin hỏi, nhà vệ sinh ở đâu?")
      ],
      questions: [
        { q: "“Tôi ngồi đây được không?” là:", options: ["我可以坐这儿吗？", "我喜欢坐这儿。", "我想坐飞机。", "你会坐这儿吗？"], answer: 0, explain: "可以 + động từ + 吗？ = xin phép làm gì." }
      ]
    },
    {
      id: "zh1-vocab150", level: "HSK1", skill: "vocab",
      title: "HSK 1 Vocabulary List: 150 Basic Chinese Words Review", titleVi: "Ôn trọn 150 từ HSK 1",
      source: yt(EC, "PIcxux2MMVY"), minutes: 25,
      goal: "Ôn hệ thống 150 từ HSK 1; bộ từ bên dưới tập trung vào thời gian và mua bán.",
      tasks: T_COURSE,
      vocab: [
        v("今天", "jīntiān", "hôm nay", "今天星期几？", "Jīntiān xīngqī jǐ?", "Hôm nay thứ mấy?"),
        v("明天", "míngtiān", "ngày mai", "明天我们去商店。", "Míngtiān wǒmen qù shāngdiàn.", "Ngày mai chúng ta đi cửa hàng."),
        v("昨天", "zuótiān", "hôm qua", "昨天下雨了。", "Zuótiān xià yǔ le.", "Hôm qua trời mưa."),
        v("现在", "xiànzài", "bây giờ", "现在几点？", "Xiànzài jǐ diǎn?", "Bây giờ mấy giờ?"),
        v("多少钱", "duōshao qián", "bao nhiêu tiền", "这个苹果多少钱？", "Zhège píngguǒ duōshao qián?", "Quả táo này bao nhiêu tiền?"),
        v("块", "kuài", "đồng (tệ, khẩu ngữ)", "一杯茶五块。", "Yì bēi chá wǔ kuài.", "Một cốc trà năm tệ."),
        v("喝", "hē", "uống", "你想喝什么？", "Nǐ xiǎng hē shénme?", "Bạn muốn uống gì?"),
        v("看", "kàn", "xem, nhìn", "我晚上看电视。", "Wǒ wǎnshang kàn diànshì.", "Buổi tối tôi xem ti vi.")
      ],
      questions: [
        { q: "现在___点？— 三点。", options: ["几", "多", "什么", "哪"], answer: 0, explain: "几 hỏi số nhỏ (giờ, ngày, tuổi trẻ em): 几点 = mấy giờ." }
      ]
    },
    {
      id: "zh1-100conv", level: "HSK1", skill: "listening",
      title: "100 Daily Chinese Conversations (Part 1): Lesson 1–10", titleVi: "100 đoạn hội thoại hằng ngày — phần 1",
      source: yt(EC, "V-zIW9s4DFQ"), minutes: 20,
      goal: "Nghe – nhại các câu xã giao: cảm ơn, xin lỗi, làm quen.",
      tasks: T_VIDEO,
      vocab: [
        v("谢谢", "xièxie", "cảm ơn", "谢谢你的帮助！", "Xièxie nǐ de bāngzhù!", "Cảm ơn bạn đã giúp đỡ!"),
        v("不客气", "bú kèqi", "không có gì", "—谢谢！—不客气。", "—Xièxie! —Bú kèqi.", "—Cảm ơn! —Không có gì."),
        v("对不起", "duìbuqǐ", "xin lỗi", "对不起，我来晚了。", "Duìbuqǐ, wǒ lái wǎn le.", "Xin lỗi, tôi đến muộn."),
        v("没关系", "méi guānxi", "không sao", "没关系，我们走吧。", "Méi guānxi, wǒmen zǒu ba.", "Không sao, mình đi thôi."),
        v("认识", "rènshi", "quen biết", "很高兴认识你。", "Hěn gāoxìng rènshi nǐ.", "Rất vui được làm quen với bạn."),
        v("名字", "míngzi", "tên", "你叫什么名字？", "Nǐ jiào shénme míngzi?", "Bạn tên là gì?")
      ],
      questions: [
        { q: "Ai đó nói “对不起！”, bạn đáp:", options: ["没关系。", "不客气。", "谢谢。", "再见。"], answer: 0, explain: "对不起 → 没关系 (không sao); 谢谢 → 不客气 (không có gì)." }
      ]
    },
    {
      id: "zh1-cctv", level: "HSK1", skill: "listening",
      title: "CCTV Learn Chinese: Growing Up with Chinese 成长汉语", titleVi: "Phim học tiếng Trung của CCTV — 100 tập ngắn",
      source: { type: "link", provider: "CCTV Learn Chinese", url: "https://cctv.cntv.cn/lm/learningchinese/01/" },
      minutes: 15,
      goal: "Học qua phim ngắn của CCTV: mỗi tập một tình huống đời thường, nói chậm, có giải thích.",
      tasks: ["Mở trang CCTV Learn Chinese, chọn series Growing Up with Chinese 成长汉语", "Mỗi ngày xem 1–2 tập, nhại lại câu của nhân vật", "Ghi 3 câu mới vào ô Ghi chú, quay lại bấm ghi thời gian"],
      vocab: [
        v("老师", "lǎoshī", "giáo viên", "王老师是北京人。", "Wáng lǎoshī shì Běijīng rén.", "Thầy Vương là người Bắc Kinh."),
        v("学生", "xuésheng", "học sinh", "她是新学生。", "Tā shì xīn xuésheng.", "Cô ấy là học sinh mới."),
        v("汉语", "Hànyǔ", "tiếng Hán (tiếng Trung)", "我在学习汉语。", "Wǒ zài xuéxí Hànyǔ.", "Tôi đang học tiếng Trung."),
        v("朋友", "péngyou", "bạn bè", "他是我的好朋友。", "Tā shì wǒ de hǎo péngyou.", "Anh ấy là bạn thân của tôi."),
        v("高兴", "gāoxìng", "vui", "认识你我很高兴。", "Rènshi nǐ wǒ hěn gāoxìng.", "Quen được bạn tôi rất vui."),
        v("学校", "xuéxiào", "trường học", "我们的学校很大。", "Wǒmen de xuéxiào hěn dà.", "Trường của chúng tôi rất lớn.")
      ]
    },

    /* ============================== HSK 2 ============================== */
    {
      id: "zh2-shopping", level: "HSK2", skill: "listening",
      title: "Shopping for Clothes in Chinese – Speak Chinese Fluently", titleVi: "Mua quần áo: hỏi màu, cỡ, giá, mặc cả",
      source: yt(EC, "gfVD7zOcSpA"), minutes: 15,
      goal: "Tự mua quần áo ở Trung Quốc: hỏi màu, xin thử, hỏi giá, mặc cả và trả tiền.",
      tasks: T_VIDEO,
      vocab: [
        v("衣服", "yīfu", "quần áo", "这件衣服很漂亮。", "Zhè jiàn yīfu hěn piàoliang.", "Bộ quần áo này rất đẹp."),
        v("颜色", "yánsè", "màu sắc", "你喜欢什么颜色？", "Nǐ xǐhuan shénme yánsè?", "Bạn thích màu gì?"),
        v("试", "shì", "thử", "我可以试一下吗？", "Wǒ kěyǐ shì yíxià ma?", "Tôi thử một chút được không?"),
        v("便宜", "piányi", "rẻ", "能便宜一点儿吗？", "Néng piányi yìdiǎnr ma?", "Rẻ hơn chút được không?"),
        v("贵", "guì", "đắt", "这双鞋太贵了。", "Zhè shuāng xié tài guì le.", "Đôi giày này đắt quá."),
        v("号", "hào", "cỡ, số (size)", "有大一号的吗？", "Yǒu dà yí hào de ma?", "Có cỡ lớn hơn một số không?"),
        v("付钱", "fù qián", "trả tiền", "我用手机付钱。", "Wǒ yòng shǒujī fù qián.", "Tôi trả tiền bằng điện thoại.")
      ],
      questions: [
        { q: "Muốn mặc cả “Rẻ hơn chút được không?”:", options: ["能便宜一点儿吗？", "太便宜了！", "这个多少钱？", "我不要了。"], answer: 0, explain: "便宜一点儿 = rẻ hơn một chút; 能…吗？ = có thể… không?" }
      ]
    },
    {
      id: "zh2-wechat", level: "HSK2", skill: "listening",
      title: "问电话 – Asking for Someone's Phone Number (Speak Natural Chinese)", titleVi: "Xin số điện thoại & kết bạn WeChat",
      source: yt(EC, "Jr4VnprtWKU"), minutes: 12,
      goal: "Xin số điện thoại, kết bạn WeChat một cách tự nhiên và lịch sự.",
      tasks: T_VIDEO,
      vocab: [
        v("电话号码", "diànhuà hàomǎ", "số điện thoại", "你的电话号码是多少？", "Nǐ de diànhuà hàomǎ shì duōshao?", "Số điện thoại của bạn là bao nhiêu?"),
        v("微信", "Wēixìn", "WeChat", "你有微信吗？", "Nǐ yǒu Wēixìn ma?", "Bạn có WeChat không?"),
        v("加", "jiā", "thêm, kết bạn", "我们加个微信吧。", "Wǒmen jiā ge Wēixìn ba.", "Mình kết bạn WeChat nhé."),
        v("扫", "sǎo", "quét (mã QR)", "我扫你还是你扫我？", "Wǒ sǎo nǐ háishi nǐ sǎo wǒ?", "Tôi quét mã bạn hay bạn quét mã tôi?"),
        v("方便", "fāngbiàn", "tiện, thuận tiện", "你现在方便说话吗？", "Nǐ xiànzài fāngbiàn shuōhuà ma?", "Bây giờ bạn nói chuyện tiện không?"),
        v("联系", "liánxì", "liên lạc", "以后常联系！", "Yǐhòu cháng liánxì!", "Sau này giữ liên lạc nhé!")
      ],
      questions: [
        { q: "你的电话号码是___？", options: ["多少", "几", "什么", "哪儿"], answer: 0, explain: "Hỏi số điện thoại, số phòng dùng 多少 (duōshao)." }
      ]
    },
    {
      id: "zh2-say-yes", level: "HSK2", skill: "vocab",
      title: "9 Ways to Say YES Fluently in Chinese – The Ultimate Guide", titleVi: "9 cách nói “Có / Được” tự nhiên",
      source: yt(EC, "FPybarwVzfY"), minutes: 12,
      goal: "Trả lời “có/được/đồng ý” đúng ngữ cảnh: 是的, lặp động từ, 当然, 好的, 行, 对, 嗯…",
      tasks: T_VIDEO,
      vocab: [
        v("当然", "dāngrán", "tất nhiên", "当然可以！", "Dāngrán kěyǐ!", "Tất nhiên là được!"),
        v("没问题", "méi wèntí", "không vấn đề gì", "明天帮你，没问题。", "Míngtiān bāng nǐ, méi wèntí.", "Mai giúp bạn, không vấn đề gì."),
        v("好的", "hǎo de", "vâng, ok (lịch sự)", "好的，我马上来。", "Hǎo de, wǒ mǎshàng lái.", "Vâng, tôi đến ngay."),
        v("行", "xíng", "được (khẩu ngữ)", "行，就这么办。", "Xíng, jiù zhème bàn.", "Được, cứ làm vậy đi."),
        v("对", "duì", "đúng", "对，你说得很对。", "Duì, nǐ shuō de hěn duì.", "Đúng, bạn nói rất đúng."),
        v("没错", "méi cuò", "không sai, chuẩn", "没错，就是他。", "Méi cuò, jiù shì tā.", "Chuẩn, chính là anh ấy."),
        v("听你的", "tīng nǐ de", "nghe theo bạn", "去哪儿吃？我听你的。", "Qù nǎr chī? Wǒ tīng nǐ de.", "Đi đâu ăn? Tôi nghe theo bạn.")
      ],
      questions: [
        { q: "Được hỏi “你喜欢喝茶吗？”, cách nói “có” tự nhiên nhất:", options: ["喜欢。", "是。", "对不起。", "没关系。"], answer: 0, explain: "Câu hỏi không dùng 是 thì trả lời bằng cách lặp lại động từ: 喜欢 / 有 / 会 / 去." }
      ]
    },
    {
      id: "zh2-350phrases", level: "HSK2", skill: "vocab",
      title: "350 Common Chinese Phrases & Sentences", titleVi: "350 cụm từ & câu thông dụng",
      source: yt(EC, "vCj-Hw-fxaM"), minutes: 20,
      goal: "Thuộc các câu “cứu cánh” khi giao tiếp: nhờ nói chậm, nói lại, báo không hiểu.",
      tasks: T_COURSE,
      vocab: [
        v("没事", "méi shì", "không sao đâu", "别担心，我没事。", "Bié dānxīn, wǒ méi shì.", "Đừng lo, tôi không sao."),
        v("等一下", "děng yíxià", "đợi một chút", "请等一下，我马上来。", "Qǐng děng yíxià, wǒ mǎshàng lái.", "Xin đợi chút, tôi đến ngay."),
        v("慢一点儿", "màn yìdiǎnr", "chậm một chút", "请说慢一点儿。", "Qǐng shuō màn yìdiǎnr.", "Xin nói chậm một chút."),
        v("再说一遍", "zài shuō yí biàn", "nói lại một lần", "对不起，请再说一遍。", "Duìbuqǐ, qǐng zài shuō yí biàn.", "Xin lỗi, làm ơn nói lại lần nữa."),
        v("听不懂", "tīng bu dǒng", "nghe không hiểu", "你说得太快，我听不懂。", "Nǐ shuō de tài kuài, wǒ tīng bu dǒng.", "Bạn nói nhanh quá, tôi nghe không hiểu."),
        v("加油", "jiāyóu", "cố lên", "明天考试，加油！", "Míngtiān kǎoshì, jiāyóu!", "Mai thi rồi, cố lên!")
      ],
      questions: [
        { q: "Người kia nói nhanh quá, bạn nhờ:", options: ["请说慢一点儿。", "请等一下。", "加油！", "没事。"], answer: 0, explain: "慢一点儿 = chậm một chút." }
      ]
    },
    {
      id: "zh2-mc-hsk2", level: "HSK2", skill: "vocab",
      title: "HSK 2 – Complete 150 Vocabulary Words & Sentence Examples", titleVi: "Trọn bộ 150 từ HSK 2 kèm câu ví dụ",
      source: yt(MC, "WOWRT2NM5AI"), minutes: 25,
      goal: "Học 150 từ mới của HSK 2 qua câu ví dụ; bộ từ bên dưới là các từ nối và trạng từ quan trọng nhất.",
      tasks: T_COURSE,
      vocab: [
        v("准备", "zhǔnbèi", "chuẩn bị", "我在准备考试。", "Wǒ zài zhǔnbèi kǎoshì.", "Tôi đang chuẩn bị thi."),
        v("希望", "xīwàng", "hy vọng", "希望明天是晴天。", "Xīwàng míngtiān shì qíngtiān.", "Hy vọng mai trời nắng."),
        v("介绍", "jièshào", "giới thiệu", "我来介绍一下，这是我同事。", "Wǒ lái jièshào yíxià, zhè shì wǒ tóngshì.", "Để tôi giới thiệu, đây là đồng nghiệp tôi."),
        v("已经", "yǐjīng", "đã (rồi)", "我已经吃饭了。", "Wǒ yǐjīng chī fàn le.", "Tôi ăn cơm rồi."),
        v("因为", "yīnwèi", "bởi vì", "因为下雨，所以我不去了。", "Yīnwèi xià yǔ, suǒyǐ wǒ bú qù le.", "Vì trời mưa nên tôi không đi nữa."),
        v("一起", "yìqǐ", "cùng nhau", "我们一起去吧！", "Wǒmen yìqǐ qù ba!", "Chúng ta cùng đi nhé!"),
        v("可能", "kěnéng", "có lẽ, có thể", "他可能不来了。", "Tā kěnéng bù lái le.", "Có lẽ anh ấy không đến nữa.")
      ],
      questions: [
        { q: "___下雨，所以我们在家。", options: ["因为", "但是", "所以", "可是"], answer: 0, explain: "因为…所以… = bởi vì… nên…" }
      ]
    },
    {
      id: "zh2-le", level: "HSK2", skill: "grammar",
      title: "How to Use le in Chinese – 怎么用“了”", titleVi: "Cách dùng 了 (phần 1)",
      source: yt(SS, "5mnag_q--oU"), minutes: 15,
      goal: "Hiểu 了 sau động từ (hành động đã hoàn thành) và 了 cuối câu (thay đổi trạng thái); phủ định bằng 没.",
      tasks: T_GRAMMAR,
      vocab: [
        v("买了", "mǎi le", "đã mua", "我买了一本书。", "Wǒ mǎi le yì běn shū.", "Tôi đã mua một quyển sách."),
        v("下雨了", "xià yǔ le", "trời mưa rồi", "外面下雨了，带伞吧。", "Wàimiàn xià yǔ le, dài sǎn ba.", "Ngoài trời mưa rồi, mang ô đi."),
        v("太好了", "tài hǎo le", "tuyệt quá", "你来了，太好了！", "Nǐ lái le, tài hǎo le!", "Bạn đến rồi, tuyệt quá!"),
        v("不去了", "bú qù le", "không đi nữa", "我累了，不去了。", "Wǒ lèi le, bú qù le.", "Tôi mệt rồi, không đi nữa."),
        v("快到了", "kuài dào le", "sắp đến rồi", "别急，我们快到了。", "Bié jí, wǒmen kuài dào le.", "Đừng vội, chúng ta sắp đến rồi."),
        v("没有", "méiyǒu", "chưa / đã không (phủ định quá khứ)", "我昨天没有去上班。", "Wǒ zuótiān méiyǒu qù shàngbān.", "Hôm qua tôi không đi làm.")
      ],
      questions: [
        { q: "Phủ định của “我吃了早饭” là:", options: ["我没吃早饭。", "我不吃了早饭。", "我没吃了早饭。", "我吃不了早饭。"], answer: 0, explain: "Phủ định hành động đã xảy ra dùng 没(有) và BỎ 了." },
        { q: "“Tôi đã mua ba quyển sách” là:", options: ["我买了三本书。", "我了买三本书。", "我买三了本书。", "了我买三本书。"], answer: 0, explain: "了 đứng ngay sau động từ khi tân ngữ có số lượng: 买了三本书." }
      ]
    },

    /* ============================== HSK 3 ============================== */
    {
      id: "zh3-walk", level: "HSK3", skill: "listening",
      title: "A Walk Around My Neighborhood – Intermediate Chinese", titleVi: "Dạo quanh khu phố nhà mình",
      source: yt(MC, "DDpKO9BrzA8"), minutes: 20,
      goal: "Nghe người bản xứ vừa đi vừa kể về khu mình sống — luyện nghe tốc độ thật, có phụ đề chữ Hán + pinyin.",
      tasks: T_VIDEO,
      vocab: [
        v("附近", "fùjìn", "gần đây, lân cận", "附近有超市吗？", "Fùjìn yǒu chāoshì ma?", "Gần đây có siêu thị không?"),
        v("超市", "chāoshì", "siêu thị", "我常去楼下的超市买菜。", "Wǒ cháng qù lóuxià de chāoshì mǎi cài.", "Tôi hay xuống siêu thị dưới nhà mua đồ ăn."),
        v("公园", "gōngyuán", "công viên", "晚饭后我们去公园走走。", "Wǎnfàn hòu wǒmen qù gōngyuán zǒuzou.", "Ăn tối xong mình ra công viên đi bộ."),
        v("散步", "sànbù", "đi dạo", "我喜欢在河边散步。", "Wǒ xǐhuan zài hébiān sànbù.", "Tôi thích đi dạo bên bờ sông."),
        v("邻居", "línjū", "hàng xóm", "我的邻居很热情。", "Wǒ de línjū hěn rèqíng.", "Hàng xóm của tôi rất nhiệt tình."),
        v("环境", "huánjìng", "môi trường, khung cảnh", "这里的环境很安静。", "Zhèlǐ de huánjìng hěn ānjìng.", "Khung cảnh ở đây rất yên tĩnh."),
        v("热闹", "rènao", "náo nhiệt", "晚上这条街很热闹。", "Wǎnshang zhè tiáo jiē hěn rènao.", "Buổi tối con phố này rất náo nhiệt.")
      ]
    },
    {
      id: "zh3-mc-hsk3", level: "HSK3", skill: "vocab",
      title: "HSK 3 – Complete 300 Vocabulary Words & Sentence Examples", titleVi: "Trọn bộ 300 từ HSK 3 kèm câu ví dụ",
      source: yt(MC, "1D5a2LGgFFk"), minutes: 25,
      goal: "Học 300 từ mới của HSK 3; bộ từ bên dưới là các cấu trúc hay dùng khi kể chuyện.",
      tasks: T_COURSE,
      vocab: [
        v("而且", "érqiě", "hơn nữa", "这家饭馆很便宜，而且很好吃。", "Zhè jiā fànguǎn hěn piányi, érqiě hěn hǎochī.", "Quán này rẻ, hơn nữa còn ngon."),
        v("越来越", "yuè lái yuè", "càng ngày càng", "天气越来越冷了。", "Tiānqì yuè lái yuè lěng le.", "Trời càng ngày càng lạnh."),
        v("终于", "zhōngyú", "cuối cùng (cũng)", "我终于找到工作了！", "Wǒ zhōngyú zhǎodào gōngzuò le!", "Cuối cùng tôi cũng tìm được việc!"),
        v("担心", "dānxīn", "lo lắng", "别担心，一切都会好的。", "Bié dānxīn, yíqiè dōu huì hǎo de.", "Đừng lo, mọi chuyện sẽ ổn thôi."),
        v("关心", "guānxīn", "quan tâm", "谢谢你关心我。", "Xièxie nǐ guānxīn wǒ.", "Cảm ơn bạn đã quan tâm tôi."),
        v("了解", "liǎojiě", "hiểu rõ, tìm hiểu", "我想了解中国文化。", "Wǒ xiǎng liǎojiě Zhōngguó wénhuà.", "Tôi muốn tìm hiểu văn hoá Trung Quốc."),
        v("一边", "yìbiān", "vừa… (vừa…)", "他一边吃饭一边看手机。", "Tā yìbiān chī fàn yìbiān kàn shǒujī.", "Anh ấy vừa ăn cơm vừa xem điện thoại.")
      ],
      questions: [
        { q: "天气___冷了。(Trời càng ngày càng lạnh)", options: ["越来越", "一边", "终于", "而且"], answer: 0, explain: "越来越 + tính từ = càng ngày càng…" }
      ]
    },
    {
      id: "zh3-result", level: "HSK3", skill: "grammar",
      title: "Learn Chinese with Movie: The Wandering Earth – Result Complement", titleVi: "Bổ ngữ kết quả qua phim Lưu lạc Địa cầu",
      source: yt(EC, "oow80iXlOXc"), minutes: 15,
      goal: "Dùng bổ ngữ kết quả 完, 懂, 到, 好, 错, 会 để nói hành động đã đạt kết quả gì.",
      tasks: T_GRAMMAR,
      vocab: [
        v("看完", "kàn wán", "xem xong", "这本书我已经看完了。", "Zhè běn shū wǒ yǐjīng kàn wán le.", "Quyển sách này tôi đọc xong rồi."),
        v("听懂", "tīng dǒng", "nghe hiểu", "老师说的话你听懂了吗？", "Lǎoshī shuō de huà nǐ tīng dǒng le ma?", "Lời thầy nói bạn nghe hiểu chưa?"),
        v("找到", "zhǎo dào", "tìm thấy", "我的钥匙找到了。", "Wǒ de yàoshi zhǎo dào le.", "Chìa khoá của tôi tìm thấy rồi."),
        v("做好", "zuò hǎo", "làm xong (tốt)", "晚饭做好了，快来吃吧。", "Wǎnfàn zuò hǎo le, kuài lái chī ba.", "Cơm tối xong rồi, mau ra ăn đi."),
        v("写错", "xiě cuò", "viết sai", "对不起，我写错了你的名字。", "Duìbuqǐ, wǒ xiě cuò le nǐ de míngzi.", "Xin lỗi, tôi viết sai tên bạn rồi."),
        v("学会", "xué huì", "học được (biết làm)", "我学会了开车。", "Wǒ xué huì le kāi chē.", "Tôi đã học được lái xe.")
      ],
      questions: [
        { q: "我找了很久，可是没找___。", options: ["到", "完", "懂", "错"], answer: 0, explain: "找到 = tìm thấy. Phủ định bổ ngữ kết quả: 没 + động từ + bổ ngữ." },
        { q: "Phủ định của “我听懂了”:", options: ["我没听懂。", "我不听懂了。", "我听没懂。", "我听懂没。"], answer: 0, explain: "没 + động từ + bổ ngữ kết quả, bỏ 了." }
      ]
    },
    {
      id: "zh3-le2", level: "HSK3", skill: "grammar",
      title: "How to Use le in Chinese (2): Where Exactly Should You Put le", titleVi: "Vị trí của 了 trong câu (phần 2)",
      source: yt(SS, "1A1laEwquPo"), minutes: 15,
      goal: "Biết đặt 了 sau động từ, cuối câu, hay cả hai — và khi nào câu có hai chữ 了.",
      tasks: T_GRAMMAR,
      vocab: [
        v("吃了饭", "chī le fàn", "ăn cơm xong", "我吃了饭就去找你。", "Wǒ chī le fàn jiù qù zhǎo nǐ.", "Ăn cơm xong tôi sẽ đi tìm bạn."),
        v("学了两年", "xué le liǎng nián", "đã học hai năm", "我学了两年汉语了。", "Wǒ xué le liǎng nián Hànyǔ le.", "Tôi học tiếng Trung được hai năm rồi (vẫn đang học)."),
        v("来了", "lái le", "đến rồi", "公共汽车来了！", "Gōnggòng qìchē lái le!", "Xe buýt đến rồi!"),
        v("不想去了", "bù xiǎng qù le", "không muốn đi nữa", "天太冷，我不想去了。", "Tiān tài lěng, wǒ bù xiǎng qù le.", "Trời lạnh quá, tôi không muốn đi nữa."),
        v("已经到了", "yǐjīng dào le", "đã đến rồi", "我已经到了，你在哪儿？", "Wǒ yǐjīng dào le, nǐ zài nǎr?", "Tôi đến rồi, bạn ở đâu?"),
        v("下了课", "xià le kè", "tan học xong", "下了课我们去吃饭吧。", "Xià le kè wǒmen qù chī fàn ba.", "Tan học xong mình đi ăn nhé.")
      ],
      questions: [
        { q: "“Tôi học tiếng Trung được hai năm rồi (và vẫn đang học)”:", options: ["我学了两年汉语了。", "我学两年了汉语。", "我了学两年汉语。", "我学汉语了两年了了。"], answer: 0, explain: "了 sau động từ (đã được 2 năm) + 了 cuối câu (vẫn tiếp diễn đến nay)." }
      ]
    },
    {
      id: "zh3-questions", level: "HSK3", skill: "listening",
      title: "Impress Your Chinese Friends: More Common Alternatives for Six Daily Questions", titleVi: "Hỏi han hằng ngày như người bản xứ",
      source: yt(SS, "MdpT5TLIKwg"), minutes: 12,
      goal: "Hỏi thăm bạn bè bằng những câu khẩu ngữ tự nhiên thay cho câu sách vở.",
      tasks: T_VIDEO,
      vocab: [
        v("干嘛", "gànmá", "làm gì (khẩu ngữ)", "你在干嘛呢？", "Nǐ zài gànmá ne?", "Bạn đang làm gì đấy?"),
        v("怎么了", "zěnme le", "sao thế", "你怎么了？不舒服吗？", "Nǐ zěnme le? Bù shūfu ma?", "Bạn sao thế? Không khoẻ à?"),
        v("有空", "yǒu kòng", "rảnh", "你周末有空吗？", "Nǐ zhōumò yǒu kòng ma?", "Cuối tuần bạn rảnh không?"),
        v("怎么样", "zěnmeyàng", "thế nào", "我们去看电影，怎么样？", "Wǒmen qù kàn diànyǐng, zěnmeyàng?", "Mình đi xem phim, thấy sao?"),
        v("忙什么", "máng shénme", "bận gì", "最近忙什么呢？", "Zuìjìn máng shénme ne?", "Dạo này bận gì thế?"),
        v("真的吗", "zhēn de ma", "thật không", "你下个月去北京？真的吗？", "Nǐ xià ge yuè qù Běijīng? Zhēn de ma?", "Tháng sau bạn đi Bắc Kinh à? Thật không?")
      ]
    },
    {
      id: "zh3-huazhongwen", level: "HSK3", skill: "vocab",
      title: "Hua Zhong Wen – Learn Chinese Words with Drawings", titleVi: "Nhớ từ bằng hình vẽ vui (画中文)",
      source: { type: "link", provider: "Hua Zhong Wen", url: "https://huazhongwen.com/words" },
      minutes: 10,
      goal: "Dùng “móc trí nhớ” bằng tranh vẽ để nhớ chữ Hán lâu hơn.",
      tasks: ["Mở Word List của Hua Zhong Wen, chọn 5 từ có hình vẽ bạn thích", "Nhìn hình, đọc pinyin, tự đặt 1 câu cho mỗi từ vào ô Ghi chú", "Thêm các từ dưới đây vào flashcard"],
      vocab: [
        v("慢", "màn", "chậm", "他走得很慢。", "Tā zǒu de hěn màn.", "Anh ấy đi rất chậm."),
        v("拖鞋", "tuōxié", "dép lê", "进门请换拖鞋。", "Jìn mén qǐng huàn tuōxié.", "Vào nhà xin đổi dép lê."),
        v("太空", "tàikōng", "vũ trụ, không gian", "他想去太空旅行。", "Tā xiǎng qù tàikōng lǚxíng.", "Anh ấy muốn du hành vào vũ trụ."),
        v("裂缝", "lièfèng", "vết nứt", "墙上有一条裂缝。", "Qiáng shang yǒu yì tiáo lièfèng.", "Trên tường có một vết nứt.")
      ]
    },

    /* ============================== HSK 4 ============================== */
    {
      id: "zh4-grammar", level: "HSK4", skill: "grammar",
      title: "5 Chinese Grammar Points: 刚 vs 刚才, 从来 vs 一直", titleVi: "5 điểm ngữ pháp HSK 4: 刚/刚才, 从来/一直, 不仅…而且, 即使…也",
      source: yt(EC, "SrIXGkEFCGw"), minutes: 15,
      goal: "Phân biệt 刚 – 刚才, 从来 – 一直; dùng 不仅…而且… và 即使…也…",
      tasks: T_GRAMMAR,
      vocab: [
        v("刚", "gāng", "vừa mới (phó từ)", "我刚到公司。", "Wǒ gāng dào gōngsī.", "Tôi vừa mới đến công ty."),
        v("刚才", "gāngcái", "lúc nãy (danh từ thời gian)", "刚才谁给我打电话了？", "Gāngcái shéi gěi wǒ dǎ diànhuà le?", "Lúc nãy ai gọi điện cho tôi thế?"),
        v("从来", "cónglái", "từ trước tới nay (+不/没)", "我从来没去过上海。", "Wǒ cónglái méi qù guo Shànghǎi.", "Tôi chưa bao giờ đến Thượng Hải."),
        v("一直", "yìzhí", "liên tục, suốt", "雨一直下到晚上。", "Yǔ yìzhí xià dào wǎnshang.", "Mưa suốt đến tối."),
        v("不仅", "bùjǐn", "không những", "他不仅会说汉语，而且会写汉字。", "Tā bùjǐn huì shuō Hànyǔ, érqiě huì xiě Hànzì.", "Anh ấy không những nói được tiếng Trung mà còn viết được chữ Hán."),
        v("即使", "jíshǐ", "cho dù", "即使下雨，我们也要去。", "Jíshǐ xià yǔ, wǒmen yě yào qù.", "Cho dù mưa chúng ta vẫn đi.")
      ],
      questions: [
        { q: "___的那个人是谁？(Người lúc nãy là ai?)", options: ["刚才", "刚", "从来", "一直"], answer: 0, explain: "刚才 là danh từ thời gian, đứng được trước danh từ; 刚 là phó từ, chỉ đứng trước động từ." },
        { q: "我___没吃过榴莲。(Tôi chưa bao giờ ăn sầu riêng)", options: ["从来", "一直", "刚才", "即使"], answer: 0, explain: "从来 + 没/不 = chưa bao giờ / không bao giờ." },
        { q: "___明天下雪，我___要去上班。", options: ["即使…也", "因为…所以", "不仅…而且", "一边…一边"], answer: 0, explain: "即使…也… = cho dù… vẫn…" }
      ]
    },
    {
      id: "zh4-mc-hsk4", level: "HSK4", skill: "vocab",
      title: "HSK 4 – Complete 600 Vocabulary Words & Sentence Examples", titleVi: "Trọn bộ 600 từ HSK 4 kèm câu ví dụ",
      source: yt(MC, "g3I_yQni6jI"), minutes: 30,
      goal: "Học 600 từ mới của HSK 4; bộ từ bên dưới hay gặp khi nói chuyện công việc.",
      tasks: T_COURSE,
      vocab: [
        v("适合", "shìhé", "phù hợp", "这份工作很适合你。", "Zhè fèn gōngzuò hěn shìhé nǐ.", "Công việc này rất hợp với bạn."),
        v("经验", "jīngyàn", "kinh nghiệm", "他有十年的工作经验。", "Tā yǒu shí nián de gōngzuò jīngyàn.", "Anh ấy có mười năm kinh nghiệm làm việc."),
        v("提供", "tígōng", "cung cấp", "酒店提供免费早餐。", "Jiǔdiàn tígōng miǎnfèi zǎocān.", "Khách sạn cung cấp bữa sáng miễn phí."),
        v("积累", "jīlěi", "tích luỹ", "学语言需要慢慢积累。", "Xué yǔyán xūyào mànmàn jīlěi.", "Học ngoại ngữ cần tích luỹ từ từ."),
        v("估计", "gūjì", "ước chừng, đoán", "我估计他今天不会来。", "Wǒ gūjì tā jīntiān bú huì lái.", "Tôi đoán hôm nay anh ấy không đến."),
        v("及时", "jíshí", "kịp thời", "谢谢你及时提醒我。", "Xièxie nǐ jíshí tíxǐng wǒ.", "Cảm ơn bạn đã nhắc tôi kịp thời."),
        v("允许", "yǔnxǔ", "cho phép", "这里不允许抽烟。", "Zhèlǐ bù yǔnxǔ chōuyān.", "Ở đây không được phép hút thuốc.")
      ]
    },
    {
      id: "zh4-foreigners", level: "HSK4", skill: "listening",
      title: "3 Things Chinese Like about Foreigners – Intermediate Chinese Listening", titleVi: "3 điều người Trung Quốc thích ở người nước ngoài",
      source: yt(MC, "zTSfPXvrNAw"), minutes: 15,
      goal: "Nghe người bản xứ chia sẻ cảm nhận ở tốc độ tự nhiên; học cách nói về ấn tượng, văn hoá.",
      tasks: T_VIDEO,
      vocab: [
        v("外国人", "wàiguórén", "người nước ngoài", "这个城市有很多外国人。", "Zhège chéngshì yǒu hěn duō wàiguórén.", "Thành phố này có nhiều người nước ngoài."),
        v("印象", "yìnxiàng", "ấn tượng", "你对中国的第一印象是什么？", "Nǐ duì Zhōngguó de dì-yī yìnxiàng shì shénme?", "Ấn tượng đầu tiên của bạn về Trung Quốc là gì?"),
        v("热情", "rèqíng", "nhiệt tình", "中国朋友对我很热情。", "Zhōngguó péngyou duì wǒ hěn rèqíng.", "Bạn bè Trung Quốc rất nhiệt tình với tôi."),
        v("礼貌", "lǐmào", "lịch sự", "他说话很有礼貌。", "Tā shuōhuà hěn yǒu lǐmào.", "Anh ấy nói chuyện rất lịch sự."),
        v("感兴趣", "gǎn xìngqù", "có hứng thú", "我对中国文化很感兴趣。", "Wǒ duì Zhōngguó wénhuà hěn gǎn xìngqù.", "Tôi rất hứng thú với văn hoá Trung Quốc."),
        v("夸", "kuā", "khen", "别人夸你的时候，可以说“哪里哪里”。", "Biérén kuā nǐ de shíhou, kěyǐ shuō “nǎlǐ nǎlǐ”.", "Khi người khác khen, bạn có thể nói “đâu có, đâu có”.")
      ]
    },
    {
      id: "zh4-if", level: "HSK4", skill: "grammar",
      title: "Different Ways to Say “If…” in Chinese", titleVi: "Các cách nói “nếu…” trong tiếng Trung",
      source: yt(EC, "jw3UtVi0IgA"), minutes: 12,
      goal: "Dùng đúng 如果, 要是, …的话, 万一, 假如, 只要 trong câu điều kiện.",
      tasks: T_GRAMMAR,
      vocab: [
        v("如果", "rúguǒ", "nếu", "如果明天下雨，我们就不去了。", "Rúguǒ míngtiān xià yǔ, wǒmen jiù bú qù le.", "Nếu mai mưa thì chúng ta không đi nữa."),
        v("要是", "yàoshi", "nếu (khẩu ngữ)", "要是你累了，就休息一下。", "Yàoshi nǐ lèi le, jiù xiūxi yíxià.", "Nếu mệt thì nghỉ một chút đi."),
        v("的话", "dehuà", "…nếu mà (cuối vế điều kiện)", "有时间的话，来我家玩儿吧。", "Yǒu shíjiān dehuà, lái wǒ jiā wánr ba.", "Có thời gian thì đến nhà tôi chơi nhé."),
        v("万一", "wànyī", "lỡ như", "带把伞吧，万一下雨呢？", "Dài bǎ sǎn ba, wànyī xià yǔ ne?", "Mang ô đi, lỡ trời mưa thì sao?"),
        v("假如", "jiǎrú", "giả sử", "假如你是我，你会怎么做？", "Jiǎrú nǐ shì wǒ, nǐ huì zěnme zuò?", "Giả sử bạn là tôi, bạn sẽ làm gì?"),
        v("只要", "zhǐyào", "chỉ cần", "只要你努力，就一定能学好。", "Zhǐyào nǐ nǔlì, jiù yídìng néng xué hǎo.", "Chỉ cần bạn cố gắng thì nhất định học tốt.")
      ],
      questions: [
        { q: "带把伞吧，___下雨呢？", options: ["万一", "只要", "终于", "刚才"], answer: 0, explain: "万一 = lỡ như (khả năng nhỏ, điều không mong muốn)." }
      ]
    },
    {
      id: "zh4-translate", level: "HSK4", skill: "vocab",
      title: "Stop Directly Translating English Sentences to Chinese", titleVi: "Đừng dịch word-by-word — những câu “dịch thẳng” buồn cười",
      source: yt(SS, "TXAGlm4wt6g"), minutes: 12,
      goal: "Nhận ra lỗi dịch thẳng từ ngôn ngữ khác sang tiếng Trung và cách nói tự nhiên hơn.",
      tasks: T_VIDEO,
      vocab: [
        v("翻译", "fānyì", "dịch", "这句话怎么翻译？", "Zhè jù huà zěnme fānyì?", "Câu này dịch thế nào?"),
        v("直接", "zhíjiē", "trực tiếp", "有问题可以直接问我。", "Yǒu wèntí kěyǐ zhíjiē wèn wǒ.", "Có thắc mắc thì cứ hỏi thẳng tôi."),
        v("意思", "yìsi", "ý nghĩa", "这个词是什么意思？", "Zhège cí shì shénme yìsi?", "Từ này nghĩa là gì?"),
        v("表达", "biǎodá", "diễn đạt", "我不知道怎么表达我的想法。", "Wǒ bù zhīdào zěnme biǎodá wǒ de xiǎngfǎ.", "Tôi không biết diễn đạt suy nghĩ của mình thế nào."),
        v("地道", "dìdao", "chuẩn bản xứ", "你的汉语说得真地道！", "Nǐ de Hànyǔ shuō de zhēn dìdao!", "Tiếng Trung của bạn chuẩn bản xứ thật!"),
        v("好笑", "hǎoxiào", "buồn cười", "这个视频太好笑了。", "Zhège shìpín tài hǎoxiào le.", "Video này buồn cười quá.")
      ]
    },
    {
      id: "zh4-culture", level: "HSK4", skill: "listening",
      title: "Top 6 Cultural Differences Between China and the West", titleVi: "6 khác biệt văn hoá giữa Trung Quốc và phương Tây",
      source: yt(EC, "nfnQKXAmumw"), minutes: 15,
      goal: "Nghe và nói về khác biệt văn hoá: thể diện, khách sáo, thói quen sinh hoạt.",
      tasks: T_VIDEO,
      vocab: [
        v("差异", "chāyì", "khác biệt", "两国的文化有很多差异。", "Liǎng guó de wénhuà yǒu hěn duō chāyì.", "Văn hoá hai nước có nhiều khác biệt."),
        v("西方", "xīfāng", "phương Tây", "很多西方人喜欢喝咖啡。", "Hěn duō xīfāng rén xǐhuan hē kāfēi.", "Nhiều người phương Tây thích uống cà phê."),
        v("面子", "miànzi", "thể diện", "在中国，面子很重要。", "Zài Zhōngguó, miànzi hěn zhòngyào.", "Ở Trung Quốc, thể diện rất quan trọng."),
        v("客气", "kèqi", "khách sáo", "别客气，就像在自己家一样。", "Bié kèqi, jiù xiàng zài zìjǐ jiā yíyàng.", "Đừng khách sáo, cứ như ở nhà mình."),
        v("习惯", "xíguàn", "thói quen; quen", "我还不习惯吃辣的。", "Wǒ hái bù xíguàn chī là de.", "Tôi vẫn chưa quen ăn cay."),
        v("尊重", "zūnzhòng", "tôn trọng", "我们应该尊重不同的文化。", "Wǒmen yīnggāi zūnzhòng bùtóng de wénhuà.", "Chúng ta nên tôn trọng các nền văn hoá khác nhau.")
      ]
    },

    /* ============================== HSK 5 ============================== */
    {
      id: "zh5-mc-hsk5", level: "HSK5", skill: "vocab",
      title: "HSK 5 – Complete 1300 Vocabulary Words & Sentence Examples (Part 1)", titleVi: "Trọn bộ 1.300 từ HSK 5 kèm câu ví dụ — phần 1",
      source: yt(MC, "Nby-Vl7ghm8"), minutes: 30,
      goal: "Học từ HSK 5 qua câu ví dụ; bộ từ bên dưới là động từ trang trọng hay gặp trong báo chí, công việc.",
      tasks: T_COURSE,
      vocab: [
        v("把握", "bǎwò", "nắm bắt; chắc chắn", "你要把握这次机会。", "Nǐ yào bǎwò zhè cì jīhuì.", "Bạn phải nắm lấy cơ hội lần này."),
        v("承担", "chéngdān", "gánh vác, chịu", "他愿意承担这个责任。", "Tā yuànyì chéngdān zhège zérèn.", "Anh ấy sẵn sàng chịu trách nhiệm này."),
        v("持续", "chíxù", "kéo dài, liên tục", "大雨持续了三天。", "Dàyǔ chíxù le sān tiān.", "Mưa lớn kéo dài ba ngày."),
        v("促进", "cùjìn", "thúc đẩy", "旅游可以促进经济发展。", "Lǚyóu kěyǐ cùjìn jīngjì fāzhǎn.", "Du lịch có thể thúc đẩy kinh tế phát triển."),
        v("具备", "jùbèi", "có đủ (điều kiện)", "他具备当老师的条件。", "Tā jùbèi dāng lǎoshī de tiáojiàn.", "Anh ấy có đủ điều kiện làm giáo viên."),
        v("逐渐", "zhújiàn", "dần dần", "天气逐渐暖和起来了。", "Tiānqì zhújiàn nuǎnhuo qǐlái le.", "Thời tiết dần ấm lên."),
        v("面临", "miànlín", "đối mặt", "公司面临很大的压力。", "Gōngsī miànlín hěn dà de yālì.", "Công ty đang đối mặt với áp lực lớn.")
      ],
      questions: [
        { q: "你要___这次机会，别错过了。", options: ["把握", "承担", "面临", "持续"], answer: 0, explain: "把握机会 = nắm bắt cơ hội." }
      ]
    },
    {
      id: "zh5-stereotypes", level: "HSK5", skill: "listening",
      title: "Stereotypes Chinese Have of Other Chinese", titleVi: "Định kiến vùng miền của người Trung Quốc",
      source: yt(MC, "jppHjPIQGis"), minutes: 20,
      goal: "Nghe một cuộc trò chuyện dài về vùng miền, tính cách — luyện nghe ý kiến, so sánh.",
      tasks: T_VIDEO,
      vocab: [
        v("刻板印象", "kèbǎn yìnxiàng", "định kiến khuôn mẫu", "这只是一种刻板印象。", "Zhè zhǐ shì yì zhǒng kèbǎn yìnxiàng.", "Đây chỉ là một định kiến khuôn mẫu."),
        v("地区", "dìqū", "khu vực, vùng", "不同地区的饮食习惯不一样。", "Bùtóng dìqū de yǐnshí xíguàn bù yíyàng.", "Thói quen ăn uống mỗi vùng khác nhau."),
        v("南方人", "nánfāng rén", "người miền Nam", "很多南方人喜欢吃米饭。", "Hěn duō nánfāng rén xǐhuan chī mǐfàn.", "Nhiều người miền Nam thích ăn cơm."),
        v("北方人", "běifāng rén", "người miền Bắc", "北方人常吃面食。", "Běifāng rén cháng chī miànshí.", "Người miền Bắc hay ăn đồ làm từ bột mì."),
        v("性格", "xìnggé", "tính cách", "他的性格很开朗。", "Tā de xìnggé hěn kāilǎng.", "Tính cách anh ấy rất cởi mở."),
        v("偏见", "piānjiàn", "thành kiến", "我们不应该对别人有偏见。", "Wǒmen bù yīnggāi duì biérén yǒu piānjiàn.", "Chúng ta không nên có thành kiến với người khác."),
        v("夸张", "kuāzhāng", "phóng đại", "你说得太夸张了吧！", "Nǐ shuō de tài kuāzhāng le ba!", "Bạn nói quá lên rồi đấy!")
      ]
    },
    {
      id: "zh5-opinions", level: "HSK5", skill: "listening",
      title: "Improve Chinese Listening Skills & Learn to Express Your Ideas", titleVi: "Luyện nghe & học cách trình bày ý kiến",
      source: yt(SS, "A2BtYEpbxgA"), minutes: 15,
      goal: "Trình bày quan điểm có mở – thân – kết: nêu ý, lấy ví dụ, diễn đạt lại, tổng kết.",
      tasks: T_VIDEO,
      vocab: [
        v("观点", "guāndiǎn", "quan điểm", "我同意你的观点。", "Wǒ tóngyì nǐ de guāndiǎn.", "Tôi đồng ý với quan điểm của bạn."),
        v("认为", "rènwéi", "cho rằng", "我认为这个办法不错。", "Wǒ rènwéi zhège bànfǎ búcuò.", "Tôi cho rằng cách này khá hay."),
        v("举个例子", "jǔ ge lìzi", "lấy một ví dụ", "举个例子，你可以每天听十分钟中文。", "Jǔ ge lìzi, nǐ kěyǐ měi tiān tīng shí fēnzhōng Zhōngwén.", "Ví dụ, mỗi ngày bạn có thể nghe tiếng Trung mười phút."),
        v("总的来说", "zǒng de lái shuō", "nói chung, tóm lại", "总的来说，这次旅行很愉快。", "Zǒng de lái shuō, zhè cì lǚxíng hěn yúkuài.", "Nói chung chuyến đi lần này rất vui."),
        v("换句话说", "huàn jù huà shuō", "nói cách khác", "换句话说，我们需要更多时间。", "Huàn jù huà shuō, wǒmen xūyào gèng duō shíjiān.", "Nói cách khác, chúng ta cần thêm thời gian."),
        v("一方面", "yì fāngmiàn", "một mặt", "一方面我想出国，另一方面又舍不得家人。", "Yì fāngmiàn wǒ xiǎng chūguó, lìng yì fāngmiàn yòu shěbude jiārén.", "Một mặt tôi muốn ra nước ngoài, mặt khác lại không nỡ xa gia đình.")
      ],
      questions: [
        { q: "___，这次旅行很愉快。(tổng kết ý)", options: ["总的来说", "举个例子", "换句话说", "一方面"], answer: 0, explain: "总的来说 = nói chung, tóm lại — dùng để kết luận." }
      ]
    },
    {
      id: "zh5-mulan", level: "HSK5", skill: "listening",
      title: "The Original Story of Mulan 花木兰的故事 | Slow Chinese Listening & Reading", titleVi: "Chuyện Hoa Mộc Lan bản gốc — nghe & đọc chậm",
      source: yt(EC, "7eeNO0psNKA"), minutes: 15,
      goal: "Nghe – đọc một câu chuyện cổ quen thuộc bằng tiếng Trung chậm; học từ về lịch sử, chiến tranh.",
      tasks: ["Xem lần 1, đọc theo phụ đề chữ Hán", "Kể lại câu chuyện bằng 5 câu tiếng Trung vào ô Ghi chú", "Làm quiz"],
      vocab: [
        v("故事", "gùshi", "câu chuyện", "奶奶给我讲了一个故事。", "Nǎinai gěi wǒ jiǎng le yí ge gùshi.", "Bà kể cho tôi nghe một câu chuyện."),
        v("替", "tì", "thay cho", "你能替我去开会吗？", "Nǐ néng tì wǒ qù kāihuì ma?", "Bạn đi họp thay tôi được không?"),
        v("从军", "cóngjūn", "tòng quân", "木兰替父从军。", "Mùlán tì fù cóngjūn.", "Mộc Lan thay cha tòng quân."),
        v("打仗", "dǎzhàng", "đánh trận", "古代的士兵常常要打仗。", "Gǔdài de shìbīng chángcháng yào dǎzhàng.", "Binh lính thời xưa thường phải đánh trận."),
        v("勇敢", "yǒnggǎn", "dũng cảm", "花木兰是一个勇敢的女孩。", "Huā Mùlán shì yí ge yǒnggǎn de nǚhái.", "Hoa Mộc Lan là một cô gái dũng cảm."),
        v("皇帝", "huángdì", "hoàng đế", "古代的皇帝住在皇宫里。", "Gǔdài de huángdì zhù zài huánggōng lǐ.", "Hoàng đế thời xưa sống trong hoàng cung."),
        v("家乡", "jiāxiāng", "quê hương", "我很想念我的家乡。", "Wǒ hěn xiǎngniàn wǒ de jiāxiāng.", "Tôi rất nhớ quê hương.")
      ],
      questions: [
        { q: "“替父从军” nghĩa là:", options: ["Thay cha đi tòng quân", "Theo cha đi làm", "Giúp cha làm ruộng", "Cùng cha về quê"], answer: 0, explain: "替 = thay cho; 从军 = tòng quân." }
      ]
    },
    {
      id: "zh5-tv", level: "HSK5", skill: "listening",
      title: "Learn Chinese With Chinese TV Series and Movies", titleVi: "Học tiếng Trung qua phim truyền hình & điện ảnh",
      source: yt(SS, "KCLzoIPJiek"), minutes: 12,
      goal: "Biết cách chọn phim để học và từ vựng để nói về phim ảnh.",
      tasks: ["Xem video, ghi tên phim được giới thiệu", "Chọn 1 phim, xem 10 phút có phụ đề tiếng Trung", "Chép 3 câu thoại hay vào ô Ghi chú"],
      vocab: [
        v("电视剧", "diànshìjù", "phim truyền hình", "最近你在看什么电视剧？", "Zuìjìn nǐ zài kàn shénme diànshìjù?", "Dạo này bạn đang xem phim truyền hình gì?"),
        v("台词", "táicí", "lời thoại", "这句台词特别有名。", "Zhè jù táicí tèbié yǒumíng.", "Câu thoại này cực kỳ nổi tiếng."),
        v("剧情", "jùqíng", "cốt truyện", "这部电影的剧情很精彩。", "Zhè bù diànyǐng de jùqíng hěn jīngcǎi.", "Cốt truyện bộ phim này rất hay."),
        v("演员", "yǎnyuán", "diễn viên", "她是我最喜欢的演员。", "Tā shì wǒ zuì xǐhuan de yǎnyuán.", "Cô ấy là diễn viên tôi thích nhất."),
        v("字幕", "zìmù", "phụ đề", "看电影的时候我开中文字幕。", "Kàn diànyǐng de shíhou wǒ kāi Zhōngwén zìmù.", "Khi xem phim tôi bật phụ đề tiếng Trung."),
        v("推荐", "tuījiàn", "giới thiệu, gợi ý", "你能给我推荐几部好看的电影吗？", "Nǐ néng gěi wǒ tuījiàn jǐ bù hǎokàn de diànyǐng ma?", "Bạn gợi ý cho tôi vài phim hay được không?")
      ]
    },
    {
      id: "zh5-passport", level: "HSK5", skill: "listening",
      title: "The Rise of the Chinese “Passport Bros”? Chinese Guy Seeks a Wife in Vietnam!", titleVi: "Chàng trai Trung Quốc sang Việt Nam tìm vợ — phỏng vấn",
      source: yt(MC, "8EXHCbzYHq0"), minutes: 20,
      goal: "Nghe phỏng vấn sâu về hôn nhân, áp lực gia đình — chủ đề gần gũi với người Việt.",
      tasks: T_VIDEO,
      vocab: [
        v("相亲", "xiāngqīn", "xem mắt", "妈妈又让我去相亲了。", "Māma yòu ràng wǒ qù xiāngqīn le.", "Mẹ lại bắt tôi đi xem mắt."),
        v("彩礼", "cǎilǐ", "sính lễ", "有些地方的彩礼很高。", "Yǒuxiē dìfang de cǎilǐ hěn gāo.", "Có những nơi tiền sính lễ rất cao."),
        v("婚姻", "hūnyīn", "hôn nhân", "幸福的婚姻需要互相理解。", "Xìngfú de hūnyīn xūyào hùxiāng lǐjiě.", "Hôn nhân hạnh phúc cần thấu hiểu lẫn nhau."),
        v("跨国", "kuàguó", "xuyên quốc gia", "跨国婚姻越来越常见。", "Kuàguó hūnyīn yuè lái yuè chángjiàn.", "Hôn nhân quốc tế ngày càng phổ biến."),
        v("压力", "yālì", "áp lực", "他的工作压力很大。", "Tā de gōngzuò yālì hěn dà.", "Áp lực công việc của anh ấy rất lớn."),
        v("门槛", "ménkǎn", "ngưỡng, rào cản", "这份工作的门槛很高。", "Zhè fèn gōngzuò de ménkǎn hěn gāo.", "Công việc này có yêu cầu đầu vào rất cao.")
      ]
    },

    /* ============================== HSK 6 ============================== */
    {
      id: "zh6-annoying", level: "HSK6", skill: "listening",
      title: "What Behaviors Do Chinese Find Really Annoying? – Chinese Street Interview", titleVi: "Hành vi nào khiến người Trung Quốc khó chịu? — phỏng vấn đường phố",
      source: yt(MC, "lhYViU0hG_U"), minutes: 20,
      goal: "Nghe nhiều người nói tốc độ tự nhiên, giọng khác nhau; học cách bày tỏ sự khó chịu.",
      tasks: T_VIDEO,
      vocab: [
        v("讨厌", "tǎoyàn", "ghét", "我最讨厌别人迟到。", "Wǒ zuì tǎoyàn biérén chídào.", "Tôi ghét nhất người khác đến muộn."),
        v("素质", "sùzhì", "ý thức, phẩm chất", "在公共场合大声说话很没素质。", "Zài gōnggòng chǎnghé dàshēng shuōhuà hěn méi sùzhì.", "Nói to ở nơi công cộng rất thiếu ý thức."),
        v("插队", "chāduì", "chen hàng", "请排队，不要插队！", "Qǐng páiduì, búyào chāduì!", "Xin xếp hàng, đừng chen ngang!"),
        v("公共场合", "gōnggòng chǎnghé", "nơi công cộng", "公共场合不要抽烟。", "Gōnggòng chǎnghé búyào chōuyān.", "Đừng hút thuốc ở nơi công cộng."),
        v("反感", "fǎngǎn", "phản cảm", "这种行为让人很反感。", "Zhè zhǒng xíngwéi ràng rén hěn fǎngǎn.", "Hành vi này khiến người ta rất phản cảm."),
        v("随地", "suídì", "bừa bãi, bất cứ chỗ nào", "不要随地扔垃圾。", "Búyào suídì rēng lājī.", "Đừng vứt rác bừa bãi."),
        v("街头采访", "jiētóu cǎifǎng", "phỏng vấn đường phố", "我们来做一个街头采访。", "Wǒmen lái zuò yí ge jiētóu cǎifǎng.", "Chúng ta làm một cuộc phỏng vấn đường phố nhé.")
      ]
    },
    {
      id: "zh6-mc-hsk6", level: "HSK6", skill: "vocab",
      title: "HSK 6 – Advanced Chinese Vocabulary Course (Video #12)", titleVi: "Khoá từ vựng HSK 6 của Mandarin Corner",
      source: yt(MC, "BdKKwEOfsRg"), minutes: 30,
      goal: "Một video trong khoá 25 video từ vựng HSK 6; bộ từ bên dưới là từ HSK 6 tiêu biểu (tự soạn) để ôn kèm.",
      tasks: T_COURSE,
      vocab: [
        v("尴尬", "gāngà", "lúng túng, ngượng", "忘了他的名字，真尴尬。", "Wàng le tā de míngzi, zhēn gāngà.", "Quên mất tên anh ấy, ngượng thật."),
        v("斟酌", "zhēnzhuó", "cân nhắc kỹ", "这件事你再斟酌一下。", "Zhè jiàn shì nǐ zài zhēnzhuó yíxià.", "Việc này bạn cân nhắc thêm đi."),
        v("弥补", "míbǔ", "bù đắp", "我想弥补自己的错误。", "Wǒ xiǎng míbǔ zìjǐ de cuòwù.", "Tôi muốn bù đắp lỗi lầm của mình."),
        v("憧憬", "chōngjǐng", "khao khát, mơ ước", "年轻人对未来充满憧憬。", "Niánqīngrén duì wèilái chōngmǎn chōngjǐng.", "Người trẻ tràn đầy mơ ước về tương lai."),
        v("迄今为止", "qìjīn wéizhǐ", "cho đến nay", "迄今为止，这是我看过最好的电影。", "Qìjīn wéizhǐ, zhè shì wǒ kàn guo zuì hǎo de diànyǐng.", "Cho đến nay, đây là bộ phim hay nhất tôi từng xem."),
        v("层出不穷", "céng chū bù qióng", "xuất hiện liên tiếp", "新的手机应用层出不穷。", "Xīn de shǒujī yìngyòng céng chū bù qióng.", "Ứng dụng điện thoại mới xuất hiện liên tục."),
        v("潜移默化", "qián yí mò huà", "ảnh hưởng ngấm dần", "父母的习惯会潜移默化地影响孩子。", "Fùmǔ de xíguàn huì qián yí mò huà de yǐngxiǎng háizi.", "Thói quen của cha mẹ ảnh hưởng ngấm dần đến con cái.")
      ]
    },
    {
      id: "zh6-18clips", level: "HSK6", skill: "listening",
      title: "If You Can Understand These 18 Audio Clips, Your Chinese is AMAZING!", titleVi: "Thử thách nghe 18 đoạn audio khó",
      source: yt(SS, "77sc_lUM0AE"), minutes: 15,
      goal: "Tự kiểm tra khả năng nghe khẩu ngữ thật; bộ từ bên dưới là tiếng lóng mạng phổ biến (tự soạn).",
      tasks: ["Nghe từng đoạn, đoán nghĩa trước khi xem đáp án", "Đếm số đoạn bạn hiểu, ghi vào ô Ghi chú để so sánh lần sau", "Học bộ từ lóng bên dưới"],
      vocab: [
        v("靠谱", "kàopǔ", "đáng tin cậy", "这个人做事很靠谱。", "Zhège rén zuòshì hěn kàopǔ.", "Người này làm việc rất đáng tin."),
        v("离谱", "lípǔ", "vô lý, quá đáng", "这价格也太离谱了！", "Zhè jiàgé yě tài lípǔ le!", "Giá này vô lý quá!"),
        v("无语", "wúyǔ", "cạn lời", "他又迟到了，我真无语。", "Tā yòu chídào le, wǒ zhēn wúyǔ.", "Anh ta lại đến muộn, tôi cạn lời thật."),
        v("内卷", "nèijuǎn", "cạnh tranh khốc liệt vô nghĩa", "现在大城市工作太内卷了。", "Xiànzài dà chéngshì gōngzuò tài nèijuǎn le.", "Đi làm ở thành phố lớn bây giờ cạnh tranh quá khốc liệt."),
        v("躺平", "tǎngpíng", "buông xuôi (“nằm thẳng”)", "他工作太累，决定躺平。", "Tā gōngzuò tài lèi, juédìng tǎngpíng.", "Anh ấy làm việc quá mệt nên quyết định buông xuôi."),
        v("绝了", "jué le", "đỉnh thật, tuyệt cú mèo", "这家店的烤鸭绝了！", "Zhè jiā diàn de kǎoyā jué le!", "Vịt quay quán này đỉnh thật!")
      ]
    },
    {
      id: "zh6-4words", level: "HSK6", skill: "vocab",
      title: "If You Know These 4 Words, Your Chinese is AMAZING.", titleVi: "Biết 4 từ này thì tiếng Trung của bạn rất giỏi",
      source: yt(SS, "Q4EUHVCIpE4"), minutes: 12,
      goal: "Xem 4 từ “khó” trong video; bộ từ bên dưới là thành ngữ bốn chữ thông dụng (tự soạn) để ôn kèm.",
      tasks: ["Xem video, ghi 4 từ vào ô Ghi chú kèm pinyin", "Học 6 thành ngữ bên dưới, mỗi thành ngữ tự đặt 1 câu", "Làm quiz"],
      vocab: [
        v("一举两得", "yì jǔ liǎng dé", "một công đôi việc", "骑车上班又省钱又锻炼，一举两得。", "Qí chē shàngbān yòu shěng qián yòu duànliàn, yì jǔ liǎng dé.", "Đạp xe đi làm vừa tiết kiệm vừa rèn luyện, một công đôi việc."),
        v("半途而废", "bàn tú ér fèi", "bỏ dở giữa chừng", "学语言不能半途而废。", "Xué yǔyán bù néng bàn tú ér fèi.", "Học ngoại ngữ không được bỏ dở giữa chừng."),
        v("入乡随俗", "rù xiāng suí sú", "nhập gia tuỳ tục", "到了中国就要入乡随俗。", "Dào le Zhōngguó jiù yào rù xiāng suí sú.", "Đến Trung Quốc thì phải nhập gia tuỳ tục."),
        v("画蛇添足", "huà shé tiān zú", "vẽ rắn thêm chân (thừa thãi)", "这句话已经很好了，再加就是画蛇添足。", "Zhè jù huà yǐjīng hěn hǎo le, zài jiā jiù shì huà shé tiān zú.", "Câu này đã hay rồi, thêm nữa là vẽ rắn thêm chân."),
        v("马马虎虎", "mǎmǎhūhū", "qua loa; tàm tạm", "他做事总是马马虎虎的。", "Tā zuòshì zǒngshì mǎmǎhūhū de.", "Anh ta làm việc lúc nào cũng qua loa."),
        v("津津有味", "jīnjīn yǒu wèi", "say sưa, ngon lành", "孩子们听故事听得津津有味。", "Háizimen tīng gùshi tīng de jīnjīn yǒu wèi.", "Bọn trẻ nghe kể chuyện say sưa.")
      ],
      questions: [
        { q: "骑车上班又省钱又锻炼，真是___。", options: ["一举两得", "半途而废", "画蛇添足", "马马虎虎"], answer: 0, explain: "一举两得 = một việc làm được hai lợi ích." }
      ]
    }
  ];

  /* Nguồn tham khảo thêm — hiện cuối trang Lộ trình */
  window.RESOURCES = [
    { name: "Everyday Chinese (YouTube)", url: "https://www.youtube.com/@EverydayChinese", note: "Khoá HSK 1–4, giao tiếp theo tình huống, ngữ pháp ngắn gọn." },
    { name: "Mandarin Corner — video theo trình độ", url: "https://mandarincorner.org/videos-by-student-level-and-subjects/", note: "Hội thoại, phỏng vấn, walk-around có phụ đề chữ Hán + pinyin + tiếng Anh." },
    { name: "Mandarin Corner — từ vựng HSK 1→6 kèm câu ví dụ", url: "https://mandarincorner.org/hsk-vocabulary-videos-with-sentence-examples/", note: "Mỗi cấp một khoá video, có timestamps." },
    { name: "ShuoshuoChinese 说说中文 (YouTube)", url: "https://www.youtube.com/@ShuoshuoChinese", note: "Ngữ pháp, khẩu ngữ, thử thách nghe cho trung – cao cấp." },
    { name: "CCTV Learn Chinese", url: "https://cctv.cntv.cn/lm/learningchinese/01/", note: "Growing Up with Chinese, Travel in Chinese, Survival Chinese… miễn phí." },
    { name: "Hua Zhong Wen 画中文", url: "https://huazhongwen.com/words", note: "Nhớ từ bằng tranh vẽ vui, có pinyin." }
  ];

  /* Bài test xếp trình độ: 4 câu mỗi cấp HSK 1 → HSK 5. Đạt ≥ 60% (3/4) mới xét tiếp cấp sau.
     Đạt cả HSK 5 và tổng ≥ 18/20 → HSK 6. */
  window.PLACEMENT_TEST = [
    // HSK 1
    { level: "HSK1", q: "我___越南人。", py: "Wǒ ___ Yuènán rén.", options: ["是", "有", "在", "叫"], answer: 0 },
    { level: "HSK1", q: "你叫什么___？", py: "Nǐ jiào shénme ___?", options: ["名字", "朋友", "学生", "东西"], answer: 0 },
    { level: "HSK1", q: "这个苹果多少___？", py: "Zhège píngguǒ duōshao ___?", options: ["钱", "个", "人", "年"], answer: 0 },
    { level: "HSK1", q: "我们明天坐飞机___北京。", py: "Wǒmen míngtiān zuò fēijī ___ Běijīng.", options: ["去", "是", "叫", "有"], answer: 0 },
    // HSK 2
    { level: "HSK2", q: "因为下雨，___我们没去公园。", options: ["所以", "但是", "虽然", "如果"], answer: 0 },
    { level: "HSK2", q: "他跑得比我___。", options: ["快", "很快", "太快", "非常快"], answer: 0 },
    { level: "HSK2", q: "我从来没吃___北京烤鸭。", options: ["过", "了", "着", "的"], answer: 0 },
    { level: "HSK2", q: "我正在___饭呢，一会儿给你打电话。", options: ["做", "做了", "做过", "做完了"], answer: 0 },
    // HSK 3
    { level: "HSK3", q: "我把作业___完了。", options: ["做", "做了", "做着", "在做"], answer: 0 },
    { level: "HSK3", q: "天气越来越___了。", options: ["冷", "很冷", "太冷", "非常冷"], answer: 0 },
    { level: "HSK3", q: "这个问题太难了，我回答不___。", options: ["出来", "起来", "下去", "过来"], answer: 0 },
    { level: "HSK3", q: "他一边听音乐，___做作业。", options: ["一边", "一起", "一直", "一定"], answer: 0 },
    // HSK 4
    { level: "HSK4", q: "___明天下雨，我们也要去。", options: ["即使", "因为", "只要", "所以"], answer: 0 },
    { level: "HSK4", q: "我___没见过这么漂亮的地方。", options: ["从来", "一直", "刚才", "已经"], answer: 0 },
    { level: "HSK4", q: "这件事___你来决定吧。", options: ["由", "被", "把", "对"], answer: 0 },
    { level: "HSK4", q: "他不仅会说汉语，___会说日语。", options: ["而且", "但是", "所以", "或者"], answer: 0 },
    // HSK 5
    { level: "HSK5", q: "你要___这次机会。", options: ["把握", "承担", "面临", "具备"], answer: 0 },
    { level: "HSK5", q: "经过大家的努力，问题___解决了。", options: ["终于", "毕竟", "何况", "简直"], answer: 0 },
    { level: "HSK5", q: "一杯咖啡卖一百块？这___是抢钱！", options: ["简直", "终于", "毕竟", "逐渐"], answer: 0 },
    { level: "HSK5", q: "别生他的气了，___他还是个孩子。", options: ["毕竟", "简直", "居然", "逐渐"], answer: 0 }
  ];
})();
