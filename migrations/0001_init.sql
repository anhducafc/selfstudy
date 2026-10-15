-- English Path — cơ sở dữ liệu D1 (SQLite). Chạy 1 lần khi tạo database.
CREATE TABLE IF NOT EXISTS users (
  id             TEXT PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,          -- luôn viết thường
  name           TEXT NOT NULL DEFAULT '',
  avatar         TEXT NOT NULL DEFAULT '',
  password_hash  TEXT,                          -- NULL nếu chỉ đăng nhập Google
  email_verified INTEGER NOT NULL DEFAULT 0,
  google_sub     TEXT UNIQUE,                   -- id tài khoản Google
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,                  -- SHA-256 của token trong cookie (không lưu token gốc)
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  user_agent TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS progress (
  user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data       TEXT NOT NULL,                     -- JSON tiến trình (giống localStorage)
  version    INTEGER NOT NULL,                  -- tăng mỗi lần lưu, chống ghi đè giữa 2 thiết bị
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS email_tokens (
  id         TEXT PRIMARY KEY,                  -- SHA-256 của token gửi qua email
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose    TEXT NOT NULL,                     -- 'verify' | 'reset'
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key      TEXT PRIMARY KEY,
  count    INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);
