import Image from "next/image";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function TeamPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>The Team</h1>
      {/* Nick div */}
      <div>
        {/* Image div */}
        <div>
          <Image
            src="/images/nick-edwards.jpeg"
            alt="Nick Edwards"
            width={400}
            height={400}
          />
        </div>

        {/* Info div */}
        <div>
          <h2>Nick Edwards</h2>
          <p>Backend Software Developer, Data Engineer</p>
          <div>
            <Link href="https://www.linkedin.com/in/nick-edwards-dev/">
              <LinkedInIcon />
            </Link>
            <Link href="https://thenickedwards.github.io/portfolio/">
              <LanguageIcon />
            </Link>
            <Link href="https://github.com/thenickedwards/">
              <GitHubIcon />
            </Link>
          </div>
        </div>
        {/* Bio div */}
        <div>
          <p>
            Backend Software Developer, Data Engineer skilled in Python, SQL,
            and cloud platforms, including Google Cloud (GCP), AWS, and Azure.
            Experienced in designing ETL pipelines, optimizing data flow, and
            building scalable applications. Passionate about sports data science
            and creating data-driven solutions that deliver measurable results.
          </p>
        </div>
      </div>

      {/* Juanita div */}
      <div>
        {/* Image div */}
        <div>
          <Image
            src="/images/juanita-samborski.jpeg"
            alt="Juanita Samborski"
            width={400}
            height={400}
          />
        </div>

        {/* Info div */}
        <div>
          <h2>Juanita Samborski</h2>
          <p>UX/UI Designer & Front End Developer</p>
          <div>
            <Link href="https://www.linkedin.com/in/juanita-samborski/">
              <LinkedInIcon />
            </Link>
            <Link href="https://juanitasamborski.com/">
              <LanguageIcon />
            </Link>
            <Link href="https://github.com/jsamborski310">
              <GitHubIcon />
            </Link>
          </div>
        </div>
        {/* Bio div */}
        <div>
          <p>
            UX/UI Designer & Front End Developer with passion for crafting
            intuitive, user-centered designs. Since 2016, partnered with +40
            businesses to design and develop websites and apps that elevate user
            experiences. In 2022, joined the Portland Trail Blazers to design
            and build custom tools that optimize basketball operations.
          </p>
        </div>
      </div>
    </main>
  );
}
