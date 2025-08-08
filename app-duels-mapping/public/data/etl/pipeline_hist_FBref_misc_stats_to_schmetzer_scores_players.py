import os
from dotenv import load_dotenv
load_dotenv()
from data_handler import DataHandler
data_handler = DataHandler()

# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

def pipeline_hist_FBref_misc_stats_to_schmetzer_scores_players():    
    ### Create tables
    # TODO: Abstract to data_handler? setup pipeline?
    data_handler.create_tables()
    
    ### Insert static data into dim tables
    data_handler.insert_dim_schmetzer_score_points()

    ### Insert into raw table
    data_handler.insert_historical_raw_FBref_mls_players_all_stats_misc()
    data_handler.insert_current_raw_FBref_mls_players_all_stats_misc()

    ### Transform raw data for staging table
    data_handler.insert_stg_FBref_mls_players_all_stats_misc()
    
    ### Create and Insert into schmetzer_scores_players calculated points and scores (each table per season)
    data_handler.insert_schmetzer_scores_players()
    
    ### Create and Insert into schmetzer_scores_all calculated points and scores (all seasons, one table)
    data_handler.insert_schmetzer_scores_all_seasons()
    
    # Upload SQLite data to Supabase
    data_handler.insert_hist_SQLite_to_Supabase(supabase_url=SUPABASE_URL, supabase_key=SUPABASE_ANON_KEY)


if __name__ == "__main__":
    pipeline_hist_FBref_misc_stats_to_schmetzer_scores_players()
    
    