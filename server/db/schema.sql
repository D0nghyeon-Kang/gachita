-- server/db/schema.sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode  = WAL;

-- 기존 DB에 생성된 좌석 트리거 명시적 제거
DROP TRIGGER IF EXISTS trg_fill_seat;
DROP TRIGGER IF EXISTS trg_free_seat;

-- ─────────────────────────────────────────
-- users
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id    TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  nickname      TEXT    NOT NULL UNIQUE,
  gender        TEXT    NOT NULL DEFAULT 'other' CHECK (gender IN ('male','female','other')),
  manner_score  REAL    NOT NULL DEFAULT 36.5,
  ride_count    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────
-- rides
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rides (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  host_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin              TEXT    NOT NULL,
  destination         TEXT    NOT NULL,
  depart_at           TEXT    NOT NULL,
  total_seats         INTEGER NOT NULL CHECK (total_seats BETWEEN 1 AND 6),
  filled_seats        INTEGER NOT NULL DEFAULT 1,
  cost_total          INTEGER NOT NULL CHECK (cost_total >= 0),
  ride_type           TEXT    NOT NULL DEFAULT 'carpool'
                              CHECK (ride_type IN ('carpool','taxi')),
  gender_restriction  TEXT    NOT NULL DEFAULT 'any'
                              CHECK (gender_restriction IN ('any','male','female')),
  has_luggage         INTEGER NOT NULL DEFAULT 0,
  car_model           TEXT,
  memo                TEXT,
  status              TEXT    NOT NULL DEFAULT 'open'
                              CHECK (status IN ('open','closed','completed','cancelled')),
  created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rides_status    ON rides (status);
CREATE INDEX IF NOT EXISTS idx_rides_depart_at ON rides (depart_at);
CREATE INDEX IF NOT EXISTS idx_rides_route     ON rides (origin, destination);

-- ─────────────────────────────────────────
-- applications
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  ride_id       INTEGER NOT NULL REFERENCES rides(id)  ON DELETE CASCADE,
  applicant_id  INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  status        TEXT    NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','accepted','rejected','cancelled')),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (ride_id, applicant_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_ride      ON applications (ride_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications (applicant_id);

-- ─────────────────────────────────────────
-- reviews
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ride_id      INTEGER NOT NULL REFERENCES rides(id)  ON DELETE CASCADE,
  reviewer_id  INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  reviewee_id  INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (ride_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_ride     ON reviews (ride_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews (reviewee_id);

-- ─────────────────────────────────────────
-- notifications
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ride_id    INTEGER REFERENCES rides(id) ON DELETE SET NULL,
  type       TEXT    NOT NULL,
  message    TEXT    NOT NULL,
  is_read    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, is_read);

-- ─────────────────────────────────────────
-- manner_score_log
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS manner_score_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta      REAL    NOT NULL,
  reason     TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_manner_log_user ON manner_score_log (user_id);

-- ─────────────────────────────────────────
-- TRIGGERS
-- ─────────────────────────────────────────

-- trg_fill_seat / trg_free_seat 는 applications.js에서 직접 관리하므로 비활성화

-- manner_score 자동 계산
CREATE TRIGGER IF NOT EXISTS trg_manner_score
  AFTER INSERT ON reviews
  BEGIN
    UPDATE users
       SET manner_score = MIN(50, MAX(0,
             manner_score + CASE NEW.rating
               WHEN 5 THEN  0.5
               WHEN 4 THEN  0.2
               WHEN 3 THEN  0.0
               WHEN 2 THEN -0.2
               WHEN 1 THEN -0.5
             END
           )),
           ride_count = ride_count + 1
     WHERE id = NEW.reviewee_id;

    INSERT INTO manner_score_log (user_id, delta, reason)
    VALUES (
      NEW.reviewee_id,
      CASE NEW.rating
        WHEN 5 THEN  0.5
        WHEN 4 THEN  0.2
        WHEN 3 THEN  0.0
        WHEN 2 THEN -0.2
        WHEN 1 THEN -0.5
      END,
      'review on ride ' || NEW.ride_id
    );
  END;

-- updated_at 자동 갱신
CREATE TRIGGER IF NOT EXISTS trg_rides_updated
  AFTER UPDATE ON rides
  BEGIN
    UPDATE rides SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS trg_users_updated
  AFTER UPDATE ON users
  BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
  END;