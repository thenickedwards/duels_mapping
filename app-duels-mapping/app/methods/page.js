"use client";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function MethodsPage() {
  const theme = useTheme();
  const dividerColor =
    theme.palette.mode === "dark"
      ? theme.palette.common.white
      : theme.palette.common.black;
  const rectColor =
    theme.palette.mode === "dark"
      ? theme.palette.common.blue
      : theme.palette.common.limegreen;

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
            often yielding the same results. Tackles are the rarer event, though
            &mdash; across our eight seasons players average 0.98 tackles won
            per 90 against 1.25 aerial duels won &mdash; so valuing them
            identically let the more common event do more of the talking. We
            value a tackle won at +1.5.
          </Typography>
          <Typography variant="body1">
            To account for aerial duels lost we assigned a value of -0.85. This
            weighting ensures that an aerial duel lost does not fully offset an
            aerial duel won. Every aerial duel has one winner and one loser, so
            the league as a whole wins exactly half of them; what these two
            values really set is the win rate at which a player breaks even, and
            at -0.85 that rate is 45.9%. Players with a 50/50 split are still
            credited for actively contesting possession, even when they
            don&apos;t win the ball. (Unfortunately, tackles lost are not
            available in the source data. More on that below.)
          </Typography>
          <Typography variant="body1">
            After aerial duels and tackles won, the next most valued statistic
            for this metric is interceptions. An interception occurs when a
            player gains possession of the ball after an opponent passes,
            crosses, or shoots before the ball can reach the intended target.
            While this game event is not a result of a direct physical challenge
            for the ball, the player creates a turnover through positioning,
            reading game flow, and anticipating ball movement, as such
            interceptions are valued at +0.9. An intercepted ball is also the
            cleanest evidence of possession genuinely kept &mdash; the player
            has it under control with no scramble &mdash; which is the second
            half of what this metric is trying to see.
          </Typography>
          <Typography variant="body1">
            The final statistic weighted by the algorithm is recoveries. A
            recovery represents any action that ends a spell of possession by
            the opposition and starts possession for the player&apos;s team.
            Recoveries are valued at +0.25 &mdash; the lowest of the five,
            because a recovery is the one event in the set where the ball was
            already loose. Nobody was beaten. It is also by far the most common
            event we count, making up more than half of everything in the
            database, so a higher value drowns out the duels this metric exists
            to measure.
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
            exclude players with less than five games worth of minutes (450
            minutes, or five 90s). Though all players are ranked, regardless of
            how many minutes they played. This decision was made to ensure that
            the season average is a more accurate reflection of the average for
            players who genuinely featured in a particular season — a lower
            threshold pulls in too many brief cameo appearances and drags the
            league average down.
          </Typography>
        </Box>
        <Box my={"60px"} sx={{ "& > *:not(:last-child)": { mb: 2 } }}>
          <Typography variant="h2" fontSize={"1.25rem"}>
            Fine-Tuning the Weights
          </Typography>
          <Typography variant="body1">
            The values above are not the ones we launched with. In 2026 we
            reviewed every weight against the full database &mdash; 5,876
            player-seasons from 2018 through 2025 &mdash; and adjusted four of
            the five.
          </Typography>
          <TableContainer sx={{ overflowX: "auto", my: 3 }}>
            <Table size="small" aria-label="Schmetzer Score weight changes">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Stat</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Initial Weight
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Fine-Tuned Weight
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ["Aerial duels won", "+1", "+1", false],
                  ["Aerial duels lost", "-0.75", "-0.85", true],
                  ["Tackles won", "+1", "+1.5", true],
                  ["Interceptions", "+0.75", "+0.9", true],
                  ["Recoveries", "+0.5", "+0.25", true],
                ].map(([stat, initial, tuned, changed]) => (
                  <TableRow key={stat}>
                    <TableCell>{stat}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontVariantNumeric: "tabular-nums",
                        opacity: 0.6,
                        textDecoration: changed ? "line-through" : "none",
                      }}
                    >
                      {initial}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: changed ? 700 : 400,
                      }}
                    >
                      {tuned}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body1">
            The problem the review found is that a weight is not the same thing
            as an influence. Recoveries carried the smallest weight and the
            largest effect, simply because there are so many of them: 339,947
            recoveries in the database against 66,056 tackles won. More than
            half of every point the Schmetzer Score awarded was a recovery, and
            the score correlated far more strongly with recoveries than with
            duels. A metric named for duels won was not primarily measuring
            duels. Halving the recovery value brings it from 55% of all points
            awarded down to 32%.
          </Typography>
          <Typography variant="body1">
            Raising tackles won to +1.5 answers the mirror-image problem.
            Because tackles are both rarer and more tightly clustered than
            aerial duels, matching them at +1 gave them noticeably less pull on
            the rankings. Valuing a tackle at the average-volume ratio would
            mean +1.27; giving tackles genuinely equal say would mean +1.89. We
            took the middle of that range rather than the top, because tackle
            counts turn out to be the least stable statistic we track &mdash;
            they move with a team&apos;s defensive scheme more than the others
            do, dropping most sharply when a player changes clubs.
          </Typography>
          <Typography variant="body1">
            Interceptions rose to +0.9 on the strength of what they say about
            keeping possession, while staying clearly below tackles because no
            one is beaten in a contest. And the aerial penalty moved to -0.85 so
            that the aerial term measures how well a player competes in the air
            rather than how often. At -0.75 a player broke even by winning just
            42.9% of their duels, which quietly paid for volume; at -0.85 the
            break-even is 45.9%, still under the 49.2% a median contested player
            manages, so contesting is credited and losing badly is not.
          </Typography>
          <Typography variant="body1">
            These changes rearrange the middle of the table more than the top.
            The retuned ranking still agrees closely with the original one,
            because a season total is driven first and foremost by how much a
            player featured; four or five names change in a given season&apos;s
            top 25. Ball-winning full-backs and holding midfielders rise, while
            players whose score was mostly loose-ball volume &mdash; including
            goalkeepers, whose totals are almost entirely recoveries &mdash;
            fall. One consequence worth stating plainly: because four of five
            values went down, every score in the app is now lower than it was,
            and season averages fall by roughly 16%. That is a change of scale,
            not a change in anyone&apos;s standing.
          </Typography>
        </Box>
        <Box my={"60px"} sx={{ "& > *:not(:last-child)": { mb: 2 } }}>
          <Typography variant="h2" fontSize={"1.25rem"}>
            Salary &amp; The Schmetzer Value Metric
          </Typography>
          <Typography variant="body1">
            A Schmetzer Score says how much contested possession a player won.
            It says nothing about what that work cost. So alongside each
            player&apos;s score we carry their publicly disclosed compensation,
            sourced from the&nbsp;
            <Link
              href="https://mlsplayers.org/resources/salary-guide"
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              MLS Players Association Salary Guide
            </Link>
            . The salary column shows annual average guaranteed compensation
            &mdash; base salary plus all signing and guaranteed bonuses,
            annualized over the term of the contract.
          </Typography>
          <Typography variant="body1">
            The <strong>smetz/$M</strong> column divides a player&apos;s
            Schmetzer Score by that compensation in millions of dollars: how
            much contested possession a club bought with the money it committed
            to that player. Players are ranked on it only once past the same
            five 90s threshold used for season averages &mdash; without a floor,
            a single substitute appearance on a league-minimum contract would
            top the table on a handful of duels.
          </Typography>
          <Typography variant="body1">
            Two things are worth keeping in mind when reading it. It measures
            contested possession per dollar and nothing else, so a designated
            player signed to score goals will always look poor on it &mdash;
            that is a statement about what the Schmetzer Score counts, not about
            the player. And clubs are not on a level field: MLS roster rules
            mean a homegrown player on a league-minimum deal does the same work
            for a fraction of the cap hit, so the metric tends to reward clubs
            that develop and play their academy.
          </Typography>
          <Typography variant="body1">
            The MLSPA publishes one release per season, compiled in the autumn,
            and it does not share a player id with our statistics source, so
            players are matched by name within their club. Roughly 91&ndash;97%
            of ranked players in a given season carry a salary. A player showing
            &ldquo;&mdash;&rdquo; either left the league before the release was
            compiled or could not be matched with confidence; we show nothing
            rather than a guess.
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
            Read more about the inspiration that sparked this project on
            the&nbsp;
            <Link
              href="./about"
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              About
            </Link>
            &nbsp;page. <br></br>Meet the two developers behind this project on
            the&nbsp;
            <Link
              href="./team"
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              Team
            </Link>
            &nbsp;page.
          </Typography>
        </Box>
        <Box my={"60px"} sx={{ "& > *:not(:last-child)": { mb: 2 } }}>
          <Typography variant="h2" fontSize={"1.25rem"}>
            Update: March 2026
          </Typography>
          <Typography variant="body1">
            Unfortunately,&nbsp;
            <Link
              href="https://www.sports-reference.com/blog/2026/01/fbref-stathead-data-update/"
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              as of January 2026
            </Link>
            , the advanced statistics that made this project possible are no
            longer publicly available. Opta terminated Sports Reference&apos;s
            access to its data feeds, citing an alleged agreement violation,
            ending free access to the advanced statistics that aspiring sports
            data analysts and soccer fans had come to love.
          </Typography>

          <Typography variant="body1">
            As a result, further development beyond the 2025 MLS season will not
            be possible until a new data source can be identified. We&apos;re
            exploring alternatives, and the modular architecture of the ETL
            pipeline means the platform can be repointed at a new source without
            a full rebuild. In the meantime, Duels Mapping remains fully
            functional as a historical record, offering insights into player
            performance and league trends from 2018&ndash;2025.
          </Typography>
        </Box>
      </Container>
    </main>
  );
}
