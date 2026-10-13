# English Path 🇬🇧

Trang web **tự học tiếng Anh theo trình độ CEFR (A1 → C1)**: theo dõi tiến độ, game hoá để học thành thói quen, **tự động có bài mới mỗi ngày** từ YouTube, **Claude soạn từ vựng + quiz** (bạn duyệt qua Pull Request) và **bot Telegram nhắc học**.

Trang là web tĩnh (HTML/CSS/JS thuần, không cần build). Phần tự động chạy bằng **GitHub Actions** miễn phí.

---

## Tính năng

**Học**
- 🎯 **Bài test xếp lớp** 20 câu → A1…C1.
- 🗺️ **Lộ trình** 28 bài soạn sẵn, cộng mục **📺 Video mới** tự cập nhật.
- ▶️ **Video YouTube** nhúng, đếm giờ xem, tự hoàn thành khi xem hết, chỉnh tốc độ, bật/tắt phụ đề CC.
- 🎧 **British Council / BBC** mở tab mới. Khi quay lại, trang hỏi để ghi số phút đã học.
- 📚 **Từ vựng** có phát âm Anh-Anh và quiz tự sinh. Mỗi bài có ô ghi chú.

**Game hoá (Phần 1)**
- ⭐ **Bài của ngày ×2 XP**: cùng ngày + cùng trình độ → cùng một bài cho mọi người, nên dễ rủ bạn học chung.
- 🏆 **XP & cấp người chơi**:
  - hoàn thành bài +50
  - mỗi câu quiz đúng +5
  - mỗi phút học +1
  - mỗi thẻ flashcard đã ôn +2
  - đạt mục tiêu phút/ngày +20
- 🏅 **26 huy hiệu**: chuỗi 3/7/30/100 ngày, quiz 100%, Chim sớm, Cú đêm, Phá đảo…
- 🧊 **Streak freeze**: mỗi mốc 7 ngày liên tiếp được tặng 1 freeze (tối đa 2). Lỡ 1 ngày thì freeze tự cứu chuỗi.
- 🃏 **Flashcard ôn ngắt quãng (Leitner 5 hộp)**: từ vựng tự vào thẻ khi bạn hoàn thành bài. Có chiều Anh→Việt và Việt→Anh, phím tắt `Space` / `1` `2` `3`.
- 🎮 **3 mini game**: Ghép từ (tính giờ), Đoán nhanh 60s, Chép chính tả (giọng đọc của trình duyệt). XP từ game có trần 60 XP/ngày.

**Tự động (Phần 2–4)**
- 📺 **RSS → bài mới**: mỗi sáng lấy video mới của BBC Learning English, British Council, TED-Ed rồi gắn trình độ theo luật trong `scripts/feeds.json`.
- ✨ **Claude soạn bài**: từ vựng có nghĩa tiếng Việt, câu ví dụ, quiz. Kết quả được kiểm tra tự động rồi mở **Pull Request** để bạn duyệt trên điện thoại.
- 📨 **Bot Telegram**:
  - 06:47 gửi Bài của ngày + Từ của ngày
  - 20:52 nhắc giữ chuỗi

---

## Cài đặt từng bước

### Bước 0 — Đưa code lên GitHub

```bash
git init && git add . && git commit -m "English Path"
git branch -M main
git remote add origin https://github.com/<username>/english-path.git
git push -u origin main
```

### Bước 1 — Bật GitHub Pages (để có trang web)

**Settings → Pages → Build and deployment → Source: `GitHub Actions`.**

Workflow `Deploy Pages` sẽ chạy mỗi lần có commit vào `main`. Trang chạy tại `https://<username>.github.io/english-path/`.

> Lúc này Phần 1 (game hoá, flashcard, mini game) đã chạy được. Tiến độ lưu trong trình duyệt của từng người.

### Bước 2 — Tự thêm bài từ RSS (không cần key)

1. **Settings → Actions → General → Workflow permissions**: chọn **Read and write permissions**.
2. Ở cùng trang này, tích **Allow GitHub Actions to create and approve pull requests** (cần cho Bước 3).
3. Chạy thử: **Actions → Daily lessons → Run workflow**.

Khi chưa có API key, workflow **commit thẳng** bài mới vào `main` và deploy luôn. Sau đó workflow tự chạy lúc 05:17 sáng mỗi ngày.

Muốn thêm kênh hoặc đổi trình độ: sửa `scripts/feeds.json`.
- Mỗi kênh có `rules` gồm regex khớp tiêu đề, kèm `level` / `skill` / `minutes`.
- Video không khớp rule nào sẽ dùng `default`. Nếu `default: null` thì video bị bỏ qua.

### Bước 3 — Claude soạn từ vựng + quiz qua Pull Request

