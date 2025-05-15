# duels_mapping Data Environment

### tl;dr

This data environment powers the custom **Schmetzer Score** composite statistic for MLS players by transforming raw FBref data through a lightweight, extensible SQLite-based ETL pipeline primarily using Python. It is designed for modularity, transparency, and future growth in advanced sports metrics.

## Overview

Welcome to the duels_mapping Data Environment! Within the [app-duels-mapping/public/data](./) directory is the SQLite database which serves as a data warehouse, ETL pipelines for sourcing and delivery of statistics, and the SQL scripts that set up the data environment, ingest and transform data, and generate the statistics consumed by the Next.js frontend dashboard which rates MLS players based on aerial duels won vs lost, tackles won, interceptions, and recoveries.

If you're this deep in the project, you're my kind of people ⚽️

### Double Pivot (Recurring Data Drivers)

As you may have guessed football tactics have been a major driver in this project and in fact part of the architecture was lifted right off the pitch. In soccer, a double pivot refers to a pairing central defensive midfielders who play a key role to both defense and offense--winning possession, progressing the ball up the field, and providing tactical versatility. Similarly, there are two core “pivot” components in the design of this architecture that orchestrate the flow of data.

1. [`data_vars.json`](./data_vars.json)  
   This JSON file stores the values used to calculate the Schmetzer Score metric. The stats can be weighted differently to allow flexible experimentation and tuning of how each individual statistic influences the overall score. This access point supports extension to include more data sources, additional ETL pipelines, and the creation of new composite metrics built off other advanced sports statistics.

2. [`DataHandler`](./etl/data_handler.py)

   This class handles and executes the ETL workflow, including extracting, parsing, loading, and transforming the data. Inspired by Apache Airflow DAGs, its modular methods make it easy to plug in additional pipelines and customize workflows.

### Flow of Data

Raw Data (CSV or web) 📒

↓

Python ETL Pipeline Scripts 🪠

↓

`raw_FBref_mls_players_all_stats_misc` 🥩

↓

`stg_FBref_mls_players_all_stats_misc`

↓

Schmetzer Score Algorithm Logic 🧮

↓

`schmetzer_scores_{season}` AND `schmetzer_scores_all` 📊

↓

Next.js Frontend Dashboard 💫

### Data Modeling & ETL Pipeline Development

All tables are created using the SQL in the [app-duels-mapping/public/data/etl/sql/create](./etl/sql/create) directory. For simplicity, readability, extensibility the filename matches the name of the table.

`dim_schmetzer_score_points` - This is the only **dim table** leveraged by the Schmetzer Score metric. While the values are static as seen below, they are controlled by the aforementioned [data_vars.json](./data_vars.json) and are inserted using Python subsequent to all table creation. Below is the table in full for visibility into individual stat values and because it's a pretty small table 🙃

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
| duels_won     | Integer   | Number of aerial duels won (renamed from 'won' as more descriptive alias)                          |
| duels_lost    | Integer   | Number of aerial duels lost (renamed from 'lost' as more descriptive alias)                        |
| load_datetime | Timestamp | Load timestamp with time zone (added for tracking data reliability and ETL performance monitoring) |

`stg_FBref_mls_players_all_stats_misc` - The **staging table** receives all data transformed to correct data types, calculates and adds columns for _aerial_duels_total_ (sum of all duels) and _aerial_duels_won_pct_ (duels won realized as a percentage), as well as updates some column names (indicated by a _italicized column name_ below) to be more descriptive in the context of the mls_stats database (i.e. primarily to prevent confusion between player and team stats).

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

`schmetzer_scores_{season}` and `schmetzer_scores_all` - serve as the final destination tables, including point tabulations attributed to each individual statistic as well as the composite metric as scored and ranked by the custom algorithm, ready for reporting and visualization.

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

All pipelines are contained within the [app-duels-mapping/public/data/etl](etl/) directory. Again, this architecture supports for extendibility, allowing for the the buildout of additional pipelines, expansion of the project to include other leagues, and development of new composite metrics. The order of the tables as listed above documents the process and flow of the data.

### File Structure & Directory Layout

Below is an outline of the data environment. Initially, this project's goal was a functional data platform for ingesting, processing, and delivering insights on player and team data. Essentially, that is everything contained within the [data](./) directory. As such, this data architecture could be used as a framework for other projects.

```bash
/app-duels-mapping/public/data/
├── database
    └── mls_stats.db                # SQLite database
├── data_vars.json                  # Config which controls algorithm scoring weights and stores data sources and destination tables
├── etl/
    ├── data_handler.py             # Primary ETL orchestration class
    ├── dependencies/               # Modular functions to support ETL
    ├── pipeline_cur_FBref_misc_stats_to_schmetzer_scores_players.py    # Pipeline runner script to update current season data
    ├── pipeline_hist_FBref_misc_stats_to_schmetzer_scores_players.py   # Pipeline runner script for all current and historical data
    └── sql/
        ├── create/                 # CREATE TABLE scripts (one per table)
        ├── transform/              # INSERT scripts for transformation (as needed)
        ├── z_schmetzer_scores/     # SQL scripts specific to loading tables with final statistical data for Schmetzer Scores
└── README.md                       # ← You are here
```

For programmatic use as well as readability, a number of naming conventions have been employed.

- **Pipelines**
  - Filenames for full pipelines follow a particular procedure for identifation
  - All filenames for pipelines begin with `pipeline_...`
  - `pipeline_cur_...` indicates a pipeline to update a current season of data
  - `pipeline_hist_...` indicates a pipeline to backfill historical seasons of data
  - This is followed by the data source, the word `to`, and then the destination
  - Lastly the filename includes the primary subject of the data (e.g. `players`, `teams`, etc.)
  - Examples:
    - `pipeline_hist_source_to_destination_subject`
    - `pipeline_hist_opta_to_superduperrankings_teams`
    - `pipeline_hist_FBref_misc_stats_to_schmetzer_scores_players.py`
- **Functions**
  - Loading functions begin with `insert_...`, followed by the name of the table
  - The word `historical` or `current` may be infixed between the two above when appropriate
  - Examples
    - `insert_dim_schmetzer_score_points`
    - `insert_historical_raw_FBref_mls_players_all_stats_misc`
    - `insert_stg_FBref_mls_players_all_stats_misc`
- **SQL Directory**
  - `create/` includes all CREATE TABLE SQL statements
  - `transform/` includes non-stat-specific transformations (e.g. inserting to a staging table from raw)
  - `z_name_of_stat` specific stat transformations and table loading are stored in the directory of the name of the stat with the prefix `z_...`

### Installation & Setup

Run the bash script at the root.

<!-- TODO: ADD MORE HERE 👇 -->

### Future Development

The source data set only includes league games for Major League Soccer, however most MLS teams are playing in multiple competitions (US Open Cup, Canadian Championship, Concacaf Champions Cup/League, Club World Cup, Leagues Cup, etc.) Ideally we could include game actions from all matches, regardless of the competition.

As previously mentioned, the architecture of this data platform was designed with an eye toward future development and could be implemented for any league, team, or individual player. So long as the data is available, the data flow can be refactored following the nomenclature above.

One possible avenue for future development could be creating a set of composite stats that also group and weight like statistics or stats that can be combined to target specific game actions, tactics, or game strategy. For example, a defensive contribution rating, chance creation rating, set piece efficiency, etc. Altogether these composite statistics can give us insights about how players can utilized in various roles and targeted match-ups.
