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

// // // // //

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