1. Tạo API key tại [Claude Console](https://console.anthropic.com).
2. **Settings → Secrets and variables → Actions → New repository secret**: tạo `ANTHROPIC_API_KEY`.
3. Tuỳ chọn, ở tab **Variables**:
   - `CLAUDE_MODEL`: mặc định `claude-sonnet-5-5`. Muốn rẻ hơn thì dùng `claude-haiku-5-5`.
   - `MAX_ENRICH`: số bài soạn mỗi ngày, mặc định 6.
   - `LESSON_MODE`: `pr` (mặc định khi có key) hoặc `direct` (bỏ qua bước duyệt).

Mỗi sáng bạn sẽ nhận một PR **"🤖 Bài học mới hôm nay"**. Nội dung PR có bảng từ vựng và đáp án của từng bài. Lướt qua rồi bấm **Merge**, trang sẽ tự deploy. Muốn sửa thì mở tab *Files changed* và sửa `data/auto-lessons.json`.

> Claude soạn dựa trên **tiêu đề + mô tả** video, không xem được video. Vì vậy bước duyệt PR là cần thiết. Script tự loại từ có câu ví dụ không chứa đúng từ đó, và loại câu hỏi có đáp án lỗi. Bài nào soạn hỏng sẽ có `"status": "failed"`; đổi lại thành `"new"` để lần sau soạn lại.
>
> Chi phí ước tính: khoảng 1–2 nghìn token cho mỗi bài, tức chỉ vài cent mỗi tháng với 6 bài/ngày.

### Bước 4 — Bot Telegram nhắc học

1. Mở Telegram, chat với **@BotFather**, gõ `/newbot`, đặt tên và **copy token**.
2. Gửi một tin bất kỳ cho bot của bạn (hoặc thêm bot vào nhóm học chung). Sau đó mở `https://api.telegram.org/bot<TOKEN>/getUpdates` và lấy `chat.id`. Id của nhóm là số âm.
3. Tạo 2 secret:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`: nhiều id thì cách nhau bằng dấu phẩy.
4. Tuỳ chọn, tạo variable:
   - `TELEGRAM_LEVELS`: mặc định `A2,B1,B2`.
   - `SITE_URL`: mặc định `https://<owner>.github.io/<repo>/`.
5. Gửi thử: **Actions → Telegram reminder → Run workflow**.

Bot dùng **chung thuật toán Bài của ngày** với trang web (`js/daily.js`), nên link trong tin nhắn trùng đúng bài người học thấy trên trang chủ.

---

## Chạy & thử trên máy

```bash
python3 -m http.server 8000                                      # mở http://localhost:8000 (YouTube không chạy với file://)
node scripts/fetch-feeds.mjs                                     # lấy RSS thật (cần mạng)
DRY_RUN=1 SITE_URL=http://localhost:8000/ node scripts/telegram-daily.mjs morning   # xem trước tin nhắn
ANTHROPIC_API_KEY=sk-... MAX_ENRICH=1 node scripts/enrich-lessons.mjs                # soạn thử 1 bài
```

## Cấu trúc

```
index.html                    khung trang + menu
css/style.css                 giao diện (dark mode, mobile)
js/data.js                    ⭐ bài soạn sẵn, bài test, thư viện nguồn
js/daily.js                   thuật toán Bài của ngày / Từ của ngày (dùng chung web + bot)
js/store.js                   localStorage: tiến độ, XP, flashcard, streak freeze
js/game.js                    huy hiệu, pháo giấy, popup
js/app.js                     router, trang chủ, lộ trình, bài học, dashboard
js/review.js                  flashcard + 3 mini game
data/auto-lessons.json        bài tự động (do workflow ghi)
scripts/feeds.json            danh sách kênh + luật gắn trình độ
scripts/fetch-feeds.mjs       Phần 2: RSS → bài mới
scripts/enrich-lessons.mjs    Phần 3: Claude soạn từ vựng + quiz
scripts/telegram-daily.mjs    Phần 4: tin nhắn Telegram
.github/workflows/pages.yml           deploy GitHub Pages
.github/workflows/daily-lessons.yml   05:17 hằng ngày: RSS → Claude → PR / commit
.github/workflows/telegram.yml        06:47 & 20:52 hằng ngày
```

## Lưu ý

- **Workflow theo lịch bị GitHub tạm dừng sau 60 ngày repo không có hoạt động.**
  - Ở chế độ `direct`, commit hằng ngày giữ repo luôn hoạt động.
  - Ở chế độ `pr`, nhớ Merge PR thường xuyên, hoặc vào tab Actions bật lại workflow.
- **Nếu chưa Merge PR hôm trước**, lần chạy hôm sau sẽ thay nội dung PR bằng bộ bài mới. Video cũ vẫn còn trong RSS nên vẫn được lấy lại.
- **Tiến độ, XP, huy hiệu và flashcard lưu trong `localStorage`**, mỗi người, mỗi trình duyệt có dữ liệu riêng. Vào **Cài đặt → Xuất file .json** để sao lưu.
- **Bản quyền nội dung**: bài nghe thuộc về British Council, BBC và các chủ kênh YouTube. Trang chỉ liên kết hoặc nhúng theo cách các nền tảng cho phép. Script kiểm tra oEmbed để bỏ qua video bị tắt chế độ nhúng.

## License

MIT
