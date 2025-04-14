import sqlite3
# import os
import glob

print("We warmin' up")
conn = sqlite3.connect('planning/sqlite_test/sqlite_test.db')
print('Connected to database successfully...')
c = conn.cursor()
print('Cursor created.')

### Running 1 file
# try:
#     with open('planning/sqlite_test/create_tables/test_table1.sql', 'r') as sql_file:
#         sql = sql_file.read()
#         c.executescript(sql)
#         print('Table created!')
#         conn.commit()
# except sqlite3.Error as e:
#     print(e)
# finally:
#     conn.close()

### Running all files in directory
try:
    for sql_file in glob.glob('planning/sqlite_test/create_tables/*.sql'):
        with open(sql_file, 'r') as f:
            sql = f.read()
            c.executescript(sql)
            print('Table created!')
            conn.commit()
except sqlite3.Error as e:
    print(e)
finally:
    conn.close()