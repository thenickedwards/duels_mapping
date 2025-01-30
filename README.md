# duels_mapping

A data environment designed to extract statistics and rate MLS players based on aerial dules won/lost, tackles won, interceptions, and recoveries

## Duels Map

On many pen-tapping occasions, Coach Schmetzer will note in interviews one of his preferred metrics to evaluate the performance of a player and the team is duels. In an effort to create a `Schmetzer Score` rating, I have combined aerial dules won as well as aerial dueles lost, tackles won, interceptions, and recoveries into a custom algorithm to measure this contirbution per player, by team, and across the league.

| Stat              | Point Value | Description   |
| ----------------- | ----------- | ------------- |
| aerial duels won  | 1           | duels won     |
| aerial duels lost | -0.75       | duels lost    |
| tackles won       | 1           | tackles won   |
| interceptions     | .75         | interceptions |
| recoveries        | .5          | recoveries    |

### Schema, Tables & Data Workflow

`raw_fbref_mls_players_all_stats_misc` - **raw table**, to load data direct from source, partitioned by season???. To keep storage to a minimum this table is cleared once inserted into the staging table.

| Column Name           | Data Type | Description                    |
| --------------------- | --------- | ------------------------------ |
| load_datetime         | Timestamp | Load timestamp with time zone  |
| player\_\_name        | String    | Player's name                  |
| player\_\_nationality | String    | Player's nationality           |
| position              | String    | Player's position              |
| squad                 | String    | Player's team                  |
| player_age            | String    | Player's age (start of season) |
| player_yob            | Integer   | Player's year of birth         |
| 90s                   | Decimal   | Minutes played ÷ 90            |
| yellow_cards1         | Integer   | Yellow cards                   |
| red_cards             | Integer   | Red cards                      |
| yellow_cards2         | Integer   | Second yellow cards            |
| fouls_committed       | Integer   | Fouls committed                |
| fouls_drawn           | Integer   | Fouls drawn                    |
| offside               | Integer   | Offside                        |
| crosses               | Integer   | Crosses                        |
| interceptions         | Integer   | Interceptions                  |
| tackles_won           | Integer   | Number of tackles won          |
| pks_won               | Integer   | Number of PKs won              |
| pks_con               | Integer   | Number of PKs conceded         |
| own_goals             | Integer   | Number of own goals scored     |
| recoveries            | Integer   | Number of recoveries           |
| aerial_duels_won      | Integer   | Number of aerial duels won     |
| aerial_duels_lost     | Integer   | Number of aerial duels lost    |
| aerial_duels_won_pct  | Decimal   | Percent of aerial duels won    |

`stg_fbref_mls_players_all_stats_misc` - **staging table**, transformed to correct datatypes, partitioned by season???

| Column Name           | Data Type | Description                    |
| --------------------- | --------- | ------------------------------ |
| load_datetime         | Timestamp | Load timestamp with time zone  |
| player\_\_name        | String    | Player's name                  |
| player\_\_nationality | String    | Player's nationality           |
| position              | String    | Player's position              |
| squad                 | String    | Player's team                  |
| player_age            | String    | Player's age (start of season) |
| player_yob            | Integer   | Player's year of birth         |
| 90s                   | Decimal   | Minutes played ÷ 90            |
| yellow_cards1         | Integer   | Yellow cards                   |
| red_cards             | Integer   | Red cards                      |
| yellow_cards2         | Integer   | Second yellow cards            |
| fouls_committed       | Integer   | Fouls committed                |
| fouls_drawn           | Integer   | Fouls drawn                    |
| offside               | Integer   | Offside                        |
| crosses               | Integer   | Crosses                        |
| interceptions         | Integer   | Interceptions                  |
| tackles_won           | Integer   | Number of tackles won          |
| pks_won               | Integer   | Number of PKs won              |
| pks_con               | Integer   | Number of PKs conceded         |
| own_goals             | Integer   | Number of own goals scored     |
| recoveries            | Integer   | Number of recoveries           |
| aerial_duels_won      | Integer   | Number of aerial duels won     |
| aerial_duels_lost     | Integer   | Number of aerial duels lost    |
| aerial_duels_won_pct  | Decimal   | Percent of aerial duels won    |

`vw_duels_map` - **view**, players ranked via custom algorithm evalutating tackles won, recoveries, aerial dules won/lost

| Column Name          | Data Type | Description                           |
| -------------------- | --------- | ------------------------------------- |
| rk                   | Integer   | Player's rank per Duels Map algorithm |
| player\_\_name       | String    | Player's name                         |
| position             | String    | Player's position                     |
| squad                | String    | Player's team                         |
| player_age           | Integer   | Player's age in years                 |
| 90s                  | Decimal   | Minutes played ÷ 90                   |
| interceptions        | Integer   | Interceptions                         |
| tackles_won          | Integer   | Number of tackles won                 |
| recoveries           | Integer   | Number of recoveries                  |
| aerial_duels_won     | Integer   | Number of aerial duels won            |
| aerial_duels_lost    | Integer   | Number of aerial duels lost           |
| aerial_duels_won_pct | Decimal   | Percent of aerial duels won           |
