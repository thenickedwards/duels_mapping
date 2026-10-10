import playerHeadshots from "./dv_mls_player_headshots.json" with { type: "json" };
import { getPlayerPic as scrapePlayerPic } from "./get-player-pics2.js";

const MLS_IMG_BASE = "https://images.mlssoccer.com/image/private";

/*
The helper function below retrieves a player's MLS headshot without scraping. dv_mls_player_headshots.json maps each player's name (with accent marks, diacritics, and any other special characters, as stored in the DB) to their MLS image ID, sourced from the MLS content API (dapi.mlssoccer.com/v2/content/en-us/players, the thumbnail's templateUrl). The image URLs are built from that ID, so no request is made.

Players missing from the JSON (e.g. new signings) fall back to scraping their profile page via get-player-pics2.

The return will be an object with two key-value-pairs: imgThumbUrl and imgDesktopUrl.
*/

export async function getPlayerPic(playerName, verbose = 0) {
  const imgId = playerHeadshots[playerName];

  if (!imgId) {
    if (verbose >= 1)
      console.log(`No stored headshot for ${playerName}, scraping...`);
    return scrapePlayerPic(playerName, verbose);
  }

  const imgThumbUrl = `${MLS_IMG_BASE}/t_thumb_squared/f_png/${imgId}.png`;
  const imgDesktopUrl = `${MLS_IMG_BASE}/t_editorial_squared_6_desktop_2x/f_png/${imgId}.png`;

  if (verbose >= 2)
    console.log({ imgThumbUrl: imgThumbUrl, imgDesktopUrl: imgDesktopUrl });

  return { imgThumbUrl: imgThumbUrl, imgDesktopUrl: imgDesktopUrl };
}
