import sqlite3

### CONNECT (OR CREATE) DATABASE
def connect_db(database_name, database_path):
    try:
        with sqlite3.connect(database_path) as conn:
            print(f"Opened SQLite database {database_name} with SQLite version {sqlite3.sqlite_version} successfully.")
            return sqlite3.connect(database_path)
        
    except sqlite3.Error as e:
        print(f"Failed to open database {database_name}:\n", e)
        
if __name__ == "__main__":
    database_name = "mls_stats.db"
    database_path = f"data/database/{database_name}"
    connect_db(database_name, database_path)