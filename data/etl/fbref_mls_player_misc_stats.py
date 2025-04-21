from data_handler import DataHandler
data_handler = DataHandler()


### Insert into dim tables
data_handler.insert_dim_schmetzer_score_points()

### Insert into raw table
data_handler.insert_historical_raw_FBref_mls_players_all_stats_misc()
data_handler.insert_current_raw_FBref_mls_players_all_stats_misc()

### Transform raw data for staging table
data_handler.insert_stg_FBref_mls_players_all_stats_misc()



# if __name__ == "__main__":