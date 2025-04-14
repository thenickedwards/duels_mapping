import sqlite3
import glob
import os
from dependencies.connect_db import connect_db


database_name = "mls_stats.db"
database_path = f"data/database/{database_name}"
# data/database/mls_stats.db

# Optional: Create the directory if it doesn't exist
# os.makedirs(os.path.dirname(database_path), exist_ok=True)

### CREATE TABLES
### Running all files in sql/create/ directory
def create_tables(database_name, database_path):
    conn = connect_db(database_name, database_path)
    c = conn.cursor()
    try:
        for sql_file in glob.glob('data/etl/sql/create/*.sql'):
            with open(sql_file, 'r') as f:
                table_name = os.path.splitext(os.path.basename(sql_file))[0]
                sql = f.read()
                c.executescript(sql)
                print(f'Created table: {table_name}')
                conn.commit()
    except sqlite3.Error as e:
        print(e)
    finally:
        conn.close()


if __name__ == "__main__":
    create_tables(database_name, database_path)