import fs from "fs";
import path from "path";

function getDefaultSchmetzerScoreConfig(verbose = 1) {
  // Read and parse data_vars JSON
  const jsonPath = path.join(
    process.cwd(),
    "app-duels-mapping/public/data/data_vars.json"
  );

  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const jsonData = JSON.parse(rawData);
  const pointsData = jsonData.schmetzer_score_points;

  // Extract and map stat and point values
  const defaultConfig = {};
  for (const key in pointsData) {
    defaultConfig[key] = pointsData[key].point_value;
  }
  if (verbose >= 2) console.log(defaultConfig);

  return defaultConfig;
}

const defaultSchmetzerScoreConfig = getDefaultSchmetzerScoreConfig();

/*
The helper function below allows for fine tuning of the Schmetzer Score. Two arguments are accepted: newConfig and playerData.

The newConfig variable should be an object with the values that are sent from the fine tuning controls. For example:
const newConfig = {
  "aerial duels won": 3,
  "aerial duels lost": 0,
  "tackles won": 2,
  interceptions: 1,
  recoveries: 0,
};
Note: The newConfig variable is optional. If you don't pass a newConfig value to function, the default values in data_vars.json are used. 

The playerData variable should be similar but include the player_name and the player's raw stats. For example:
const playerData = {
  player_name: "Yeimar Gómez Andrade",
  aerial_duels_won: 25,
  aerial_duels_lost: 16,
  tackles_won: 24,
  interceptions: 20,
  recoveries: 68,
};

The return will be an object with two key-value-pairs: player_name and newScore. For example:
{ player_name: 'Yeimar Gómez Andrade', newScore: 143 }
*/

export async function tuneSchmetzerScore(
  newConfig = defaultSchmetzerScoreConfig,
  playerData,
  verbose = 1
) {
  let newScore = 0;

  for (const stat in newConfig) {
    const normalizedKey = stat.replace(/ /g, "_");
    const statValue = playerData[normalizedKey] || 0;
    const weight = newConfig[stat];
    newScore += statValue * weight;
  }

  const newPlayerScore = {
    player_name: playerData.player_name,
    newScore: newScore,
  };

  if (verbose >= 1) console.log(`New player Schmetzer Score:`, newPlayerScore);

  return newPlayerScore;
}
