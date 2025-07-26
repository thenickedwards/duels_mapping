import { column, Schema, Table } from "@powersync/web";
// OR: import { column, Schema, Table } from '@powersync/react-native';

const schmetzer_scores_all = new Table(
  {
    // id column (text) is automatically included
    player_name: column.text,
    player_nationality: column.text,
    position: column.text,
    squad: column.text,
    player_age: column.integer,
    player_yob: column.integer,
    nineties: column.real,
    schmetzer_score: column.real,
    schmetzer_rk: column.integer,
    aerial_duels_won: column.integer,
    aerial_duels_lost: column.integer,
    aerial_duels_total: column.integer,
    aerial_duels_won_pct: column.real,
    tackles_won: column.integer,
    interceptions: column.integer,
    recoveries: column.integer,
  },
  { indexes: {} }
);

const schmetzer_scores_2018 = new Table(
  {
    // id column (text) is automatically included
    player_name: column.text,
    player_nationality: column.text,
    position: column.text,
    squad: column.text,
    player_age: column.integer,
    player_yob: column.integer,
    nineties: column.real,
    schmetzer_score: column.real,
    schmetzer_rk: column.integer,
    aerial_duels_won: column.integer,
    aerial_duels_lost: column.integer,
    aerial_duels_total: column.integer,
    aerial_duels_won_pct: column.real,
    tackles_won: column.integer,
    interceptions: column.integer,
    recoveries: column.integer,
  },
  { indexes: {} }
);

const schmetzer_scores_2019 = new Table(
  {
    // id column (text) is automatically included
    player_name: column.text,
    player_nationality: column.text,
    position: column.text,
    squad: column.text,
    player_age: column.integer,
    player_yob: column.integer,
    nineties: column.real,
    schmetzer_score: column.real,
    schmetzer_rk: column.integer,
    aerial_duels_won: column.integer,
    aerial_duels_lost: column.integer,
    aerial_duels_total: column.integer,
    aerial_duels_won_pct: column.real,
    tackles_won: column.integer,
    interceptions: column.integer,
    recoveries: column.integer,
  },
  { indexes: {} }
);

const schmetzer_scores_2020 = new Table(
  {
    // id column (text) is automatically included
    player_name: column.text,
    player_nationality: column.text,
    position: column.text,
    squad: column.text,
    player_age: column.integer,
    player_yob: column.integer,
    nineties: column.real,
    schmetzer_score: column.real,
    schmetzer_rk: column.integer,
    aerial_duels_won: column.integer,
    aerial_duels_lost: column.integer,
    aerial_duels_total: column.integer,
    aerial_duels_won_pct: column.real,
    tackles_won: column.integer,
    interceptions: column.integer,
    recoveries: column.integer,
  },
  { indexes: {} }
);

const schmetzer_scores_2021 = new Table(
  {
    // id column (text) is automatically included
    player_name: column.text,
    player_nationality: column.text,
    position: column.text,
    squad: column.text,
    player_age: column.integer,
    player_yob: column.integer,
    nineties: column.real,
    schmetzer_score: column.real,
    schmetzer_rk: column.integer,
    aerial_duels_won: column.integer,
    aerial_duels_lost: column.integer,
    aerial_duels_total: column.integer,
    aerial_duels_won_pct: column.real,
    tackles_won: column.integer,
    interceptions: column.integer,
    recoveries: column.integer,
  },
  { indexes: {} }
);

const schmetzer_scores_2022 = new Table(
  {
    // id column (text) is automatically included
    player_name: column.text,
    player_nationality: column.text,
    position: column.text,
    squad: column.text,
    player_age: column.integer,
    player_yob: column.integer,
    nineties: column.real,
    schmetzer_score: column.real,
    schmetzer_rk: column.integer,
    aerial_duels_won: column.integer,
    aerial_duels_lost: column.integer,
    aerial_duels_total: column.integer,
    aerial_duels_won_pct: column.real,
    tackles_won: column.integer,
    interceptions: column.integer,
    recoveries: column.integer,
  },
  { indexes: {} }
);

const schmetzer_scores_2023 = new Table(
  {
    // id column (text) is automatically included
    player_name: column.text,
    player_nationality: column.text,
    position: column.text,
    squad: column.text,
    player_age: column.integer,
    player_yob: column.integer,
    nineties: column.real,
    schmetzer_score: column.real,
    schmetzer_rk: column.integer,
    aerial_duels_won: column.integer,
    aerial_duels_lost: column.integer,
    aerial_duels_total: column.integer,
    aerial_duels_won_pct: column.real,
    tackles_won: column.integer,
    interceptions: column.integer,
    recoveries: column.integer,
  },
  { indexes: {} }
);

const schmetzer_scores_2024 = new Table(
  {
    // id column (text) is automatically included
    player_name: column.text,
    player_nationality: column.text,
    position: column.text,
    squad: column.text,
    player_age: column.integer,
    player_yob: column.integer,
    nineties: column.real,
    schmetzer_score: column.real,
    schmetzer_rk: column.integer,
    aerial_duels_won: column.integer,
    aerial_duels_lost: column.integer,
    aerial_duels_total: column.integer,
    aerial_duels_won_pct: column.real,
    tackles_won: column.integer,
    interceptions: column.integer,
    recoveries: column.integer,
  },
  { indexes: {} }
);

const schmetzer_scores_2025 = new Table(
  {
    // id column (text) is automatically included
    player_name: column.text,
    player_nationality: column.text,
    position: column.text,
    squad: column.text,
    player_age: column.integer,
    player_yob: column.integer,
    nineties: column.real,
    schmetzer_score: column.real,
    schmetzer_rk: column.integer,
    aerial_duels_won: column.integer,
    aerial_duels_lost: column.integer,
    aerial_duels_total: column.integer,
    aerial_duels_won_pct: column.real,
    tackles_won: column.integer,
    interceptions: column.integer,
    recoveries: column.integer,
  },
  { indexes: {} }
);

export const AppSchema = new Schema({
  schmetzer_scores_all,
  schmetzer_scores_2018,
  schmetzer_scores_2019,
  schmetzer_scores_2020,
  schmetzer_scores_2021,
  schmetzer_scores_2022,
  schmetzer_scores_2023,
  schmetzer_scores_2024,
  schmetzer_scores_2025,
});
