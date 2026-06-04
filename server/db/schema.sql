-- server/db/schema.sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode  = WAL;

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
-- 라우터(rides.js)가 쓰는 컬럼명 기준으로 통일:
--   gender_restriction, has_luggage
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

CREATE INDEX IF NOT EXISTS idx_applications_ride     ON applications (ride_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications (applicant_id);

-- ─────────────────────────────────────────
-- reviews
-- reviewModel.js 가 쓰는 컬럼명 기준으로 통일:
--   reviewee_id, rating, comment
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
-- notifications  ← 기존 schema에 없어서 추가
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
-- manner_score_log  ← 기존 schema에 없어서 추가
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

-- filled_seats +1 (트리거 방식 사용 시)
-- ※ routes/applications.js 에서 직접 UPDATE도 하고 있으므로
--   applications.js 쪽 수동 UPDATE를 제거하거나 이 트리거를 DROP해야 중복 방지됨.
--   DB 담당자 단독 수정 범위: 트리거는 일단 DROP하고 라우터 코드에 맡김.
--   (트리거를 살리려면 applications.js 수정 필요 → 팀원 담당)

-- trg_fill_seat / trg_free_seat 는 라우터와 중복이라 주석 처리
-- 팀원이 라우터 코드를 제거하면 아래 주석 해제

-- CREATE TRIGGER IF NOT EXISTS trg_fill_seat
--   AFTER UPDATE OF status ON applications
--   WHEN NEW.status = 'accepted' AND OLD.status = 'pending'
--   BEGIN
--     UPDATE rides
--        SET filled_seats = filled_seats + 1,
--            status = CASE WHEN filled_seats + 1 >= total_seats THEN 'closed' ELSE status END
--      WHERE id = NEW.ride_id;
--   END;

-- CREATE TRIGGER IF NOT EXISTS trg_free_seat
--   AFTER UPDATE OF status ON applications
--   WHEN NEW.status IN ('cancelled','rejected') AND OLD.status = 'accepted'
--   BEGIN
--     UPDATE rides
--        SET filled_seats = MAX(1, filled_seats - 1),
--            status = 'open'
--      WHERE id = NEW.ride_id;
--   END;

-- manner_score 자동 계산 (reviews.rating 기준 — 위에서 컬럼명 통일 완료)
CREATE TRIGGER IF NOT EXISTS trg_manner_score
  AFTER INSERT ON reviews
  BEGIN
    -- manner_score 업데이트
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

    -- 로그 기록
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