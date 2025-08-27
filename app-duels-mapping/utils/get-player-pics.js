import * as cheerio from "cheerio";

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeName(str) {
  return removeAccents(str) // strip accents/diacritics
    .toLowerCase() // lowercase
    .replace(/\s+/g, ""); // remove all spaces
}

/*
The helper function below retrieves a player's MLS headshot. One argument is required which is the player's name and this value should be passed with accent marks, diacritics, and any other special characters. While the URL requires special characters to be removed, parsing the HTML requires special characters to be maintained.

The return will be an object with two key-value-pairs: imgThumbUrl and imgDesktopUrl.
*/

export async function getPlayerPic(playerName, verbose = 1) {
  const playerNameSimple = removeAccents(playerName);
  const playerNameUrl = playerNameSimple.toLowerCase().replace(/\s/g, "-");
  const playerUrl = `https://www.mlssoccer.com/players/${playerNameUrl}/`;
  if (verbose >= 1) console.log(`Getting player headshot of ${playerName}...`);
  if (verbose >= 2) console.log(`Sourcing picture from ${playerUrl}`);

  // const $ = await cheerio.fromURL(testUrl);

  //Fetch HTML manually
  let html;
  try {
    const res = await fetch(playerUrl);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} (${res.statusText})`);
    }

    html = await res.text();
  } catch (err) {
    console.error(`Failed to fetch ${playerUrl}:`, err.message);
    return { imgThumbUrl: null, imgDesktopUrl: null };
  }

  // Load HTML using cheerio
  const $ = cheerio.load(html);

  // FIRST PASS
  // const imgUrl1 = $.extract({
  //   imgs: [
  //     {
  //       selector: "img",
  //       value: (el, key) => {
  //         const src = $(el).attr("src");
  //         if ($(el).attr("alt") === playerNameSimple) {
  //           return src;
  //         }
  //       },
  //     },
  //   ],
  // });
  // console.log(imgUrl1);

  // REVISED, SIMPLIFIED
  // First attempt: exact match with original name
  let imgThumbUrl = $("img")
    .filter((_, el) => $(el).attr("alt") === playerName)
    .attr("src");

  // If not found, try normalized match
  if (!imgThumbUrl) {
    const targetName = normalizeName(playerName);
    imgThumbUrl = $("img")
      .filter((_, el) => {
        const alt = $(el).attr("alt");
        return alt && normalizeName(alt) === targetName;
      })
      .attr("src");
  }

  const imgDesktopUrl = imgThumbUrl?.replace(
    "t_thumb_squared",
    "t_editorial_squared_6_desktop_2x"
  );

  if (verbose >= 2)
    console.log({ imgThumbUrl: imgThumbUrl, imgDesktopUrl: imgDesktopUrl });

  return { imgThumbUrl: imgThumbUrl, imgDesktopUrl: imgDesktopUrl };
}
