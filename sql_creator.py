import sqlite3
import os
import json
import uuid

# 1) open the DB and immediately set all our space-saving pragmas
conn = sqlite3.connect('jeopardy.db')
c = conn.cursor()
c.execute("PRAGMA journal_mode   = OFF;")        # no rollback-journal file
c.execute("PRAGMA synchronous    = OFF;")        # no fsync on every write
c.execute("PRAGMA temp_store     = MEMORY;")     # temp b-trees in RAM not on disk
c.execute("PRAGMA page_size      = 2048;")       # smaller pages → less wasted slack
c.execute("PRAGMA auto_vacuum    = FULL;")       # keep DB compact as you go

# 2) define tables WITHOUT ROWID so we don't store an extra 8‐byte rowid per row
c.execute("""
CREATE TABLE IF NOT EXISTS shows (
    id           TEXT    PRIMARY KEY,
    date_year    INTEGER,
    date_month   INTEGER,
    date_day     INTEGER
) WITHOUT ROWID;
""")

c.execute("""
CREATE TABLE IF NOT EXISTS clues (
    id        TEXT    PRIMARY KEY,
    show_id   TEXT,
    category  TEXT,
    clue      TEXT,
    answer    TEXT,
    FOREIGN KEY(show_id) REFERENCES shows(id)
) WITHOUT ROWID;
""")
conn.commit()

# 3) do one big transaction for all inserts (faster + no intermediate bloat)
c.execute("BEGIN;")
for filename in os.listdir("./shows"):
    if not filename.lower().endswith('.json'):
        continue

    full_path = os.path.join("./shows", filename)
    try:
        data = json.load(open(full_path, 'r', encoding='utf-8'))
        show_uuid = str(uuid.uuid4())

        c.execute("""
            INSERT INTO shows (id, date_year, date_day, date_month)
            VALUES (?, ?, ?, ?)
        """, (
            show_uuid,
            data["date"]["year"],
            data["date"]["day"],
            data["date"]["month"],
        ))

        for clue in data.get('clues', []):
            c.execute("""
                INSERT INTO clues (id, show_id, category, clue, answer)
                VALUES (?, ?, ?, ?, ?)
            """, (
                str(uuid.uuid4()),
                show_uuid,
                clue.get('category'),
                clue.get('text'),
                clue.get('answer')
            ))

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON in {filename}: {e}")
    except Exception as e:
        print(f"Error reading {filename}: {e}")

c.execute("COMMIT;")

# 4) finally, rebuild the file compactly
c.execute("VACUUM;")
conn.close()
