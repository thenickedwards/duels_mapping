# duels_mapping Data Environment

Welcome to the duels_mapping Data Environment! Within the [app-duels-mapping/public/data](.) directory is the SQLite database which serves as a data warehouse, ETL pipelines for sourcing and delivery of statistics, and the SQL to set up the data environment, ingest and transform the data, and provides statistics for the Next.js front end dashboard which rates MLS players based on aerial dules won/lost, tackles won, interceptions, and recoveries.

If you're this deep in the project, you're my kind of people.

## Double Pivot (Reoccuring Data Variables)

There are two pivot points which dictate the flow of data and handle the data traffic.

The file [app-duels-mapping/public/data/data_vars.json](data_vars.json) is acting as a pivot for the algorithim. This JSON file contains the point values which control the algorithim calculating the `Schmetzer Score` rating. This access point for the individual stat weights was written with an eye toward further development. The raw and staging tables as well as the FBref data sources are named so that additional sources, ETL pipelines, and composite metrics of other advanced soccer statistics.

The `DataHandler` class defined in [app-duels-mapping/public/data/etl/data_handler.py](etl/data_handler.py) utilizes custom methods to extract, parse, load, and transform the data. This architecture was inspired by Apache Airflow DAGs with future development of additional ETL piplines in mind.

### Data Modeling & Table Schema

All tables are created using the SQL in the [app-duels-mapping/public/data/etl/sql/create](etl/sql/create) directory. For simplicity, readability, extendibility the filename matches the name of the table.

`dim_schmetzer_score_points` - This is the only **dim table** leveraged by the Schmetzer Score metric. While the values are static as seen below, they are controlled by the aforementioned [data_vars.json](data_vars.json) and are inserted using Python subsequent to all table creation.

| stat_name         | point_value | abbrev        |
| ----------------- | ----------- | ------------- |
| aerial duels won  | 1           | duels won     |
| aerial duels lost | -0.75       | duels lost    |
| tackles won       | 1           | tackles won   |
| interceptions     | .75         | interceptions |
| recoveries        | .5          | recoveries    |

`raw_FBref_mls_players_all_stats_misc` - The **raw table** for this workflow, this table serves as a first destination once the extracted data is sourced and parsed using Python and a Pandas Dataframe. In order to conserve on resources and keep the data as close to the original as possible very little in the way of transformation occurs (the only changes being as noted below).

| Column Name   | Data Type | Description                                                                                        |
| ------------- | --------- | -------------------------------------------------------------------------------------------------- |
| season        | Integer   | Year of season                                                                                     |
| player        | Text      | Player's name                                                                                      |
| nation        | Text      | Player's nationality                                                                               |
| pos           | Text      | Player's position                                                                                  |
| squad         | Text      | Player's team                                                                                      |
| age           | Integer   | Player's age at start of season                                                                    |
| born          | Integer   | Player's year of birth                                                                             |
| nineties      | Real      | Minutes played ÷ 90 (renamed from '90s' as column names cannot start with a number)                |
| crdy          | Integer   | Yellow cards                                                                                       |
| crdr          | Integer   | Red cards                                                                                          |
| second_crdy   | Integer   | Second yellow cards (renamed from '2crdy' as column names cannot start with a number)              |
| fls           | Integer   | Fouls committed                                                                                    |
| fld           | Integer   | Fouls drawn                                                                                        |
| off           | Integer   | Offside                                                                                            |
| crs           | Integer   | Crosses                                                                                            |
| intercept     | Integer   | Interceptions (renamed from 'int' as more descriptive alias)                                       |
| tklw          | Integer   | Number of tackles won                                                                              |
| pkwon         | Integer   | Number of PKs won                                                                                  |
| pkcon         | Integer   | Number of PKs conceded                                                                             |
| og            | Integer   | Number of own goals scored                                                                         |
| recov         | Integer   | Number of recoveries                                                                               |
| won           | Integer   | Number of aerial duels won (renamed from 'won' as more descriptive alias)                          |
| lost          | Integer   | Number of aerial duels lost (renamed from 'lost' as more descriptive alias)                        |
| load_datetime | Timestamp | Load timestamp with time zone (added for tracking data reliability and ETL performance monitoring) |

`stg_FBref_mls_players_all_stats_misc` - The **staging table** receives all data transformed to correct datatypes, calculates and adds columns for _aerial_duels_total_ (sum of all duels) and _aerial_duels_won_pct_ (duels won realized as a percentage), as well as updates some column names (indicated by a _italicized column name_ below) to be more descriptive in the context of the mls_stats database (i.e. primarily to prevent confusion between player and team stats).

