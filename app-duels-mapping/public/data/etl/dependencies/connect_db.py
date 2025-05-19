import sqlite3
import os

### CONNECT (OR CREATE) DATABASE
def connect_db(database_name, database_path, timeout=10.0):
    if not os.path.exists(database_path):
        print(f"❌ Database file not found at: {database_path}")
        return None
    try:
        with sqlite3.connect(database_path, timeout=timeout) as conn:
            print(f"✅ Opened SQLite database '{database_name}' at {os.path.abspath(database_path)} (SQLite v{sqlite3.sqlite_version})")
            return sqlite3.connect(database_path, timeout=timeout)
            # return conn
        
    except sqlite3.Error as e:
        print(f"❌ Failed to open database {database_name}:\n", e)
        
# if __name__ == "__main__":
#     database_name = "mls_stats.db"
#     database_path = f"data/database/{database_name}"
#     connect_db(database_name, database_path)