import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>About Us</h1>
      <p>
        This project began as a thought experiment and a dream of working in
        professional sports data and analytics. At many of his post-game press
        conferences, Coach Schmetzer will tap his pen on the table and reference
        his preferred statistic:{" "}
        <span style={{ fontStyle: "italic" }}>duels won</span>. If working for
        the Sounders&apos; data and analytics team, how could we deliver a
        fuller picture to the coaching staff of how possession is won or lost by
        a particular player. Understanding when a player is more likely to gain
        or lose possession, can inform tactical decisions, highlight areas for
        individual improvement, and shape game strategy for opponents and
        matchups.
      </p>
      <p>
        To achieve this goal, we developed a{" "}
        <span style={{ fontStyle: "italic" }}>Contested Possession Metric</span>{" "}
        -- a composite statistic using a custom algorithm to weight aerial duels
        won and lost, tackles won, interceptions, and recoveries in order to
        reflect the in-game contribution of creating turnovers or securing
        possession. Since “Contested Possession Metric” is a bit of a mouthful,
        we&apos;ve dubbed it the <strong>Schmetzer Score</strong>.
      </p>
      <p>
        <Link href="https://thenickedwards.github.io/portfolio/">
          <strong>Nick Edwards</strong>
        </Link>
        architected the data environment, developed the ETL pipelines which
        ingest the data, designed the algorithm to calculate the scores, and
        built the API routing which delivers hard numbers to the front end.
      </p>
      <p>
        <Link href="https://juanitasamborski.com/">
          <strong>Juanita Samborski</strong>
        </Link>
        brought all the stats to life in a vibrant and interactive Next.js
        dashboard that leverages an intuitive UX/UI, centers the user, and
        offers a seamless experience.
      </p>
      <Link href="./methods">
        Read more about the thought process supporting our approach and how the
        statistics were weighted on the Methods page.
      </Link>
      <Link href="./team">
        Meet the two developers behind this project on the Team page.
      </Link>
    </main>
  );
}
