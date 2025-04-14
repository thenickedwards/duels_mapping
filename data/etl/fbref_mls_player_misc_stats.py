import sqlite3
import glob
import os
from dependencies.connect_db import connect_db
from dependencies.get_from_fbref import get_FBref_mls_player_misc_stats

# TODO MOVE THESE TO JSON VARS
database_name = "mls_stats.db"
database_path = f"data/database/{database_name}"
# data/database/mls_stats.db
year=2024
FBref_current_url='https://FBref.com/en/comps/22/misc/Major-League-Soccer-Stats'
FBref_2024_url=f'https://FBref.com/en/comps/22/{year}/misc/{year}-Major-League-Soccer-Stats'
raw_table = 'raw_FBref_mls_players_all_stats_misc'

dim_schmetzer_score_points = {
  "aerial duels won": {
    "point_value": 1,
    "abbrev": "adw"
  },
  "aerial duels lost": {
    "point_value": -0.75,
    "abbrev": "adl"
  },
  "tackles won": {
    "point_value": 1,
    "abbrev": "tkwon"
  },
  "interceptions": {
    "point_value": 0.75,
    "abbrev": "inter"
  },
  "recoveries": {
    "point_value": 0.5,
    "abbrev": "recov"
  }
}



conn = connect_db(database_name, database_path)
c = conn.cursor()
### Insert into raw table
try:
    df = get_FBref_mls_player_misc_stats(year=year, url=FBref_2024_url)
    # Once new data obtained, remove existing data, then insert
    c.execute(f"DELETE FROM {raw_table} WHERE season = ?", (year,))
    print(f'Deleted from table: {raw_table} where season = {year}')
    conn.commit()
    df.to_sql(raw_table, conn, if_exists='append', index=False)
    print(f'Inserted into table: {raw_table} where season = {year}')
    conn.commit()
except sqlite3.Error as e:
    print(e)
finally:
    conn.close()

### Transform raw data for staging table
conn = connect_db(database_name, database_path)
c = conn.cursor()
try:
    for sql_file in glob.glob('data/etl/sql/transform/*.sql'):
        with open(sql_file, 'r') as f:
            table_name = os.path.splitext(os.path.basename(sql_file))[0].replace('load_', '')
            sql = f.read()
            c.executescript(sql)
            # c.executescript(sql, {'point_value': dim_schmetzer_score_points['point_value'], 'description': dim_schmetzer_score_points['abbrev']})
            print(f'Inserted into table: {table_name} where season = {year} by player')
            conn.commit()
except sqlite3.Error as e:
    print(e)
finally:
    conn.close()




# if __name__ == "__main__":