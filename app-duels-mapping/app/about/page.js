"use client";
import Link from "next/link";
import { Container, Typography, Box, Divider} from "@mui/material";
import { useTheme } from "@mui/material/styles";


export default function AboutPage() {
  const theme = useTheme();
  const dividerColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const rectColor = theme.palette.mode === "dark" ? "#3B5B84" : "#B7F08E"; 

  return (
    <main style={{ padding: "2rem" }}>
      {/* About Page */}
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
          About
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
        <Box my={"60px"} sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
        <Typography variant="body1" >
          This project began as a thought experiment and a dream of working in
          professional sports data and analytics. At many of his post-game press
          conferences, Coach Schmetzer will tap his pen on the table and
          reference his preferred statistic:{" "}
          <span sx={{ fontStyle: "italic" }}>duels won</span>. If working for
          the Sounders data and analytics team, how could we deliver a
          fuller picture to the coaching staff of how possession is won or lost
          by a particular player. Understanding when a player is more likely to
          gain or lose possession, can inform tactical decisions, highlight
          areas for individual improvement, and shape game strategy for
          opponents and matchups.
        </Typography>
        <Typography variant="body1" >
          To achieve this goal, we developed a{" "}
          <span style={{ fontStyle: "italic" }}>
            Contested Possession Metric
          </span>{" "}
          — a composite statistic using a custom algorithm to weight aerial
          duels won and lost, tackles won, interceptions, and recoveries in
          order to reflect the in-game contribution of creating turnovers or
          securing possession. Since “Contested Possession Metric” is a bit of a
          mouthful, we have dubbed it the <em>Schmetzer Score</em>.
        </Typography>
        <Typography variant="body1" >
          <Link href="https://thenickedwards.github.io/portfolio/" style={{ textDecoration: 'underline', color: 'inherit' }}>
            Nick Edwards
          </Link>
          {" "} architected the data environment, developed the ETL pipelines which
          ingest the data, designed the algorithm to calculate the scores, and
          built the API routing which delivers hard numbers to the front end.
        </Typography>
        <Typography variant="body1">
          <Link href="https://juanitasamborski.com/" style={{ textDecoration: 'underline', color: 'inherit' }}>
           Juanita Samborski
          </Link>
          {" "} brought all the stats to life in a vibrant and interactive Next.js
          dashboard that leverages an intuitive UX/UI, centers the user, and
          offers a seamless experience.
        </Typography>
        <Typography variant="body1">
          Read more about the thought process supporting our approach and how
          the statistics were weighted on the <Link href="./methods" style={{ textDecoration: 'underline', color: 'inherit' }}>Methods</Link> page.
        </Typography>
        </Box>
      </Container>
    </main>
  );
}
