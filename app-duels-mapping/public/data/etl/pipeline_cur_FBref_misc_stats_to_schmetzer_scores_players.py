from data_handler import DataHandler
data_handler = DataHandler()


def pipeline_cur_FBref_misc_stats_to_schmetzer_scores_players():    
    ### Insert into raw table
    data_handler.insert_current_raw_FBref_mls_players_all_stats_misc()

    ### Transform raw data for staging table
    data_handler.insert_stg_FBref_mls_players_all_stats_misc()
    
    ### Create and Insert into schmetzer_scores_players calculated points and scores (each table per season)
    data_handler.insert_schmetzer_scores_players()
    
    ### Create and Insert into schmetzer_scores_all calculated points and scores (all seasons, one table)
    data_handler.insert_schmetzer_scores_all_seasons()


if __name__ == "__main__":
    pipeline_cur_FBref_misc_stats_to_schmetzer_scores_players()