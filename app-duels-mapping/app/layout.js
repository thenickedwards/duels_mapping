import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AppThemeProvider } from "./theme";
import { Nunito_Sans, Bebas_Neue } from "next/font/google";
import NavBar from "./components/common/NavBar";
import "./lib/fontawesome";
import theme from "./theme";
import { SITE_DESCRIPTION } from "./lib/siteDescription";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
  description: SITE_DESCRIPTION,
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
        <Analytics />
      </body>
    </html>
  );
}
