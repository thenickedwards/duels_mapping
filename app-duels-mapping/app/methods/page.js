"use client";
import Link from "next/link";
import { Container, Typography, Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function MethodsPage() {
  const theme = useTheme();
  const dividerColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const rectColor = theme.palette.mode === "dark" ? "#3B5B84" : "#B7F08E";

  return (
    <main style={{ padding: "2rem" }}>
      {/* Methods Page */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
            position: "relative",
          }}
        >
          {/* Background Rectangle */}
          <Box
            sx={{
              position: "absolute",
              height: "40px",
              width: "150px",
              top: "50%",
              left: "30px",
              transform: "translateY(-50%)",
              backgroundColor: rectColor,
              zIndex: 0,
            }}
          />
          {/* Content */}
          <Typography
            variant="h1"
            fontSize="1.5rem"
            whiteSpace="nowrap"
            sx={{ position: "relative", zIndex: 1 }}
          >
            Methods
          </Typography>
          <Divider
            sx={{
              flexGrow: 1,
              borderBottom: `1px solid ${dividerColor}`,
              position: "relative",
              zIndex: 1,
            }}
          />
        </Box>
      </Box>
      <Container maxWidth="md">
        <Box my={"60px"} sx={{ "& > *:not(:last-child)": { mb: 2 } }}>
          <Typography variant="body1">
            Our goal with this project was to develop a{" "}
            <span style={{ fontStyle: "italic" }}>
              “Contested Possession Metric”
            </span>{" "}
            — a composite statistic designed to reflect a player&apos;s in-game
            contributions that either create turnovers or secure possession.
          </Typography>
          <Typography variant="body1">
            In homage to club legend Brian Schmetzer, we started with a stat he
            frequently emphasizes: duels won. An aerial duel is defined as a
            challenge between two players to gain control of the ball above
            elbow height (typically with the head). We assigned the value for an
            aerial duel won at +1.
          </Typography>
          <Typography variant="body1">
            A tackle in soccer represents when a player challenges their
            opponent with their feet for a ball on the ground (or at least below
            the elbow), a game event markedly similar to an aerial duel won and
            often yielding the same results. As such, we also valued tackles won
            at +1.
          </Typography>
          <Typography variant="body1">
            To account for aerial duels lost we assigned a value of -0.75. This
            weighting ensures that an aerial duel lost does not fully offset an
            aerial duel won. Players with a 50/50 split are effectively credited
            for actively contesting possession, even when they don&apos;t win
            the ball. (Unfortunately, tackles lost are unfortunately not
            available in the source data. More in for below.)
          </Typography>
          <Typography variant="body1">
            After aerial duels and tackles won, the next most valued statistic
            for this metric is interceptions. An interception occurs when a
            player gains possession of the ball after an opponent passes,
            crosses, or shoots before the ball can reach the intended target.
            While this game event is not a result of a direct physical challenge
            for the ball, the player creates a turnover through positioning,
            reading game flow, and anticipating ball movement, as such
            interceptions were valued at +0.75.
          </Typography>
          <Typography variant="body1">
            The final statistic weighted by the algorithm is recoveries. A
            recovery represents any action that ends a spell of possession by
            the opposition and starts possession for the player&apos;s team.
            Again, while not a direct challenge to win the ball, recoveries were
            valued at +0.5 because the result of a recovery (whether the product
            of an error from the opposition or efforts by the player) is a
            turnover by the opponent and an opportunity in a new phase of play.
          </Typography>
          <Typography variant="body1">
            We chose these weights to prioritize direct challenges (duels and
            tackles) while still recognizing off-ball efforts (interceptions and
            recoveries) that affect possession dynamics. The final Schmetzer
            Score is the sum of the weighted values for each statistic.
          </Typography>
          <Typography variant="body1">
            In the source data a player was listed twice if they played for
            multiple teams in a season (this could be the result a number of
            scenarios including contract terms, inter-league trades or loans
            within the league). This could effectively lower the rank of a
            player as their statistics would be distributed across multiple
            teams. To capture the full picture of a player&apos;s performance
            over the season, a player&apos;s statistics are consolidated to the
            squad with which the player played more minutes (i.e. higher value
            in nineties.)
          </Typography>
          <Typography variant="body1">
            When tabulating the season average of any given statistic, we
            decided to exclude players with less than 90 minutes in the season.
            Though all players are ranked, regardless of how many minutes they
            played. This decision was made to ensure that the season average is
            a more accurate reflection of a the average for players who played
            in a particular season.
          </Typography>
        </Box>
        <Box my={"60px"} sx={{ "& > *:not(:last-child)": { mb: 2 } }}>
          <Typography variant="h2" fontSize={"1.25rem"}>
            Data Source, Limitations, & Further Development
          </Typography>
          <Typography variant="body1">
            Our source data came from the amazing folks at&nbsp;
            <Link
              href={"https://fbref.com/en/"}
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              FBref
            </Link>{" "}
            &nbsp;(the source data set for this project) and&nbsp;
            <Link
              href={"https://www.sports-reference.com/about.html"}
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              Sports Reference
            </Link>
            . They&apos;re doing incredible work, democratizing sports data by
            making it publicly available. One current limitation is the
            granularity of available statistics. While providers like Wyscout
            break down duels into 4 types (offensive duels, defensive duels,
            loose ball duels, and aerial duels) FBRef lists only aerial duels
            won or lost as well as tackles won. Tackles lost, as well as duel
            types beyond aerial, are not available in this dataset.
          </Typography>
          <Typography variant="body1">
            While this is a limitation of the current iteration of this
            application, fortunately the data architecture is modular and the
            ETL pipelines could be pointed at a new data source in the future.
            This data could also be combined with field position to ascertain if
            a player tends to win or lose possession in specific zones on the
            field or during certain patterns of play. We also have under
            development fine tuning controls which would allow a user to
            manipulate the default values which weight the Schmetzer Score.
          </Typography>

          <Typography variant="body1">
            Read more about the inspiration that sparked this project on the&nbsp;
            <Link
              href="./about"
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              About
            </Link>
            &nbsp;page. Meet the two developers behind this project on the&nbsp;
            <Link
              href="./team"
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              Team
            </Link>
            &nbsp;page.
          </Typography>
        </Box>
      </Container>
    </main>
  );
}
