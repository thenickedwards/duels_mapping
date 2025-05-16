# duels_mapping

Welcome to duels*mapping, a code repository which supports a new composite sports statistic: **`Contested Possession Metric`**. A method for rating a player's ability to win aerial duels and tackles as well as force interceptions and secure recoveries--which effectively tells us about a player's ability to win and keep possession. Since `Contested Possession Metric` is a bit of a mouthful, we've dubbed it the `Schmetzer Score`. As a Sounders supporter, I've watched many press conferences where Coach Schmetzer will tap his pen on the table and reference his preferred statistic: \_duels won*. In an effort to create a fuller picture, I have combined aerial duels won as well as aerial duels lost, tackles won, interceptions, and recoveries into a custom algorithm to measure this skill by player, team, and across the league.

Currently the source data set is from [FBref](https://fbref.com/en/). These [amazing folks](https://www.sports-reference.com/about.html) are doing God's work, making sports data publicly available.

<!-- REVISE -->

A data environment designed to extract statistics and rate MLS players based on aerial dules won/lost, tackles won, interceptions, and recoveries

## Duels Map AKA The Schmetzer Score

On many pen-tapping occasions, Coach Schmetzer will note in interviews one of his preferred metrics to evaluate the performance of a player and the team is duels. In an effort to create a `Schmetzer Score` rating, I have combined aerial dules won as well as aerial dueles lost, tackles won, interceptions, and recoveries into a custom algorithm to measure this contirbution per player, by team, and across the league.

<!-- ??? should this be a dim table? -->

| Stat              | Point Value | Description   |
| ----------------- | ----------- | ------------- |
| aerial duels won  | 1           | duels won     |
| aerial duels lost | -0.75       | duels lost    |
| tackles won       | 1           | tackles won   |
| interceptions     | .75         | interceptions |
| recoveries        | .5          | recoveries    |

### Schema, Tables & Data Workflow

`raw_FBref_mls_players_all_stats_misc` - **raw table**, to load data direct from source, partitioned by season???. To keep storage to a minimum this table is cleared once inserted into the staging table.

| Column Name   | Data Type | Description                    |
| ------------- | --------- | ------------------------------ |
| season        | Integer   | Year of season                 |
| player        | Text      | Player's name                  |
| nation        | Text      | Player's nationality           |
| pos           | Text      | Player's position              |
| squad         | Text      | Player's team                  |
| age           | Text      | Player's age (start of season) |
| born          | Text      | Player's year of birth         |
| nineties      | Real      | Minutes played ÷ 90            |
| crdy          | Integer   | Yellow cards                   |
| crdr          | Integer   | Red cards                      |
| second_crdy   | Integer   | Second yellow cards            |
| fls           | Integer   | Fouls committed                |
| fld           | Integer   | Fouls drawn                    |
| off           | Integer   | Offside                        |
| crs           | Integer   | Crosses                        |
| intercept     | Integer   | Interceptions                  |
| tklw          | Integer   | Number of tackles won          |
| pkwon         | Integer   | Number of PKs won              |
| pkcon         | Integer   | Number of PKs conceded         |
| og            | Integer   | Number of own goals scored     |
| recov         | Integer   | Number of recoveries           |
| won           | Integer   | Number of aerial duels won     |
| lost          | Integer   | Number of aerial duels lost    |
| load_datetime | Timestamp | Load timestamp with time zone  |

`stg_FBref_mls_players_all_stats_misc` - **staging table**, transformed to correct datatypes, added duels total, duels pct; partitioned by season???

| Column Name          | Data Type | Description                    |
| -------------------- | --------- | ------------------------------ |
| season               | Integer   | Year of Season                 |
| player_name          | Text      | Player's name                  |
| player_nationality   | Text      | Player's nationality           |
| position             | Text      | Player's position              |
| squad                | Text      | Player's team                  |
| player_age           | Text      | Player's age (start of season) |
| player_yob           | Text      | Player's year of birth         |
| nineties             | Real      | Minutes played ÷ 90            |
| yellow_cards1        | Integer   | Yellow cards                   |
| red_cards            | Integer   | Red cards                      |
| yellow_cards2        | Integer   | Second yellow cards            |
| fouls_committed      | Integer   | Fouls committed                |
| fouls_drawn          | Integer   | Fouls drawn                    |
| offside              | Integer   | Offside                        |
| crosses              | Integer   | Crosses                        |
| interceptions        | Integer   | Interceptions                  |
| tackles_won          | Integer   | Number of tackles won          |
| pks_won              | Integer   | Number of PKs won              |
| pks_con              | Integer   | Number of PKs conceded         |
| own_goals            | Integer   | Number of own goals scored     |
| recoveries           | Integer   | Number of recoveries           |
| aerial_duels_won     | Integer   | Number of aerial duels won     |
| aerial_duels_lost    | Integer   | Number of aerial duels lost    |
| aerial_duels_total   | Integer   | Total aerial duels             |
| aerial_duels_won_pct | Real      | Percent of aerial duels won    |
| load_datetime        | Timestamp | Load timestamp with time zone  |

`vw_duels_map_{{season}}` - **view**, players ranked via custom algorithm evalutating tackles won, recoveries, aerial dules won/lost

<!-- DO WE NEED SEASON? -->

| Column Name          | Data Type | Description                            |
| -------------------- | --------- | -------------------------------------- |
| season               | Integer   | Season as year                         |
| player_name          | String    | Player's name                          |
| position             | String    | Player's position                      |
| squad                | String    | Player's team                          |
| player_age           | Integer   | Player's age in years                  |
| 90s                  | Decimal   | Minutes played ÷ 90                    |
| schmetzer_score      | Integer   | Player's score per Duels Map algorithm |
| interceptions        | Integer   | Interceptions                          |
| tackles_won          | Integer   | Number of tackles won                  |
| recoveries           | Integer   | Number of recoveries                   |
| aerial_duels_won     | Integer   | Number of aerial duels won             |
| aerial_duels_lost    | Integer   | Number of aerial duels lost            |
| aerial_duels_won_pct | Decimal   | Percent of aerial duels won            |
