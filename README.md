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

**Tài khoản (Cloudflare)**
- 🔐 Đăng nhập Google / email, tự đồng bộ tiến trình giữa các thiết bị — xem mục *Tài khoản & đồng bộ* bên dưới.

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

> **Nếu tab Actions có cảnh báo vàng "Không đọc được feed" (RSS YouTube trả 404):** RSS của YouTube đôi khi chặn máy chủ GitHub. Script đã tự thử lại và thử thêm feed playlist. Để có nguồn dự phòng ổn định, tạo **YouTube Data API key** miễn phí rồi lưu thành secret `YOUTUBE_API_KEY`:
> 1. Vào [Google Cloud Console](https://console.cloud.google.com), tạo một project.
> 2. Vào *APIs & Services → Library*, bật **YouTube Data API v3**.
> 3. Vào *Credentials → Create credentials → API key*.
>
> Mỗi lần chạy chỉ tốn khoảng 6 đơn vị quota, trong khi hạn mức miễn phí là 10.000 đơn vị/ngày.

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

## 🔐 Tài khoản & đồng bộ tiến trình (Cloudflare Pages + D1)

Phần này dành cho khi bạn chạy trang trên **Cloudflare Pages** với tên miền riêng. Trên GitHub Pages, nút Đăng nhập tự ẩn và trang vẫn lưu tiến trình trên trình duyệt như cũ.

**Cách hoạt động**
- **Đăng nhập** bằng **Google** hoặc **email + mật khẩu**:
  - Mật khẩu được băm PBKDF2-SHA256 với 100.000 vòng.
  - Phiên đăng nhập là cookie `__Host-` (HttpOnly, Secure, SameSite=Lax), tồn tại 30 ngày và tự gia hạn khi bạn dùng thường xuyên.
- **Người chưa đăng nhập vẫn học được bình thường.** Khi đăng nhập, tiến trình trên máy được **gộp** vào tài khoản: bài đã học, XP, huy hiệu, flashcard, ghi chú, chuỗi ngày.
- **Tự lưu sau 2–3 giây mỗi khi có thay đổi.**
  - Học trên 2 thiết bị cùng lúc thì máy chủ phát hiện xung đột phiên bản, trình duyệt tự gộp rồi lưu lại, không mất dữ liệu bên nào.
  - Đăng xuất sẽ xoá dữ liệu trên trình duyệt đó, nên an toàn với máy dùng chung.
- **Bảo mật:**
  - Chặn CSRF bằng kiểm tra Origin.
  - Giới hạn số lần thử đăng nhập/đăng ký/quên mật khẩu.
  - Không tiết lộ email có tồn tại hay không.
  - Chống chiếm tài khoản khi liên kết Google với email chưa xác nhận.
- **Người dùng tự quản lý:** đổi/đặt mật khẩu, đăng xuất mọi thiết bị, xoá tài khoản.

**Các file liên quan:** `functions/api/**` (API), `server/lib.js` (thư viện chung), `migrations/0001_init.sql` (bảng dữ liệu), `js/sync.js` (giao diện + đồng bộ), `_headers` (header bảo mật), `scripts/build-site.sh` (build).

### Bước C1 — Tạo database D1
1. Vào [dash.cloudflare.com](https://dash.cloudflare.com) → **Storage & Databases → D1 SQL Database → Create**.
2. Đặt tên `english-path` → **Create**.
3. Mở database vừa tạo → tab **Console**. Dán toàn bộ nội dung file `migrations/0001_init.sql` → **Execute**.

### Bước C2 — Tạo Pages project nối với GitHub
1. Vào **Workers & Pages → Create**, chọn tab **Pages** → **Connect to Git**, rồi chọn repo của bạn (vd `selfstudy`).
2. Mục **Build settings**:
   - Framework preset: **None**
   - Build command: `sh scripts/build-site.sh`
   - Build output directory: `dist`
3. Bấm **Save and Deploy**. Từ giờ mỗi commit vào `main` sẽ tự deploy, kể cả commit do workflow Daily lessons tạo.

### Bước C3 — Gắn database vào trang
Vào Pages project → **Settings → Bindings → Add → D1 database**:
- Variable name: **`DB`** (viết hoa đúng như vậy)
- Database: `english-path`

Lưu lại, rồi vào tab **Deployments** → bấm **⋯** ở bản mới nhất → **Retry deployment**. Mỗi lần đổi binding hoặc biến môi trường đều cần deploy lại.

### Bước C4 — Tên miền riêng
Vào Pages project → **Custom domains → Set up a custom domain**, nhập ví dụ `hoc.tenmien.com`. Vì tên miền đã ở Cloudflare nên DNS được tạo tự động. Chứng chỉ HTTPS mất vài phút.

> Lúc này **đăng nhập bằng email** đã chạy được. Mở trang → **Đăng nhập → Tạo tài khoản** để thử.

### Bước C5 — Đăng nhập bằng Google
1. Vào [console.cloud.google.com](https://console.cloud.google.com), chọn project đã tạo cho YouTube API → **APIs & Services → OAuth consent screen** (giao diện mới tên là *Google Auth Platform*):
   - Bấm **Get started**, đặt tên ứng dụng `English Path`, chọn email hỗ trợ, Audience chọn **External**, rồi **Create**.
   - Ở mục **Branding → Authorized domains**, thêm tên miền gốc, ví dụ `tenmien.com`.
   - Ở mục **Audience**, bấm **Publish app** để ai cũng đăng nhập được. Ứng dụng chỉ xin quyền email, tên và ảnh đại diện nên không cần Google duyệt.
2. Vào **Clients** (hoặc **Credentials**) → **Create client** → **Web application**:
   - **Authorized redirect URIs** thêm cả hai địa chỉ:
     - `https://hoc.tenmien.com/api/auth/google/callback`
     - `https://<tên-project>.pages.dev/api/auth/google/callback`
   - Bấm **Create**, rồi copy **Client ID** và **Client secret**.
3. Vào Pages project → **Settings → Variables and Secrets → Add**:
   - `GOOGLE_CLIENT_ID`, kiểu Text
   - `GOOGLE_CLIENT_SECRET`, kiểu **Secret**

   Lưu rồi **Retry deployment**.

### Bước C6 (tuỳ chọn) — Email xác nhận & Quên mật khẩu
Phần này cần dịch vụ gửi email. Hướng dẫn dưới dùng [Resend](https://resend.com), gói miễn phí đủ dùng.
1. Đăng ký Resend → **Domains → Add domain**, nhập `tenmien.com`. Thêm các bản ghi DNS mà Resend hiển thị vào Cloudflare DNS → bấm **Verify**.
2. Vào **API Keys → Create API key**.
3. Thêm vào Pages project (Settings → Variables and Secrets):
   - `RESEND_API_KEY`, kiểu Secret
   - `MAIL_FROM`, kiểu Text, ví dụ `English Path <no-reply@tenmien.com>`

   Rồi **Retry deployment**.

Khi chưa cấu hình phần này, link "Quên mật khẩu?" tự ẩn. Người dùng đăng nhập bằng Google thì không cần mật khẩu.

### Sau khi chuyển sang Cloudflare
- Đổi variable `SITE_URL` trên GitHub (dùng cho bot Telegram) thành `https://hoc.tenmien.com/`.
- Có thể giữ hoặc tắt GitHub Pages. Bản trên GitHub Pages vẫn chạy được, chỉ không có đăng nhập.
- Xem số người dùng: vào D1 → Console, chạy `SELECT COUNT(*) FROM users;`.

### Chạy thử trên máy
```bash
npm i -D wrangler
cp wrangler.toml.example wrangler.toml          # điền database_id nếu muốn dùng D1 thật
npx wrangler d1 execute english-path --local --file migrations/0001_init.sql
sh scripts/build-site.sh && npx wrangler pages dev dist     # mở http://localhost:8788
```
Muốn thử đăng nhập Google trên máy thì tạo file `.dev.vars` chứa `GOOGLE_CLIENT_ID=...` và `GOOGLE_CLIENT_SECRET=...`, đồng thời thêm redirect URI `http://localhost:8788/api/auth/google/callback` trên Google.

---

## 🇨🇳 Trang tiếng Trung (`/zh/`) & đổi ngôn ngữ học

Cùng một repo, cùng một lần deploy: tiếng Anh ở `/`, tiếng Trung ở `/zh/` (vd `https://selfstudy.anhducafc.com/zh/`). Trang chủ và Cài đặt có nút **Đang học: 🇬🇧 Tiếng Anh | 🇨🇳 Tiếng Trung**.

- **Lộ trình HSK 1 → 6**, 35 bài soạn sẵn (224 từ có chữ Hán, pinyin, câu ví dụ, nghĩa câu), test xếp lớp 20 câu.
- Nguồn: Everyday Chinese, Mandarin Corner, ShuoshuoChinese 说说中文 (video nhúng), CCTV Learn Chinese và Hua Zhong Wen (mở tab mới).
- Quiz/flashcard/mini game giống tiếng Anh; chép chính tả gõ **chữ Hán hoặc pinyin**; câu điền từ chấp nhận cả pinyin không dấu.
- **Một tài khoản, tiến trình riêng từng ngôn ngữ** (XP, chuỗi ngày, flashcard tách biệt). Server tự tạo bảng `progress_lang` lần đầu — không cần chạy thêm SQL (file `migrations/0002_progress_lang.sql` chỉ để tham khảo).
- **Bài tự động**: workflow *Daily lessons* chạy thêm bước 🇨🇳 với `scripts/feeds-zh.json` (3 kênh + 5 playlist khoá HSK của Mandarin Corner) → `zh/data/auto-lessons.json`; Claude soạn thêm pinyin + nghĩa câu ví dụ.
- **Telegram**: tin buổi sáng có thêm Bài của ngày tiếng Trung. Variable `TELEGRAM_ZH_LEVELS` (mặc định `HSK1,HSK2`; `none` = tắt).

**Triển khai:** chỉ cần upload các file mới/đã sửa lên repo (nhớ thư mục `zh/`, `js/lang-base.js`, `scripts/feeds-zh.json`). Cloudflare tự build — không phải đổi cài đặt nào. Đăng nhập Google từ `/zh/` dùng lại redirect URI cũ và tự quay về trang tiếng Trung.

**Thêm ngôn ngữ khác (vd tiếng Nhật `ja`):** copy thư mục `zh/` thành `ja/` → sửa `ja/js/lang.js` (storeKey, tts `ja-JP`, cjk…) và `ja/js/data.js`; thêm 1 dòng vào `LANGS` + `allStoreKeys` trong `js/lang-base.js`; thêm `"ja"` vào `LANG_IDS` trong `server/lib.js`; thêm `ja` vào `scripts/build-site.sh`, `_headers`, `COURSES` trong `scripts/fetch-feeds.mjs`.

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
