import Link from "next/link";

export default function MethodsPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Methods</h1>
      <div>
        <p>
          Our goal with this project was to develop a{" "}
          <span style={{ fontStyle: "italic" }}>
            “Contested Possession Metric”
          </span>{" "}
          &dash; a composite statistic designed to reflect a player&apos;s
          in&dash;game contributions that either create turnovers or secure
          possession.
        </p>
        <p>
          In homage to club legend Brian Schmetzer, we started with a stat he
          frequently emphasizes: duels won. An aerial duel is defined as a
          challenge between two players to gain control of the ball above elbow
          height (typically with the head). We assigned the value for an aerial
          duel won at +1.
        </p>
        <p>
          A tackle in soccer represents when a player challenges their opponent
          with their feet for a ball on the ground (or at least below the
          elbow), a game event markedly similar to an aerial duel won and often
          yielding the same results. As such, we also valued tackles won at +1.
        </p>
        <p>
          To account for aerial duels lost we assigned a value of &dash;0.75.
          This weighting ensures that an aerial duel lost does not fully offset
          an aerial duel won. Players with a 50/50 split are effectively
          credited for actively contesting possession, even when they don&apos;t
          win the ball. (Unfortunately, tackles lost are unfortunately not
          available in the source data. More in for below.)
        </p>
        <p>
          After aerial duels and tackles won, the next most valued statistic for
          this metric is interceptions. An interception occurs when a player
          gains possession of the ball after an opponent passes, crosses, or
          shoots before the ball can reach the intended target. While this game
          event is not a result of a direct physical challenge for the ball, the
          player creates a turnover through positioning, reading game flow, and
          anticipating ball movement, as such interceptions were valued at
          +0.75.
        </p>
        <p>
          The final statistic weighted by the algorithm is recoveries. A
          recovery represents any action that ends a spell of possession by the
          opposition and starts possession for the player&apos;s team. Again,
          while not a direct challenge to win the ball, recoveries were valued
          at +0.5 because the result of a recovery (whether the product of an
          error from the opposition or efforts by the player) is a turnover by
          the opponent and an opportunity in a new phase of play.
        </p>
        <p>
          We chose these weights to prioritize direct challenges (duels and
          tackles) while still recognizing off&dash;ball efforts (interceptions
          and recoveries) that affect possession dynamics.
        </p>
      </div>
      <div>
        <h2>Data Source, Limitations, & Further Development</h2>
        <p>
          Our source data came from the amazing folks at
          <Link href={"https://fbref.com/en/"}>FBref</Link> (the source data set
          for this project) and{" "}
          <Link href={"https://www.sports-reference.com/about.html"}>
            Sports Reference
          </Link>
          . They&apos;re doing incredible work, democratizing sports data by
          making it publicly available. One current limitation is the
          granularity of available statistics. While providers like Wyscout
          break down duels into 4 types (offensive duels, defensive duels, loose
          ball duels, and aerial duels) FBRef lists only aerial duels won or
          lost as well as tackles won. Tackles lost, as well as duel types
          beyond aerial, are not available in this dataset.
        </p>
        <p>
          While this is a limitation of the current iteration of this
          application, fortunately the data architecture is modular and the ETL
          pipelines could be pointed at a new data source in the future. This
          data could also be combined with field position to ascertain if a
          player tends to win or lose possession in specific zones on the field
          or during certain patterns of play. We also have under development
          fine tuning controls which would allow a user to manipulate the
          default values which weight the Schmetzer Score.
        </p>
      </div>
      <div>
        <Link href="./about">
          Read more about the inspiration that sparked this project on the About
          page.
        </Link>
        <Link href="./team">
          Meet the two developers behind this project on the Team page.
        </Link>
      </div>
    </main>
  );
}
