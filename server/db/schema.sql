PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id    TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  nickname      TEXT    NOT NULL,
  gender        TEXT    CHECK(gender IN ('male','female','other')) DEFAULT 'other',
  manner_score  REAL    NOT NULL DEFAULT 36.5,
  ride_count    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS rides (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  host_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin       TEXT    NOT NULL,
  destination  TEXT    NOT NULL,
  depart_at    TEXT    NOT NULL,
  total_seats  INTEGER NOT NULL CHECK(total_seats BETWEEN 2 AND 5),
  filled_seats INTEGER NOT NULL DEFAULT 1,
  cost_total   INTEGER NOT NULL,
  gender_limit TEXT    CHECK(gender_limit IN ('male','female','any')) DEFAULT 'any',
  luggage_ok   INTEGER NOT NULL DEFAULT 0,
  memo         TEXT,
  status       TEXT    NOT NULL DEFAULT 'open'
               CHECK(status IN ('open','confirmed','completed','cancelled')),
  created_at   TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS applications (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ride_id      INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  applicant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status       TEXT    NOT NULL DEFAULT 'pending'
               CHECK(status IN ('pending','accepted','rejected','cancelled')),
  created_at   TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  UNIQUE(ride_id, applicant_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ride_id     INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  UNIQUE(ride_id, reviewer_id, reviewee_id)
);

CREATE TABLE IF NOT EXISTS manner_score_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ride_id    INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  delta      REAL    NOT NULL,
  reason     TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            TEXT    NOT NULL
                  CHECK(type IN ('applied','accepted','rejected','confirmed','completed','cancelled','departed')),
  message         TEXT    NOT NULL,
  related_ride_id INTEGER REFERENCES rides(id) ON DELETE SET NULL,
  is_read         INTEGER NOT NULL DEFAULT 0 CHECK(is_read IN (0,1)),
  created_at      TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TRIGGER IF NOT EXISTS trg_rides_updated
AFTER UPDATE ON rides
BEGIN
  UPDATE rides SET updated_at = datetime('now','localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_applications_updated
AFTER UPDATE ON applications
BEGIN
  UPDATE applications SET updated_at = datetime('now','localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_fill_seat_on_accept
AFTER UPDATE OF status ON applications
WHEN NEW.status = 'accepted' AND OLD.status = 'pending'
BEGIN
  UPDATE rides SET filled_seats = filled_seats + 1 WHERE id = NEW.ride_id;
  UPDATE users SET ride_count   = ride_count + 1   WHERE id = NEW.applicant_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_release_seat
AFTER UPDATE OF status ON applications
WHEN NEW.status IN ('rejected','cancelled') AND OLD.status = 'accepted'
BEGIN
  UPDATE rides SET filled_seats = filled_seats - 1 WHERE id = NEW.ride_id;
  UPDATE users SET ride_count   = ride_count - 1   WHERE id = NEW.applicant_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_update_manner_score
AFTER INSERT ON reviews
BEGIN
  UPDATE users
    SET manner_score = (
      SELECT 36.5 + (AVG(rating) - 3) * 0.5
      FROM reviews WHERE reviewee_id = NEW.reviewee_id
    )
  WHERE id = NEW.reviewee_id;

  INSERT INTO manner_score_log(user_id, ride_id, delta, reason)
    VALUES(NEW.reviewee_id, NEW.ride_id, (NEW.rating - 3) * 0.5, '후기 별점 반영');
END;