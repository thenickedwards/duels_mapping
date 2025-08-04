import json
import glob
import os
import datetime
import sqlite3
from supabase import create_client, Client
from supafunc.errors import FunctionsRelayError, FunctionsHttpError
from dependencies.connect_db import connect_db
from dependencies.get_from_fbref import get_FBref_mls_player_misc_stats
from dependencies.normalize_data import find_none, normalize_none_to_null, normalize_row

script_dir = os.path.dirname(os.path.abspath(__file__))
data_vars_path = os.path.join(script_dir, "..", "data_vars.json")
data_vars_path = os.path.normpath(data_vars_path)

class DataHandler:
    def __init__(self, data_vars_path=data_vars_path):
        with open(data_vars_path, 'r') as f:
            data_vars = json.load(f)
            self.database_name = data_vars["database"]["name"]
            self.database_path = data_vars["database"]["path"] + data_vars["database"]["name"]
            # base_dir = os.path.dirname(os.path.abspath(data_vars_path))
            # full_path = os.path.join(base_dir, data_vars["database"]["path"], self.database_name)
            # self.database_path = os.path.normpath(full_path)
            # TODO: Remove check
            print(f"📂 Database will be opened from: {self.database_path}")
            self.inaugural_season = data_vars["database"]["inaugural_season"]
            self.current_year = datetime.datetime.now().year
            self.raw_table = data_vars["database"]["misc_raw_table"]
            self.stg_table = data_vars["database"]["misc_stg_table"]
            self.misc_season_current  = data_vars["fbref"]["fbref_urls"]["misc_season_current"]
            self.misc_season_specific  = data_vars["fbref"]["fbref_urls"]["misc_season_specific"]
            self.schmetzer_score = data_vars["schmetzer_score_points"]
            self.schmetzer_scores_tables = data_vars["database"]["schmetzer_scores_tables"] 

    def create_tables(self):
        conn = connect_db(self.database_name, self.database_path)
        c = conn.cursor()
        try:
            for sql_file in glob.glob('app-duels-mapping/public/data/etl/sql/create/*.sql'):
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
            
    def insert_dim_schmetzer_score_points(self):
        conn = connect_db(self.database_name, self.database_path)
        c = conn.cursor()
        try:
            for stat_name, stat_info in self.schmetzer_score.items():
                point_value = stat_info["point_value"]
                abbrev = stat_info["abbrev"]
                c.execute("INSERT INTO dim_schmetzer_score_points VALUES (:stat_name, :point_value, :abbrev)", {'stat_name': stat_name, 'point_value': point_value, 'abbrev': abbrev})
                conn.commit()
                print(f'Inserted into table: dim_schmetzer_score_points {stat_name} with point_value: {point_value} and abbrev: {abbrev}')
        except sqlite3.Error as e:
            print(e)
        finally:
            conn.close()
        
    def insert_historical_raw_FBref_mls_players_all_stats_misc(self):
        conn = connect_db(self.database_name, self.database_path)
        c = conn.cursor()
        ### Insert into raw table
        try:
            for year in range(2018, self.current_year):
                url = f'https://FBref.com/en/comps/22/{year}/misc/{year}-Major-League-Soccer-Stats'
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
        
    def insert_current_raw_FBref_mls_players_all_stats_misc(self):
        conn = connect_db(self.database_name, self.database_path)
        c = conn.cursor()
        ### Insert into raw table
        try:
            url = self.misc_season_current
            df = get_FBref_mls_player_misc_stats(year=self.current_year, url=url)
            # Once new data obtained, remove existing data, then insert
            c.execute(f"DELETE FROM {self.raw_table} WHERE season = ?", (self.current_year,))
            print(f'Deleted from table: {self.raw_table} where season = {self.current_year}')
            conn.commit()
            df.to_sql(self.raw_table, conn, if_exists='append', index=False)
            print(f'Inserted into table: {self.raw_table} where season = {self.current_year}')
            conn.commit()
        except sqlite3.Error as e:
            print(e)
        finally:
            conn.close()
    
    def insert_stg_FBref_mls_players_all_stats_misc(self):
        conn = connect_db(self.database_name, self.database_path)
        c = conn.cursor()
        try:
            sql_file = glob.glob('app-duels-mapping/public/data/etl/sql/transform/load_stg_FBref_mls_players_all_stats_misc.sql')[0]
            with open(sql_file, 'r') as f:
                table_name = os.path.splitext(os.path.basename(sql_file))[0].replace('load_', '')
                sql = f.read()
                c.executescript(sql)
                print(f'Inserted into table: {table_name}')
                conn.commit()
        except sqlite3.Error as e:
            print(e)
        finally:
            conn.close()
    
    def insert_schmetzer_scores_players(self):
        conn = connect_db(self.database_name, self.database_path)
        c = conn.cursor()
        try:
            sql_file = glob.glob('app-duels-mapping/public/data/etl/sql/z_schmetzer_scores/schmetzer_scores_players.sql')[0]
            for year in range(2018, self.current_year + 1):            
                with open(sql_file, 'r') as f:
                    table_name = f'schmetzer_scores_{year}'
                    sql = f.read()
                    sql = sql.format(year=year)
                    c.executescript(sql)
                    print(f'Created table: {table_name} and inserted player data from table: {self.stg_table} for season {year}')
                    conn.commit()
        except sqlite3.Error as e:
            print(e)
        finally:
            conn.close()
    
    def insert_schmetzer_scores_all_seasons(self):
        conn = connect_db(self.database_name, self.database_path)
        c = conn.cursor()
        try:
             # Find all schmetzer_scores_YYYY tables
            c.execute("""
                SELECT name FROM sqlite_master
                WHERE type='table' AND name LIKE 'schmetzer_scores_20__';
            """)
            schmetzer_season_tables = [row[0] for row in c.fetchall()]
            
            sql_file = glob.glob('app-duels-mapping/public/data/etl/sql/z_schmetzer_scores/schmetzer_scores_all.sql')[0]
            with open(sql_file, 'r') as f:
                sql_template = f.read()

            for table in schmetzer_season_tables:
                year_match = table[-4:]
                if not year_match.isdigit():
                    continue
                year = int(year_match)

                sql = sql_template.format(year=year)
                c.executescript(sql)
                print(f'Inserted player data into schmetzer_scores_all from table: {table} for season {year}')
                conn.commit()
        except sqlite3.Error as e:
            print(e)
        finally:
            conn.close()
            
            
    def insert_hist_SQLite_to_Supabase(self, supabase_url, supabase_key):
        tables = [
            self.schmetzer_scores_tables["all"]] + [
            self.schmetzer_scores_tables["season"].replace("YEAR", str(year)) for year in range(2018, self.current_year + 1)
        ]
        # Supabase client
        supabase: Client = create_client(supabase_url, supabase_key)
        # SQLite connection
        conn = connect_db(self.database_name, self.database_path)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        try: 
            for t in tables:
                print(f"Extracting data from SQLite table: {t}")
                c.execute(f"SELECT id, season, player_name, player_nationality, position, squad, player_age, player_yob, nineties, schmetzer_score, schmetzer_rk, aerial_duels_won, aerial_duels_lost, aerial_duels_total, aerial_duels_won_pct, tackles_won, interceptions, recoveries FROM {t}")
                rows = c.fetchall()
                # normalize data
                data = [
                    normalize_row(r) for r in rows
                    if r['season'] is not None and isinstance(r['season'], int)
                ]

                ####
                find_none(data)


                response = supabase.table(t).upsert(data, default_to_null=True).execute()
                # for r in rows:
                #     record = dict(r)
                #     response = supabase.table(t).upsert(record, default_to_null=True).execute()
                print(f'Inserted data into Supbase table: {t}')
        except sqlite3.Error as e:
            print(e)
        except FunctionsHttpError as exception:
            err = exception.to_dict()
            print(f'Function returned an error {err.get("message")}')
        except FunctionsRelayError as exception:
            err = exception.to_dict()
            print(f'Relay error: {err.get("message")}')
        finally:
            conn.close()
        

