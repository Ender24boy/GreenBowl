import sqlite3

def delete_first_n_records(db_path: str, table: str, n: int = 10000):
    """
    Connects to the SQLite database at db_path and deletes the first n rows
    from the specified table (ordered by rowid).
    """
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Start a transaction
    cur.execute("BEGIN TRANSACTION;")

    # Delete the first n rows by rowid
    cur.execute(f"""
        DELETE FROM {table}
        WHERE rowid IN (
            SELECT rowid
            FROM {table}
            ORDER BY rowid
            LIMIT ?
        );
    """, (n,))

    # Commit and report
    conn.commit()
    deleted = cur.rowcount
    conn.close()

    print(f"Deleted {deleted} rows from '{table}'.")

if __name__ == "__main__":
    delete_first_n_records("jeopardy.db", "shows", 10000)
