"use client";
import Image from "next/image";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Container,
  Typography,
  Box,
  Divider,
  Stack,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function TeamPage() {
  const theme = useTheme();
  const dividerColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const rectColor = theme.palette.mode === "dark" ? "#3B5B84" : "#B7F08E";

  return (
    <main style={{ padding: "2rem" }}>
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
            The Team
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
        <Box my={"60px"}>
          {/* Nick div */}

          <Grid container mb={"80px"}>
            {/* Image div */}
            <Grid item size={{ xs: 4, sm: 2, md: 1.6 }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  overflow: "hidden",
                  borderRadius: "50%",
                }}
              >
                <Image
                  src="/images/nick-edwards.jpeg"
                  alt="Nick Edwards"
                  width={100}
                  height={100}
                />
              </Box>
            </Grid>

            {/* Info div */}
            <Grid item size={{ xs: 8, sm: 10, md: 3.4 }}>
              <Typography variant="h2" fontSize="1.25rem">
                Nick Edwards
              </Typography>
              <Typography variant="body1" color="#505050">
                Backend Software Developer
              </Typography>
              <Typography variant="body1" color="#505050">
                Data Engineer
              </Typography>
              <Stack direction="row" spacing={1.8} mt={"16px"}>
                <Link href="https://www.linkedin.com/in/nick-edwards-dev/">
                  <LinkedInIcon />
                </Link>
                <Link href="https://thenickedwards.github.io/portfolio/">
                  <LanguageIcon />
                </Link>
                <Link href="https://github.com/thenickedwards/">
                  <GitHubIcon />
                </Link>
              </Stack>
            </Grid>
            {/* Bio div */}
            <Grid
              item
              size={{ xs: 12, md: 7 }}
              sx={{
                pt: { xs: 4, sm: 4, md: 0 },
              }}
            >
              <Typography variant="body1">
                Backend Software Developer, Data Engineer skilled in Python,
                SQL, and cloud platforms, including Google Cloud (GCP), AWS, and
                Azure. Experienced in designing ETL pipelines, optimizing data
                flow, and building scalable applications. Passionate about
                sports data science and creating data-driven solutions that
                deliver measurable results.
              </Typography>
            </Grid>
          </Grid>

          {/* Juanita div */}
          <Grid container>
            {/* Image div */}
            <Grid item size={{ xs: 4, sm: 2, md: 1.6 }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  overflow: "hidden",
                  borderRadius: "50%",
                }}
              >
                <Image
                  src="/images/juanita-samborski.jpeg"
                  alt="Juanita Samborski"
                  width={100}
                  height={100}
                />
              </Box>
            </Grid>

            {/* Info div */}
            <Grid item size={{ xs: 8, sm: 10, md: 3.4 }}>
              <Typography variant="h2" fontSize="1.25rem">
                Juanita Samborski
              </Typography>
              <Typography variant="body1" color="#505050">
                UX/UI Designer &
              </Typography>
              <Typography variant="body1" color="#505050">
                Front End Developer
              </Typography>

              <Stack direction="row" spacing={1.8} mt={"16px"}>
                <Link href="https://www.linkedin.com/in/juanita-samborski/">
                  <LinkedInIcon />
                </Link>
                <Link href="https://juanitasamborski.com/">
                  <LanguageIcon />
                </Link>
                <Link href="https://github.com/jsamborski310">
                  <GitHubIcon />
                </Link>
              </Stack>
            </Grid>
            {/* Bio div */}
            <Grid
              item
              size={{ xs: 12, md: 7 }}
              sx={{
                pt: { xs: 4, sm: 4, md: 0 },
              }}
            >
              <Typography variant="body1">
                UX/UI Designer & Front End Developer with passion for crafting
                intuitive, user-centered designs. Since 2016, partnered with +40
                businesses to design and develop websites and apps that elevate
                user experiences. In 2022, joined the Portland Trail Blazers to
                design and build custom tools that optimize basketball
                operations.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </main>
  );
}
