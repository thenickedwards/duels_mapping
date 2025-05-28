import * as cheerio from "cheerio";

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function getPlayerPic(playerName, verbose = 1) {
  const playerNameSimple = removeAccents(playerName);
  const playerNameUrl = playerNameSimple.toLowerCase().replace(/\s/g, "-");
  const playerUrl = `https://www.mlssoccer.com/players/${playerNameUrl}/`;
  if (verbose >= 1) console.log(`Getting player headshot of ${playerName}...`);
  if (verbose >= 2) console.log(`Sourcing picture from ${playerUrl}`);

  const $ = await cheerio.fromURL(testUrl);

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
  const imgThumbUrl = $("img")
    .filter((_, el) => $(el).attr("alt") === playerName)
    .attr("src");

  const imgDesktopUrl = imgThumbUrl.replace(
    "t_thumb_squared",
    "t_editorial_squared_6_desktop_2x"
  );

  if (verbose >= 2)
    console.log({ imgThumbUrl: imgThumbUrl, imgDesktopUrl: imgDesktopUrl });

  return { imgThumbUrl: imgThumbUrl, imgDesktopUrl: imgDesktopUrl };
}
