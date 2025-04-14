import json
import glob
import os
import sqlite3
from dependencies.connect_db import connect_db
from dependencies.get_from_fbref import get_FBref_mls_player_misc_stats





class DataHandler:
    def __init__(self, data_vars_path='data/data_vars.json'):
        with open(data_vars_path, 'r') as f:
            data_vars = json.load(f)
            self.database_name = data_vars["database"]["name"]
            self.database_path = data_vars["database"]["path"].replace("_DATABASE_NAME_", self.database_name)
            self.inaugural_season = data_vars["database"]["inaugural_season"]
            self.raw_table = data_vars["database"]["misc_raw_table"]
            self.stg_table = data_vars["database"]["misc_stg_table"]
            self.misc_season_current  = data_vars["fbref"]["fbref_urls"]["misc_season_current"]
            self.misc_season_specific  = data_vars["fbref"]["fbref_urls"]["misc_season_specific"]
            self.schmetzer_score = data_vars["schmetzer_score_points"]

        
    def insert_historical_raw_FBref_mls_players_all_stats_misc(self, url, year=2024):
        conn = connect_db(self.database_name, self.database_path)
        c = conn.cursor()
        ### Insert into raw table
        try:
            df = get_FBref_mls_player_misc_stats(year=year, url=url)
            # Once new data obtained, remove existing data, then insert
            c.execute(f"DELETE FROM {self.raw_table} WHERE season = ?", (year,))
            print(f'Deleted from table: {self.raw_table} where season = {year}')
            conn.commit()
            df.to_sql(self.raw_table, conn, if_exists='append', index=False)
            print(f'Inserted into table: {self.raw_table} where season = {year}')
            conn.commit()
        except sqlite3.Error as e:
            print(e)
        finally:
            conn.close()
    
    def insert_stg_FBref_mls_players_all_stats_misc(self, year=2024):
        conn = connect_db(self.database_name, self.database_path)
        c = conn.cursor()
        try:
            # for sql_file in glob.glob('data/etl/sql/transform/*.sql'):
            sql_file = glob.glob('data/etl/sql/transform/load_stg_FBref_mls_players_all_stats_misc.sql')[0]
            with open(sql_file, 'r') as f:
                table_name = os.path.splitext(os.path.basename(sql_file))[0].replace('load_', '')
                sql = f.read()
                c.executescript(sql)
                print(f'Inserted into table: {table_name} where season = {year} by player')
                conn.commit()
        except sqlite3.Error as e:
            print(e)
        finally:
            conn.close()