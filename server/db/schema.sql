-- server/db/schema.sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode  = WAL;

-- ── 유저 ──────────────────────────────────────
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

-- ── 동승 게시글 ────────────────────────────────
-- 프론트 필드: from, to, departureDate, departureTime, seats,
--             estimatedCost, rideType, genderRestriction, hasLuggage, memo
CREATE TABLE IF NOT EXISTS rides (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  host_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin              TEXT    NOT NULL,          -- from
  destination         TEXT    NOT NULL,          -- to
  depart_at           TEXT    NOT NULL,          -- departureDate + departureTime
  total_seats         INTEGER NOT NULL CHECK (total_seats BETWEEN 1 AND 6),
  filled_seats        INTEGER NOT NULL DEFAULT 1,
  cost_total          INTEGER NOT NULL CHECK (cost_total >= 0),   -- estimatedCost
  ride_type           TEXT    NOT NULL DEFAULT 'carpool'
                              CHECK (ride_type IN ('carpool','taxi')),  -- rideType
  gender_restriction  TEXT    NOT NULL DEFAULT 'any'
                              CHECK (gender_restriction IN ('any','male','female')),
  has_luggage         INTEGER NOT NULL DEFAULT 0,  -- hasLuggage (0/1)
  memo                TEXT,
  status              TEXT    NOT NULL DEFAULT 'open'
                              CHECK (status IN ('open','closed','completed','cancelled')),
  created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rides_status    ON rides (status);
CREATE INDEX IF NOT EXISTS idx_rides_depart_at ON rides (depart_at);
CREATE INDEX IF NOT EXISTS idx_rides_route     ON rides (origin, destination);

-- ── 참여 신청 ──────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  ride_id       INTEGER NOT NULL REFERENCES rides(id)  ON DELETE CASCADE,
  applicant_id  INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  status        TEXT    NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','accepted','rejected','cancelled')),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (ride_id, applicant_id)
);

-- ── 후기 ───────────────────────────────────────
-- 프론트 필드: rideId, rating, text
CREATE TABLE IF NOT EXISTS reviews (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ride_id      INTEGER NOT NULL REFERENCES rides(id)  ON DELETE CASCADE,
  reviewer_id  INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  score        INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),   -- rating
  content      TEXT,                                              -- text
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (ride_id, reviewer_id)
);

-- ── 트리거: 신청 수락 시 filled_seats +1 ────────
CREATE TRIGGER IF NOT EXISTS trg_fill_seat
  AFTER UPDATE OF status ON applications
  WHEN NEW.status = 'accepted' AND OLD.status = 'pending'
  BEGIN
    UPDATE rides
       SET filled_seats = filled_seats + 1,
           status = CASE WHEN filled_seats + 1 >= total_seats THEN 'closed' ELSE status END
     WHERE id = NEW.ride_id;
  END;

-- ── 트리거: 수락 취소 시 filled_seats -1 ────────
CREATE TRIGGER IF NOT EXISTS trg_free_seat
  AFTER UPDATE OF status ON applications
  WHEN NEW.status IN ('cancelled','rejected') AND OLD.status = 'accepted'
  BEGIN
    UPDATE rides
       SET filled_seats = MAX(1, filled_seats - 1),
           status = 'open'
     WHERE id = NEW.ride_id;
  END;

-- ── 트리거: 후기 등록 시 manner_score + ride_count 갱신 ──
CREATE TRIGGER IF NOT EXISTS trg_manner_score
  AFTER INSERT ON reviews
  BEGIN
    UPDATE users
       SET manner_score = MIN(50, MAX(0,
             manner_score + CASE NEW.score
               WHEN 5 THEN  0.5
               WHEN 4 THEN  0.2
               WHEN 3 THEN  0.0
               WHEN 2 THEN -0.2
               WHEN 1 THEN -0.5
             END
           )),
           ride_count = ride_count + 1
     WHERE id = NEW.reviewer_id;
  END;

-- ── 트리거: updated_at 자동 갱신 ────────────────
CREATE TRIGGER IF NOT EXISTS trg_rides_updated
  AFTER UPDATE ON rides
  BEGIN
    UPDATE rides SET updated_at = datetime('now') WHERE id = NEW.id;
  END;
