import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>About Us</h1>
      <p>
        This project began as a thought experiment and a dream of working in
        professional sports data and analytics. In many press conferences Coach
        Schmetzer will tap his pen on the table and reference his preferred
        statistic: <span style={{ fontStyle: "italic" }}>duels won</span>. If
        working for the Sounders&apos; data and analytics team, how could we
        deliver a fuller picture to the coaching staff of how possession is won
        or lost by a particular player. Understanding when a player is more
        likely to gain or lose possession, can help the team address
        shortcomings in training as well as strategize tactics and matchups in
        upcoming games.
      </p>
      <p>
        To achieve this goal, we created a{" "}
        <span style={{ fontStyle: "italic" }}>Contested Possession Metric</span>{" "}
        -- a composite statistic weighted by aerial duels won, aerial duels
        lost, tackles won, interceptions, and recoveries using a custom
        algorithm. Since “Contested Possession Metric” is a bit of a mouthful,
        we&apos;ve dubbed it the <strong>Schmetzer Score</strong>.
      </p>
      <p>
        <Link href="https://thenickedwards.github.io/portfolio/">
          <strong>Nick Edwards</strong>
        </Link>{" "}
        architected the data environment, developed the ETL pipelines which
        ingest the data, designed the algorithm to calculate the scores, and
        built the API routing which delivers hard numbers to the front end.
      </p>
      <p>
        <Link href="https://juanitasamborski.com/">
          <strong>Juanita Samborski</strong>
        </Link>
        brought all the stats to life in a vibrant and interactive Next.js
        dashboard that leverages an intuitive UX/UI -- centering the user and
        offering a seamless digital experience.
      </p>
    </main>
  );
}