| Column Name          | Data Type | Description                                                                                    |
| -------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| season               | Integer   | Year of Season                                                                                 |
| _player_name_        | Text      | Player's name                                                                                  |
| _player_nationality_ | Text      | Player's nationality                                                                           |
| _position_           | Text      | Player's position                                                                              |
| squad                | Text      | Player's team                                                                                  |
| _player_age_         | Integer   | Player's age at start of season                                                                |
| _player_yob_         | Text      | Player's year of birth                                                                         |
| nineties             | Real      | Minutes played ÷ 90                                                                            |
| _yellow_cards1_      | Integer   | Yellow cards                                                                                   |
| _red_cards_          | Integer   | Red cards                                                                                      |
| _yellow_cards2_      | Integer   | Second yellow cards                                                                            |
| _fouls_committed_    | Integer   | Fouls committed                                                                                |
| _fouls_drawn_        | Integer   | Fouls drawn                                                                                    |
| _offside_            | Integer   | Offside                                                                                        |
| _crosses_            | Integer   | Crosses                                                                                        |
| _interceptions_      | Integer   | Interceptions                                                                                  |
| _tackles_won_        | Integer   | Number of tackles won                                                                          |
| _pks_won_            | Integer   | Number of PKs won                                                                              |
| _pks_con_            | Integer   | Number of PKs conceded                                                                         |
| _own_goals_          | Integer   | Number of own goals scored                                                                     |
| _recoveries_         | Integer   | Number of recoveries                                                                           |
| _aerial_duels_won_   | Integer   | Number of aerial duels won                                                                     |
| _aerial_duels_lost_  | Integer   | Number of aerial duels lost                                                                    |
| aerial_duels_total   | Integer   | Total aerial duels (sum of all duels)                                                          |
| aerial_duels_won_pct | Real      | Percent of aerial duels won (duels as percentage)                                              |
| load_datetime        | Timestamp | Load timestamp with time zone (continued tracking of data reliability and ETL pipeline health) |

`schmetzer_scores_{season}` and `schmetzer_scores_all` - serve as the final destination tables, including point tabulations attributed to each individual statistic as well as the composite metric as scored and ranked by the custom algorithim, ready for reporting and visualization.

| Column Name          | Data Type | Description                                                                                    |
| -------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| season               | Integer   | Year of Season                                                                                 |
| player_name          | Text      | Player's name                                                                                  |
| player_nationality   | Text      | Player's nationality                                                                           |
| position             | Text      | Player's position                                                                              |
| squad                | Text      | Player's team                                                                                  |
| player_age           | Integer   | Player's age at start of season                                                                |
| player_yob           | Text      | Player's year of birth                                                                         |
| nineties             | Real      | Minutes played ÷ 90                                                                            |
| yellow_cards1        | Integer   | Yellow cards                                                                                   |
| red_cards            | Integer   | Red cards                                                                                      |
| yellow_cards2        | Integer   | Second yellow cards                                                                            |
| fouls_committed      | Integer   | Fouls committed                                                                                |
| fouls_drawn          | Integer   | Fouls drawn                                                                                    |
| offside              | Integer   | Offside                                                                                        |
| crosses              | Integer   | Crosses                                                                                        |
| interceptions        | Integer   | Interceptions                                                                                  |
| tackles_won          | Integer   | Number of tackles won                                                                          |
| pks_won              | Integer   | Number of PKs won                                                                              |
| pks_con              | Integer   | Number of PKs conceded                                                                         |
| own_goals            | Integer   | Number of own goals scored                                                                     |
| recoveries           | Integer   | Number of recoveries                                                                           |
| aerial_duels_won     | Integer   | Number of aerial duels won                                                                     |
| aerial_duels_lost    | Integer   | Number of aerial duels lost                                                                    |
| aerial_duels_total   | Integer   | Total aerial duels (sum of all duels)                                                          |
| aerial_duels_won_pct | Real      | Percent of aerial duels won (duels as percentage)                                              |
| load_datetime        | Timestamp | Load timestamp with time zone (continued tracking of data reliability and ETL pipeline health) |

### Data Flow Process & ETL Pipeline Development

All pipelines are contained within the [app-duels-mapping/public/data/etl](etl/) directory.
