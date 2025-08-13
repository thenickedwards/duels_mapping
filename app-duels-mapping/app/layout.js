import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AppThemeProvider } from "./theme";
import { Nunito_Sans, Bebas_Neue } from "next/font/google";
import NavBar from "./components/NavBar";
import "./lib/fontawesome";
import theme from "./theme";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Duels Mapping",
  description:
    "Duels Mapping is an interactive dashboard that compares how possession is won or retained by MLS players using a custom-built composite metric. A player's aerial duels won, tackles won, interceptions, recoveries, and aerial duels lost are weighted using an algorithm, then players receive a Schmetzer Score and ranking.",
};

export default function RootLayout(props) {
  const { children } = props;
  return (
    <html lang="en" className={`${bebasNeue.variable} ${nunitoSans.className}`}>
      <body>
        <AppRouterCacheProvider>
          <AppThemeProvider>
            <NavBar />
            {children}
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
